const express = require('express');
const updateController = require('../controllers/updateController');

const router = express.Router();

router.route('/').post(updateController.createUpdate);

router
  .route('/:id')
  .get(updateController.getUpdate)
  .patch(updateController.updateUpdate);

module.exports = router;
