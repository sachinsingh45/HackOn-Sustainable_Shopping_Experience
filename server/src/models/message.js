const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({

  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  content: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  newUser: { type: Number, default: 0 },
}, { timestamps: true });

const messageModel = mongoose.model('message', messageSchema);
module.exports = messageModel;
