const express = require('express');
const yearCommentController = require('../controllers/yearCommentController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(yearCommentController.getAllYearComments)
  .post(
    authController.protect,
    yearCommentController.setYearAnonUserIds,
    yearCommentController.createYearComment,
  );

router
  .route('/:id')
  .get(yearCommentController.getYearComment)
  .patch(
    authController.restrictTo('creator', 'admin'),
    yearCommentController.updateYearComment,
  )
  .delete(
    authController.restrictTo('creator', 'admin'),
    yearCommentController.deleteYearComment,
  );

module.exports = router;
