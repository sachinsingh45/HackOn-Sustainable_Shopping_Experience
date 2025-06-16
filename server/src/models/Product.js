// Libraries
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: Number,
  url: String,
  resUrl: String,
  price: String,
  value: String,
  accValue: Number,
  discount: String,
  mrp: String,
  name: String,
  category: {
    type: String,
    default: 'General'
  },
  points: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 4
  },
  reviews: {
    type: Number,
    default: 100
  },
  carbonFootprint: {
    type: Number,
    default: 2.5
  },
  ecoScore: {
    type: Number,
    default: 75
  },
  isEcoFriendly: {
    type: Boolean,
    default: true
  },
  groupBuyEligible: {
    type: Boolean,
    default: false
  }
});

const Product = new mongoose.model("products", productSchema);

module.exports = Product;