// models/Feedback.js
const db = require('../config/db');
const util = require('util');

// Promisify db.query for async/await
db.query = util.promisify(db.query);

class Feedback {
    static async createFeedback({ user_id, quiz_id, feedback_text, sentiment, positive_score, neutral_score, negative_score, compound_score }) {
        try {
            const result = await db.query(
                `INSERT INTO quiz_feedback (user_id, quiz_id, feedback_text, sentiment, positive_score, neutral_score, negative_score, compound_score) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [user_id, quiz_id, feedback_text, sentiment, positive_score, neutral_score, negative_score, compound_score]
            );
            return result.insertId;
        } catch (error) {
            console.error("Error creating feedback:", error);
            throw error;
        }
    }

    static async getPositiveFeedbackByUser(user_id) {
        try {
            const rows = await db.query(
                `SELECT * FROM quiz_feedback WHERE user_id = ? AND sentiment = 'positive' ORDER BY compound_score DESC`,
                [user_id]
            );
            return rows;
        } catch (error) {
            console.error(`Error fetching positive feedback for user ID ${user_id}:`, error);
            throw error;
        }
    }

    static async getNegativeFeedbackByUser(user_id) {
        try {
            const rows = await db.query(
                `SELECT * FROM quiz_feedback WHERE user_id = ? AND sentiment = 'negative' ORDER BY compound_score ASC`,
                [user_id]
            );
            return rows;
        } catch (error) {
            console.error(`Error fetching negative feedback for user ID ${user_id}:`, error);
            throw error;
        }
    }

    static async getFeedbackStats(user_id) {
        try {
            const rows = await db.query(
                `SELECT 
                    sentiment, 
                    COUNT(*) as count, 
                    AVG(compound_score) as average_score 
                FROM quiz_feedback 
                WHERE user_id = ? 
                GROUP BY sentiment`,
                [user_id]
            );
            return rows;
        } catch (error) {
            console.error(`Error fetching feedback stats for user ID ${user_id}:`, error);
            throw error;
        }
    }

    static async getFeedbackWithCategories(user_id) {
        try {
            const rows = await db.query(
                `SELECT f.*, q.category 
                FROM quiz_feedback f 
                JOIN quizze q ON f.quiz_id = q.id 
                WHERE f.user_id = ?`,
                [user_id]
            );
            return rows;
        } catch (error) {
            console.error(`Error fetching feedback with categories for user ID ${user_id}:`, error);
            throw error;
        }
    }

    static async getFeedbackByUser(user_id) {
        try {
            const rows = await db.query(
                `SELECT * FROM quiz_feedback WHERE user_id = ? ORDER BY created_at DESC`,
                [user_id]
            );
            return rows;
        } catch (error) {
            console.error(`Error fetching all feedback for user ID ${user_id}:`, error);
            throw error;
        }
    }
}

module.exports = Feedback;
