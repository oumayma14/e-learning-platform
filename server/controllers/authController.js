const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const util = require('util');
const saltRounds = 10;

db.query = util.promisify(db.query);

const SECRET_KEY = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = process.env.JWT_EXPIRES_IN || '1h';

// Register a new user
const register = async (req, res) => {
    try {
        const { username, name, email, password, role } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!username || !name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const checkQuery = "SELECT * FROM user WHERE username = ? OR email = ?";
        const existingUsers = await db.query(checkQuery, [username, email]);

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: "Username or email already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const insertQuery = `
            INSERT INTO user (username, name, email, password, role, image) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        await db.query(insertQuery, [username, name, email, hashedPassword, role, image]);
        
        res.status(201).json({ 
            message: "User registered successfully",
            user: { username, email, role } 
        });

    } catch (error) {
        res.status(500).json({ 
            error: "Server error", 
            details: error.message 
        });
    }
};

// User login
const login = async (req, res) => {
    const { LoginEmail, LoginPassword } = req.body;

    try {
        const SQL = 'SELECT * FROM user WHERE email = ?';
        const results = await db.query(SQL, [LoginEmail]);

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid email or password!" });
        }

        const user = results[0];
        const passwordMatch = await bcrypt.compare(LoginPassword, user.password);
        
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid email or password!" });
        }

        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email,
                role: user.role 
            }, 
            SECRET_KEY, 
            { expiresIn: TOKEN_EXPIRATION }
        );

        res.json({ 
            message: "Login successful!", 
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                image: user.image
            }
        });

    } catch (error) {
        res.status(500).json({ 
            error: "Server error", 
            details: error.message 
        });
    }
};

module.exports = { register, login };