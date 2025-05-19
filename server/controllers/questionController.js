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


// Delete a question
exports.deleteQuestion = async (req, res) => {
    try {
        const questionId = req.params.questionId;

        // Check if the question exists
        const question = await Question.getById(questionId);
        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        // Delete the question
        await Question.delete(questionId);

        res.status(204).end(); // No content

    } catch (error) {
        console.error("Error deleting question:", error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete question',
            ...(process.env.NODE_ENV === 'development' && { detail: error.message })
        });
    }
};
// questionController.js
exports.updateQuestions = async (req, res) => {
    try {
        const quizId = req.params.quizId;
        const { questions } = req.body;

        // ✅ Update or create questions
        for (const question of questions) {
            const { id, question_text, question_type, question_order, correct_short_answer, time_limit, options } = question;

            let questionId = id;

            if (id) {
                // ✅ Update existing question
                await Question.update(id, {
                    question_text,
                    question_type,
                    question_order,
                    correct_short_answer,
                    time_limit
                });
            } else {
                // ✅ Create new question
                questionId = await Question.create(quizId, {
                    questionText: question_text,
                    questionType: question_type,
                    questionOrder: question_order,
                    correctShortAnswer: correct_short_answer,
                    timeLimit: time_limit
                });
            }

            // ✅ Update or create options
            if (options && options.length > 0) {
                await Question.updateOptions(questionId, options);
            }
        }

        res.json({
            success: true,
            message: 'Questions and options updated successfully'
        });
    } catch (error) {
        console.error("Error updating questions:", error);
        res.status(500).json({
            success: false,
            message: 'Failed to update questions and options',
            detail: error.message
        });
    }
};
// questionController.js

exports.deleteQuestion = async (req, res) => {
    try {
        const questionId = req.params.questionId;

        // ✅ Check if the question exists
        const question = await Question.getById(questionId);
        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        // ✅ Delete the question and associated options
        const deleted = await Question.delete(questionId);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Failed to delete question'
            });
        }

        res.status(204).end(); // No content

    } catch (error) {
        console.error("Error deleting question:", error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete question',
            ...(process.env.NODE_ENV === 'development' && { detail: error.message })
        });
    }
};


// ✅ Add this function for deleting options
exports.deleteOption = async (req, res) => {
    try {
        const optionId = req.params.optionId;

        // ✅ Delete the option
        const deleted = await Question.deleteOption(optionId);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Option not found'
            });
        }

        res.status(204).end(); // No content

    } catch (error) {
        console.error("Error deleting option:", error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete option',
            ...(process.env.NODE_ENV === 'development' && { detail: error.message })
        });
    }
};
