const jwt = require('jsonwebtoken');
const User = require('../models/User');
const secretKey = process.env.SECRET_KEY;

const authenticate = async function(req, res, next) {
  try {
    const token = await req.cookies.AmazonClone;
    // console.log(token);
    const verifyToken = await jwt.verify(token, secretKey);
    // console.log(verifyToken);
    const rootUser = await User.findOne({ _id: verifyToken._id });
    // console.log(rootUser);

    if (!rootUser) {
      throw new Error("User not found");
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userId = rootUser._id;

    next();

  } catch (error) {

    res.status(400).json({
      status: false,
      message: "No token provided",
      error: error
    })
  }
} 

module.exports = authenticate;