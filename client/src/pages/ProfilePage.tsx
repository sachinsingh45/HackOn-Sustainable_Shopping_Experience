import React, { useState } from 'react';
import { User, Award, Leaf, TrendingUp, Calendar, Package, Heart, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

const ProfilePage = () => {
  const { user } = useStore();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Please sign in to view your profile</h2>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'EcoHealth Dashboard', icon: TrendingUp },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const monthlyData = [
    { month: 'Jan', co2Saved: 12, moneySaved: 450 },
    { month: 'Feb', co2Saved: 18, moneySaved: 680 },
    { month: 'Mar', co2Saved: 25, moneySaved: 920 },
    { month: 'Apr', co2Saved: 32, moneySaved: 1200 },
    { month: 'May', co2Saved: 28, moneySaved: 1050 },
    { month: 'Jun', co2Saved: 35, moneySaved: 1400 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg p-8 mb-8">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <User className="w-12 h-12" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
            <p className="text-green-100 mb-4">{user.email}</p>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{user.ecoScore}</div>
                <div className="text-sm text-green-100">Eco Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{user.carbonSaved} kg</div>
                <div className="text-sm text-green-100">CO₂ Saved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">₹{user.moneySaved}</div>
                <div className="text-sm text-green-100">Money Saved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{user.circularityScore}%</div>
                <div className="text-sm text-green-100">Circularity</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Impact Summary */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Monthly CO₂ Saved</h3>
                  <Leaf className="w-6 h-6 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {user.carbonSaved} kg
                </div>
                <p className="text-sm text-gray-600">
                  Equivalent to planting {Math.round(user.carbonSaved / 10)} trees
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Money Saved</h3>
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  ₹{user.moneySaved}
                </div>
                <p className="text-sm text-gray-600">
                  Through sustainable choices
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Circularity Score</h3>
                  <Award className="w-6 h-6 text-purple-500" />
                </div>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {user.circularityScore}%
                </div>
                <p className="text-sm text-gray-600">
                  Items recycled or reused
                </p>
              </div>
            </div>

            {/* Monthly Progress Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-6">Monthly Progress</h3>
              <div className="grid grid-cols-6 gap-4">
                {monthlyData.map((data, index) => (
                  <div key={index} className="text-center">
                    <div className="mb-2">
                      <div
                        className="bg-green-500 rounded-t"
                        style={{ height: `${(data.co2Saved / 40) * 100}px` }}
                      />
                      <div className="text-xs text-gray-600 mt-1">{data.month}</div>
                    </div>
                    <div className="text-sm font-medium">{data.co2Saved} kg</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Challenges */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Current Challenges</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Zero Waste Week</h4>
                    <p className="text-sm text-gray-600">Choose products with minimal packaging</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">Progress: 60%</div>
                    <div className="text-xs text-gray-500">4 days left</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Group Buy Champion</h4>
                    <p className="text-sm text-gray-600">Participate in 3 group purchases</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-blue-600">Progress: 33%</div>
                    <div className="text-xs text-gray-500">1 of 3 completed</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <img
                    src="https://images.pexels.com/photos/6636309/pexels-photo-6636309.jpeg?auto=compress&cs=tinysrgb&w=100"
                    alt="Product"
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h4 className="font-medium">Eco-Friendly Bamboo Laptop Stand</h4>
                    <p className="text-sm text-gray-600">Ordered on March 15, 2024</p>
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Delivered
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">₹2,499</div>
                  <div className="text-sm text-green-600">Saved 2.1 kg CO₂</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'achievements' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Your Achievements</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {user.achievements.map((achievement, index) => (
                  <div key={index} className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <Award className="w-12 h-12 text-yellow-600 mx-auto mb-2" />
                    <h4 className="font-medium text-yellow-800">{achievement}</h4>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={user.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={user.location}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md font-medium">
                Save Changes
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;