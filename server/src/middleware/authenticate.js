const jwt = require('jsonwebtoken');
const User = require('../models/User');
const secretKey = process.env.SECRET_KEY;

const authenticate = async function(req, res, next) {
  try {
    const token = req.cookies.AmazonClone;
    
    if (!token) {
      console.error('Authentication failed: No token in cookies');
      return res.status(401).json({
        status: false,
        message: "Authentication required",
        error: "No authentication token found"
      });
    }
    
    if (!secretKey) {
      console.error('Authentication failed: SECRET_KEY not configured');
      return res.status(500).json({
        status: false,
        message: "Server configuration error",
        error: "Secret key not configured"
      });
    }
    
    const verifyToken = jwt.verify(token, secretKey);
    
    const rootUser = await User.findOne({ _id: verifyToken._id });

    if (!rootUser) {
      console.error('Authentication failed: User not found for ID:', verifyToken._id);
      return res.status(401).json({
        status: false,
        message: "Authentication failed",
        error: "User not found"
      });
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userId = rootUser._id;

    next();

  } catch (error) {
    console.error('Authentication error:', error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: false,
        message: "Invalid authentication token",
        error: error.message
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: false,
        message: "Authentication token expired",
        error: "Please login again"
      });
    }
    return res.status(401).json({
      status: false,
      message: "Authentication failed",
      error: error.message
    });
  }
} 

module.exports = authenticate;