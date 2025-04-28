const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const quizRoutes = require('./routes/quizRoutes');
const pool = require('./config/db');
const progressRoutes = require("./routes/progressRoutes");
const challengeRouutes = require("./routes/challengeRoutes");

const app = express();

// ======================
// 1. Enhanced Middleware
// ======================
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL 
    : 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 300
});
app.use(limiter);

app.use(express.json({ limit: '10kb' }));

// =============
// 2. Static Files (ONLY CHANGE MADE)
// =============
app.use('/uploads', express.static('uploads', {
  setHeaders: (res) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', 
      process.env.NODE_ENV === 'production' 
        ? process.env.CLIENT_URL 
        : 'http://localhost:3000');
  }
}));

// =============
// 3. Routes
// =============
app.use('/', authRoutes);
app.use('/api', userRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/challenges', challengeRouutes);

// ======================
// 4. Database Health Check
// ======================
app.get('/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1');
    res.status(200).json({ 
      status: 'healthy',
      database: 'connected'
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'unhealthy',
      database: 'disconnected',
      error: err.message
    });
  }
});

// ======================
// 5. Error Handling
// ======================
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Endpoint not found' 
  });
});

app.use((err, req, res, next) => {
  console.error('🚨 Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
});

// ======================
// 6. Server Startup
// ======================
const PORT = process.env.PORT || 3002;

const startServer = async () => {
  try {
    const [rows] = await pool.query('SELECT 1');
    console.log('**Database connected successfully');
    
    app.listen(PORT, () => {
      console.log(`**Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  }
};

startServer();

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  pool.end().then(() => {
    console.log('Database connections closed');
    process.exit(0);
  });
});
