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
import { useToast } from '../context/ToastContext';
import { leaderboardAPI } from '../services/api';

const BADGE_ICONS = {
  earned: 'https://cdn-icons-png.flaticon.com/512/2583/2583346.png', // gold star
  locked: 'https://cdn-icons-png.flaticon.com/512/565/565547.png', // grey lock
  daily: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png', // calendar/star
  weekly: 'https://cdn-icons-png.flaticon.com/512/2583/2583343.png', // trophy
  monthly: 'https://cdn-icons-png.flaticon.com/512/2583/2583347.png', // crown
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
  const { challenges, fetchChallenges, joinChallenge, completeChallenge, user } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { showToast } = useToast();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  const categories = [
    { id: 'all', name: 'All Challenges', icon: Award, color: 'bg-green-500' },
    { id: 'daily', name: 'Daily', icon: Calendar, color: 'bg-blue-500' },
    { id: 'weekly', name: 'Weekly', icon: Target, color: 'bg-purple-500' },
    { id: 'monthly', name: 'Monthly', icon: Trophy, color: 'bg-orange-500' },
  ];

  useEffect(() => {
    fetchChallenges();
    leaderboardAPI.getLeaderboard().then(setLeaderboard);
  }, [fetchChallenges]);

  const filteredChallenges = challenges.filter(
    (challenge) =>
      selectedCategory === 'all' || challenge.frequency === selectedCategory
  );

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
              {[
                { id: 'all', name: 'All Challenges', icon: Award, color: 'bg-green-500' },
                { id: 'daily', name: 'Daily', icon: Calendar, color: 'bg-blue-500' },
                { id: 'weekly', name: 'Weekly', icon: Target, color: 'bg-purple-500' },
                { id: 'monthly', name: 'Monthly', icon: Trophy, color: 'bg-orange-500' },
              ].map((category) => (
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
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Challenges List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Challenges</h2>
            <div className="space-y-6">
              {(filteredChallenges ?? []).map((challenge, index) => {
                const joined = user?.currentChallenges?.includes(challenge._id) || user?.currentChallenges?.includes(challenge.id);
                const completed = user?.badges?.some(b => b.challengeId === challenge._id || b.challengeId === challenge.id);
                let statusLabel = 'Not Joined';
                if (completed) statusLabel = 'Completed';
                else if (joined) statusLabel = 'Joined';
                const freqColor = frequencyColors[challenge.frequency] || 'bg-gray-100 text-gray-700';
                const badgeIcon = completed
                  ? BADGE_ICONS[challenge.frequency] || BADGE_ICONS.earned
                  : BADGE_ICONS.locked;
                const badgeStyle = completed ? '' : 'grayscale opacity-60';

                // Progress calculation for daily/monthly eco-friendly product challenges
                let progressText = '';
                let progress = 0;
                let target = 1;
                if (user && (challenge.frequency === 'daily' || challenge.frequency === 'monthly')) {
                  const now = new Date();
                  let ecoCount = 0;
                  user.orders?.forEach(order => {
                    const orderDate = new Date(order.orderInfo?.date || order.date);
                    const isEco = order.orderInfo?.isEcoFriendly || order.orderInfo?.ecoScore > 0 || order.orderInfo?.isEcoFriendly === true;
                    if (challenge.frequency === 'daily') {
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
                    } else if (challenge.frequency === 'monthly') {
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
                // Custom descriptions
                let customDescription = challenge.description;
                if (challenge.frequency === 'daily') {
                  customDescription = 'Buy at least 1 eco-friendly product today to complete this challenge.';
                } else if (challenge.frequency === 'weekly') {
                  customDescription = 'Place at least 1 order this week to complete this challenge.';
                } else if (challenge.frequency === 'monthly') {
                  customDescription = 'Buy at least 10 eco-friendly products this month to complete this challenge.';
                }
                return (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`bg-white rounded-2xl shadow-lg transition-shadow border-2 ${completed ? 'border-yellow-400' : joined ? 'border-blue-400' : 'border-gray-100'} group hover:bg-gray-50`}
                  >
                    <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${freqColor}`}>{challenge.frequency?.toUpperCase() || 'CHALLENGE'}</span>
                          <span className="text-xs text-gray-400 ml-2">
                            {formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">{challenge.name}</h3>
                        <p className="text-gray-600 mb-2 text-sm">{customDescription}</p>
                        {(challenge.frequency === 'daily' || challenge.frequency === 'monthly') && joined && !completed && (
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
                            title={challenge.rewardBadge?.name + (completed ? ' (Earned)' : ' (Locked)')}
                          />
                          <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 text-xs text-gray-500 bg-white bg-opacity-80 px-2 py-0.5 rounded shadow border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                            {challenge.rewardBadge?.name}
                            <br />
                            <span className="text-gray-400">{challenge.rewardBadge?.description}</span>
                          </div>
                        </div>
                        {completed && <span className="text-xs text-yellow-600 font-semibold mt-1">Badge Earned!</span>}
                      </div>
                    </div>
                    <div className="flex gap-2 px-6 pb-4">
                      {!joined && !completed && (
                        <button
                          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium w-full"
                          onClick={() => joinChallenge(challenge.id)}
                        >
                          Join Challenge
                        </button>
                      )}
                      {joined && !completed && (
                        <a
                          href="/green-store"
                          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium w-full text-center block"
                        >
                          Continue Shopping
                        </a>
                      )}
                      {completed && (
                        <span className="bg-yellow-400 text-white px-6 py-2 rounded-lg font-medium w-full text-center">Badge Earned!</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                Leaderboard
              </h3>
              <div className="space-y-3">
                {leaderboard.length === 0 && <div className="text-gray-400 text-sm">No leaderboard data yet.</div>}
                {leaderboard.map((lbUser, index) => {
                  const isCurrent = user && lbUser.name === user.name;
                  let rankIcon = null;
                  if (index === 0) rankIcon = <span title="1st" className="mr-1">🥇</span>;
                  else if (index === 1) rankIcon = <span title="2nd" className="mr-1">🥈</span>;
                  else if (index === 2) rankIcon = <span title="3rd" className="mr-1">🥉</span>;
                  return (
                    <div
                      key={lbUser.name}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${isCurrent ? 'bg-green-50 border-2 border-green-400' : 'hover:bg-gray-50'}`}
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-gray-200 text-gray-700">
                        {rankIcon || index + 1}
                      </div>
                      <img src={lbUser.avatar} alt={lbUser.name} className="w-8 h-8 rounded-full" />
                      <div className="flex-1">
                        <div className={`font-medium ${isCurrent ? 'text-green-700' : 'text-gray-900'}`}>{lbUser.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{lbUser.points}</div>
                        <div className="text-xs text-gray-500">points</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
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
