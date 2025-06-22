import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Avatar from 'react-avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Trash2, Plus, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import { useStore } from '../store/useStore';
import ChatRoom from './chat';
import { chatSocket } from '../services/socket';
import { api } from "../services/api";

const SingleGroupBuyPage = () => {
  const { user } = useStore();
  const { groupId, name } = useParams();
  const [loading, setLoading] = useState(true);

  const [newitem, setNewItem] = useState({});
  const [Orderbook, serOrderBook] = useState(false);
  const [itemRemove, setItemRemove] = useState({});
  const [userOrder, setUserOrder] = useState({});
  const [selectedPackaging, setSelectedPackaging] = useState({});
  const [expandedMembers, setExpandedMembers] = useState({});
  const [messages, setMessages] = useState([]);
  const [isOrdering, setIsOrdering] = useState(false);

  const packagingOptions = [
    { id: 'standard', label: 'Standard', description: 'Default packaging', cost: 0 },
    { id: 'eco', label: 'Eco-Friendly', description: 'Less plastic, more paper', cost: 10 },
    { id: 'gift', label: 'Gift Wrap', description: 'Comes in a gift box', cost: 25 },
  ];

  useEffect(() => {
    if (!user) return;
    const userId = user._id;

    if (chatSocket.connected) {
      chatSocket.emit('join-group', { groupId, userId });
    } else {
      chatSocket.on('connect', () => {
        chatSocket.emit('join-group', { groupId, userId });
      });
    }

    chatSocket.on('previous-messages', (data) => {
      if (data?.message?.PendingGroup?.length > 0) {
        setUserOrder(data.message.PendingGroup[0]);
        setMessages(data.message.PendingGroup[0].message);
      }
    });

    chatSocket.on('new-item-added', (data) => {
      if (data?.message?.PendingGroup?.length > 0) {
        setUserOrder(data.message.PendingGroup[0]);
      }

      if (data?.userId && (data?.userId !== userId)) {
        setNewItem(prev => {
          const updated = { ...prev };
          updated[data.userId] = (prev[data.userId] || 0) + 1;
          return updated;
        });
      }
    });

    chatSocket.on('item-removed', (data) => {
      if (data?.message?.PendingGroup?.length > 0) {
        setUserOrder(data.message.PendingGroup[0]);
      }

      if (data?.userId && (data?.userId !== userId)) {
        setItemRemove(prev => {
          const updated = { ...prev };
          updated[data.userId] = (prev[data.userId] || 0) + 1;
          return updated;
        });
      }
    });

    chatSocket.on('order-placed', (data) => {
      serOrderBook(true);
    });

    return () => {
      chatSocket.off('previous-messages');
      chatSocket.off('new-item-added');
      chatSocket.off('item-removed');
    };
  }, [user, groupId]);

  useEffect(() => {
    if (user && user._id) {
      setLoading(false);
    }
  }, [user]);


  const OrderTheGroupBuyProducts = async () => {
    try {
      setIsOrdering(true);

      await api.post(`/order/group/${groupId}`);

      serOrderBook(true);
    } catch (error) {
      console.error("Order error", error);
    } finally {
      setIsOrdering(false);
    }
  };


  const UpdateItemQuantity = async({ itemId, productId, userId, quantity, operation }) => {
    const data = { itemId, productId, userId, groupId, quantity, operation };
    try {
      await api.put(`/update-item/group/:${groupId}`, data);
    } catch (error) {
      console.log("error to update the product quantity");
    }
  };

  const DeleteItem_user = async({ itemId, productId, userId }) => {
    const data = { itemId, productId, userId, groupId };
    try {
      await api.put(`/remove-item/group/:${groupId}`, data);
    } catch (error) {
      console.log("error to update the product quantity");
    }
  };

  const removeUserId = (userId) => {
    setNewItem(prev => {
      const updated = { ...prev };
      delete updated[userId];
      return updated;
    });

    setItemRemove(prev => {
      const updated = { ...prev };
      delete updated[userId];
      return updated;
    });
  };

  const formatDateTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const formattedDate = d.toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
    });
    const formattedTime = d.toLocaleTimeString(undefined, {
      hour: '2-digit', minute: '2-digit', hour12: true,
    }).toUpperCase();
    return `${formattedDate}, ${formattedTime}`;
  };

  const toggleMemberExpand = (userId) => {
    removeUserId(userId);
    setExpandedMembers(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-lg font-medium text-gray-600">Loading group details...</div>;
  }

  return (
    <div className="p-4 w-full max-w-7xl mx-auto">

      <div className="mb-8 bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                {userOrder?.name || name || 'Group Buy'} 
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 py-1 px-2 rounded-full align-middle">Active</span>
              </h1>
              <div className="flex items-center text-gray-600">
                Admin: <span className="text-blue-600 font-medium ml-1">{userOrder?.admin || 'Unknown'}</span>
              </div>
            </div>
          </div>

          {/* Right Section: Order Icon */}
          <div className="text-blue-600">
            {!Orderbook ? (
              <button
                onClick={OrderTheGroupBuyProducts}
                disabled={isOrdering}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isOrdering
                    ? 'bg-blue-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isOrdering ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                    Ordering...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3h18M9 3v18M15 3v18"
                      />
                    </svg>
                    Place Order
                  </>
                )}
              </button>
            ) : (
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                <svg
                  className="w-4 h-4 mr-2 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Your products have been ordered
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
          <span>Created At {formatDateTime(userOrder?.createdAt)}</span>
          <span>{userOrder?.members?.length || 0} members</span>
        </div>
      </div>


      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3 w-full">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Group Members</h2>
            <div className="space-y-4">
              {(userOrder?.members || []).map((member, idx) => (
                <motion.div key={member.userId._id} className="bg-gray-50 rounded-lg overflow-hidden" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: idx * 0.05 }}>
                  <div className="p-3 flex items-center gap-3 cursor-pointer" onClick={() => toggleMemberExpand(member.userId._id)}>
                  <div className="relative">
                    <Avatar name={member.userId.name} size="48" round />

                    {/* New Item Badge */}
                    {newitem[member.userId._id] > 0 && (
                      <div className="absolute -top-1 -left-1">
                        <span className="bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow">
                          +{newitem[member.userId._id]}
                        </span>
                      </div>
                    )}

                    {/* Removed Item Badge (slightly offset) */}
                    {itemRemove[member.userId._id] > 0 && (
                      <div className="absolute -top-1 left-5">
                        <span className="bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow">
                          -{itemRemove[member.userId._id]}
                        </span>
                      </div>
                    )}
                  </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800">{member.userId.name}</h3>
                      <h3 className="font-medium text-gray-800">{member.itemId.length} item(s)</h3>
                    </div>
                    <div>
                      {expandedMembers[member.userId._id] ? <ChevronUp className="text-gray-500 w-5 h-5" /> : <ChevronDown className="text-gray-500 w-5 h-5" />}
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedMembers[member.userId._id] && (member.itemId || []).map((item) => {
                      const product = item.product;
                      const price = parseFloat(product?.price?.replace(/[^0-9.]/g, '') || 0);
                      const mrp = parseFloat(product?.mrp?.replace(/[^0-9.]/g, '') || 0);
                      const discountPercent = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
                      const isOwnData = user && user._id === member.userId._id;

                      return (
                        <motion.div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-4 mt-4 relative" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
                          {isOwnData && (
                            <div className="absolute top-2 right-2 flex items-center gap-2">
                              <button onClick={() => { item.quantity <= 1 ? DeleteItem_user({ itemId: item._id, productId: product._id, userId: member.userId._id }) : UpdateItemQuantity({ itemId: item._id, productId: product._id, userId: member.userId._id, quantity: item.quantity - 1, operation: 1 }) }} className="p-1 hover:bg-gray-100 rounded-full"><Minus className="w-4 h-4 text-gray-600" /></button>
                              <span className="text-sm font-semibold">{item.quantity}</span>
                              <button onClick={() => UpdateItemQuantity({ itemId: item._id, productId: product._id, userId: member.userId._id, quantity: item.quantity + 1, operation: 0 })} className="p-1 hover:bg-gray-100 rounded-full"><Plus className="w-4 h-4 text-gray-600" /></button>
                              <button onClick={() => DeleteItem_user({ itemId: item._id, productId: product._id, userId: member.userId._id })} className="p-1 hover:bg-red-100 rounded-full"><Trash2 className="w-4 h-4 text-red-500" /></button>
                            </div>
                          )}

                          <div className="flex items-start gap-4">
                            <img src={product.image || product.url} alt={product.name} className="w-20 h-20 object-contain border rounded-md" onError={(e) => (e.currentTarget.src = 'https://images.pexels.com/photos/1029236/pexels-photo-1029236.jpeg?auto=compress&cs=tinysrgb&w=400')} />
                            <div className="flex-1">
                              <div className="text-lg font-semibold text-gray-800 break-words">{product.name}</div>
                              <div className="flex items-center flex-wrap gap-2 mt-1">
                                {product.isEcoFriendly && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><Leaf className="w-3 h-3 mr-1" />Eco-Friendly</span>}
                                {product.groupBuyEligible && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Group Buy Eligible</span>}
                              </div>
                              <div className="mt-2 flex items-center gap-3">
                                <span className="text-lg font-semibold text-gray-900">₹{price.toLocaleString()}</span>
                                {mrp > price && <><span className="text-sm text-gray-400 line-through">₹{mrp}</span><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">{discountPercent}% OFF</span></>}
                              </div>
                              <div className="mt-1 text-sm text-gray-500">Quantity: {item.quantity}</div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2 text-sm text-gray-700">Packaging Options:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              {packagingOptions.map((option) => (
                                <label key={option.id} className={`flex items-start p-2 border rounded cursor-pointer text-sm ${selectedPackaging[item._id] === option.id ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}>
                                  <input type="radio" name={`packaging-${item._id}`} value={option.id} checked={selectedPackaging[item._id] === option.id} onChange={(e) => setSelectedPackaging({ ...selectedPackaging, [item._id]: e.target.value })} className="sr-only" />
                                  <div>
                                    <div className="font-medium">{option.label}</div>
                                    <div className="text-xs text-gray-600">{option.description}</div>
                                    {option.cost > 0 && <div className="text-xs text-green-600">+₹{option.cost}</div>}
                                  </div>
                                </label>
                              ))}
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

        <div className="lg:w-1/3 w-full">
          <div className="bg-white rounded-lg shadow-sm">
            <ChatRoom messages={messages} setMessages={setMessages} groupId={groupId} groupName={userOrder?.name || name || ''} userId={user._id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleGroupBuyPage;
