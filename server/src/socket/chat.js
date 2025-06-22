const User = require('../models/User');
const messageModel = require('../models/message');
const groupModel = require('../models/group');
const itemModel = require('../models/items');
const Product = require('../models/Product');
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
                      { path: 'members.userId',  select: 'name email' },
                      { path: 'members.itemId', model: 'items', populate: { path: 'product', model: 'products' } },
                      { path: 'message', select: 'content senderId sentAt', populate: { path: 'senderId', select: 'name email' } }
                    ]
                  });
                  

                socket.emit('previous-messages', { message: data });

            } catch (error) {
                socket.emit('error-message', 'Failed to join group or load messages.');
            }
        });

        socket.on('send-message', async({ groupId, content, senderId }) => {
            
            try {
                let newMessage = await messageModel.create({ content, senderId, sentAt: new Date(), readBy:[senderId] });
                await groupModel.findByIdAndUpdate(groupId, { $push: { message: newMessage._id } });

                newMessage = await messageModel.findById(newMessage._id).populate([ { path: 'senderId', select: 'name' }, { path: 'readBy', select: 'name' } ]);

                chat.in(groupId.toString()).emit('receive-message', { message: newMessage });
            } catch (error) {
                socket.emit('error-message', 'Message sending failed.');   
            }
        });  



        socket.on('single', async({ groupId, userId }) => {
            try {
                socket.join(userId);
                socket.emit('success', userId);

                const data = await User.findById(userId).populate({
                    path: 'OrderedGroup',
                    match: { _id: groupId },
                    populate: [
                      { path: 'members.userId',  select: 'name email' },
                      { path: 'members.itemId', model: 'items', populate: { path: 'product', model: 'products' } },
                      { path: 'message', select: 'content senderId sentAt', populate: { path: 'senderId', select: 'name email' } }
                    ]
                  });

                socket.emit('last-messages', { message: data });
            } catch (error) {
                socket.emit('error-message', 'Failed to join group or load messages.');
            }
        });

        socket.on('send-private-message', async({ groupId, content, senderId }) => {
            
            try {
                let newMessage = await messageModel.create({ content, senderId, sentAt: new Date(), readBy:[senderId] });
                await groupModel.findByIdAndUpdate(groupId, { $push: { message: newMessage._id } });

                newMessage = await messageModel.findById(newMessage._id).populate([ { path: 'senderId', select: 'name' }, { path: 'readBy', select: 'name' } ]);

                socket.emit('curr-receive-message', { message: newMessage });
            } catch (error) {
                socket.emit('error-message', 'Message sending failed.');   
            }
        });

    });
};



const OrderGroupBuyProduct = async({ groupId }) => {
    try {
        const group = await groupModel.findById(groupId);
        const memberUserIds = group.members.map(member => member.userId.toString());
        
        for(let _id of memberUserIds){
            await User.updateOne(
                { _id: _id },
                { $pull: { PendingGroup: groupId }, $addToSet: { OrderedGroup: groupId } }
              );
        }

        const io = getIO();

        io.of('/chat').in(groupId.toString()).emit('order-placed', { message: 'Your order placed' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to Place group Buy order', error: error.message }); 
    }
};


const ExitGroup = async({ groupId, userId }) => {
    try {
        const group = await groupModel.findById(groupId);
        const member = group.members.find(m => m.userId.toString() === userId.toString());

        if (member.itemId.length > 0) {
            await itemModel.deleteMany({ _id: { $in: member.itemId } });
        }

        group.members = group.members.filter(m => m.userId.toString() !== userId.toString());
        await group.save();

        await User.findByIdAndUpdate( userId, { $pull: { PendingGroup: groupId } } );
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to exit group', error: error.message });
    }
};


const AddProduct = async({ userId, groupId, productId, count }) => {
    try {
        let product = await Product.findById(productId);
        const { name, price, carbonFootprint, ecoScore, isEcoFriendly } = product;

        const newItem = await itemModel.create({ product: productId, quantity: count, name: name, carbonFootprint: carbonFootprint, ecoScore: ecoScore, isEcoFriendly: isEcoFriendly  });

        await groupModel.findOneAndUpdate(
            { _id: groupId, 'members.userId': userId },
            { $push: { 'members.$.itemId': newItem._id } },
            { new: true }
          ).populate({
            path: 'members.itemId',
            model: 'items',
            populate: {
              path: 'product',
              model: 'products'
            }
        });


        const data = await User.findById(userId).populate({
            path: 'PendingGroup',
            match: { _id: groupId },
            populate: [
              { path: 'members.userId',  select: 'name email' },
              { path: 'members.itemId', model: 'items', populate: { path: 'product', model: 'products' } },
              { path: 'message', select: 'content senderId sentAt', populate: { path: 'senderId', select: 'name email' } }
            ]
        });

        const io = getIO();

        io.of('/chat').in(groupId.toString()).emit('new-item-added', { userId: userId, product: product, message: data });

    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to add item to group', error: error.message });
    }
};


const updateProductQunatity = async({ itemId, productId, userId, groupId, quantity, operation }) => {
    try {
        await itemModel.findByIdAndUpdate(itemId, { quantity: quantity });

        const data = await User.findById(userId).populate({
            path: 'PendingGroup',
            match: { _id: groupId },
            populate: [
              { path: 'members.userId',  select: 'name email' },
              { path: 'members.itemId', model: 'items', populate: { path: 'product', model: 'products' } },
              { path: 'message', select: 'content senderId sentAt', populate: { path: 'senderId', select: 'name email' } }
            ]
        });

        const io = getIO();

        if(operation)
            io.of('/chat').in(groupId.toString()).emit('item-removed', { userId: userId, message: data });
        else
            io.of('/chat').in(groupId.toString()).emit('new-item-added', { userId: userId, message: data });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: 'Failed to add item to group', error: error.message });
    }
};


const RemoveProduct = async({ itemId, productId, userId, groupId, }) => {
    try {
        await itemModel.findByIdAndDelete(itemId);

        await groupModel.findOneAndUpdate(
            { _id: groupId, 'members.userId': userId },
            { $pull: { 'members.$.itemId': itemId } },
            { new: true }
          ).populate({
            path: 'members.itemId',
            model: 'items',
            populate: {
              path: 'product',
              model: 'products'
            }
          });

        const data = await User.findById(userId).populate({
            path: 'PendingGroup',
            match: { _id: groupId },
            populate: [
              { path: 'members.userId',  select: 'name email' },
              { path: 'members.itemId', model: 'items', populate: { path: 'product', model: 'products' } },
              { path: 'message', select: 'content senderId sentAt', populate: { path: 'senderId', select: 'name email' } }
            ]
        });

        const io = getIO();

        io.of('/chat').in(groupId.toString()).emit('item-removed', { userId: userId, message: data });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to delete item to group', error: error.message });
    }
};


module.exports = { OrderGroupBuyProduct, ExitGroup, ChatFunction, AddProduct, RemoveProduct, updateProductQunatity };RemoveProduct