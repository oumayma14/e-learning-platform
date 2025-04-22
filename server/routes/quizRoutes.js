const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const questionController = require('../controllers/questionController');

// Quiz routes
router.get('/', quizController.getAllQuizzes);
router.get('/:id', quizController.getQuiz);
router.post('/', quizController.createQuiz);
router.put('/:id', quizController.updateQuiz);
router.delete('/:id', quizController.deleteQuiz);

// Question routes
router.post('/:quizId/questions', questionController.addQuestion);
router.get('/:quizId/questions', questionController.getQuestions);
router.post('/full', quizController.createFullQuiz);


module.exports = router;