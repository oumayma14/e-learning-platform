const express = require('express');
const recommendationController = require('../controllers/recommendationController');
const router = express.Router();

// Get recommended quizzes for a user
router.get('/:userId', recommendationController.getRecommendedQuizzes);

module.exports = router;
