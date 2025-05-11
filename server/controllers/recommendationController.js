// controllers/recommendationController.js

const Quiz = require('../models/quizModel');
const Feedback = require('../models/Feedback');

exports.getRecommendedQuizzes = async (req, res) => {

    try {
        const user_id = req.params.userId;

        // Fetch feedback with categories
        const feedbacks = await Feedback.getFeedbackWithCategories(user_id);

        // Calculate category scores based on feedback
        const categoryScores = {};
        feedbacks.forEach(feedback => {
            const score = feedback.sentiment === 'positive' ? 2 : feedback.sentiment === 'neutral' ? 1 : -1;
            const category = feedback.category;

            // Weight feedback by recency (most recent feedback is more impactful)
            const timeDecayFactor = 1 - (Date.now() - new Date(feedback.created_at).getTime()) / (1000 * 60 * 60 * 24 * 30); // 30 days decay
            const weightedScore = score * timeDecayFactor;

            categoryScores[category] = (categoryScores[category] || 0) + weightedScore;
        });

        // Get top 3 categories
        const topCategories = Object.keys(categoryScores)
            .sort((a, b) => categoryScores[b] - categoryScores[a])
            .slice(0, 3);

        // Fetch quizzes in the top categories
        let recommendedQuizzes = [];
        if (topCategories.length > 0) {
            recommendedQuizzes = await Quiz.getQuizzesByCategories(topCategories, 10);
        }

        // Fallback to popular quizzes if no strong category preferences
        if (recommendedQuizzes.length === 0) {
            recommendedQuizzes = await Quiz.getPopularQuizzes(10);
        }

        res.status(200).json({
            success: true,
            data: recommendedQuizzes
        });

    } catch (error) {
        console.error("Error getting recommended quizzes:", error);
        res.status(500).json({ success: false, message: "Failed to fetch recommendations" });
    }
};
