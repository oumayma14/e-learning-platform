const userModel = require('../models/userModel'); // NEW
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt'); 

// Register - Now uses userModel.registerUser()
const register = async (req, res) => {
  try {
    const { username, name, email, password, role } = req.body;
    const image = req.file?.filename; // NEW: Optional chaining

    // NEW: Delegate to model
    const user = await userModel.registerUser({ 
      username, name, email, password, role, image 
    });

    res.status(201).json({ 
      message: "User registered successfully",
      user // NEW: Cleaner response
    });
  } catch (error) {
    res.status(400).json({ 
      error: error.message // NEW: Direct error from model
    });
  }
};

// Login - Simplified with model
const login = async (req, res) => {
  try {
    const { LoginEmail, LoginPassword } = req.body;
    
    // NEW: Model handles DB query
    const user = await userModel.findUserByEmail(LoginEmail);
    if (!user) throw new Error("Invalid credentials");

    const validPassword = await bcrypt.compare(LoginPassword, user.password);
    if (!validPassword) throw new Error("Invalid credentials");

    // Rest remains the same
    const token = jwt.sign(
      { userId: user.username, email: user.email, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.json({ token, user: { ...user, password: undefined } });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = { register, login };