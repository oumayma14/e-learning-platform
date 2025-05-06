const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const questionController = require('../controllers/questionController');
const { updateUserScore } = require('../controllers/userController');
const authenticateToken = require('../middlewares/authenticateToken');

// Quiz routes
router.get('/', quizController.getAllQuizzes);
router.get('/:id', quizController.getQuiz);
router.post('/', quizController.createQuiz);
router.put('/:id', quizController.updateQuiz);
router.delete('/:id', quizController.deleteQuiz);
router.get('/formateur/quizzes', authenticateToken, quizController.getQuizzesByFormateur);

// Question routes
router.post('/:quizId/questions', questionController.addQuestion);
router.get('/:quizId/questions', questionController.getQuestions);
router.post('/full', quizController.createFullQuiz);
router.post ('/:id/submit', async (req,res) => {
    const {username, score} = req.body;
    try{
        const newScore = await updateUserScore(username, score);
        res.status(200).json({success: true, message:'Score Updated', newScore});
    } catch(error) {
        res.status(500).json({success: false, message: error.message})

    }
});

module.exports = router;