const mongoose = require('mongoose');
const Challenge = require('./models/Challenge');
require('dotenv').config({ path: '../.env' });

const badgeIcons = {
  daily: '/daily-badge.png',
  weekly: '/weekly-badge.png',
  monthly: '/monthly-badge.png',
};

function getPeriodDates(frequency) {
  const now = new Date();
  let startDate, endDate;
  if (frequency === 'daily') {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  } else if (frequency === 'weekly') {
    const day = now.getDay();
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day);
    endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day + 7);
  } else if (frequency === 'monthly') {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  }
  return { startDate, endDate };
}

async function ensureChallenge(frequency, name, description, type, targetValue) {
  const { startDate, endDate } = getPeriodDates(frequency);
  // Check if a challenge for this period and frequency exists
  const exists = await Challenge.findOne({ frequency, startDate, endDate });
  if (!exists) {
    await Challenge.create({
      name,
      description,
      type,
      targetValue,
      rewardBadge: {
        name: `${frequency.charAt(0).toUpperCase() + frequency.slice(1)} Eco Champion`,
        description: `Awarded for completing the ${frequency} eco challenge`,
        iconUrl: badgeIcons[frequency],
      },
      isActive: true,
      frequency,
      startDate,
      endDate,
    });
    console.log(`Created new ${frequency} challenge for period ${startDate.toISOString()} - ${endDate.toISOString()}`);
  } else {
    console.log(`${frequency} challenge already exists for this period.`);
  }
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  
  // Create challenges that match frontend expectations
  await ensureChallenge(
    'daily', 
    'Daily Eco Shopper', 
    'Buy at least 1 eco-friendly product today to complete this challenge.', 
    'ecoScore', 
    1
  );
  
  await ensureChallenge(
    'weekly', 
    'Weekly CO₂ Saver', 
    'Save at least 5kg of CO₂ this week to complete this challenge.', 
    'co2Saved', 
    5
  );
  
  await ensureChallenge(
    'monthly', 
    'Monthly Green Champion', 
    'Buy at least 10 eco-friendly products this month to complete this challenge.', 
    'ecoScore', 
    10
  );
  
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error('Error in autoChallenges:', err);
  process.exit(1);
}); 