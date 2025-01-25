const express = require('express');
const mainCommentController = require('../controllers/mainCommentController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(mainCommentController.getAllMainComments)
  .post(
    authController.protect,
    mainCommentController.setMainAnonUserIds,
    mainCommentController.createMainComment,
  );

router
  .route('/:id')
  .get(mainCommentController.getMainComment)
  .patch(
    authController.protect,
    authController.restrictTo('creator', 'admin', 'superadmin'),
    mainCommentController.updateMainComment,
  )
  .delete(
    authController.protect,
    authController.restrictTo('creator', 'admin', 'superadmin'),
    mainCommentController.deleteMainComment,
  );

module.exports = router;
