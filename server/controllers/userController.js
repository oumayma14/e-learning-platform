const userModel = require('../models/userModel'); // NEW

// NEW: Simplified getAllUsers
const getUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// NEW: Leaderboard uses model
const getAllUsers = async (req, res) => {
  try {
    const leaderboard = await userModel.getLeaderboard();
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// NEW: Cleaner updateUser
const updateUser = async (req, res) => {
  try {
    const updatedUser = await userModel.updateUser(
      req.params.username,
      req.body
    );
    res.json({ 
      message: 'User updated',
      user: updatedUser 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// NEW: Simplified deleteUser
const deleteUser = async (req, res) => {
  try {
    await userModel.deleteUser(req.params.username);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getUsers, getAllUsers, updateUser, deleteUser };