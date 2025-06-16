import React, { useState } from 'react';
import { Store, TrendingUp, Users, Package, ArrowRight, CheckCircle, Leaf, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const SellOnAmazonPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const benefits = [
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: 'Reach Millions of Customers',
      description: 'Access to over 400 million customers across India and globally'
    },
    {
      icon: <Package className="w-8 h-8 text-green-600" />,
      title: 'Fulfillment by Amazon',
      description: 'Let us handle storage, packaging, and delivery for you'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
      title: 'Grow Your Business',
      description: 'Scale your business with our advertising and analytics tools'
    },
    {
      icon: <Leaf className="w-8 h-8 text-green-600" />,
      title: 'Go Green with GreenBridge',
      description: 'Get sustainability insights and eco-friendly certifications'
    }
  ];

  const steps = [
    {
      step: 1,
      title: 'Create Your Account',
      description: 'Sign up for a seller account and provide your business information'
    },
    {
      step: 2,
      title: 'List Your Products',
      description: 'Add your products with detailed descriptions and high-quality images'
    },
    {
      step: 3,
      title: 'Set Up Fulfillment',
      description: 'Choose between self-fulfillment or Fulfillment by Amazon (FBA)'
    },
    {
      step: 4,
      title: 'Start Selling',
      description: 'Launch your products and start reaching customers immediately'
    }
  ];

  const pricingPlans = [
    {
      name: 'Individual',
      price: '₹0',
      period: 'monthly fee',
      features: [
        'Sell up to 40 items per month',
        '₹25 per item sold',
        'Basic selling tools',
        'Customer support'
      ],
      recommended: false
    },
    {
      name: 'Professional',
      price: '₹999',
      period: 'per month',
      features: [
        'Unlimited items',
        'No per-item fee',
        'Advanced selling tools',
        'Bulk listing tools',
        'API access',
        'GreenBridge analytics'
      ],
      recommended: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Sell on Amazon
              </h1>
              <p className="text-xl mb-8 text-orange-100">
                Start your business journey with India's most trusted e-commerce platform. 
                Reach millions of customers and grow your business with our powerful tools.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center">
                  Start Selling Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors">
                  Watch Demo
                </button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img
                src="https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Selling on Amazon"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-4 -left-4 bg-white text-gray-900 p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <Store className="w-6 h-6 text-orange-500" />
                  <div>
                    <div className="font-semibold">2M+ Sellers</div>
                    <div className="text-sm text-gray-600">Trust Amazon</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'benefits', label: 'Benefits' },
              { id: 'pricing', label: 'Pricing' },
              { id: 'getting-started', label: 'Getting Started' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
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
            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
                <div className="text-3xl font-bold text-orange-600 mb-2">400M+</div>
                <div className="text-gray-600">Active Customers</div>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
                <div className="text-3xl font-bold text-blue-600 mb-2">2M+</div>
                <div className="text-gray-600">Sellers Worldwide</div>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
                <div className="text-3xl font-bold text-green-600 mb-2">185+</div>
                <div className="text-gray-600">Countries Served</div>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
                <div className="text-3xl font-bold text-purple-600 mb-2">₹50K+</div>
                <div className="text-gray-600">Avg Monthly Revenue</div>
              </div>
            </div>

            {/* Success Stories */}
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <h2 className="text-2xl font-bold text-center mb-8">Success Stories</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    name: 'Rajesh Kumar',
                    business: 'Handmade Crafts',
                    growth: '300% increase in sales',
                    image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150'
                  },
                  {
                    name: 'Priya Sharma',
                    business: 'Organic Foods',
                    growth: '₹5L monthly revenue',
                    image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150'
                  },
                  {
                    name: 'Tech Solutions Ltd',
                    business: 'Electronics',
                    growth: 'Expanded to 15 cities',
                    image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150'
                  }
                ].map((story, index) => (
                  <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                    <img
                      src={story.image}
                      alt={story.name}
                      className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="font-semibold mb-1">{story.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{story.business}</p>
                    <p className="text-sm font-medium text-green-600">{story.growth}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'benefits' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Sell on Amazon?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Join millions of sellers who trust Amazon to grow their business and reach customers worldwide.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-lg shadow-sm border"
                >
                  <div className="mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </motion.div>
              ))}
            </div>

            {/* GreenBridge Feature */}
            <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-8">
              <div className="flex items-center mb-4">
                <Leaf className="w-8 h-8 text-green-600 mr-3" />
                <h3 className="text-2xl font-bold text-green-800">
                  Introducing GreenBridge for Sellers
                </h3>
              </div>
              <p className="text-green-700 mb-6">
                Get detailed analytics on your products' environmental impact, receive AI-powered 
                sustainability recommendations, and earn green certifications to attract eco-conscious customers.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-green-600 mb-2" />
                  <h4 className="font-semibold mb-1">GreenScore Analytics</h4>
                  <p className="text-sm text-gray-600">Track packaging waste, carbon footprint, and recyclability</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-blue-600 mb-2" />
                  <h4 className="font-semibold mb-1">Eco Certifications</h4>
                  <p className="text-sm text-gray-600">Earn Climate Pledge Friendly and other green badges</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600 mb-2" />
                  <h4 className="font-semibold mb-1">Community Hub</h4>
                  <p className="text-sm text-gray-600">Share best practices with other sustainable sellers</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'pricing' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Choose the plan that works best for your business. No hidden fees, no long-term contracts.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-lg shadow-sm border-2 p-8 relative ${
                    plan.recommended ? 'border-orange-500' : 'border-gray-200'
                  }`}
                >
                  {plan.recommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Recommended
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="text-4xl font-bold text-gray-900 mb-1">{plan.price}</div>
                    <div className="text-gray-600">{plan.period}</div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                      plan.recommended
                        ? 'bg-orange-500 hover:bg-orange-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    Get Started
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'getting-started' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Start Selling in 4 Easy Steps
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Get your business up and running on Amazon in just a few simple steps.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start mb-8">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg mr-6">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center">
                Start Your Seller Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SellOnAmazonPage;