const pool = require('../config/db');
const util = require('util');
pool.query = util.promisify(pool.query);

class Quiz {
    static async getAll(timeFormat = 'seconds') {
        try {
          const rows = await pool.query('SELECT * FROM quizzes');
          const formatted = rows.map(quiz => this.formatQuizTime(quiz, timeFormat));
          return formatted;
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

    static async getByFormateurId(formateurId, timeFormat = 'seconds') {
        try {
          const rows = await pool.query(`
            SELECT q.*
            FROM quizzes q
            JOIN formateur_quizzes fq ON fq.quiz_id = q.id
            WHERE fq.formateur_id = ?
          `, [formateurId]);
      
          return rows.map(quiz => this.formatQuizTime(quiz, timeFormat));
        } catch (error) {
          throw error;
        }
      }
      static async getPopularQuizzes(limit = 5) {
        try {
            const rows = await pool.query(
                `SELECT q.*, AVG(f.compound_score) as average_score 
                FROM quizzes q 
                LEFT JOIN feedback f ON q.id = f.quiz_id 
                GROUP BY q.id 
                ORDER BY average_score DESC 
                LIMIT ?`,
                [limit]
            );
            return rows;
        } catch (error) {
            console.error("Error fetching popular quizzes:", error);
            throw error;
        }
    }
    

    static async getRecommendedQuizzes(user_id) {
        try {
            // Get positive feedback from user
            const positiveFeedback = await pool.query(
                `SELECT quiz_id FROM feedback WHERE user_id = ? AND sentiment = 'positive' ORDER BY compound_score DESC LIMIT 5`,
                [user_id]
            );
            const quizIds = positiveFeedback.map(fb => fb.quiz_id);
            
            if (quizIds.length === 0) {
                // If no positive feedback, return popular quizzes
                return await this.getPopularQuizzes();
            }

            // Fetch similar quizzes
            const placeholders = quizIds.map(() => '?').join(',');
            const rows = await pool.query(
                `SELECT * FROM quizzes WHERE id IN (${placeholders}) ORDER BY created_at DESC LIMIT 5`,
                quizIds
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getSimilarQuizzes(quizIds) {
        try {
            const rows = await pool.query(
                `SELECT * FROM quizzes 
                WHERE category IN (SELECT category FROM quizzes WHERE id IN (?))
                AND id NOT IN (?)
                ORDER BY created_at DESC 
                LIMIT 5`,
                [quizIds, quizIds]
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getQuizzesByCategories(categories, limit = 10) {
        try {
            if (!categories.length) return [];
            const placeholders = categories.map(() => '?').join(',');
            const rows = await pool.query(
                `SELECT * FROM quizzes 
                WHERE category IN (${placeholders}) 
                ORDER BY RAND() 
                LIMIT ?`,
                [...categories, limit]
            );
            return rows;
        } catch (error) {
            console.error("Error fetching quizzes by categories:", error);
            throw error;
        }
    }
    
      
}

module.exports = Quiz;