const express = require('express');
const yearAnonController = require('../controllers/yearAnonController');
const authController = require('../controllers/authController');
const yearCommentRouter = require('./yearCommentRoutes');

const router = express.Router();

router.use('/:yearAnonId/comments', yearCommentRouter);

router
  .route('/:yearAnonId/reactions')
  .patch(authController.protect, yearAnonController.updateYearAnonReaction);

router
  .route('/')
  .get(yearAnonController.getAllYearAnons)
  .post(
    authController.protect,
    yearAnonController.setUserIds,
    yearAnonController.addNewYearAnon,
  );

router
  .route('/:id')
  .get(yearAnonController.getSingleYearAnon)
  .patch(authController.protect, yearAnonController.updateYearAnon)
  .delete(
    authController.protect,
    authController.restrictTo('creator', 'admin'),
    yearAnonController.deleteYearAnon,
  );

module.exports = router;
