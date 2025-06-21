const notificationModel = require('../models/groupBuyNotification');
const messageModel = require('../models/message');
const groupModel = require('../models/group');
const User = require('../models/User');
const { getIO } = require('../socket/socketconnection');


const transformUserGroups = (user, userId) => {
    if (!user || !user.PendingGroup) return [];
  
    return user.PendingGroup
      .map(group => {
        const unreadMessages = (group.message || []).filter(
          msg => !msg.readBy?.some(reader => reader.toString() === userId.toString())
        );
  
        if (unreadMessages.length === 0) return null; // skip if no unread messages
  
        return {
          name: group.name,
          message: unreadMessages
        };
      })
      .filter(Boolean); // remove nulls
};
  


const Notification = () => {
    const io = getIO();

    const notification = io.of('/notification');

    notification.on('connection', (socket) => {
        console.log("notification ", socket.id);

        socket.on('join-room', async(userId) => {
           try {
                socket.join(userId);

                let notificationData = await notificationModel.find({ receiver: userId, isRead: false }).select('-receiver').
                populate({ path: 'sender', select: 'name email' }).populate({ path: 'groupId', select: 'name members' }); 

                const userDoc = await User.findById(userId).select('PendingGroup')
                    .populate({
                        path: 'PendingGroup',
                        select: 'name message',
                        populate: {  path: 'message', select: 'content senderId sentAt readBy', populate: { path: 'senderId', select: 'name email' } }
                }).lean();

                const data = transformUserGroups(userDoc, userId);

                socket.emit('previous-notification', { notification: notificationData, message: data });
           } catch (error) {
                console.log("previous notification error");
           }
        });


        socket.on('join-group', async({ _id, groupId, userId }) => {
            try {
                let user = await User.findOneAndUpdate({ _id: userId }, { $addToSet: { PendingGroup: groupId } }, { new: true });
                const message = new messageModel({ senderId: userId, content: `${ user.name } have joined your group`, newUser: 1, readBy: [userId]});
                await message.save();

                await groupModel.findByIdAndUpdate( groupId, { $push: { members: { userId: userId, item: [], } } });
                                
                await notificationModel.findByIdAndUpdate(_id, { isRead: true });


                for(let groupUserId of user.PendingGroup){
                    if(groupUserId.toString() === _id.toString())
                        continue;
                    
                    socket.to(groupUserId.toString()).emit('newUser-join-group', { name: user.name, senderId: userId, content: `${ user.name } have joined your group` });
                }

                let notificationData = await notificationModel.find({ receiver: userId, isRead: false }).select('-receiver').
                populate({ path: 'sender', select: 'name email' }).populate({ path: 'groupId', select: 'name members' }); 

                const userDoc = await User.findById(userId).select('PendingGroup')
                    .populate({
                        path: 'PendingGroup',
                        select: 'name message',
                        populate: {  path: 'message', select: 'content senderId sentAt readBy', populate: { path: 'senderId', select: 'name email' } }
                }).lean();

                const data = transformUserGroups(userDoc, userId);
                
                socket.emit('previous-notification', { notification: notificationData, message: data });
            } catch (error) {
                console.log("group join failed");
            }
        });
    });
};







const NewGroupNotification = async({ sender, groupId, latitude, longitude, pincode, message }) => {
    try {
        const nearbyUsers = await User.find({ 
            _id: { $ne: sender._id },
            'location.pin': pincode,
            'location.coor': { $near: { $geometry: { type: 'Point', coordinates: [longitude, latitude] }, $maxDistance: 200 } }
        });

        const io = getIO();

        for (const user of nearbyUsers) {
            const notification = new notificationModel({
              sender: sender._id,  
              receiver: user._id,
              groupId: groupId,

              message: message,
              createdAt: new Date()
            });

            await notification.save();
            
            let notificationData = await notificationModel.find({_id: notification._id, receiver: user._id, isRead: false }).select('-receiver').
                populate({ path: 'sender', select: 'name email' }).populate({ path: 'groupId', select: 'name members' }); 

            io.of('/notification').to(user._id.toString()).emit('receive-notification', { notification: notificationData  });
        }
          
    } catch (error) {
        console.error('Error sending group buy notifications:', error);
    }
};


const UpdateLocationNotification = async({ userId, latitude, longitude, pin }) => {
    try {
        const nearbyUsers = await User.find({ 
            _id: { $ne: userId },
            'location.pin': pin,
            'location.coor': { $near: { $geometry: { type: 'Point', coordinates: [longitude, latitude] },  $maxDistance: 100 } }
        }).select('name email').populate('PendingGroup');
        

        for (const nearbyUser of nearbyUsers) {
            for (const group of nearbyUser.PendingGroup) {
                await notificationModel.create({ 
                    sender: nearbyUser._id,
                    receiver: userId,
                    groupId: group._id,
                    groupName: group.groupName,
                    message: `${nearbyUser.name} created a new group near you!`,  isRead: false 
                });
            }
        }

    } catch (error) {
        console.error('Error sending group buy notifications:', error);
    }
};

module.exports = { NewGroupNotification, UpdateLocationNotification, Notification };