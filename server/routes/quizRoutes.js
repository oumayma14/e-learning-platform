const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const questionController = require('../controllers/questionController');
const { updateUserScore } = require('../controllers/userController');
const authenticateToken = require('../middlewares/authenticateToken');


// Quiz routes
router.get('/all', quizController.getAllQuizzes);
router.get('/:id', quizController.getQuiz);
router.post('/', quizController.createQuiz);
router.put('/:id', quizController.updateQuiz);
router.delete('/:id', quizController.deleteQuiz);
router.get('/formateur/quizzes', authenticateToken, quizController.getQuizzesByFormateur);
// quizRoutes.js
// ✅ Quiz routes
router.put('/:id', authenticateToken, quizController.updateQuiz);

// ✅ Question routes
router.put('/:quizId/questions', authenticateToken, questionController.updateQuestions);

// Question routes
router.post('/:quizId/questions', questionController.addQuestion);
router.get('/:quizId/questions', questionController.getQuestions);
// ✅ Route for deleting questions (already present)
router.delete('/question/:questionId', authenticateToken, questionController.deleteQuestion);
// ✅ Add this for deleting options
router.delete('/option/:optionId', authenticateToken, questionController.deleteOption);

router.post('/full', quizController.createFullQuiz);
router.post('/:id/submit', async (req, res) => {
    const { username, score } = req.body;
    const quizId = req.params.id;
    
    try {
        const newScore = await updateUserScore(username, score, quizId);
        res.status(200).json({ success: true, message: 'Score Updated', newScore });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


module.exports = router;