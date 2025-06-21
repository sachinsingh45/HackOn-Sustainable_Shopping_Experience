const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({

  name: { type: String, required: true },
  admin: { type: String  },
  members: [{ 
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
        item: [{
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
            count: { type: Number },
        }],
    }],

  message: [ { type: mongoose.Schema.Types.ObjectId, ref: 'message' } ],
  date: { type: String },
  pending: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now }

}, { timestamps: true });

const groupModel = mongoose.model('group', groupSchema);
module.exports = groupModel; 
