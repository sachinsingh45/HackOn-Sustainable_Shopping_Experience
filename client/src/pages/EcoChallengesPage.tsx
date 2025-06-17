import React, { useState } from 'react';
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

const EcoChallengesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const categories = [
    { id: 'all', name: 'All Challenges', icon: Award, color: 'bg-green-500' },
    { id: 'daily', name: 'Daily', icon: Calendar, color: 'bg-blue-500' },
    { id: 'weekly', name: 'Weekly', icon: Target, color: 'bg-purple-500' },
    { id: 'monthly', name: 'Monthly', icon: Trophy, color: 'bg-orange-500' },
    { id: 'community', name: 'Community', icon: Users, color: 'bg-pink-500' }
  ];

  const challenges = [
    {
      id: 1,
      title: 'Zero Waste Week',
      description: 'Go completely waste-free for 7 days',
      category: 'weekly',
      difficulty: 'Hard',
      participants: 1247,
      rewards: 500,
      carbonSaved: 25,
      timeLeft: '3 days',
      isActive: true,
      progress: 85,
      icon: Leaf,
      color: 'bg-green-500',
      tags: ['Waste Reduction', 'Lifestyle']
    },
    {
      id: 2,
      title: 'Energy Saver',
      description: 'Reduce your electricity consumption by 20%',
      category: 'monthly',
      difficulty: 'Medium',
      participants: 892,
      rewards: 300,
      carbonSaved: 15,
      timeLeft: '12 days',
      isActive: true,
      progress: 60,
      icon: Zap,
      color: 'bg-yellow-500',
      tags: ['Energy', 'Home']
    },
    {
      id: 3,
      title: 'Plastic-Free Day',
      description: 'Avoid all single-use plastics for 24 hours',
      category: 'daily',
      difficulty: 'Easy',
      participants: 2156,
      rewards: 100,
      carbonSaved: 5,
      timeLeft: '8 hours',
      isActive: true,
      progress: 100,
      icon: Target,
      color: 'bg-blue-500',
      tags: ['Plastic', 'Daily']
    },
    {
      id: 4,
      title: 'Green Commute',
      description: 'Use eco-friendly transportation for a week',
      category: 'weekly',
      difficulty: 'Medium',
      participants: 678,
      rewards: 250,
      carbonSaved: 20,
      timeLeft: '5 days',
      isActive: true,
      progress: 40,
      icon: TrendingUp,
      color: 'bg-purple-500',
      tags: ['Transport', 'Weekly']
    },
    {
      id: 5,
      title: 'Sustainable Shopping',
      description: 'Buy only eco-friendly products for a month',
      category: 'monthly',
      difficulty: 'Hard',
      participants: 445,
      rewards: 750,
      carbonSaved: 35,
      timeLeft: '18 days',
      isActive: true,
      progress: 25,
      icon: ShoppingBag,
      color: 'bg-pink-500',
      tags: ['Shopping', 'Lifestyle']
    },
    {
      id: 6,
      title: 'Water Conservation',
      description: 'Reduce water usage by 30%',
      category: 'weekly',
      difficulty: 'Medium',
      participants: 567,
      rewards: 200,
      carbonSaved: 10,
      timeLeft: '6 days',
      isActive: true,
      progress: 70,
      icon: Droplets,
      color: 'bg-cyan-500',
      tags: ['Water', 'Conservation']
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'Sarah Green', points: 2840, avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150', carbonSaved: 156 },
    { rank: 2, name: 'Eco Warrior', points: 2650, avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150', carbonSaved: 142 },
    { rank: 3, name: 'Green Thumb', points: 2480, avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150', carbonSaved: 128 },
    { rank: 4, name: 'Nature Lover', points: 2320, avatar: 'https://images.pexels.com/photos/937481/pexels-photo-937481.jpeg?auto=compress&cs=tinysrgb&w=150', carbonSaved: 115 },
    { rank: 5, name: 'Eco Explorer', points: 2180, avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150', carbonSaved: 98 }
  ];

  const userStats = {
    totalPoints: 1850,
    challengesCompleted: 23,
    carbonSaved: 89,
    currentRank: 12,
    streak: 7
  };

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
                <div className="text-2xl font-bold">{userStats.totalPoints}</div>
                <div className="text-green-100 text-sm">Total Points</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl font-bold">{userStats.challengesCompleted}</div>
                <div className="text-green-100 text-sm">Completed</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl font-bold">{userStats.carbonSaved}</div>
                <div className="text-green-100 text-sm">CO2 Saved (kg)</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl font-bold">#{userStats.currentRank}</div>
                <div className="text-green-100 text-sm">Rank</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl font-bold">{userStats.streak}</div>
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
              {sortedChallenges.map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${challenge.color} text-white`}>
                          <challenge.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{challenge.title}</h3>
                          <p className="text-gray-600">{challenge.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{challenge.rewards}</div>
                        <div className="text-sm text-gray-500">points</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Progress: {challenge.progress}%</span>
                        <span>{challenge.participants} participants</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-green-500 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${challenge.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Tags and Stats */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex space-x-2">
                        {challenge.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Leaf className="w-4 h-4 text-green-500" />
                          <span>{challenge.carbonSaved}kg CO2</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-orange-500" />
                          <span>{challenge.timeLeft}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          challenge.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                          challenge.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {challenge.difficulty}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          <Share2 className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium">
                          {challenge.progress === 100 ? 'Completed' : 'Join Challenge'}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
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
                {leaderboard.map((user, index) => (
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
