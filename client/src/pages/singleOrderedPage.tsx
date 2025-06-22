import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Avatar from 'react-avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, ChevronDown, ChevronUp } from 'lucide-react';
import { useStore } from '../store/useStore';
import { chatSocket } from '../services/socket';
import { api } from '../services/api';

const packagingOptions = [
  { id: 'standard', label: 'Standard', description: 'Default packaging', cost: 0 },
  { id: 'eco', label: 'Eco-Friendly', description: 'Less plastic, more paper', cost: 10 },
  { id: 'gift', label: 'Gift Wrap', description: 'Comes in a gift box', cost: 25 },
];

const SingleOrderedPage = () => {
  const { user } = useStore();
  const { groupId, name } = useParams();
  const [loading, setLoading] = useState(true);
  const [userOrder, setUserOrder] = useState({});
  const [selectedPackaging, setSelectedPackaging] = useState({});
  const [expandedMembers, setExpandedMembers] = useState({});
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(chatSocket.connected);
  const [typingUsers, setTypingUsers] = useState([]);
  const inputRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/single-ordered/${groupId}`);
      setUserOrder(response.data.data.OrderedGroup[0]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!user) return;
    const userId = user._id;

    if (chatSocket.connected) {
      chatSocket.emit('single', { groupId, userId });
    } else {
      chatSocket.on('connect', () => {
        chatSocket.emit('single', { groupId, userId });
        setIsConnected(true);
      });
    }

    chatSocket.on('last-messages', (data) => {
      if (data?.message?.OrderedGroup?.length > 0) {
        setMessages(data.message.OrderedGroup[0].message);
      }
    });

    chatSocket.on('curr-receive-message', (data) => {
      if (data?.message) {
        setMessages((prev) => [...prev, data.message]);
      }
    });

    return () => {
      chatSocket.off('last-messages');
      chatSocket.off('curr-receive-message');
    };
  }, [user, groupId]);

  const sendMessage = useCallback(() => {
    if (!input.trim()) return;

    const message = {
      content: input,
      groupId,
      senderId: user._id,
      senderName: user.name,
      timestamp: new Date().toISOString(),
    };

    chatSocket.emit('send-private-message', message);
    setInput('');
  }, [input, groupId, user]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const toggleMemberExpand = (userId) => {
    setExpandedMembers((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase();
  };

  const formatDateTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.toLocaleDateString()} ${formatTime(date)}`;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-lg font-medium text-gray-600">Loading group details...</div>;
  }

  return (
    <div className="p-4 w-full max-w-7xl mx-auto">
      {/* Group Header */}
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              {userOrder?.name || name || 'Group Buy'}
              <span className="ml-2 text-xs bg-blue-100 text-blue-800 py-1 px-2 rounded-full">Active</span>
            </h1>
            <div className="text-gray-600">Admin: <span className="text-blue-600 font-medium">{userOrder?.admin || 'Unknown'}</span></div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between text-sm text-gray-500">
          <span>Created At {formatDateTime(userOrder?.createdAt)}</span>
          <span>{userOrder?.members?.length || 0} members</span>
        </div>
      </div>

      {/* Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side - Members */}
        <div className="lg:w-2/3 w-full">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Group Members</h2>
            <div className="space-y-4">
              {(userOrder?.members || []).map((member, idx) => (
                <motion.div key={member.userId._id} className="bg-gray-50 rounded-lg overflow-hidden" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: idx * 0.05 }}>
                  <div className="p-3 flex items-center gap-3 cursor-pointer" onClick={() => toggleMemberExpand(member.userId._id)}>
                    <Avatar name={member.userId.name} size="48" round />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{member.userId.name}</h3>
                      <div className="text-sm text-gray-500">{member.itemId.length} item(s)</div>
                    </div>
                    {expandedMembers[member.userId._id] ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                  </div>

                  <AnimatePresence>
                    {expandedMembers[member.userId._id] && (member.itemId || []).map((item) => {
                      const product = item.product;
                      const price = parseFloat(product?.price?.replace(/[^0-9.]/g, '') || 0);
                      const mrp = parseFloat(product?.mrp?.replace(/[^0-9.]/g, '') || 0);
                      const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
                      return (
                        <motion.div key={item._id} className="bg-white border rounded-xl p-4 mt-2" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
                          <div className="flex gap-4">
                            <img src={product.image || product.url} alt={product.name} className="w-20 h-20 object-cover border rounded" />
                            <div>
                              <div className="font-semibold text-gray-800">{product.name}</div>
                              <div className="flex gap-2 text-sm mt-1">
                                {product.isEcoFriendly && <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Eco-Friendly</span>}
                                {product.groupBuyEligible && <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Group Buy Eligible</span>}
                              </div>
                              <div className="flex gap-2 mt-2">
                                <span className="text-lg font-semibold">₹{price}</span>
                                {discount > 0 && <><span className="line-through text-sm text-gray-400">₹{mrp}</span><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">{discount}% OFF</span></>}
                              </div>
                              <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Chat */}
        <div className="lg:w-1/3 w-full">
          <div className="flex flex-col h-full bg-gray-100 rounded-lg shadow-md overflow-hidden">
            <header className="bg-green-600 text-white p-3 flex justify-between items-center">
              <h2 className="font-semibold">{userOrder?.name || 'Chat Room'}</h2>
              <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-300' : 'bg-red-500'}`} />
            </header>
            <main className="flex-1 overflow-y-auto p-2 space-y-2">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.senderId._id === user._id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-3 py-2 rounded-lg ${msg.senderId._id === user._id ? 'bg-green-100 rounded-tr-none' : 'bg-white rounded-tl-none'}`}>
                    {msg.senderId._id !== user._id && (
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar name={msg.senderId.name} size="30" round />
                      </div>
                    )}
                    <div className="text-gray-800 text-sm">{msg.content}</div>
                    <div className="text-right text-[10px] text-gray-500">{formatTime(msg.sentAt)}</div>
                  </div>
                </div>
              ))}
              {typingUsers.length > 0 && (
                <div className="text-xs italic text-gray-500">
                  {typingUsers.join(', ')} {typingUsers.length > 1 ? 'are' : 'is'} typing...
                </div>
              )}
            </main>
            <footer className="bg-white border-t px-3 py-2">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-400"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="px-4 py-2 bg-green-600 text-white rounded-full disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleOrderedPage;