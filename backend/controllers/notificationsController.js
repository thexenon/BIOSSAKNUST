const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const User = require('./../models/userModel');
const { Expo } = require('expo-server-sdk');
const Notification = require('../models/notificationModel');

const expo = new Expo();

const MAX_RETRIES = 3;

async function checkReceiptsAndRetry(ticketMap) {
  // ticketMap: [{ notificationId, ticketId, recipientId, payload }]
  const receiptIds = ticketMap.map((t) => t.ticketId).filter(Boolean);
  if (receiptIds.length === 0) return;

  try {
    const receipts = await expo.getPushNotificationReceiptsAsync(receiptIds);

    // receipts is an object keyed by ticketId
    for (const t of ticketMap) {
      const receipt = receipts[t.ticketId];
      if (!receipt) continue;

      if (receipt.status === 'ok') {
        // update log
        await Notification.findOneAndUpdate(
          { ticketId: t.ticketId },
          { status: 'delivered' },
        );
        continue;
      }

      // If error
      const error = receipt.details?.error || receipt.message || 'unknown';
      await Notification.findOneAndUpdate(
        { ticketId: t.ticketId },
        { status: 'failed', lastError: error },
      );

      // Decide if retryable
      const retryable =
        ['DeviceNotRegistered', 'MessageRateExceeded', 'Timeout'].includes(
          receipt.details?.error,
        ) || !receipt.details;
      if (retryable) {
        // find original notification log
        const log = await Notification.findOne({ ticketId: t.ticketId });
        if (log && log.attempts < MAX_RETRIES) {
          // resend
          try {
            const messages = [t.payload];
            const chunks = expo.chunkPushNotifications(messages);
            for (const chunk of chunks) {
              const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
              // store new ticket
              for (const nt of ticketChunk) {
                await Notification.create({
                  recipient: t.recipientId,
                  title: t.payload.title,
                  body: t.payload.body,
                  data: t.payload.data,
                  ticketId: nt.id || nt.details?.id,
                  status: nt.status === 'ok' ? 'sent' : 'failed',
                  attempts: log.attempts + 1,
                  lastError:
                    nt.status === 'error'
                      ? nt.message || JSON.stringify(nt.details)
                      : null,
                });
              }
            }
          } catch (err) {
            console.error('Retry send error', err);
          }
        }
      }
    }
  } catch (err) {
    console.error('Receipt check failed', err);
  }
}

exports.sendNotification = catchAsync(async (req, res, next) => {
  const { to, type, message, postId } = req.body;
  if (!to) return next(new AppError('Missing recipient id (to)', 400));

  // Find recipient
  const recipient = await User.findById(to).select('+expoPushToken');
  if (!recipient || !recipient.expoPushToken) {
    return res
      .status(200)
      .json({ status: 'success', message: 'Recipient has no push token' });
  }

  if (!Expo.isExpoPushToken(recipient.expoPushToken)) {
    console.warn('Invalid Expo push token', recipient.expoPushToken);
    return res
      .status(400)
      .json({ status: 'failed', message: 'Invalid push token' });
  }

  const payload = {
    to: recipient.expoPushToken,
    sound: 'default',
    title: type === 'comment' ? 'New comment on your post' : 'New reaction',
    body: message,
    data: { postId, type },
  };

  // Send
  const chunks = expo.chunkPushNotifications([payload]);
  const tickets = [];
  const ticketMap = [];
  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      for (const t of ticketChunk) {
        tickets.push(t);
        // store log entry
        const ticketId = t.id || t.details?.id || null;
        const log = await Notification.create({
          recipient: recipient._id,
          title: payload.title,
          body: payload.body,
          data: payload.data,
          ticketId,
          status: t.status === 'ok' ? 'sent' : 'failed',
          attempts: 1,
          lastError:
            t.status === 'error'
              ? t.message || JSON.stringify(t.details)
              : null,
        });

        ticketMap.push({
          notificationId: log._id,
          ticketId,
          recipientId: recipient._id,
          payload,
        });
      }
    } catch (error) {
      console.error('Expo send error', error);
    }
  }

  // After a short delay, check receipts and perform retries if needed
  setTimeout(() => {
    checkReceiptsAndRetry(ticketMap).catch((err) => console.error(err));
  }, 2000);

  res.status(200).json({ status: 'success', tickets });
});

exports.getNotifications = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.recipient) filter.recipient = req.query.recipient;
  if (req.query.status) filter.status = req.query.status;

  const total = await Notification.countDocuments(filter);
  const docs = await Notification.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('recipient', 'name email');

  res.status(200).json({ status: 'success', total, page, limit, data: docs });
});
