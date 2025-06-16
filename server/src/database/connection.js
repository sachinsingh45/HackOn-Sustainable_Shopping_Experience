// Libraries
const mongoose = require('mongoose');
const db_url = process.env.DB_URL;

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(db_url);
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log("Database Connection Error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;