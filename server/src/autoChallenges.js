const mongoose = require('mongoose');
const Challenge = require('./models/Challenge');
require('dotenv').config({ path: '../.env' });

const badgeIcons = {
  daily: 'https://cdn-icons-png.flaticon.com/512/190/190411.png',
  weekly: 'https://cdn-icons-png.flaticon.com/512/190/190406.png',
  monthly: 'https://cdn-icons-png.flaticon.com/512/190/190416.png',
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
        name: `${frequency.charAt(0).toUpperCase() + frequency.slice(1)} Challenge Winner`,
        description: `Awarded for completing the ${frequency} challenge`,
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
  await ensureChallenge('daily', 'Eco Daily Action', 'Complete one eco-friendly action today!', 'ecoScore', 10);
  await ensureChallenge('weekly', 'Weekly CO2 Saver', 'Save 5kg of CO2 this week!', 'co2Saved', 5);
  await ensureChallenge('monthly', 'Monthly Green Shopper', 'Buy 3 eco-friendly products this month!', 'moneySaved', 3);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error('Error in autoChallenges:', err);
  process.exit(1);
}); 