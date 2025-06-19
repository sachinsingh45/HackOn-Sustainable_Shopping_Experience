import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  Trophy, 
  Target, 
  Calendar, 
  Users, 
  Star, 
  Leaf, 
  Zap,
  TrendingUp,
  Gift,
  Clock,
  CheckCircle,
  Play,
  Share2,
  Heart,
  Lightbulb,
  ShoppingBag,
  Droplets
} from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Challenge } from '../store/useStore';
import { useToast } from '../context/ToastContext';
import { leaderboardAPI } from '../services/api';

type OrderItem = {
  isEcoFriendly?: boolean;
  ecoScore?: number;
  // add other fields as needed
};

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
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

const frequencyColors: Record<string, string> = {
  daily: 'bg-blue-100 text-blue-700',
  weekly: 'bg-purple-100 text-purple-700',
  monthly: 'bg-orange-100 text-orange-700',
};

const EcoChallengesPage = () => {
  const { challenges, fetchChallenges, joinChallenge, completeChallenge, checkCompletion, user } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { showToast } = useToast();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [showAllLeaderboard, setShowAllLeaderboard] = useState(false);

  const categories = [
    { id: 'all', name: 'All Challenges', icon: Award, color: 'bg-green-500' },
    { id: 'daily', name: 'Daily', icon: Calendar, color: 'bg-blue-500' },
    { id: 'weekly', name: 'Weekly', icon: Target, color: 'bg-purple-500' },
    { id: 'monthly', name: 'Monthly', icon: Trophy, color: 'bg-orange-500' },
  ];

  useEffect(() => {
    fetchChallenges();
    leaderboardAPI.getLeaderboard().then(setLeaderboard).catch(console.error);
  }, [fetchChallenges]);

  const handleCheckCompletion = async () => {
    setIsChecking(true);
    try {
      // Debug: Log user orders
      console.log('User orders:', user?.orders);
      console.log('User current challenges:', user?.currentChallenges);
      console.log('User badges:', user?.badges);
      
      const response = await checkCompletion();
      console.log('Check completion response:', response);
      
      if (response?.status) {
        if (response.completedChallenges && response.completedChallenges.length > 0) {
          showToast(`Great! ${response.completedChallenges.length} challenge(s) completed!`, 'success');
          // Refresh user data to show updated badges
          window.location.reload();
        } else {
          showToast('No new challenges completed. Keep shopping eco-friendly products!', 'info');
        }
      } else {
        showToast('Failed to check challenges', 'error');
      }
    } catch (error) {
      console.error('Error checking completion:', error);
      showToast('Error checking challenges', 'error');
    } finally {
      setIsChecking(false);
    }
  };

  const filteredChallenges = challenges?.filter(
    (challenge) => {
      // Exclude expired challenges
      const now = new Date();
      const endDate = new Date(challenge?.endDate);
      const notExpired = !challenge?.endDate || endDate > now;
      return notExpired && (selectedCategory === 'all' || challenge?.frequency === selectedCategory);
    }
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Award className="w-10 h-10" />
              <h1 className="text-4xl font-bold">Eco Challenges</h1>
            </div>
            <p className="text-xl text-green-100 mb-8">
              Complete challenges, earn rewards, and save the planet
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
              {categories.map((category, idx: number) => (
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
            <button
              onClick={handleCheckCompletion}
              disabled={isChecking}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-medium flex items-center space-x-2 disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isChecking ? 'Checking...' : 'Check Completed'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Challenges List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Challenges</h2>
            <div className="space-y-6">
              {(filteredChallenges ?? []).map((challenge: Challenge, index: number) => {
                const joined = user?.currentChallenges?.includes(challenge._id?.toString() || '');
                const completed = user?.badges?.some(b => b?.challengeId === challenge?._id || b?.challengeId === challenge?.id);
                let statusLabel = 'Not Joined';
                if (completed) statusLabel = 'Completed';
                else if (joined) statusLabel = 'Joined';
                const freqColor = frequencyColors[challenge?.frequency] || 'bg-gray-100 text-gray-700';
                const badgeIcon = completed
                  ? BADGE_ICONS.earned
                  : BADGE_ICONS.locked;
                const badgeStyle = completed ? '' : 'grayscale opacity-60';

                // Progress calculation for daily/monthly eco-friendly product challenges
                let progressText = '';
                let progress = 0;
                let target = 1;
                if (user && (challenge?.frequency === 'daily' || challenge?.frequency === 'monthly' || challenge?.frequency === 'weekly')) {
                  const now = new Date();
                  if (challenge?.frequency === 'weekly') {
                    // Calculate start of week (Monday)
                    const day = now.getDay();
                    const diffToMonday = (day === 0 ? -6 : 1) - day; // Sunday=0, so shift to previous Monday
                    const weekStart = new Date(now);
                    weekStart.setDate(now.getDate() + diffToMonday);
                    weekStart.setHours(0, 0, 0, 0);
                    let co2Saved = 0;
                    user?.orders?.forEach((order: any) => {
                      const orderDate = new Date(order?.orderInfo?.date || order?.orderInfo?.orderDate);
                      if (orderDate >= weekStart && orderDate <= now) {
                        // Try multiple possible fields for carbon footprint
                        const carbonFootprint = order?.orderInfo?.carbonFootprint || 
                                               order?.orderInfo?.totalCarbonSaved ||
                                               order?.orderInfo?.summary?.carbonFootprint ||
                                               0;
                        co2Saved += carbonFootprint;
                        
                        // Debug logging for weekly challenge
                        console.log('Weekly order:', {
                          orderDate,
                          carbonFootprint,
                          orderInfo: order?.orderInfo
                        });
                      }
                    });
                    target = 5;
                    progressText = `CO₂ saved this week: ${co2Saved.toFixed(2)}/5 kg`;
                    progress = co2Saved;
                  } else {
                    let ecoCount = 0;
                    user?.orders?.forEach((order: any) => {
                      const orderDate = new Date(order?.orderInfo?.date || order?.orderInfo?.orderDate);
                      
                      // Improved eco-friendly detection logic
                      const isEco = order?.orderInfo?.isEcoFriendly === true || 
                                   (order?.orderInfo?.ecoScore && order.orderInfo.ecoScore > 0) ||
                                   (order?.orderInfo?.items && order.orderInfo.items.some((item: OrderItem) => 
                                     item?.isEcoFriendly === true || (item?.ecoScore && item.ecoScore > 0)
                                   ));
                      
                      // Debug logging for first few orders
                      if (ecoCount < 3) {
                        console.log(`Order ${ecoCount + 1}:`, {
                          orderDate,
                          isEco,
                          orderInfo: order?.orderInfo,
                          challenge: challenge?.frequency
                        });
                      }
                      
                      if (challenge?.frequency === 'daily') {
                        if (
                          orderDate.getDate() === now.getDate() &&
                          orderDate.getMonth() === now.getMonth() &&
                          orderDate.getFullYear() === now.getFullYear() &&
                          isEco
                        ) {
                          ecoCount++;
                        }
                        target = 1;
                        progressText = `Eco-friendly products bought today: ${ecoCount}/1`;
                        progress = ecoCount;
                      } else if (challenge?.frequency === 'monthly') {
                        if (
                          orderDate.getMonth() === now.getMonth() &&
                          orderDate.getFullYear() === now.getFullYear() &&
                          isEco
                        ) {
                          ecoCount++;
                        }
                        target = 10;
                        progressText = `Eco-friendly products bought this month: ${ecoCount}/10`;
                        progress = ecoCount;
                      }
                    });
                  }
                }
                // Custom descriptions
                let customDescription = challenge?.description || 'Complete this challenge to earn a badge!';
                if (challenge?.frequency === 'daily') {
                  customDescription = 'Buy at least 1 eco-friendly product today to complete this challenge.';
                } else if (challenge?.frequency === 'weekly') {
                  customDescription = 'Save at least 5kg of CO₂ this week to complete this challenge.';
                } else if (challenge?.frequency === 'monthly') {
                  customDescription = 'Buy at least 10 eco-friendly products this month to complete this challenge.';
                }
                return (
                  <motion.div
                    key={challenge?._id || challenge?.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`bg-white rounded-2xl shadow-lg transition-shadow border-2 ${completed ? 'border-yellow-400' : joined ? 'border-blue-400' : 'border-gray-100'} group hover:bg-gray-50`}
                  >
                    <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${freqColor}`}>{challenge?.frequency?.toUpperCase() || 'CHALLENGE'}</span>
                          <span className="text-xs text-gray-400 ml-2">
                            {formatDate(challenge?.startDate)} - {formatDate(challenge?.endDate)}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">{challenge?.name}</h3>
                        <p className="text-gray-600 mb-2 text-sm">{customDescription}</p>
                        {(challenge?.frequency === 'daily' || challenge?.frequency === 'monthly' || challenge?.frequency === 'weekly') && joined && !completed && (
                          <div className="mb-2">
                            <div className="text-xs text-blue-700 font-semibold">{progressText}</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div
                                className={`h-2 rounded-full ${progress >= target ? 'bg-green-500' : 'bg-blue-400'}`}
                                style={{ width: `${Math.min((progress / target) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${completed ? 'bg-yellow-100 text-yellow-800' : joined ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>{statusLabel}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-2 min-w-[120px]">
                        <div className="relative group">
                          <img
                            src={badgeIcon}
                            alt="badge"
                            className={`w-14 h-14 rounded-full border-2 ${completed ? 'border-yellow-400' : 'border-gray-300'} shadow ${badgeStyle} transition-all duration-200`}
                            title={challenge?.rewardBadge?.name + (completed ? ' (Earned)' : ' (Locked)')}
                          />
                          <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 text-xs text-gray-500 bg-white bg-opacity-80 px-2 py-0.5 rounded shadow border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                            {challenge?.rewardBadge?.name}
                            <br />
                            <span className="text-gray-400">{challenge?.rewardBadge?.description}</span>
                          </div>
                        </div>
                        {joined && !completed && (
                          <div className="flex gap-2">
                            <a
                              href="/green-store"
                              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium flex-1 text-center"
                            >
                              Continue Shopping
                            </a>
                            {progress >= target && (
                              <button
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
                                onClick={async () => {
                                  try {
                                    const response = await completeChallenge(challenge._id);
                                    if (response.status) {
                                      showToast('Challenge completed! Badge earned!', 'success');
                                    } else {
                                      showToast('Failed to complete challenge', 'error');
                                    }
                                  } catch (error) {
                                    showToast('Error completing challenge', 'error');
                                  }
                                }}
                              >
                                Complete
                              </button>
                            )}
                          </div>
                        )}
                        {completed && (
                          <span className="bg-yellow-400 text-white px-6 py-2 rounded-lg font-medium w-full text-center">Badge Earned!</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 px-6 pb-4">
                      {!joined && !completed && (
                        <button
                          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium w-full"
                          onClick={() => joinChallenge(challenge._id)}
                        >
                          Join Challenge
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                Your Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Orders:</span>
                  <span className="font-semibold">{user?.orders?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Eco Score:</span>
                  <span className="font-semibold text-green-600">{user?.ecoScore?.toFixed(1) || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CO₂ Saved:</span>
                  <span className="font-semibold text-blue-600">{user?.carbonSaved?.toFixed(2) || 0} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Badges Earned:</span>
                  <span className="font-semibold text-yellow-600">{user?.badges?.length || 0}</span>
                </div>
                
                {/* Weekly Challenge Debug Info */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Weekly Challenge Debug:</h4>
                  {(() => {
                    const now = new Date();
                    const day = now.getDay();
                    const diffToMonday = (day === 0 ? -6 : 1) - day;
                    const weekStart = new Date(now);
                    weekStart.setDate(now.getDate() + diffToMonday);
                    weekStart.setHours(0, 0, 0, 0);
                    
                    const weeklyOrders = user?.orders?.filter(order => {
                      const orderDate = new Date(order?.orderInfo?.date || order?.orderInfo?.orderDate);
                      return orderDate >= weekStart && orderDate <= now;
                    }) || [];
                    
                    const totalWeeklyCo2 = weeklyOrders.reduce((sum, order) => {
                      const carbonFootprint = order?.orderInfo?.carbonFootprint || 
                                             order?.orderInfo?.totalCarbonSaved ||
                                             order?.orderInfo?.summary?.carbonFootprint ||
                                             0;
                      return sum + carbonFootprint;
                    }, 0);
                    
                    return (
                      <div className="text-xs space-y-1">
                        <div>Week Start: {weekStart.toLocaleDateString()}</div>
                        <div>Weekly Orders: {weeklyOrders.length}</div>
                        <div>Weekly CO₂: {totalWeeklyCo2.toFixed(2)} kg</div>
                        <div>Target: 5.00 kg</div>
                        <div className={`font-semibold ${totalWeeklyCo2 >= 5 ? 'text-green-600' : 'text-red-600'}`}>
                          Status: {totalWeeklyCo2 >= 5 ? 'Complete!' : 'In Progress'}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                Leaderboard
              </h3>
              <div className="space-y-3">
                {leaderboard?.length === 0 && <div className="text-gray-400 text-sm">No leaderboard data yet.</div>}
                {(showAllLeaderboard ? leaderboard : leaderboard?.slice(0, 5))?.map((lbUser: any, index: number) => {
                  const isCurrent = user && lbUser?.name === user?.name;
                  let rankIcon = null;
                  if (index === 0) rankIcon = <span title="1st" className="mr-1">🥇</span>;
                  else if (index === 1) rankIcon = <span title="2nd" className="mr-1">🥈</span>;
                  else if (index === 2) rankIcon = <span title="3rd" className="mr-1">🥉</span>;
                  return (
                    <div
                      key={lbUser?.name || index}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${isCurrent ? 'bg-green-50 border-2 border-green-400' : 'hover:bg-gray-50'}`}
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-gray-200 text-gray-700">
                        {rankIcon || index + 1}
                      </div>
                      <img src={lbUser?.avatar} alt={lbUser?.name} className="w-8 h-8 rounded-full" />
                      <div className="flex-1">
                        <div className={`font-medium ${isCurrent ? 'text-green-700' : 'text-gray-900'}`}>{lbUser?.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{lbUser?.points}</div>
                        <div className="text-xs text-gray-500">points</div>
                      </div>
                    </div>
                  );
                })}
                {leaderboard?.length > 5 && (
                  <button
                    onClick={() => setShowAllLeaderboard(!showAllLeaderboard)}
                    className="w-full text-center text-blue-600 hover:text-blue-800 font-medium py-2"
                  >
                    {showAllLeaderboard ? 'Show Less' : `Show More (${leaderboard.length - 5} more)`}
                  </button>
                )}
              </div>
            </div>
            {/* Quick Actions / Rewards */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <Gift className="w-5 h-5 text-green-500" />
                  <span className="font-medium">View Rewards</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">Invite Friends</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium">Suggest Challenge</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoChallengesPage;