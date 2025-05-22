const db = require('../config/db');
const bcrypt = require('bcrypt');
const util = require('util');

// Make db.query return promises
db.query = util.promisify(db.query);

module.exports = {
  /**
   * Register a new user
   */
  async registerUser({ username, name, email, password, role, image }) {
    const checkQuery = 'SELECT * FROM learners WHERE username = ? OR email = ?';
    const users = await db.query(checkQuery, [username, email]);
    if (users.length > 0) throw new Error('Username or email exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = `
      INSERT INTO learners (username, name, email, password, role, image, score)
      VALUES (?, ?, ?, ?, ?, ?, 0)
    `;
    await db.query(insertQuery, [username, name, email, hashedPassword, role, image]);

    return { username, email, role };
  },

  /**
   * Find user by email (for login)
   */
  async findUserByEmail(email) {
    const query = 'SELECT * FROM learners WHERE email = ?';
    const users = await db.query(query, [email]);
    return users[0] || null;
  },

  /**
   * Get all users
   */
  async getAllUsers() {
    const query = 'SELECT username, name, email, role, score FROM user';
    return await db.query(query);
  },

  /**
   * Update user
   */
  async updateUser(username, updates) {
    const [user] = await db.query('SELECT * FROM learners WHERE username = ?', [username]);
    if (!user) throw new Error('User not found');

    const updatedUser = {
      name: updates.name || user.name,
      email: updates.email || user.email,
      role: updates.role || user.role,
      score: updates.score !== undefined ? updates.score : user.score
    };

    let query = 'UPDATE learners SET name=?, email=?, role=?, score=? WHERE username=?';
    let params = [updatedUser.name, updatedUser.email, updatedUser.role, updatedUser.score, username];

    if (updates.password) {
      updatedUser.password = await bcrypt.hash(updates.password, 10);
      query = 'UPDATE user SET name=?, email=?, password=?, role=?, score=? WHERE username=?';
      params = [updatedUser.name, updatedUser.email, updatedUser.password, updatedUser.role, updatedUser.score, username];
    }

    await db.query(query, params);
    return updatedUser;
  },

  /**
   * Delete user
   */
  async deleteUser(username) {
    const result = await db.query('DELETE FROM learners WHERE username = ?', [username]);
    if (result.affectedRows === 0) throw new Error('User not found');
    return true;
  },

  /**
   * Get leaderboard
   */
  async getLeaderboard() {
    const query = 'SELECT username, score, image FROM learners ORDER BY score DESC LIMIT 10';
    return await db.query(query);
  },

  /**
   * NEW: Get user by username (for current user endpoint)
   */
  async getUserByUsername(username) {
    const query = 'SELECT username, name, email, role, image, score FROM learners WHERE username = ?';
    const users = await db.query(query, [username]);
    return users[0] || null;
  }
};