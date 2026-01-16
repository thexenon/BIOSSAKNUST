const express = require('express');
const aiController = require('../controllers/aiController');
const authController = require('../controllers/authController');

const router = express.Router();

// Optional: allow public usage but rate-limited; for now protect if user is authenticated
router.post('/chat', authController.protect, aiController.chatProxy);

module.exports = router;
