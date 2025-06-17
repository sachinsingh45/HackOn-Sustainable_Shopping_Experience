import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  HelpCircle, 
  Search, 
  ArrowRight, 
  Clock, 
  Shield, 
  Truck, 
  CreditCard, 
  Package, 
  User,
  Star,
  FileText,
  Settings,
  Globe,
  Users,
  Play,
  Smartphone
} from 'lucide-react';

const CustomerServicePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const helpCategories = [
    {
      id: 'orders',
      name: 'Orders & Shipping',
      icon: Package,
      color: 'bg-blue-500',
      description: 'Track orders, shipping info, returns'
    },
    {
      id: 'payments',
      name: 'Payments & Billing',
      icon: CreditCard,
      color: 'bg-green-500',
      description: 'Payment methods, billing issues'
    },
    {
      id: 'returns',
      name: 'Returns & Refunds',
      icon: ArrowRight,
      color: 'bg-orange-500',
      description: 'Return policies, refund status'
    },
    {
      id: 'account',
      name: 'Account & Security',
      icon: User,
      color: 'bg-purple-500',
      description: 'Account settings, security'
    },
    {
      id: 'prime',
      name: 'Amazon Prime',
      icon: Star,
      color: 'bg-yellow-500',
      description: 'Prime membership, benefits'
    },
    {
      id: 'technical',
      name: 'Technical Support',
      icon: Settings,
      color: 'bg-red-500',
      description: 'App issues, website problems'
    }
  ];

  const quickActions = [
    {
      title: 'Track Your Order',
      description: 'Check the status of your recent orders',
      icon: Package,
      color: 'bg-blue-100 text-blue-600',
      action: () => console.log('Track order')
    },
    {
      title: 'Start a Return',
      description: 'Return items you\'re not satisfied with',
      icon: ArrowRight,
      color: 'bg-orange-100 text-orange-600',
      action: () => console.log('Start return')
    },
    {
      title: 'Contact Us',
      description: 'Get help from our customer service team',
      icon: MessageCircle,
      color: 'bg-green-100 text-green-600',
      action: () => console.log('Contact us')
    },
    {
      title: 'Help Center',
      description: 'Browse our comprehensive help articles',
      icon: HelpCircle,
      color: 'bg-purple-100 text-purple-600',
      action: () => console.log('Help center')
    }
  ];

  const contactMethods = [
    {
      title: 'Live Chat',
      description: 'Chat with us 24/7',
      icon: MessageCircle,
      color: 'bg-green-500',
      availability: 'Available now',
      action: () => console.log('Live chat')
    },
    {
      title: 'Phone Support',
      description: 'Call us for immediate help',
      icon: Phone,
      color: 'bg-blue-500',
      availability: '24/7',
      action: () => console.log('Phone support')
    },
    {
      title: 'Email Support',
      description: 'Send us an email',
      icon: Mail,
      color: 'bg-purple-500',
      availability: 'Response within 24h',
      action: () => console.log('Email support')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <MessageCircle className="w-10 h-10" />
              <h1 className="text-4xl font-bold">Customer Service</h1>
            </div>
            <p className="text-xl text-blue-100 mb-8">
              We're here to help you with any questions or concerns
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="How can we help you today?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={action.action}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${action.color}`}>
                <action.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-gray-600 text-sm">{action.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Help Categories */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Help Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {helpCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${category.color} text-white`}>
                <category.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{category.description}</p>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
                Learn more <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Contact Methods */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactMethods.map((method, index) => (
            <motion.div
              key={method.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={method.action}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer text-center"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${method.color} text-white`}>
                <method.icon className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{method.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{method.description}</p>
              <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
                <Clock className="w-4 h-4" />
                <span>{method.availability}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {[
            {
              question: "How do I track my order?",
              answer: "You can track your order by going to 'Your Orders' in your account or using the tracking number provided in your order confirmation email."
            },
            {
              question: "What is your return policy?",
              answer: "Most items can be returned within 30 days of delivery. Some items have different return windows. Check the product page for specific return information."
            },
            {
              question: "How do I cancel my Amazon Prime membership?",
              answer: "You can cancel your Prime membership by going to Account & Lists > Prime > Manage Membership > End Membership."
            },
            {
              question: "What payment methods do you accept?",
              answer: "We accept credit cards, debit cards, UPI, net banking, and digital wallets like Paytm and PhonePe."
            }
          ].map((faq, index) => (
            <div key={index} className="border-b border-gray-200 last:border-b-0">
              <button className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{faq.question}</h3>
                  <ArrowRight className="w-5 h-5 text-gray-400 transform rotate-90" />
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Resources */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Help Center', icon: HelpCircle, color: 'bg-blue-100 text-blue-600' },
            { title: 'Community Forum', icon: Users, color: 'bg-green-100 text-green-600' },
            { title: 'Video Tutorials', icon: Play, color: 'bg-purple-100 text-purple-600' },
            { title: 'Download App', icon: Smartphone, color: 'bg-orange-100 text-orange-600' }
          ].map((resource, index) => (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer text-center"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 ${resource.color}`}>
                <resource.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900">{resource.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerServicePage; 