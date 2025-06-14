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
  points: [{
    type: String
  }]
});

const Product = new mongoose.model("products", productSchema);

module.exports = Product;