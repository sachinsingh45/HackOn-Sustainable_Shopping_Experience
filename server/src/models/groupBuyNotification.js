// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'group' },
  type: { type: Number, default: 1 },

  groupName: { type: String },
  message: { type: String },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const notificationModel = mongoose.model('notifications', notificationSchema);
module.exports = notificationModel;
