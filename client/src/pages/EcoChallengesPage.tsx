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
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/leaf.png')]" />
        <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Award className="w-12 h-12 text-yellow-300 drop-shadow-lg" />
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight relative inline-block">
                Eco Challenges
                <span className="block h-1 w-16 bg-green-300 rounded-full mx-auto mt-2" />
              </h1>
            </div>
            <p className="text-lg sm:text-xl text-green-100 mb-4 flex items-center justify-center gap-2">
              <Leaf className="w-6 h-6 text-green-200" />
              Complete challenges, earn rewards, and save the planet
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <div className="flex space-x-2 sm:space-x-4 bg-gray-50 rounded-xl p-2 shadow-inner overflow-x-auto scrollbar-hide">
              {categories.map((category, idx: number) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap flex-shrink-0 font-semibold shadow-sm border-2 ${
                    selectedCategory === category.id
                      ? 'bg-green-500 text-white border-green-600 shadow-lg scale-105'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-green-50 hover:border-green-300'
                  }`}
                >
                  <category.icon className="w-5 h-5" />
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
            <button
              onClick={handleCheckCompletion}
              disabled={isChecking}
              className="hidden sm:flex bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-medium items-center space-x-2 disabled:opacity-50 w-full sm:w-auto mt-3 sm:mt-0 shadow-lg"
            >
              <CheckCircle className="w-4 h-4" />
              <span>
                <span className="block sm:hidden">Check</span>
                <span className="hidden sm:block">{isChecking ? 'Checking...' : 'Check Completed'}</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-8 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl mt-4 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Challenges List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" /> Active Challenges
            </h2>
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
                      const orderDate = new Date(order?.orderDate || order?.orderDate);
                      if (orderDate >= weekStart && orderDate <= now) {
                        // Try multiple possible fields for carbon footprint
                        const carbonFootprint = order?.carbonFootprint || 
                                               order?.totalCarbonSaved ||
                                               order?.carbonFootprint ||
                                               0;
                        co2Saved += carbonFootprint;
                      }
                    });
                    target = 5;
                    progressText = `CO₂ saved this week: ${co2Saved.toFixed(2)}/5 kg`;
                    progress = co2Saved;
                  } else {
                    let ecoCount = 0;
                    user?.orders?.forEach((order: any) => {
                      const orderDate = new Date(order?.orderDate || order?.orderDate);
                      // Improved eco-friendly detection logic
                      const isEco = order?.isEcoFriendly === true || 
                                   (order?.ecoScore && order.ecoScore > 0) ||
                                   (order?.items && order.items.some((item: OrderItem) => 
                                     item?.isEcoFriendly === true || (item?.ecoScore && item.ecoScore > 0)
                                   ));
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
                    className={`bg-white rounded-2xl shadow-lg transition-shadow border-l-8 ${completed ? 'border-green-400' : joined ? 'border-blue-400' : 'border-gray-200'} group hover:-translate-y-1 hover:shadow-2xl`}
                  >
                    <div className="p-4 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${freqColor}`}>{challenge?.frequency?.toUpperCase() || 'CHALLENGE'}</span>
                          <span className="text-xs text-gray-400 ml-2">
                            {formatDate(challenge?.startDate)} - {formatDate(challenge?.endDate)}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 text-xl mb-1 flex items-center gap-2">
                          {completed && <CheckCircle className="w-5 h-5 text-green-500" />} {challenge?.name}
                        </h3>
                        <p className="text-gray-600 mb-2 text-base">{customDescription}</p>
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
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${completed ? 'bg-green-100 text-green-800' : joined ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>{statusLabel}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-2 min-w-0 md:min-w-[120px] w-full md:w-auto">
                        <div className="relative group">
                          <img
                            src={badgeIcon}
                            alt="badge"
                            className={`w-14 h-14 rounded-full border-2 ${completed ? 'border-green-400' : 'border-gray-300'} shadow ${badgeStyle} transition-all duration-200`}
                            title={challenge?.rewardBadge?.name + (completed ? ' (Earned)' : ' (Locked)')}
                          />
                          <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 text-xs text-gray-500 bg-white bg-opacity-80 px-2 py-0.5 rounded shadow border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                            {challenge?.rewardBadge?.name}
                            <br />
                            <span className="text-gray-400">{challenge?.rewardBadge?.description}</span>
                          </div>
                        </div>
                        {joined && !completed && (
                          <div className="flex flex-col gap-2 px-4 sm:px-6 pb-4">
                            <div className="flex gap-2">
                              <a
                                href="/green-store"
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium flex-1 text-center shadow"
                              >
                                Continue Shopping
                              </a>
                              {progress >= target && (
                                <button
                                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium shadow"
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
                          </div>
                        )}
                        {completed && (
                          <span className="bg-green-400 text-white px-6 py-2 rounded-lg font-medium w-full text-center shadow">Badge Earned!</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 px-4 sm:px-6 pb-4">
                      {!joined && !completed && (
                        <button
                          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium w-full shadow"
                          onClick={async () => {
                            try {
                              const response = await joinChallenge(challenge._id);
                              if (response.status) {
                                showToast('Challenge joined successfully!', 'success');
                                fetchChallenges(); // Refresh challenges
                              } else {
                                showToast(response.message || 'Failed to join challenge', 'error');
                              }
                            } catch (error: any) {
                              console.error('Error joining challenge:', error);
                              showToast(error.response?.data?.message || 'Please login to join challenges', 'error');
                            }
                          }}
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
          <div className="space-y-4 sm:space-y-6">
            {/* User Stats */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                Your Stats
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex flex-col xs:flex-row justify-between gap-1 xs:gap-0 items-center">
                  <span className="text-gray-600 flex items-center gap-1"><ShoppingBag className="w-4 h-4 text-blue-400" /> Total Orders:</span>
                  <span className="font-semibold">{user?.orders?.length || 0}</span>
                </div>
                <div className="flex flex-col xs:flex-row justify-between gap-1 xs:gap-0 items-center">
                  <span className="text-gray-600 flex items-center gap-1"><Leaf className="w-4 h-4 text-green-400" /> Eco Score:</span>
                  <span className="font-semibold text-green-600">{user?.ecoScore?.toFixed(1) || 0}</span>
                </div>
                <div className="flex flex-col xs:flex-row justify-between gap-1 xs:gap-0 items-center">
                  <span className="text-gray-600 flex items-center gap-1"><Droplets className="w-4 h-4 text-blue-500" /> CO₂ Saved:</span>
                  <span className="font-semibold text-blue-600">{user?.carbonSaved?.toFixed(2) || 0} kg</span>
                </div>
                <div className="flex flex-col xs:flex-row justify-between gap-1 xs:gap-0 items-center">
                  <span className="text-gray-600 flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400" /> Badges Earned:</span>
                  <span className="font-semibold text-yellow-600">{user?.badges?.length || 0}</span>
                </div>
                {/* Weekly Challenge Debug Info */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1"><Clock className="w-4 h-4 text-blue-400" /> Weekly Challenge Debug:</h4>
                  {(() => {
                    const now = new Date();
                    const day = now.getDay();
                    const diffToMonday = (day === 0 ? -6 : 1) - day;
                    const weekStart = new Date(now);
                    weekStart.setDate(now.getDate() + diffToMonday);
                    weekStart.setHours(0, 0, 0, 0);
                    
                    const weeklyOrders = user?.orders?.filter(order => {
                      const orderDate = new Date(order?.orderDate || order?.orderDate);
                      return orderDate >= weekStart && orderDate <= now;
                    }) || [];
                    
                    const totalWeeklyCo2 = weeklyOrders.reduce((sum, order) => {
                      const carbonFootprint = order?.carbonFootprint || 
                                             order?.totalCarbonSaved ||
                                             order?.carbonFootprint ||
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
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                Leaderboard
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {leaderboard?.length === 0 && <div className="text-gray-400 text-sm">No leaderboard data yet.</div>}
                {(showAllLeaderboard ? leaderboard : leaderboard?.slice(0, 5))?.map((lbUser: any, index: number) => {
                  const isCurrent = user && lbUser?.name === user?.name;
                  let rankIcon = null;
                  let rowBg = '';
                  if (index === 0) { rankIcon = <span title="1st" className="mr-1">🥇</span>; rowBg = 'bg-yellow-50'; }
                  else if (index === 1) { rankIcon = <span title="2nd" className="mr-1">🥈</span>; rowBg = 'bg-gray-100'; }
                  else if (index === 2) { rankIcon = <span title="3rd" className="mr-1">🥉</span>; rowBg = 'bg-orange-50'; }
                  return (
                    <div
                      key={lbUser?.name || index}
                      className={`flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg transition-colors ${rowBg} ${isCurrent ? 'bg-green-50 border-2 border-green-400' : 'hover:bg-gray-50'}`}
                    >
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold bg-gray-200 text-gray-700">
                        {rankIcon || index + 1}
                      </div>
                      <img src={lbUser?.avatar} alt={lbUser?.name} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full" />
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium truncate ${isCurrent ? 'text-green-700' : 'text-gray-900'}`}>{lbUser?.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600 text-xs sm:text-base">{lbUser?.points}</div>
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
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-green-400" /> Quick Actions</h3>
              <div className="space-y-2 sm:space-y-3">
                <button className="w-full flex flex-col xs:flex-row items-center xs:items-center space-y-2 xs:space-y-0 xs:space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <Gift className="w-5 h-5 text-green-500" />
                  <span className="font-medium">View Rewards</span>
                </button>
                <button className="w-full flex flex-col xs:flex-row items-center xs:items-center space-y-2 xs:space-y-0 xs:space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">Invite Friends</span>
                </button>
                <button className="w-full flex flex-col xs:flex-row items-center xs:items-center space-y-2 xs:space-y-0 xs:space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
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