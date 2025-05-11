const Feedback = require('../models/Feedback');
const Quiz = require('../models/quizModel');
const vader = require('vader-sentiment');
const natural = require('natural');

const analyzeSentiment = (text) => {
    const vaderScores = vader.SentimentIntensityAnalyzer.polarity_scores(text);
    const overallSentiment = vaderScores.compound >= 0.05
        ? 'positive'
        : vaderScores.compound <= -0.05
        ? 'negative'
        : 'neutral';

    const tokenizer = new natural.WordTokenizer();
    const words = tokenizer.tokenize(text.toLowerCase());
    const positiveWords = ['great', 'awesome', 'amazing', 'fantastic', 'love', 'fun'];
    const negativeWords = ['bad', 'terrible', 'worst', 'boring', 'hate', 'disappointing'];

    const positiveMatches = words.filter(word => positiveWords.includes(word)).length;
    const negativeMatches = words.filter(word => negativeWords.includes(word)).length;

    const emotion = positiveMatches > negativeMatches ? 'happy' : negativeMatches > positiveMatches ? 'frustrated' : 'neutral';

    return {
        sentiment: overallSentiment,
        positive_score: vaderScores.pos,
        neutral_score: vaderScores.neu,
        negative_score: vaderScores.neg,
        compound_score: vaderScores.compound,
        emotion
    };
};

exports.createFeedback = async (req, res) => {
    try {
        const { user_id, quiz_id, feedback_text } = req.body;

        if (!user_id || !quiz_id || !feedback_text) {
            return res.status(400).json({ 
                success: false, 
                message: "User ID, Quiz ID, and Feedback Text are required." 
            });
        }

        // Get quiz category for better recommendations
        const quiz = await Quiz.getById(quiz_id);
        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found"
            });
        }

        // Perform Sentiment Analysis
        const sentimentData = analyzeSentiment(feedback_text);

        // Save feedback to database
        const feedbackId = await Feedback.createFeedback({
            user_id,
            quiz_id,
            feedback_text,
            sentiment: sentimentData.sentiment,
            positive_score: sentimentData.positive_score,
            neutral_score: sentimentData.neutral_score,
            negative_score: sentimentData.negative_score,
            compound_score: sentimentData.compound_score
        });

        res.status(201).json({
            success: true,
            message: "Feedback submitted successfully",
            data: {
                feedbackId,
                overallSentiment: sentimentData.sentiment,
                emotion: sentimentData.emotion
            }
        });

    } catch (error) {
        console.error("Error creating feedback:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to submit feedback",
            error: error.message 
        });
    }
};

exports.getFeedbackByQuiz = async (req, res) => {
    try {
        const quiz_id = req.params.quizId;
        const feedback = await Feedback.getFeedbackByQuiz(quiz_id);

        if (feedback.length === 0) {
            return res.status(404).json({ success: false, message: "No feedback found for this quiz" });
        }

        res.status(200).json({ success: true, data: feedback });
    } catch (error) {
        console.error(`Error fetching feedback for quiz ID ${req.params.quizId}:`, error);
        res.status(500).json({ success: false, message: "Failed to fetch feedback" });
    }
};

exports.getFeedbackByUser = async (req, res) => {
    try {
        const user_id = req.params.userId;
        const feedback = await Feedback.getFeedbackByUser(user_id);

        if (feedback.length === 0) {
            return res.status(404).json({ success: false, message: "No feedback found for this user" });
        }

        res.status(200).json({ success: true, data: feedback });
    } catch (error) {
        console.error(`Error fetching feedback for user ID ${req.params.userId}:`, error);
        res.status(500).json({ success: false, message: "Failed to fetch feedback" });
    }
};
