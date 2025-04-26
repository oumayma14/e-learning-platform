const pool = require('../config/db');

class Quiz {
    static async getAll(timeFormat = 'seconds') {
        try {
            const rows = await pool.query('SELECT * FROM quizzes');
            
            // Convert time format if needed
            return rows.map(quiz => this.formatQuizTime(quiz, timeFormat));
        } catch (error) {
            throw error;
        }
    }

    static async getById(id, timeFormat = 'seconds') {
        try {
            const rows = await pool.query('SELECT * FROM quizzes WHERE id = ?', [id]);
            if (!rows.length) return null;
            
            return this.formatQuizTime(rows[0], timeFormat);
        } catch (error) {
            throw error;
        }
    }

    static async create(quizData) {
        try {
            const { title, description, difficulty, category, timeLimit, timeUnit } = quizData;
            
            // Convert to seconds if needed
            const timeLimitInSeconds = timeUnit === 'minutes' ? timeLimit * 60 : timeLimit;

            const result = await pool.query(
                `INSERT INTO quizzes (title, description, difficulty, category, time_limit) 
                VALUES (?, ?, ?, ?, ?)`,
                [title, description, difficulty, category, timeLimitInSeconds]
            );

            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    static async update(id, quizData) {
        try {
            const { title, description, difficulty, category, timeLimit, timeUnit } = quizData;
            
            // Convert to seconds if needed
            const timeLimitInSeconds = timeUnit === 'minutes' ? timeLimit * 60 : timeLimit;

            const result = await pool.query(
                `UPDATE quizzes SET 
                    title = ?, 
                    description = ?, 
                    difficulty = ?, 
                    category = ?,
                    time_limit = ?
                WHERE id = ?`,
                [title, description, difficulty, category, timeLimitInSeconds, id]
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

    static async getWithQuestions(id, timeFormat = 'seconds') {
        try {
            const quizRows = await pool.query(
                'SELECT * FROM quizzes WHERE id = ?',
                [id]
            );

            if (!quizRows.length) {
                return null;
            }

            const quiz = this.formatQuizTime(quizRows[0], timeFormat);

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

    // Helper method to format quiz time
    static formatQuizTime(quiz, format = 'seconds') {
        if (!quiz) return quiz;
        
        const formattedQuiz = { ...quiz };
        
        if (format === 'minutes') {
            formattedQuiz.time_limit = Math.ceil(quiz.time_limit / 60);
            formattedQuiz.time_unit = 'minutes';
        } else {
            formattedQuiz.time_unit = 'seconds';
        }
        
        return formattedQuiz;
    }
}

module.exports = Quiz;