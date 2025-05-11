const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    console.log("🛡️ Raw Authorization Header:", authHeader);
    
    // Extract only the token part
    const token = authHeader && authHeader.split(' ')[1];
    console.log("🔑 Extracted Token:", token);

    if (!token) {
      console.warn("⚠️ Token not provided");
      return res.status(401).json({ success: false, message: 'Token is required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("👤 Decoded User:", decoded);

    // Correctly set the user object
    req.user = {
      _id: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    console.error("❌ Authentication error:", error);
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
