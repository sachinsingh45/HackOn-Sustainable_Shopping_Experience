import React, { useState } from 'react';
import { BarChart3, Leaf, TrendingUp, Users, Package, Award, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const GreenBridgePage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8 text-green-600" />,
      title: 'GreenScore Analytics',
      description: 'Get detailed insights on packaging waste, return rates, CO₂ emissions, and recyclability for each product.'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
      title: 'Eco-Optimization Tips',
      description: 'AI-powered suggestions to improve sustainability - switch to compostable mailers, reduce over-packaging.'
    },
    {
      icon: <Award className="w-8 h-8 text-purple-600" />,
      title: 'Climate Pledge Friendly',
      description: 'Checklist and nudge system to help sellers earn green certifications and increase visibility.'
    },
    {
      icon: <Users className="w-8 h-8 text-orange-600" />,
      title: 'Seller Community',
      description: 'Hub for sharing best practices, success stories, and connecting with other sustainable sellers.'
    }
  ];

  const metrics = [
    { label: 'CO₂ Emissions', value: '2.5 kg', change: '-15%', color: 'text-green-600' },
    { label: 'Packaging Waste', value: '150g', change: '-22%', color: 'text-green-600' },
    { label: 'Return Rate', value: '3.2%', change: '-8%', color: 'text-green-600' },
    { label: 'Recyclability Score', value: '85%', change: '+12%', color: 'text-green-600' }
  ];

  const recommendations = [
    {
      title: 'Switch to Biodegradable Packaging',
      impact: 'Reduce CO₂ by 0.8 kg per order',
      difficulty: 'Easy',
      cost: 'Low'
    },
    {
      title: 'Optimize Package Size',
      impact: 'Reduce packaging waste by 30%',
      difficulty: 'Medium',
      cost: 'None'
    },
    {
      title: 'Use Recycled Materials',
      impact: 'Improve recyclability score by 15%',
      difficulty: 'Easy',
      cost: 'Medium'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center mb-4"
            >
              <Leaf className="w-12 h-12 mr-3" />
              <h1 className="text-4xl md:text-6xl font-bold">GreenBridge</h1>
            </motion.div>
            <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
              Empowering Amazon sellers to go green with comprehensive sustainability analytics, 
              AI-powered optimization tips, and community-driven best practices.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'features', label: 'Features' },
              { id: 'community', label: 'Community' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-lg shadow-sm border"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Benefits Section */}
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <h2 className="text-2xl font-bold text-center mb-8">Why Choose GreenBridge?</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Increase Sales</h3>
                  <p className="text-gray-600 text-sm">
                    Eco-conscious customers prefer sustainable products. Get green certifications to boost visibility.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Reduce Costs</h3>
                  <p className="text-gray-600 text-sm">
                    Optimize packaging and reduce returns with our AI-powered recommendations.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Build Brand Trust</h3>
                  <p className="text-gray-600 text-sm">
                    Demonstrate your commitment to sustainability and attract loyal customers.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Metrics Overview */}
            <div className="grid md:grid-cols-4 gap-6">
              {metrics.map((metric, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">{metric.label}</h3>
                    <span className={`text-sm font-medium ${metric.color}`}>
                      {metric.change}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                </div>
              ))}
            </div>

            {/* GreenScore Chart */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">GreenScore Trends</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Interactive chart showing your sustainability metrics over time</p>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">AI-Powered Recommendations</h3>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{rec.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{rec.impact}</p>
                      <div className="flex space-x-4 text-xs">
                        <span className="text-blue-600">Difficulty: {rec.difficulty}</span>
                        <span className="text-purple-600">Cost: {rec.cost}</span>
                      </div>
                    </div>
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-medium text-sm">
                      Implement
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'features' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Comprehensive Sustainability Tools
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Everything you need to make your Amazon business more sustainable and profitable.
              </p>
            </div>

            {/* Feature Details */}
            <div className="space-y-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border p-8">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <div className="mb-4">{feature.icon}</div>
                      <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                      <p className="text-gray-600 mb-6">{feature.description}</p>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                          <span className="text-sm">Real-time monitoring</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                          <span className="text-sm">Automated reporting</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                          <span className="text-sm">Actionable insights</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                      <div className="text-center">
                        {feature.icon}
                        <p className="text-gray-600 mt-2">Feature Preview</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'community' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Join the Sustainable Seller Community
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Connect with like-minded sellers, share best practices, and learn from sustainability experts.
              </p>
            </div>

            {/* Community Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
                <div className="text-3xl font-bold text-green-600 mb-2">5,000+</div>
                <div className="text-gray-600">Active Sellers</div>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
                <div className="text-3xl font-bold text-blue-600 mb-2">1,200</div>
                <div className="text-gray-600">Best Practices Shared</div>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
                <div className="text-3xl font-bold text-purple-600 mb-2">85%</div>
                <div className="text-gray-600">Improved GreenScore</div>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
                <div className="text-3xl font-bold text-orange-600 mb-2">2.5M kg</div>
                <div className="text-gray-600">CO₂ Saved Together</div>
              </div>
            </div>

            {/* Success Stories */}
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <h3 className="text-xl font-semibold mb-6">Success Stories</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    name: 'EcoTech Solutions',
                    achievement: 'Reduced packaging waste by 60%',
                    quote: 'GreenBridge helped us identify packaging inefficiencies we never knew existed.',
                    image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100'
                  },
                  {
                    name: 'Sustainable Crafts Co.',
                    achievement: 'Earned Climate Pledge Friendly badge',
                    quote: 'The certification checklist made it easy to meet all sustainability requirements.',
                    image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100'
                  }
                ].map((story, index) => (
                  <div key={index} className="p-6 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-4">
                      <img
                        src={story.image}
                        alt={story.name}
                        className="w-12 h-12 rounded-full mr-4 object-cover"
                      />
                      <div>
                        <h4 className="font-semibold">{story.name}</h4>
                        <p className="text-sm text-green-600">{story.achievement}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 italic">"{story.quote}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Join Community CTA */}
            <div className="text-center bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Make Your Business More Sustainable?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Join thousands of sellers who are already using GreenBridge to reduce their environmental 
                impact while increasing their profits.
              </p>
              <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold inline-flex items-center">
                Start Your Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GreenBridgePage;