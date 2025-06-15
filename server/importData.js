require('dotenv').config();
const mongoose = require('mongoose');
const defaultData = require('./src/defaultData');

// Connect to MongoDB
mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log('Connected to MongoDB');
        // Run the data import
        defaultData();
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error);
        process.exit(1);
    }); 