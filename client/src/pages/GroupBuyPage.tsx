import React, { useState, useEffect, ChangeEvent } from 'react';
import {Link} from 'react-router-dom';
import Avatar from 'react-avatar';
import { motion } from 'framer-motion';
import { Users, TrendingDown, Clock, Target, CheckCircle, Plus, Share2, MessageCircle,Calendar,DollarSign,Package,Star,ArrowRight,Leaf,Zap } from 'lucide-react';
import { useStore } from '../store/useStore';

import { api } from "../services/api";

const GroupBuyPage = () => {
  const { products, user } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('savings');

  const [groupData, setGroupData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [groupName, setGroupName] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [groupNameError, setGroupNameError] = useState<string>('');

  const handleGroupNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value);
    if (groupNameError) setGroupNameError('');
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleSubmit = async() => {
    if (!groupName.trim()) {
      setGroupNameError('Group name is required.');
      return;
    }

    try {
      setIsLoading(true); // Set loading when submitting
      const response = await api.post('/create-group', { groupName, date });
      
      console.log(response.data.data.PendingGroup)
      if(response.data?.data?.PendingGroup) {
        setGroupData(response.data.data.PendingGroup);
      }


      // Reset state
      setGroupName('');
      setDate('');
      setGroupNameError('');
      setIsOpen(false);
      setIsLoading(false); // Loading complete
    } catch (error) {
      console.log(error);
      setIsLoading(false); // Loading complete even if error
    }
  };

  const fetchGroup = async() => {
    try {
      setIsLoading(true); // Set loading when fetching
      const response = await api.get('/pending-group');

      console.log(response.data.data.PendingGroup)
      if(response.data?.data?.PendingGroup) {
        setGroupData(response.data.data.PendingGroup);
      }
      setIsLoading(false); // Loading complete
    } catch (error) {
      console.error(error);
      setIsLoading(false); // Loading complete even if error
    }
  };

  useEffect(() => {
    fetchGroup();
  }, []);

  const categories = [
    { id: 'all', name: 'All Groups', icon: Users, color: 'bg-blue-500' },
    { id: 'electronics', name: 'Electronics', icon: Zap, color: 'bg-purple-500' },
    { id: 'fashion', name: 'Fashion', icon: Package, color: 'bg-pink-500' },
    { id: 'home', name: 'Home & Kitchen', icon: Target, color: 'bg-green-500' },
    { id: 'beauty', name: 'Beauty', icon: Star, color: 'bg-yellow-500' }
  ];

  // Mock group buy data
  const groupBuys = products.slice(0, 8).map(product => ({
    ...product,
    groupId: `group-${Math.floor(Math.random() * 1000)}`,
    originalPrice: Math.round(parseFloat(product.price.replace(/[^0-9.]/g, '')) * 1.4),
    groupPrice: Math.round(parseFloat(product.price.replace(/[^0-9.]/g, '')) * 0.8),
    savings: Math.round(parseFloat(product.price.replace(/[^0-9.]/g, '')) * 0.6),
    membersNeeded: Math.floor(Math.random() * 10) + 5,
    currentMembers: Math.floor(Math.random() * 5) + 1,
    timeLeft: Math.floor(Math.random() * 72) + 12, // 12-84 hours
    category: ['electronics', 'fashion', 'home', 'beauty'][Math.floor(Math.random() * 4)],
    isEcoFriendly: Math.random() > 0.5,
    carbonSaved: Math.floor(Math.random() * 50) + 10
  }));

  const filteredGroups = groupBuys.filter(group => 
    selectedCategory === 'all' || group.category === selectedCategory
  );

  const sortedGroups = [...filteredGroups].sort((a, b) => {
    switch (sortBy) {
      case 'savings':
        return b.savings - a.savings;
      case 'time':
        return a.timeLeft - b.timeLeft;
      case 'members':
        return b.currentMembers - a.currentMembers;
      default:
        return 0;
    }
  });

  const userStats = {
    totalSavings: 2450,
    groupsJoined: 8,
    carbonSaved: 125,
    moneySaved: 1800
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Users className="w-10 h-10" />
              <h1 className="text-4xl font-bold">Group Buy</h1>
            </div>
            <p className="text-xl text-green-100 mb-8">
              Save money and the planet with collective purchasing
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl font-bold">{userStats.totalSavings}</div>
                <div className="text-green-100 text-sm">Total Savings (₹)</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl font-bold">{userStats.groupsJoined}</div>
                <div className="text-green-100 text-sm">Groups Joined</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl font-bold">{userStats.carbonSaved}</div>
                <div className="text-green-100 text-sm">CO₂ Saved (kg)</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl font-bold">{userStats.moneySaved}</div>
                <div className="text-green-100 text-sm">Money Saved (₹)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How Group Buy Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: 1,
              title: 'Join a Group',
              description: 'Find a product you want and join an existing group or create a new one',
              icon: Users,
              color: 'bg-blue-500'
            },
            {
              step: 2,
              title: 'Reach Target',
              description: 'Wait for the group to reach the minimum member count',
              icon: Target,
              color: 'bg-green-500'
            },
            {
              step: 3,
              title: 'Get Discount',
              description: 'Once the target is reached, everyone gets the discounted price',
              icon: TrendingDown,
              color: 'bg-orange-500'
            }
          ].map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg text-center"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${step.color} text-white`}>
                <step.icon className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold text-gray-400 mb-2">{step.step}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                    selectedCategory === category.id
                      ? 'bg-green-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  <span className="font-medium">{category.name}</span>
                </button>
              ))}
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="savings">Sort by Savings</option>
              <option value="time">Sort by Time Left</option>
              <option value="members">Sort by Members</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Groups */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Group Buys</h2>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {groupData && groupData.length > 0 ? (
              groupData.map((data, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  {/* Product Content */}
                  <div className="p-4 flex flex-col h-full">
                    {/* Avatar and Name Section */}
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex-shrink-0">
                        <Avatar 
                          name={data?.name} 
                          src='' 
                          size="60" 
                          round={true} 
                          className="border-2 border-blue-100"
                        />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 truncate">
                        {data?.name || "Untitled Group"}
                      </h3>
                    </div>
                
                    {/* Details Section */}
                    <div className="space-y-2 text-sm text-gray-600 flex-grow">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-medium">Admin:</span> {data?.admin || "Unknown"}
                      </div>
                      
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="font-medium">Members:</span> {data?.members?.length || 0}
                      </div>
                    </div>
                
                    {/* Action Button */}
                    <Link to={`/group/${data?.name?.toLowerCase().replace(/\s+/g, '-')}/id/${data._id}`} className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-center rounded-lg transition-colors duration-300 text-sm font-medium">
                      View Group
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 mb-4">No active group buys found</div>
                <button 
                  onClick={() => setIsOpen(true)}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Create New Group
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create New Group */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus onClick={() => setIsOpen(true)} className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Your Own Group Buy</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Can't find a group for the product you want? Start your own and invite friends to join!
            </p>
            <button onClick={() => setIsOpen(true)} className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold">
              Create New Group
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Create Group</h3>

            {/* Group Name */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Group Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={groupName}
                onChange={handleGroupNameChange}
                className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 ${
                  groupNameError ? 'border-red-500 ring-red-300' : 'focus:ring-green-400'
                }`}
                placeholder="Enter group name"
              />
              {groupNameError && (
                <p className="text-sm text-red-500 mt-1">{groupNameError}</p>
              )}
            </div>

            {/* Date (Optional) */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Date (Optional)</label>
              <input
                type="date"
                value={date}
                onChange={handleDateChange}
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setGroupNameError('');
                }}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                {isLoading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Benefits */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Choose Group Buy?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Save Money',
              description: 'Get up to 40% off retail prices through bulk purchasing',
              icon: DollarSign,
              color: 'bg-green-100 text-green-600'
            },
            {
              title: 'Eco-Friendly',
              description: 'Reduce packaging waste and carbon footprint',
              icon: Leaf,
              color: 'bg-blue-100 text-blue-600'
            },
            {
              title: 'Community',
              description: 'Connect with like-minded shoppers in your area',
              icon: Users,
              color: 'bg-purple-100 text-purple-600'
            },
            {
              title: 'Convenience',
              description: 'Free delivery and easy group management',
              icon: Package,
              color: 'bg-orange-100 text-orange-600'
            }
          ].map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg text-center"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 ${benefit.color}`}>
                <benefit.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600 text-sm">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupBuyPage;