const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: String,
    body: String,
    data: Object,
    ticketId: String,
    status: {
      type: String,
      enum: ['queued', 'sent', 'delivered', 'failed'],
      default: 'queued',
    },
    attempts: {
      type: Number,
      default: 0,
    },
    lastError: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model('Notification', notificationSchema);
