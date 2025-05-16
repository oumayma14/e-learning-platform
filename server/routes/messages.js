// routes/messages.js
const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');

// Send a simple email
router.post('/send-simple-email', messagesController.sendSimpleEmail);

module.exports = router;
