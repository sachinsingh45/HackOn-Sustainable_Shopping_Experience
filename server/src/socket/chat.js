const User = require('../models/User');
const messageModel = require('../models/message');
const groupModel = require('../models/group');
const { getIO } = require('./socketconnection');


const ChatFunction = () => {
    const io = getIO();

    const chat = io.of("/chat");

    chat.on('connection', (socket) => {
        console.log("chat", socket.id);

        socket.on('join-group', async({ groupId, userId }) => {

            try {
                socket.join(groupId);
    
                socket.to(groupId).emit('user-joined', socket.id); 
                socket.emit('joined-success', groupId);


                const data = await User.findById(userId).populate({
                    path: 'PendingGroup',
                    match: { _id: groupId },
                    populate: [
                        { path: 'members.userId', select: 'name email', },
                        { path: 'message', select: 'content senderId sentAt', populate: { path: 'senderId', select: 'name email', } }
                    ]
                });

                socket.emit('previous-messages', { message: data });

            } catch (error) {
                console.error("Join group error:", error);
                socket.emit('error-message', 'Failed to join group or load messages.');
            }
        });

        socket.on('send-message', async({ groupId, content, senderId }) => {
            
            try {
                let newMessage = await messageModel.create({ content, senderId, sentAt: new Date(), });
                await groupModel.findByIdAndUpdate(groupId, { $push: { message: newMessage._id } });

                newMessage = await messageModel.findById(newMessage._id).populate([ { path: 'senderId', select: 'name' }, { path: 'readBy', select: 'name' } ]);

                chat.in(groupId).emit('receive-message', { message: newMessage });
            } catch (error) {
                socket.emit('error-message', 'Message sending failed.');   
            }
        });  
    });
};

module.exports = ChatFunction;