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
    default: false
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
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  materialComposition: {
    type: Map,
    of: Number, // percentage of each material
    required: true
  },
  packaging: {
    type: String,
    required: true
  },
  recyclability: {
    type: Boolean,
    required: true
  },
  distance: {
    type: Number, // distance in km
    required: true
  },
  salesCount: {
    type: Number,
    default: 0,
    min: 0
  },
  repairability: {
    type: Boolean,
    required: true
  },
  lifespan: {
    type: Number,
    required: true
  }
});

productSchema.virtual('outOfStock').get(function() {
  return this.unitsSold >= this.unitsInStock;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

productSchema.set('timestamps', true);

const Product = new mongoose.model("products", productSchema);

module.exports = Product;