const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  iconUrl: { type: String },
});

const challengeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['ecoScore', 'co2Saved', 'moneySaved', 'circularityScore'], required: true },
  targetValue: { type: Number, required: true },
  rewardBadge: { type: badgeSchema, required: true },
  isActive: { type: Boolean, default: true },
  frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

const Challenge = mongoose.model('challenges', challengeSchema);

module.exports = Challenge; 