require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const defaultData = require('./defaultData');

const MONGODB_URL = process.env.MONGO_URI;

if (!MONGODB_URL) {
  console.error('❌ MONGO_URI is not defined in .env');
  process.exit(1);
}

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ Connected to MongoDB');
    return defaultData();
  })
  .catch((error) => {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  });
