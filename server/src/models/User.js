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
      cartItem: {},
      qty: Number
    }
  ],
  orders: [
    {
      items: [{
        name: String,
        quantity: Number,
        price: Number,
        carbonFootprint: Number,
        ecoScore: Number,
        isEcoFriendly: Boolean
      }],
      totalAmount: Number,
      totalEcoScore: Number,
      totalCarbonSaved: Number,
      moneySaved: Number,
      orderDate: Date,
      status: String
    }
  ],
  location: {

    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: '' },
    pin: { type: String, default: '' },

    coor: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    }
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
    type: [String],
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
  },

  PendingGroup: [{ type: mongoose.Schema.Types.ObjectId, ref: 'group' }],
  OrderedGroup: [{ type: mongoose.Schema.Types.ObjectId, ref: 'group' }],
  GroupOrderPlaced: [{ type: mongoose.Schema.Types.ObjectId, ref: 'group' }],
});

userSchema.index({ 'location.coor': '2dsphere' });

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
userSchema.methods.addOrder = async function(order) {
  try {
    this.orders = this.orders.concat(order);
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
  if (err.code !== 26 && err.code !== 27) { // 26: namespace not found, 27: index not found
    console.error('Error dropping name index:', err);
  }
});


// Export model
module.exports = User;