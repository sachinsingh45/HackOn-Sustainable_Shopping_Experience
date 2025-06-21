const  SocketIo = require("socket.io");
const cors = require('cors');


let io;
const setUpsSockets = (server) => {

    io = SocketIo(server, {
        cors : { origin: 'http://localhost:5173', methods: ['GET', 'POST'], credentials: true },
    });

    console.log('✅ Socket.IO initialized');     
};

const getIO = () => {
    if (!io) throw new Error("Socket.io not initialized!");
        return io;
};

module.exports =  { setUpsSockets, getIO };