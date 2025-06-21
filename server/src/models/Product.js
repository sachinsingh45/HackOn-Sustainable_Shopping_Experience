// Libraries
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  url: String,
  price: String,
  mrp: String,
  name: String,
  category: {
    type: String,
    default: 'General'
  },
  subCategory: {
    type: String,
    default: ''
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
    default: 50
  },
  isEcoFriendly: {
    type: Boolean,
    default: true
  },
  groupBuyEligible: {
    type: Boolean,
    default: true
  },
  unitsInStock: {
    type: Number,
    default: 0,
    min: 0
  },
  unitsSold: {
    type: Number,
    default: 0,
    min: 0
  }
});

productSchema.virtual('outOfStock').get(function() {
  return this.unitsSold >= this.unitsInStock;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = new mongoose.model("products", productSchema);

module.exports = Product;