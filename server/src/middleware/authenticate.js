const jwt = require('jsonwebtoken');
const User = require('../models/User');
const secretKey = process.env.SECRET_KEY;

const authenticate = async function(req, res, next) {
  try {
    console.log('Cookies received:', req.cookies);
    const token = await req.cookies.AmazonClone;
    console.log('Token extracted:', token ? 'Token exists' : 'No token found');
    
    if (!token) {
      throw new Error("No token provided");
    }
    
    const verifyToken = await jwt.verify(token, secretKey);
    console.log('Token verified for user:', verifyToken._id);
    
    const rootUser = await User.findOne({ _id: verifyToken._id });
    console.log('User found:', rootUser ? 'Yes' : 'No');

    if (!rootUser) {
      throw new Error("User not found");
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userId = rootUser._id;

    next();

  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(400).json({
      status: false,
      message: "Authentication failed",
      error: error.message
    })
  }
} 

module.exports = authenticate;