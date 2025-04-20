const Question = require('../models/questionModel');
const Quiz = require('../models/quizModel');

exports.addQuestion = async (req, res) => {
    try {
        const quizId = req.params.quizId;
        
        // Validate input
        if (!req.body.questionText || !req.body.questionType) {
            return res.status(400).json({
                success: false,
                message: 'Question text and type are required'
            });
        }

        // Verify quiz exists
        const quiz = await Quiz.getById(quizId);
        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        // Create question
        const questionId = await Question.create(quizId, {
            questionText: req.body.questionText,
            questionType: req.body.questionType,
            timeLimit: req.body.timeLimit,
            questionOrder: req.body.questionOrder || 0
        });

        // Add options if provided
        if (req.body.options?.length) {
            await Question.addOptions(questionId, req.body.options);
        }

        // Update question count
        await Quiz.update(quizId, {
            questions_count: (quiz.questions_count || 0) + 1
        });

        return res.status(201).json({
            success: true,
            data: {
                id: questionId,
                quizId: parseInt(quizId),
                questionText: req.body.questionText,
                questionType: req.body.questionType
            },
            message: 'Question added successfully'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: process.env.NODE_ENV === 'development' 
                ? error.message 
                : 'Failed to add question',
            ...(process.env.NODE_ENV === 'development' && {
                sqlError: error.sqlMessage
            })
        });
    }
};

exports.getQuestions = async (req, res) => {
    try {
        const questions = await Question.getByQuizId(req.params.quizId);
        res.json({
            success: true,
            data: questions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get questions'
        });
    }
};
