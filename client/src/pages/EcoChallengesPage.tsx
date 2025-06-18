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

const EcoChallengesPage = () => {
  const { challenges, fetchChallenges, joinChallenge, completeChallenge, user } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const categories = [
    { id: 'all', name: 'All Challenges', icon: Award, color: 'bg-green-500' },
    { id: 'daily', name: 'Daily', icon: Calendar, color: 'bg-blue-500' },
    { id: 'weekly', name: 'Weekly', icon: Target, color: 'bg-purple-500' },
    { id: 'monthly', name: 'Monthly', icon: Trophy, color: 'bg-orange-500' },
    { id: 'community', name: 'Community', icon: Users, color: 'bg-pink-500' }
  ];

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  const filteredChallenges = challenges.filter(challenge => 
    selectedCategory === 'all' || challenge.category === selectedCategory
  );

  const sortedChallenges = [...filteredChallenges].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.participants - a.participants;
      case 'rewards':
        return b.rewards - a.rewards;
      case 'time':
        return parseInt(a.timeLeft) - parseInt(b.timeLeft);
      default:
        return 0;
    }
  });

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
            
            {/* User Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl font-bold">{user?.totalPoints}</div>
                <div className="text-green-100 text-sm">Total Points</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl font-bold">{user?.challengesCompleted}</div>
                <div className="text-green-100 text-sm">Completed</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl font-bold">{user?.carbonSaved}</div>
                <div className="text-green-100 text-sm">CO2 Saved (kg)</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl font-bold">#{user?.currentRank}</div>
                <div className="text-green-100 text-sm">Rank</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl font-bold">{user?.streak}</div>
                <div className="text-green-100 text-sm">Day Streak</div>
              </div>
            </div>
          </div>
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
              <option value="popular">Sort by Popularity</option>
              <option value="rewards">Sort by Rewards</option>
              <option value="time">Sort by Time Left</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Challenges List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Challenges</h2>
            <div className="space-y-6">
              {challenges.map((challenge, index) => {
                const joined = user?.currentChallenges.includes(challenge._id);
                const completed = user?.badges.some(b => b.challengeId === challenge._id);
                return (
                  <motion.div
                    key={challenge._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow ${completed ? 'border-4 border-yellow-400' : joined ? 'border-4 border-blue-400' : ''}`}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-green-500 text-white`}>
                            <span className="text-lg font-bold">{challenge.name[0]}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{challenge.name}</h3>
                            <p className="text-gray-600">{challenge.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">{challenge.targetValue}</div>
                          <div className="text-sm text-gray-500">target</div>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        {!joined && !completed && (
                          <button
                            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
                            onClick={() => joinChallenge(challenge._id)}
                          >
                            Join Challenge
                          </button>
                        )}
                        {joined && !completed && (
                          <button
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                            onClick={() => completeChallenge(challenge._id)}
                          >
                            Mark as Complete
                          </button>
                        )}
                        {completed && (
                          <span className="bg-yellow-400 text-white px-6 py-2 rounded-lg font-medium">Badge Earned!</span>
                        )}
                      </div>
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
                {user?.leaderboard.map((user, index) => (
                  <div key={user.rank} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      user.rank === 1 ? 'bg-yellow-500 text-white' :
                      user.rank === 2 ? 'bg-gray-400 text-white' :
                      user.rank === 3 ? 'bg-orange-500 text-white' :
                      'bg-gray-200 text-gray-700'
                    }`}>
                      {user.rank}
                    </div>
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.carbonSaved}kg CO2 saved</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">{user.points}</div>
                      <div className="text-xs text-gray-500">points</div>
                    </div>
                  </div>
                ))}
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

            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Achievements</h3>
              <div className="space-y-3">
                {[
                  { title: 'First Challenge', description: 'Completed your first eco challenge', icon: Star, color: 'text-yellow-500' },
                  { title: 'Week Warrior', description: 'Completed 7 challenges in a week', icon: Award, color: 'text-green-500' },
                  { title: 'Carbon Hero', description: 'Saved 50kg of CO2', icon: Leaf, color: 'text-blue-500' }
                ].map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <achievement.icon className={`w-5 h-5 ${achievement.color}`} />
                    <div>
                      <div className="font-medium text-gray-900">{achievement.title}</div>
                      <div className="text-sm text-gray-600">{achievement.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoChallengesPage;
