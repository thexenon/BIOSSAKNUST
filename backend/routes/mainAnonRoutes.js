const express = require('express');
const mainAnonController = require('../controllers/mainAnonController');
const authController = require('../controllers/authController');
const mainCommentRouter = require('./mainCommentRoutes');

const router = express.Router();

router.use('/:mainAnonId/comments', mainCommentRouter);

router
  .route('/:mainAnonId/reactions')
  .patch(authController.protect, mainAnonController.updateMainAnonReaction);

router
  .route('/')
  .get(mainAnonController.getAllMainAnons)
  .post(
    authController.protect,
    mainAnonController.setUserIds,
    mainAnonController.addNewMainAnon,
  );

router
  .route('/:id')
  .get(mainAnonController.getSingleMainAnon)
  .patch(authController.protect, mainAnonController.updateMainAnon)
  .delete(
    authController.protect,
    authController.restrictTo('creator', 'admin'),
    mainAnonController.deleteMainAnon,
  );

module.exports = router;
