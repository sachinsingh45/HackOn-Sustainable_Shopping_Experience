// Libraries
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var path = require('path'); 
const http = require('http');


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
  'https://hack-on-sustainable-shopping-experience-bhr7csnmr.vercel.app'
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

