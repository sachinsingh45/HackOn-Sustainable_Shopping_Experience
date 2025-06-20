import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingDown, 
  Clock, 
  Target, 
  CheckCircle, 
  Plus, 
  Share2, 
  MessageCircle,
  Calendar,
  DollarSign,
  Package,
  Star,
  ArrowRight,
  Leaf,
  Zap
} from 'lucide-react';
import { useStore } from '../store/useStore';

const GroupBuyPage = () => {
  const { products, user } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('savings');

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedGroups.map((group, index) => (
            <motion.div
              key={group.groupId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Product Image */}
              <div className="relative">
                <img
                  src={group.url || 'https://images.pexels.com/photos/1029236/pexels-photo-1029236.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt={group.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1029236/pexels-photo-1029236.jpeg?auto=compress&cs=tinysrgb&w=400';
                  }}
                />
                {group.isEcoFriendly && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center space-x-1">
                    <Leaf className="w-3 h-3" />
                    <span>Eco</span>
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                  -{Math.round(((group.originalPrice - group.groupPrice) / group.originalPrice) * 100)}%
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {group.name}
                </h3>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>{group.currentMembers}/{group.membersNeeded} members</span>
                    <span>{Math.round((group.currentMembers / group.membersNeeded) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(group.currentMembers / group.membersNeeded) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{group.groupPrice}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    ₹{group.originalPrice}
                  </span>
                  <span className="text-sm text-green-600 font-medium">
                    Save ₹{group.savings}
                  </span>
                </div>

                {/* Time Left */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{group.timeLeft}h left</span>
                  </div>
                  {group.isEcoFriendly && (
                    <div className="flex items-center space-x-1 text-sm text-green-600">
                      <Leaf className="w-4 h-4" />
                      <span>{group.carbonSaved}kg CO₂ saved</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium">
                    Join Group
                  </button>
                  <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Share2 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Create New Group */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Your Own Group Buy</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Can't find a group for the product you want? Start your own and invite friends to join!
            </p>
            <button className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold">
              Create New Group
            </button>
          </div>
        </div>
      </div>

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