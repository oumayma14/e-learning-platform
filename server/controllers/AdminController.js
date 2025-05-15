const AdminModel = require('../models/AdminModel');
const jwt = require('jsonwebtoken');
const pool = require('../config/db'); 
require('dotenv').config();

class AdminController {
    // Register a new admin
    static async register(req, res) {
        try {
            const { username, email, password, full_name } = req.body;

            // Check if the admin already exists
            const existingAdmin = await AdminModel.findByUsername(username);
            if (existingAdmin) {
                return res.status(400).json({ message: 'Username already taken' });
            }

            // Create the admin
            const newAdmin = await AdminModel.create({ username, email, password, full_name });
            res.status(201).json({ message: 'Admin registered successfully', admin: newAdmin });
        } catch (error) {
            console.error('Error registering admin:', error);
            res.status(500).json({ message: 'Error registering admin' });
        }
    }

    // Login an admin
    static async login(req, res) {
        try {
            const { username, password } = req.body;

            // Find the admin by username
            const admin = await AdminModel.findByUsername(username);
            if (!admin) {
                return res.status(400).json({ message: 'Invalid username or password' });
            }

            // Verify the password
            const isPasswordValid = await AdminModel.verifyPassword(password, admin.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Invalid username or password' });
            }

            // Generate JWT Token
            const token = jwt.sign({ id: admin.id, username: admin.username ,  full_name: admin.full_name}, process.env.JWT_SECRET, { expiresIn: '24h' });

            res.status(200).json({ message: 'Login successful', token });
        } catch (error) {
            console.error('Error logging in admin:', error);
            res.status(500).json({ message: 'Error logging in admin' });
        }
    }
    // controllers/AdminController.js
    static async getAllQuizzes(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 12;
        const offset = (page - 1) * pageSize;
        const search = req.query.search || '';
        const category = req.query.category || '';
        const difficulty = req.query.difficulty || '';

        // Build the WHERE clause based on filters
        const conditions = [];
        const params = [];

        if (search) {
            conditions.push("q.title LIKE ?");
            params.push(`%${search}%`);
        }

        if (category) {
            conditions.push("q.category = ?");
            params.push(category);
        }

        if (difficulty) {
            conditions.push("q.difficulty = ?");
            params.push(difficulty);
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        // Fetch total quiz count for pagination
        const countQuery = `SELECT COUNT(*) AS count FROM quizzes q ${whereClause}`;
        pool.query(countQuery, params, (countError, countRows) => {
            if (countError) {
                console.error('Error counting quizzes:', countError.message);
                return res.status(500).json({ message: 'Error counting quizzes' });
            }

            const totalQuizzes = countRows[0].count;
            const totalPages = Math.ceil(totalQuizzes / pageSize);

            // Fetch paginated quizzes
            const quizQuery = `
                SELECT 
                    q.id AS quiz_id, q.title, q.description, q.difficulty, q.category, q.time_limit
                FROM quizzes q
                ${whereClause}
                ORDER BY q.id
                LIMIT ? OFFSET ?
            `;
            pool.query(quizQuery, [...params, pageSize, offset], (quizError, quizRows) => {
                if (quizError) {
                    console.error('Error fetching quizzes:', quizError.message);
                    return res.status(500).json({ message: 'Error fetching quizzes' });
                }

                // If no quizzes found, return empty array
                if (quizRows.length === 0) {
                    return res.status(200).json({
                        quizzes: [],
                        totalPages: totalPages
                    });
                }

                // Fetch questions and options for the quizzes
                const quizIds = quizRows.map(q => q.quiz_id);
                const questionQuery = `
                    SELECT 
                        qu.quiz_id, qu.id AS question_id, qu.question_text, qu.question_order, qu.question_type, qu.correct_short_answer,
                        o.id AS option_id, o.option_text, o.is_correct, o.option_order
                    FROM questions qu
                    LEFT JOIN options o ON qu.id = o.question_id
                    WHERE qu.quiz_id IN (?)
                    ORDER BY qu.quiz_id, qu.question_order, o.option_order
                `;
                pool.query(questionQuery, [quizIds], (questionError, questionRows) => {
                    if (questionError) {
                        console.error('Error fetching questions:', questionError.message);
                        return res.status(500).json({ message: 'Error fetching questions' });
                    }

                    // Format the quizzes with their questions and options
                    const formattedQuizzes = quizRows.map(quiz => ({
                        id: quiz.quiz_id,
                        title: quiz.title,
                        category: quiz.category,
                        difficulty: quiz.difficulty,
                        questions: []
                    }));

                    questionRows.forEach(row => {
                        const quiz = formattedQuizzes.find(q => q.id === row.quiz_id);
                        if (quiz) {
                            let question = quiz.questions.find(q => q.id === row.question_id);
                            if (!question) {
                                question = {
                                    id: row.question_id,
                                    text: row.question_text,
                                    order: row.question_order,
                                    type: row.question_type,
                                    options: []
                                };
                                quiz.questions.push(question);
                            }

                            if (row.option_id) {
                                question.options.push({
                                    id: row.option_id,
                                    text: row.option_text,
                                    isCorrect: !!row.is_correct
                                });
                            }
                        }
                    });

                    res.status(200).json({
                        quizzes: formattedQuizzes,
                        totalPages: totalPages
                    });
                });
            });
        });
    } catch (error) {
        console.error('Error fetching quizzes:', error.message);
        res.status(500).json({ message: 'Error fetching quizzes' });
    }
    }

    // controllers/AdminController.js
static async getCategories(req, res) {
    try {
        pool.query(`SELECT DISTINCT category FROM quizzes ORDER BY category`, (error, rows) => {
            if (error) {
                console.error('Error fetching categories:', error.message);
                return res.status(500).json({ message: 'Error fetching categories' });
            }

            const categories = rows.map(row => row.category);
            res.status(200).json(categories);
        });
    } catch (error) {
        console.error('Error fetching categories:', error.message);
        res.status(500).json({ message: 'Error fetching categories' });
    }
}

    // Delete a quiz
    static async deleteQuiz(req, res) {
        try {
            const { quizId } = req.params;
            const deleted = await AdminModel.deleteQuizById(quizId);
            if (!deleted) {
                return res.status(404).json({ message: 'Quiz not found' });
            }
            res.status(200).json({ message: 'Quiz deleted successfully' });
        } catch (error) {
            console.error('Error deleting quiz:', error.message);
            res.status(500).json({ message: 'Error deleting quiz' });
        }
    }
    
     // Get all user scores for the admin dashboard
     static async getAllUserScores(req, res) {
        try {
            const query = `SELECT username, score FROM user`;
            pool.query(query, (error, results) => {
                if (error) {
                    console.error('Error fetching scores:', error.message);
                    return res.status(500).json({ message: 'Failed to fetch scores' });
                }
                res.status(200).json(results);
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to fetch scores' });
        }
    }

    static getPlatformStats(req, res) {
        try {
            const usersQuery = 'SELECT COUNT(*) AS users FROM user';
        const trainersQuery = 'SELECT COUNT(*) AS trainers FROM formateurs';
        const quizzesQuery = 'SELECT COUNT(*) AS quizzes FROM quizzes';

            pool.query(usersQuery, (userError, userResults) => {
                if (userError) {
                    console.error('Error fetching users:', userError.message);
                    return res.status(500).json({ message: 'Failed to fetch users' });
                }

                pool.query(trainersQuery, (trainerError, trainerResults) => {
                    if (trainerError) {
                        console.error('Error fetching trainers:', trainerError.message);
                        return res.status(500).json({ message: 'Failed to fetch trainers' });
                    }

                    pool.query(quizzesQuery, (quizError, quizResults) => {
                        if (quizError) {
                            console.error('Error fetching quizzes:', quizError.message);
                            return res.status(500).json({ message: 'Failed to fetch quizzes' });
                        }

                        const stats = {
                            users: userResults[0].users,
                            trainers: trainerResults[0].trainers,
                            quizzes: quizResults[0].quizzes
                        };
                        res.status(200).json(stats);
                    });
                });
            });
        } catch (error) {
            console.error('Error fetching platform stats:', error.message);
            res.status(500).json({ message: 'Failed to fetch platform stats' });
        }
    }

    // controllers/AdminController.js

static async getQuizCountsByCategory(req, res) {
    try {
        const query = `
            SELECT category, COUNT(*) AS quiz_count 
            FROM quizzes 
            GROUP BY category 
            ORDER BY category;
        `;
        
        pool.query(query, (error, rows) => {
            if (error) {
                console.error('Error fetching quiz counts by category:', error.message);
                return res.status(500).json({ message: 'Error fetching quiz counts by category' });
            }

            const counts = rows.map(row => ({
                category: row.category,
                count: row.quiz_count
            }));

            res.status(200).json(counts);
        });
    } catch (error) {
        console.error('Error fetching quiz counts by category:', error.message);
        res.status(500).json({ message: 'Error fetching quiz counts by category' });
    }
}

}

module.exports = AdminController;
