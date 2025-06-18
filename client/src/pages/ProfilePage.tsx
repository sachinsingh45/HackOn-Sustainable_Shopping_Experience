import React, { useState, useEffect } from 'react';
import { User, Award, Leaf, TrendingUp, Calendar, Package, Heart, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import axios from 'axios';

const ProfilePage = () => {
  const { user, setUser } = useStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [locationPrompt, setLocationPrompt] = useState(false);
  const [manualLocation, setManualLocation] = useState('');

  useEffect(() => {
    if (user && !user.location) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          // Use a geocoding API to get city/country (or just store lat/lng)
          const loc = `${latitude},${longitude}`;
          await axios.post('/api/update-location', { location: loc });
          setUser({ ...user, location: loc });
        }, () => setLocationPrompt(true));
      } else {
        setLocationPrompt(true);
      }
    }
  }, [user, setUser]);

  const handleManualLocation = async () => {
    await axios.post('/api/update-location', { location: manualLocation });
    setUser({ ...user, location: manualLocation });
    setLocationPrompt(false);
  };

  // Calculate monthly CO2 saved from orders
  const monthlyCO2 = {};
  if (user && user.orders) {
    user.orders.forEach(order => {
      const date = new Date(order.orderInfo?.date || order.date);
      const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      const co2 = order.orderInfo?.carbonFootprint || order.carbonFootprint || 0;
      if (!monthlyCO2[month]) monthlyCO2[month] = 0;
      monthlyCO2[month] += co2;
    });
  }
  const monthlyData = Object.entries(monthlyCO2).map(([month, co2Saved]) => ({ month, co2Saved }));

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
    { id: 'settings', label: 'Settings', icon: Settings }
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
            <p className="text-green-100 mb-4">{user.location}</p>
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
              {monthlyData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <Leaf className="w-10 h-10 mb-2 text-green-400" />
                  <div className="text-lg font-semibold mb-1">No orders yet</div>
                  <div className="text-sm">Your monthly CO₂ savings will appear here after your first order.</div>
                </div>
              ) : (
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
              )}
            </div>

            {/* Current Challenges */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Current Challenges</h3>
              <div className="space-y-4">
                {user.currentChallenges && user.currentChallenges.length > 0 ? (
                  user.currentChallenges.map((challenge, idx) => (
                    <div key={challenge.id || idx} className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{challenge.name}</h4>
                        <p className="text-sm text-gray-600">{challenge.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">Progress: {challenge.progress}%</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No current challenges</p>
                )}
              </div>
            </div>

            {/* Badges */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Badges</h3>
              <div className="flex flex-wrap gap-4">
                {user.badges && user.badges.length > 0 ? (
                  user.badges.map((badge, idx) => (
                    <div key={badge.id || idx} className="flex flex-col items-center p-2 bg-yellow-50 rounded-lg shadow-sm">
                      {badge.iconUrl && <img src={badge.iconUrl} alt={badge.name} className="w-10 h-10 mb-2" />}
                      <span className="font-medium">{badge.name}</span>
                      <span className="text-xs text-gray-600">{badge.description}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No badges earned yet</p>
                )}
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
              {user.orders && user.orders.length > 0 ? (
                user.orders.slice().reverse().map((order, idx) => {
                  const info = order.orderInfo || order;
                  return (
                    <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img
                          src={info.image || info.url || 'https://images.pexels.com/photos/1029236/pexels-photo-1029236.jpeg?auto=compress&cs=tinysrgb&w=100'}
                          alt={info.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <h4 className="font-medium">{info.name}</h4>
                          <p className="text-sm text-gray-600">Ordered on {info.date ? new Date(info.date).toLocaleDateString() : '-'}</p>
                          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Delivered
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{info.price}</div>
                        <div className="text-sm text-green-600">Saved {info.carbonFootprint || 0} kg CO₂</div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-gray-500 text-center py-8">No orders yet. Start shopping to see your orders here!</div>
              )}
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

      {locationPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-2">Enter your location</h2>
            <input
              type="text"
              className="w-full border p-2 rounded mb-4"
              placeholder="City, Country"
              value={manualLocation}
              onChange={e => setManualLocation(e.target.value)}
            />
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={handleManualLocation}
            >Save</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;