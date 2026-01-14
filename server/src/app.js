// Libraries
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var path = require('path'); 
const http = require('http');
const cron = require('node-cron');


const port = process.env.PORT || 8000;
const app = express();

// socket connection
const { setUpsSockets } = require('./socket/socketconnection');
const { ChatFunction } = require('./socket/chat');
const { Notification } = require('./socket/notification');


const server = http.createServer(app);

setUpsSockets(server);

ChatFunction();
Notification();

// Database connection
const connectDB = require('./database/connection');
connectDB();

// Product Model
const Product = require('./models/Product');

// Routes
const router = require('./routes/router');

// Auto-update challenges
const Challenge = require('./models/Challenge');
const User = require('./models/User');

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

async function updateChallenges() {
  try {
    console.log('[CRON] Running challenge update check...');
    const now = new Date();
    
    // Deactivate expired challenges
    const expired = await Challenge.find({ isActive: true, endDate: { $lt: now } });
    if (expired.length > 0) {
      await Challenge.updateMany(
        { isActive: true, endDate: { $lt: now } },
        { $set: { isActive: false } }
      );
      for (const challenge of expired) {
        await User.updateMany(
          { currentChallenges: challenge._id.toString() },
          { $pull: { currentChallenges: challenge._id.toString() } }
        );
      }
      console.log(`[CRON] Deactivated ${expired.length} expired challenges`);
    }
    
    // Create new challenges if needed
    const challenges = [
      { frequency: 'daily', name: 'Daily Eco Shopper', description: 'Buy at least 1 eco-friendly product today to complete this challenge.', type: 'ecoScore', targetValue: 1 },
      { frequency: 'weekly', name: 'Weekly CO₂ Saver', description: 'Save at least 5kg of CO₂ this week to complete this challenge.', type: 'co2Saved', targetValue: 5 },
      { frequency: 'monthly', name: 'Monthly Green Champion', description: 'Buy at least 10 eco-friendly products this month to complete this challenge.', type: 'ecoScore', targetValue: 10 }
    ];
    
    for (const ch of challenges) {
      const { startDate, endDate } = getPeriodDates(ch.frequency);
      const exists = await Challenge.findOne({ frequency: ch.frequency, startDate, endDate });
      if (!exists) {
        const newChallenge = await Challenge.create({
          name: ch.name,
          description: ch.description,
          type: ch.type,
          targetValue: ch.targetValue,
          rewardBadge: {
            name: `${ch.frequency.charAt(0).toUpperCase() + ch.frequency.slice(1)} Eco Champion`,
            description: `Awarded for completing the ${ch.frequency} eco challenge`,
            iconUrl: badgeIcons[ch.frequency],
          },
          isActive: true,
          frequency: ch.frequency,
          startDate,
          endDate,
        });
        await User.updateMany(
          { currentChallenges: { $ne: newChallenge._id.toString() } },
          { $addToSet: { currentChallenges: newChallenge._id.toString() } }
        );
        console.log(`[CRON] Created new ${ch.frequency} challenge`);
      }
    }
  } catch (error) {
    console.error('[CRON] Challenge update error:', error);
  }
}

// Run challenge update every hour
cron.schedule('0 * * * *', updateChallenges);

// Run once on startup
setTimeout(updateChallenges, 5000);

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser(""));

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://hack-on-sustainable-shopping-experi.vercel.app',
  'https://hack-on-sustainable-git-9d5060-sachin-singhs-projects-a8578191.vercel.app',
  'https://hack-on-sustainable-shopping-experience-bhr7csnmr.vercel.app',
  'https://ecofriendly-store.netlify.app',
  'https://hack-on-sustainable-shopping-experi-black.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In production, allow all origins for now (you can restrict this later)
    if (process.env.NODE_ENV === 'production') {
      return callback(null, true);
    }
    
    // In development, use the allowed origins list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use('/api', router);

// For deployment
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../../client/dist", "index.html"));
  });
}

// Server
server.listen(port, function() {
  console.log("Server started at port " + port);
})

