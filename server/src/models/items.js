const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    carbonFootprint: Number,
    ecoScore: Number,
    isEcoFriendly: Boolean,
  
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    createdAt: { type: Date, default: Date.now }
  
  }, { timestamps: true });
  
const itemModel = mongoose.model('items', itemSchema);
module.exports = itemModel; 