// server/config/index.js
require('dotenv').config();

module.exports = {
  app: {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3002,
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3002'
  },
  db: require('./db'), // Import your existing db config
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  upload: {
    dest: process.env.UPLOAD_DIR || 'uploads/',
    limits: {
      fileSize: parseInt(process.env.MAX_UPLOAD_SIZE, 10) || 2 * 1024 * 1024 // 2MB
    }
  }
};