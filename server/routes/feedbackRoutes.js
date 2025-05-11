const express = require('express');
const feedbackController = require('../controllers/feedbackController');
const router = express.Router();

// Create Feedback
router.post('/', feedbackController.createFeedback);

// Get Feedback by Quiz
router.get('/quiz/:quizId', feedbackController.getFeedbackByQuiz);

// Get Feedback by User
router.get('/user/:userId', feedbackController.getFeedbackByUser);

module.exports = router;
