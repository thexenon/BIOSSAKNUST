// // TODO: WEB VIEW ROUTES
// const express = require('express');
// const viewsController = require('../controllers/viewsController');
// const authController = require('../controllers/authController');

// const router = express.Router();

// router.get('/', authController.isLoggedIn, viewsController.getOverview);
// router.get(
//   '/scripture/:id',
//   authController.isLoggedIn,
//   viewsController.getScripture,
// );
// router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
// router.get('/me', authController.protect, viewsController.getAccount);
// router.get('/stream', viewsController.getStream);

// router.post(
//   '/submit-user-data',
//   authController.protect,
//   viewsController.updateUserData,
// );

// router.get('/post-video', viewsController.postVideoForm);

// module.exports = router;
