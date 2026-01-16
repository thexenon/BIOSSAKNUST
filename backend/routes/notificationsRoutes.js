const express = require('express');
const notificationsController = require('./../controllers/notificationsController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.post('/', notificationsController.sendNotification);

// Admin: list notification logs
router.get(
  '/',
  authController.restrictTo('admin', 'superadmin'),
  notificationsController.getNotifications,
);

module.exports = router;
