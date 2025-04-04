const db = require('../config/db');
const bcrypt = require('bcrypt');
const util = require('util');

// Make db.query return promises
db.query = util.promisify(db.query);

module.exports = {
  /**
   * Register a new user (used in authController.register())
   */
  async registerUser({ username, name, email, password, role, image }) {
    // 1. Check if user exists
    const checkQuery = 'SELECT * FROM user WHERE username = ? OR email = ?';
    const users = await db.query(checkQuery, [username, email]);
    if (users.length > 0) throw new Error('Username or email exists');

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insert user
    const insertQuery = `
      INSERT INTO user (username, name, email, password, role, image, score)
      VALUES (?, ?, ?, ?, ?, ?, 0)
    `;
    await db.query(insertQuery, [username, name, email, hashedPassword, role, image]);

    return { username, email, role };
  },

  /**
   * Login user (used in authController.login())
   */
  async findUserByEmail(email) {
    const query = 'SELECT * FROM user WHERE email = ?';
    const users = await db.query(query, [email]);
    return users[0] || null;
  },

  /**
   * Get all users (used in userController.getUsers())
   */
  async getAllUsers() {
    const query = 'SELECT username, name, email, role, score FROM user';
    return await db.query(query);
  },

  /**
   * Update user (used in userController.updateUser())
   */
  async updateUser(username, updates) {
    // 1. Get existing user
    const userQuery = 'SELECT * FROM user WHERE username = ?';
    const [user] = await db.query(userQuery, [username]);
    if (!user) throw new Error('User not found');

    // 2. Apply updates
    const updatedUser = {
      name: updates.name || user.name,
      email: updates.email || user.email,
      role: updates.role || user.role,
      score: updates.score !== undefined ? updates.score : user.score
    };

    // 3. Handle password update
    let query = 'UPDATE user SET name=?, email=?, role=?, score=? WHERE username=?';
    let params = [updatedUser.name, updatedUser.email, updatedUser.role, updatedUser.score, username];

    if (updates.password) {
      updatedUser.password = await bcrypt.hash(updates.password, 10);
      query = 'UPDATE user SET name=?, email=?, password=?, role=?, score=? WHERE username=?';
      params = [updatedUser.name, updatedUser.email, updatedUser.password, updatedUser.role, updatedUser.score, username];
    }

    // 4. Execute update
    await db.query(query, params);
    return updatedUser;
  },

  /**
   * Delete user (used in userController.deleteUser())
   */
  async deleteUser(username) {
    const query = 'DELETE FROM user WHERE username = ?';
    const result = await db.query(query, [username]);
    if (result.affectedRows === 0) throw new Error('User not found');
    return true;
  },

  /**
   * Get leaderboard (used in userController.getAllUsers())
   */
  async getLeaderboard() {
    const query = 'SELECT username, score, image FROM user ORDER BY score DESC LIMIT 10';
    return await db.query(query);
  }
};