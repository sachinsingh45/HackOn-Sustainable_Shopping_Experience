const  SocketIo = require("socket.io");
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://hack-on-sustainable-shopping-experi.vercel.app',
  'https://hack-on-sustainable-git-9d5060-sachin-singhs-projects-a8578191.vercel.app',
  'https://hack-on-sustainable-shopping-experience-bhr7csnmr.vercel.app',
  'https://ecofriendly-store.netlify.app',
  'https://hackon-sustainable-shopping-experience.vercel.app',
  'https://hack-on-sustainable-shopping-experi-black.vercel.app'
];

let io;
const setUpsSockets = (server) => {

    io = SocketIo(server, {
        cors: { 
          origin: allowedOrigins, 
          methods: ['GET', 'POST'], 
          credentials: true 
        },
    });

    console.log('✅ Socket.IO initialized with CORS:', allowedOrigins.join(', '));     
};

const getIO = () => {
    if (!io) throw new Error("Socket.io not initialized!");
        return io;
};

module.exports =  { setUpsSockets, getIO };