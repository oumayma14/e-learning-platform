const express = require('express');
const jwt = require('jsonwebtoken'); 
const AdminController = require('../controllers/AdminController');
const pool = require('../config/db');
require('dotenv').config();


const router = express.Router();

// Admin Registration Route
router.post('/register', AdminController.register);

// Admin Login Route
router.post('/login', AdminController.login);

router.get('/me', (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ admin: decoded });
    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(401).json({ message: "Unauthorized" });
    }
});

// Middleware to verify the token
const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(401).json({ message: "Unauthorized" });
    }
};

// Get all users (learners and formateurs)
router.get('/users', verifyToken, async (req, res) => {
    try {
        pool.query('SELECT username, name, email, score, image, "Apprenant" AS role FROM user', (err, users, fields) => {
            if (err) throw err;
            pool.query('SELECT CAST(id AS CHAR) AS username, nom AS name, email, 0 AS score, NULL AS image, "Formateur" AS role FROM formateurs', (err, formateurs, fields) => {
                if (err) throw err;
                const combinedUsers = [...(users || []), ...(formateurs || [])];
                res.json({ users: combinedUsers });
            });
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users" });
    }
});

// Get single user by username
router.get('/users/:username', verifyToken, async (req, res) => {
    try {
        const { username } = req.params;
        pool.query('SELECT username, name, email, score, image, "Apprenant" AS role FROM user WHERE username = ?', [username], (err, users, fields) => {
            if (err) throw err;
            pool.query('SELECT id AS username, nom AS name, email, 0 AS score, NULL AS image, "Formateur" AS role FROM formateurs WHERE id = ?', [username], (err, formateurs, fields) => {
                if (err) throw err;
                const user = [...(users || []), ...(formateurs || [])];
                if (user.length === 0) {
                    return res.status(404).json({ message: "User not found" });
                }
                res.json({ user: user[0] });
            });
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Error fetching user" });
    }
});

// Delete user by username
router.delete('/users/:username', verifyToken, async (req, res) => {
    try {
        const { username } = req.params;
        pool.query('DELETE FROM user WHERE username = ?', [username], (err, userResult, fields) => {
            if (err) throw err;
            pool.query('DELETE FROM formateurs WHERE id = ?', [username], (err, formateurResult, fields) => {
                if (err) throw err;
                if (userResult.affectedRows === 0 && formateurResult.affectedRows === 0) {
                    return res.status(404).json({ message: "User not found" });
                }
                res.json({ message: "User deleted successfully" });
            });
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Error deleting user" });
    }
});

// Update user by username
router.put('/users/:username', verifyToken, async (req, res) => {
    try {
        const { username } = req.params;
        const { name, email, role } = req.body;

        // Check if the user is an Apprenant
        pool.query(
            'UPDATE user SET name = ?, email = ?, role = ? WHERE username = ?',
            [name, email, role, username],
            (err, result) => {
                if (err) throw err;

                // If no rows were affected, check if it's a Formateur
                if (result.affectedRows === 0) {
                    pool.query(
                        'UPDATE formateurs SET nom = ?, email = ? WHERE id = ?',
                        [name, email, username],
                        (err, formateurResult) => {
                            if (err) throw err;
                            if (formateurResult.affectedRows === 0) {
                                return res.status(404).json({ message: "User not found" });
                            }
                            res.json({ message: "Formateur updated successfully" });
                        }
                    );
                } else {
                    res.json({ message: "Apprenant updated successfully" });
                }
            }
        );
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Error updating user" });
    }
});

// Quiz Management Routes
router.get('/quizzes', verifyToken, AdminController.getAllQuizzes);
router.delete('/quizzes/:quizId', verifyToken, AdminController.deleteQuiz);
// routes/AdminRoutes.js
router.get('/categories', verifyToken, AdminController.getCategories);
//routes to get users score
router.get('/scores', verifyToken, AdminController.getAllUserScores);
//stats
router.get('/stats', verifyToken, AdminController.getPlatformStats);
// Route to get quiz counts by category
router.get('/quiz-category-counts', verifyToken, AdminController.getQuizCountsByCategory);

module.exports = router;
