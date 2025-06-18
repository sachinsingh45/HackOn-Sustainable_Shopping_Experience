import React, { useState, useEffect } from 'react';
import { User, Award, Leaf, TrendingUp, Calendar, Package, Settings, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

// Badge icons and date formatting (copied from EcoChallengesPage for consistency)
const BADGE_ICONS = {
  earned: '/daily-badge.png', // fallback to daily badge
  locked: 'https://cdn-icons-png.flaticon.com/512/565/565547.png', // grey lock
  daily: '/daily-badge.png',
  weekly: '/weekly-badge.png',
  monthly: '/monthly-badge.png',
};

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
  // add other fields as needed
};

const ProfilePage = () => {
  const { user, setUser, challenges } = useStore();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [locationPrompt, setLocationPrompt] = useState(false);
  const [manualLocation, setManualLocation] = useState('');
  const [locationDetails, setLocationDetails] = useState({
    city: '',
    state: '',
    country: '',
    pin: ''
  });
  const [locationDetailsLoading, setLocationDetailsLoading] = useState(false);

  useEffect(() => {
    if (user && !user.location) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          // Use a geocoding API to get city/country (or just store lat/lng)
          const loc = `${latitude},${longitude}`;
          await axios.post('/api/update-location', { location: loc });
          setUser({ ...(user as any), location: loc });
        }, () => setLocationPrompt(true));
      } else {
        setLocationPrompt(true);
      }
    }
  }, [user, setUser]);

  const handleManualLocation = async () => {
    await axios.post('/api/update-location', { location: manualLocation });
    setUser({ ...(user as any), location: manualLocation });
    setLocationPrompt(false);
  };

  // Calculate monthly CO2 saved from orders
  const monthlyCO2: Record<string, number> = {};
  if (user && user.orders) {
    user.orders.forEach(order => {
      const date = new Date(order.orderInfo?.date || order.date);
      const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      const co2 = order.orderInfo?.carbonFootprint || order.carbonFootprint || 0;
      if (!monthlyCO2[month]) monthlyCO2[month] = 0;
      monthlyCO2[month] += co2;
    });
  }
  const monthlyData = Object.entries(monthlyCO2).map(([month, co2Saved]) => ({ month, co2Saved: Number(co2Saved) }));

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
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4 sm:mb-0">
            <User className="w-12 h-12" />
          </div>
          <div className="text-center sm:text-left w-full">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 break-words">{user.name}</h1>
            <p className="text-green-100 mb-2 text-sm sm:text-base break-words">{user.email}</p>
            <p className="text-green-100 mb-4 text-sm sm:text-base break-words">
              {user.location && typeof user.location === 'object' && 'city' in user.location
                ? `${user.location.city}, ${user.location.state}, ${user.location.country} - ${user.location.pin}`
                : typeof user.location === 'string' ? user.location : 'No location set'}
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-4">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold">{user.ecoScore}</div>
                <div className="text-xs sm:text-sm text-green-100">Eco Score</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold">{user.carbonSaved} kg</div>
                <div className="text-xs sm:text-sm text-green-100">CO₂ Saved</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold">₹{user.moneySaved}</div>
                <div className="text-xs sm:text-sm text-green-100">Money Saved</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold">{user.circularityScore}%</div>
                <div className="text-xs sm:text-sm text-green-100">Circularity</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-1 mb-8 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 sm:py-3 px-2 sm:px-4 rounded-md font-medium transition-colors text-sm sm:text-base ${
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 text-base sm:text-lg">Monthly CO₂ Saved</h3>
                  <Leaf className="w-6 h-6 text-green-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
                  {user.carbonSaved} kg
                </div>
                <p className="text-xs sm:text-sm text-gray-600">
                  Equivalent to planting {Math.round(user.carbonSaved / 10)} trees
                </p>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 text-base sm:text-lg">Money Saved</h3>
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
                  ₹{user.moneySaved}
                </div>
                <p className="text-xs sm:text-sm text-gray-600">
                  Through sustainable choices
                </p>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 text-base sm:text-lg">Circularity Score</h3>
                  <Award className="w-6 h-6 text-purple-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">
                  {user.circularityScore}%
                </div>
                <p className="text-xs sm:text-sm text-gray-600">
                  Items recycled or reused
                </p>
              </div>
            </div>

            {/* Monthly Progress Chart */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
              <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Monthly Progress</h3>
              {monthlyData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <Leaf className="w-10 h-10 mb-2 text-green-400" />
                  <div className="text-lg font-semibold mb-1">No orders yet</div>
                  <div className="text-sm">Your monthly CO₂ savings will appear here after your first order.</div>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                  {monthlyData.map((data, index) => (
                    <div key={index} className="text-center">
                      <div className="mb-2">
                        <div
                          className="bg-green-500 rounded-t mx-auto"
                          style={{ height: `${(data.co2Saved / 40) * 100}px`, width: '18px' }}
                        />
                        <div className="text-xs text-gray-600 mt-1">{data.month}</div>
                      </div>
                      <div className="text-xs sm:text-sm font-medium">{typeof data.co2Saved === 'number' ? data.co2Saved : Number(data.co2Saved)} kg</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Current Challenges */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
              <h3 className="text-base sm:text-lg font-semibold mb-4">Current Challenges</h3>
              <div className="space-y-4">
                {user.currentChallenges && user.currentChallenges.length > 0 ? (
                  user.currentChallenges.map((challengeId: string, idx: number) => {
                    const challenge = challenges.find(
                      (c) => c._id === challengeId || c.id === challengeId
                    );
                    return (
                      <div key={challengeId || idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-green-50 rounded-lg gap-2 sm:gap-0">
                        <div>
                          {challenge ? (
                            <>
                              <h4 className="font-medium text-base sm:text-lg">{challenge.name}</h4>
                              <p className="text-sm text-gray-700 mb-1">{challenge.description}</p>
                              <span className="inline-block bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full mr-2">
                                {challenge.frequency.charAt(0).toUpperCase() + challenge.frequency.slice(1)}
                              </span>
                              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                {challenge.type}
                              </span>
                              <div className="text-xs text-gray-500 mt-1">
                                {challenge.startDate && challenge.endDate && (
                                  <>
                                    {formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}
                                  </>
                                )}
                              </div>
                            </>
                          ) : (
                            <h4 className="font-medium text-base sm:text-lg text-red-500">Challenge not found</h4>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500">No current challenges</p>
                )}
              </div>
            </div>

            {/* Badges */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
              <h3 className="text-base sm:text-lg font-semibold mb-4">Badges</h3>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {user.badges && user.badges.length > 0 ? (
                  user.badges.map((badge, idx) => {
                    // Always use public folder icons, determine frequency from badge name
                    let freq = '';
                    if (badge.name?.toLowerCase().includes('daily')) freq = 'daily';
                    else if (badge.name?.toLowerCase().includes('weekly')) freq = 'weekly';
                    else if (badge.name?.toLowerCase().includes('monthly')) freq = 'monthly';
                    
                    const badgeIcon = BADGE_ICONS[freq] || BADGE_ICONS.earned;
                    
                    return (
                      <div key={badge.id || badge.challengeId || badge.name || idx} className="flex flex-col items-center p-2 bg-yellow-50 rounded-lg shadow-sm w-24">
                        <img src={badgeIcon} alt={badge.name} className="w-14 h-14 mb-2 rounded-full border-2 border-yellow-400 shadow" />
                        <span className="font-medium text-xs sm:text-sm text-center">{badge.name}</span>
                        <span className="text-xs text-gray-600 text-center">{badge.description}</span>
                        {badge.dateEarned && (
                          <span className="text-[10px] text-gray-400 mt-1">Earned: {formatDate(badge.dateEarned)}</span>
                        )}
                      </div>
                    );
                  })
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
            className="space-y-6"
          >
            {/* Orders Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center border">
                <span className="text-2xl font-bold text-green-600">{user.orders?.length || 0}</span>
                <span className="text-gray-600 mt-1">Total Orders</span>
              </div>
              <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center border">
                <span className="text-2xl font-bold text-blue-600">₹{user.orders?.reduce((sum, order) => {
                  const data = order.orderInfo || order;
                  return sum + (data.totalAmount || data.price || 0);
                }, 0).toLocaleString() || '0'}</span>
                <span className="text-gray-600 mt-1">Total Spent</span>
              </div>
              <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center border">
                <span className="text-2xl font-bold text-green-700 flex items-center gap-1">
                  {user.orders?.reduce((sum, order) => {
                    const data = order.orderInfo || order;
                    return sum + (data.totalCarbonSaved || data.carbonFootprint || 0);
                  }, 0).toFixed(1) || '0'} <Leaf className="w-5 h-5 text-green-400" />
                </span>
                <span className="text-gray-600 mt-1">CO₂ Saved (kg)</span>
              </div>
              <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center border">
                <span className="text-2xl font-bold text-green-600">₹{user.orders?.reduce((sum, order) => {
                  const data = order.orderInfo || order;
                  return sum + (data.moneySaved || 0);
                }, 0).toLocaleString() || '0'}</span>
                <span className="text-gray-600 mt-1">Money Saved</span>
              </div>
            </div>

            {/* Orders List */}
            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-4">Recent Orders</h3>
              <div className="space-y-4">
                {user.orders && user.orders.length > 0 ? (
                  user.orders.slice().reverse().map((order, idx) => {
                    const data = order.orderInfo || order;
                    return (
                      <div key={order._id || idx} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-800">{data.summary?.name || data.name || `Order #${idx + 1}`}</h4>
                            <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                              <Calendar className="w-4 h-4" />
                              <span>Ordered on {new Date(data.orderDate || data.date).toLocaleDateString()}</span>
                            </div>
                            <div className="mt-2">
                              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                {data.status || 'Completed'}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-green-600">
                              ₹{(data.totalAmount || data.price || 0).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {data.items?.length || 1} {data.items?.length === 1 ? 'item' : 'items'}
                            </div>
                            <div className="text-xs text-green-700 mt-1 flex items-center gap-1">
                              Saved {(data.totalCarbonSaved || data.carbonFootprint || 0).toFixed(1)} kg <Leaf className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                        {/* Order Items */}
                        {data.items && data.items.length > 0 && (
                          <div className="mt-4 pt-4 border-t">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Order Items:</h5>
                            <div className="space-y-2">
                              {data.items.map((item: OrderItem, itemIdx: number) => (
                                <div key={itemIdx} className="flex justify-between text-sm">
                                  <span className="text-gray-600">
                                    {item.name} x {item.quantity}
                                  </span>
                                  <span className="text-gray-800">
                                    ₹{(item.price * item.quantity).toLocaleString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-gray-500 text-center py-8">
                    <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <div className="text-lg font-semibold mb-1">No orders yet</div>
                    <div className="text-sm">Start shopping to see your orders here!</div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 max-w-xl mx-auto"
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
              <Settings className="w-6 h-6 text-green-600" /> Account Settings
            </h3>
            <div className="space-y-6 sm:space-y-8">
              {/* Name & Email */}
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                <User className="w-8 h-8 text-green-500 flex-shrink-0" />
                <div className="flex-1 w-full">
                  <div className="mb-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Name</label>
                    <input
                      type="text"
                      value={user.name}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 text-gray-700 focus:outline-none"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 text-gray-700 focus:outline-none"
                      disabled
                    />
                  </div>
                </div>
              </div>
              {/* Location Update */}
              <div className="bg-green-50 rounded-lg p-3 sm:p-4 border flex flex-col gap-3">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-6 h-6 text-green-600" />
                  <span className="font-semibold text-green-800">Location</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={locationDetails.city}
                    onChange={e => setLocationDetails({ ...locationDetails, city: e.target.value })}
                    className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
                    placeholder="City"
                  />
                  <input
                    type="text"
                    value={locationDetails.state}
                    onChange={e => setLocationDetails({ ...locationDetails, state: e.target.value })}
                    className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
                    placeholder="State"
                  />
                  <input
                    type="text"
                    value={locationDetails.country}
                    onChange={e => setLocationDetails({ ...locationDetails, country: e.target.value })}
                    className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
                    placeholder="Country"
                  />
                  <input
                    type="text"
                    value={locationDetails.pin}
                    onChange={e => setLocationDetails({ ...locationDetails, pin: e.target.value })}
                    className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
                    placeholder="Pin Code"
                  />
                </div>
                <button
                  className={`flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium transition-colors mt-2 w-full sm:w-auto justify-center ${locationDetailsLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                  disabled={locationDetailsLoading}
                  onClick={async () => {
                    if (locationDetails.city && locationDetails.state && locationDetails.country && locationDetails.pin) {
                      setLocationDetailsLoading(true);
                      try {
                        await axios.post('/api/update-location', locationDetails);
                        setUser({ ...(user as any), location: locationDetails });
                        setLocationDetails({ city: '', state: '', country: '', pin: '' });
                        showToast('Location updated successfully!', 'success');
                      } catch {
                        showToast('Failed to update location', 'error');
                      } finally {
                        setLocationDetailsLoading(false);
                      }
                    }
                  }}
                >
                  <MapPin className="w-4 h-4" /> {locationDetailsLoading ? 'Updating...' : 'Update Location'}
                </button>
                {user.location && typeof user.location === 'object' && 'city' in user.location && (
                  <div className="text-xs text-green-700 mt-1 flex items-center gap-1">
                    <span className="font-semibold">Current:</span> {user.location.city}, {user.location.state}, {user.location.country} - {user.location.pin}
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-1">Please enter your full address for accurate delivery and tracking.</div>
              </div>
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