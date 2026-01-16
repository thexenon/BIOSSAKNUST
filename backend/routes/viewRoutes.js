// TODO: WEB VIEW ROUTES
const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get(
  '/mainanon/:id',
  authController.isLoggedIn,
  viewsController.getMainAnon,
);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get(
  '/forgot-password',
  authController.isLoggedIn,
  viewsController.getForgotPasswordForm,
);
router.get('/me', authController.protect, viewsController.getAccount);

router.get(
  '/reset-password/:token',
  authController.isLoggedIn,
  viewsController.getResetPasswordForm,
);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData,
);

module.exports = router;
