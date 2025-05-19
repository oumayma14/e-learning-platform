// controllers/feedbackController.js
const Feedback = require('../models/Feedback');
const vader = require('vader-sentiment');
const natural = require('natural');

// controllers/feedbackController.js
const analyzeSentiment = (text) => {
    const vaderScores = vader.SentimentIntensityAnalyzer.polarity_scores(text);
    const compound = vaderScores.compound;

    // Map compound scores to custom sentiment labels
    let sentiment = 'neutral';
    if (compound >= 0.6) {
        sentiment = 'very good';
    } else if (compound >= 0.2) {
        sentiment = 'good';
    } else if (compound <= -0.2 && compound > -0.6) {
        sentiment = 'bad';
    } else if (compound <= -0.6) {
        sentiment = 'very bad';
    }

    // Additional check for strong positive words
    const tokenizer = new natural.WordTokenizer();
    const words = tokenizer.tokenize(text.toLowerCase());
    const positiveWords = ['great', 'awesome', 'amazing', 'fantastic', 'love', 'fun', 'excellent', 'wonderful', 'perfect', 'incredible', 'spectacular', 'outstanding', 'brilliant', 'magnificent', 'remarkable'];
    const negativeWords = ['bad', 'terrible', 'worst', 'boring', 'hate', 'disappointing', 'awful', 'horrible', 'disgusting', 'pathetic', 'miserable', 'painful', 'regret', 'disastrous'];

    const positiveMatches = words.filter(word => positiveWords.includes(word)).length;
    const negativeMatches = words.filter(word => negativeWords.includes(word)).length;

    // Boost the sentiment if there are many positive words
    if (positiveMatches >= 2 && compound >= 0.4) {
        sentiment = 'very good';
    } else if (negativeMatches >= 2 && compound <= -0.4) {
        sentiment = 'very bad';
    }

    const emotion = positiveMatches > negativeMatches ? 'happy' : negativeMatches > positiveMatches ? 'frustrated' : 'neutral';

    return {
        sentiment,
        positive_score: vaderScores.pos,
        neutral_score: vaderScores.neu,
        negative_score: vaderScores.neg,
        compound_score: compound,
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

        const sentimentData = analyzeSentiment(feedback_text);

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
