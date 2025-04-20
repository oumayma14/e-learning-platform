const pool = require('../config/db');

class Quiz {
    static async getAll() {
        try {
            const rows = await pool.query('SELECT * FROM quizzes');
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getById(id) {
        try {
            const rows = await pool.query('SELECT * FROM quizzes WHERE id = ?', [id]);
            return rows[0] || null;
        } catch (error) {
            throw error;
        }
    }

    static async create(quizData) {
        try {
            const { title, description, difficulty, category } = quizData;

            const result = await pool.query(
                `INSERT INTO quizzes (title, description, difficulty, category) VALUES (?, ?, ?, ?)`,
                [title, description, difficulty, category]
            );

            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    static async update(id, quizData) {
        try {
            const { title, description, difficulty, category } = quizData;

            const result = await pool.query(
                `UPDATE quizzes SET title = ?, description = ?, difficulty = ?, category = ? WHERE id = ?`,
                [title, description, difficulty, category, id]
            );

            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        try {
            const result = await pool.query(
                'DELETE FROM quizzes WHERE id = ?',
                [id]
            );

            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async getWithQuestions(id) {
        try {
            const quizRows = await pool.query(
                'SELECT * FROM quizzes WHERE id = ?',
                [id]
            );

            if (!quizRows.length) {
                return null;
            }

            const quiz = quizRows[0];

            const questionRows = await pool.query(
                'SELECT * FROM questions WHERE quiz_id = ? ORDER BY question_order',
                [id]
            );

            for (const question of questionRows) {
                const optionRows = await pool.query(
                    'SELECT * FROM options WHERE question_id = ? ORDER BY option_order',
                    [question.id]
                );
                question.options = optionRows;
            }

            quiz.questions = questionRows;
            return quiz;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Quiz;
