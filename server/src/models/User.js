// Libraries
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Product = require('./Product');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  confirmPassword: {
    type: String
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ],
  cart: [
    {
      id: String,
      cartItem: {},
      qty: Number
    }
  ],
  orders: [
    {}
  ],
  location: {
    type: String,
    default: ''
  },
  carbonSaved: {
    type: Number,
    default: 0
  },
  ecoScore: {
    type: Number,
    default: 0
  },
  circularityScore: {
    type: Number,
    default: 0
  },
  moneySaved: {
    type: Number,
    default: 0
  },
  currentChallenges: {
    type: [String], // or you can use an array of ObjectId if you have a Challenge model
    default: []
  },
  badges: {
    type: [
      {
        name: { type: String, required: true },
        description: { type: String },
        iconUrl: { type: String },
        challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'challenges' },
        dateEarned: { type: Date, default: Date.now }
      }
    ],
    default: []
  }
});

// Convert email to lowercase before saving
userSchema.pre('save', function(next) {
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  next();
});

// Token generation
const secretKey = process.env.SECRET_KEY;
userSchema.methods.generateAuthToken = async function() {
  try {
    console.log('Generating token for user:', this._id);
    console.log('Secret key exists:', !!secretKey);
    
    if (!secretKey) {
      throw new Error('SECRET_KEY is not defined in environment variables');
    }
    
    const token = jwt.sign({ _id: this._id }, secretKey);
    console.log('Token generated successfully');
    
    this.tokens = this.tokens.concat({token: token});
    await this.save();
    console.log('Token saved to user document');
    
    return token;
  } catch (error) {
    console.log('Token generation error:', error);
    throw error;
  }
}

// Add to cart
userSchema.methods.addToCart = async function(productId, product) {
  try {
    this.cart = this.cart.concat({
      id: productId,
      cartItem: product,
      qty: 1
    });
    await this.save();
  } catch (error) {
    console.error("Add to cart error:", error);
    throw error;
  }
}

// Orders
userSchema.methods.addOrder = async function(orderInfo) {
  try {
    this.orders = this.orders.concat({ orderInfo });
    this.cart = [];
    await this.save();
  } catch (error) {
    console.log(error);
  }
}

// Model
const User = mongoose.model("users", userSchema);

// Drop the unique index on name field if it exists
User.collection.dropIndex('name_1').catch(err => {
  if (err.code !== 26) { // 26 is the error code for "namespace not found"
    console.error('Error dropping name index:', err);
  }
});

// Export model
module.exports = User;