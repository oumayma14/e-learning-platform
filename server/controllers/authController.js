const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const util = require('util');
const saltRounds = 10;

db.query = util.promisify(db.query);

const SECRET_KEY = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = process.env.JWT_EXPIRES_IN || '30s';

// Registration logic
const register = async (req, res) => {
    try {
        const { username, name, email, password, role } = req.body;

        if (!username || !name || !email || !password || !role) {
            return res.status(400).json({ message: "Missing required fields!" });
        }

        // Check if email or username exists
        const checkQuery = "SELECT * FROM user WHERE username = ? OR email = ?";
        db.query(checkQuery, [username, email], async (err, results) => {
            if (err) return res.status(500).json({ error: "Database error" });

            if (results.length > 0) {
                return res.status(400).json({ message: "Username or email already exists!" });
            }

            // **Hash the password only if it's not empty**
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const insertQuery = "INSERT INTO user (username, name, email, password, role) VALUES (?, ?, ?, ?, ?)";
            db.query(insertQuery, [username, name, email, hashedPassword, role], (err, result) => {
                if (err) return res.status(500).json({ error: "Server error", details: err });

                res.status(201).json({ message: "User registered successfully" });
            });
        });

    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
};

// Login
const login = async (req, res) => {
    const { LoginEmail, LoginPassword } = req.body;
    console.log("Received request: ", req.body);

    try {
        const SQL = 'SELECT * FROM user WHERE email = ?';
        const query = util.promisify(db.query).bind(db);
        const results = await query(SQL, [LoginEmail]);
        console.log("Query results: ", results);

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid email or password!" });
        }

        const user = results[0];
        console.log("Found user: ", user);

        // Compare password
        const passwordMatch = await bcrypt.compare(LoginPassword, user.password);
        console.log("Password match: ", passwordMatch);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid email or password!" });
        }

        // Generate token
        const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION });

        res.json({ message: "Login successful!", token, user: { username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
};


module.exports = { register, login };