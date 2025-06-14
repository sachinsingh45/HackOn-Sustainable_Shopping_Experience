// Libraries
const mongoose = require('mongoose');
const db_url = process.env.DB_URL;

// Database Connection
mongoose.connect(db_url, function(error) {
  if (error) {
    console.log(error);
  } else {
    console.log("Database Connected Successfully");
  }
})