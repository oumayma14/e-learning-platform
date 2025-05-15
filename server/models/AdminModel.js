const pool = require('../config/db');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

class AdminModel {
    // Create a new admin
    static async create({ username, email, password, full_name }) {
        try {
            // Hash the password before saving
            const hashedPassword = await bcrypt.hash(password, 10);
            const id = uuidv4();

            const query = `INSERT INTO admins (id, username, email, password, full_name) VALUES (?, ?, ?, ?, ?)`;
            const values = [id, username, email, hashedPassword, full_name];

            await pool.query(query, values);
            return { id, username, email, full_name };
        } catch (error) {
            console.error('Error creating admin:', error);
            throw error;
        }
    }

// Find an admin by username
static async findByUsername(username) {
    try {
        const [rows, fields] = await new Promise((resolve, reject) => {
            pool.query('SELECT * FROM admins WHERE username = ?', [username], (error, results, fields) => {
                if (error) return reject(error);
                resolve([results, fields]);
            });
        });

        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error('Error finding admin by username:', error);
        throw error;
    }
}


    // Verify password
    static async verifyPassword(plainPassword, hashedPassword) {
        try {
            return await bcrypt.compare(plainPassword, hashedPassword);
        } catch (error) {
            console.error('Error verifying password:', error);
            throw error;
        }
    }
    // Fetch all quizzes with questions and options
    static getAllQuizzesWithQuestions() {
        return new Promise((resolve, reject) => {
            pool.query(`
                SELECT 
                    q.id AS quiz_id, q.title, q.description, q.difficulty, q.category, q.time_limit, 
                    qu.id AS question_id, qu.question_text, qu.question_order, qu.question_type, qu.correct_short_answer, qu.time_limit AS question_time_limit,
                    o.id AS option_id, o.option_text, o.is_correct, o.option_order
                FROM quizzes q
                LEFT JOIN questions qu ON q.id = qu.quiz_id
                LEFT JOIN options o ON qu.id = o.question_id
                ORDER BY q.id, qu.question_order, o.option_order
            `, (error, rows, fields) => {
                if (error) {
                    console.error('Error fetching quizzes with questions:', error.message);
                    return reject(error);
                }
                resolve(rows);
            });
        });
    }
    static deleteQuizById(quizId) {
        return new Promise((resolve, reject) => {
            pool.query('DELETE FROM quizzes WHERE id = ?', [quizId], (error, result) => {
                if (error) {
                    console.error('Error deleting quiz:', error.message);
                    return reject(error);
                }
                resolve(result.affectedRows > 0);
            });
        });
    }
}

module.exports = AdminModel;
