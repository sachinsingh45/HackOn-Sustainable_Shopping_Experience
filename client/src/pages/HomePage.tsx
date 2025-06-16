import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Users, Award, TrendingUp, Star, Truck, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import ProductCard from '../components/common/ProductCard';

const HomePage = () => {
  const { products, user } = useStore();

  const categories = [
    { name: 'Green Electronics', icon: '📱', count: '2,400+ items', color: 'bg-blue-100 text-blue-800' },
    { name: 'Sustainable Fashion', icon: '👕', count: '5,600+ items', color: 'bg-green-100 text-green-800' },
    { name: 'Eco Home & Garden', icon: '🏡', count: '3,200+ items', color: 'bg-yellow-100 text-yellow-800' },
    { name: 'Organic Beauty', icon: '🧴', count: '1,800+ items', color: 'bg-pink-100 text-pink-800' },
    { name: 'Zero Waste Kitchen', icon: '🍽️', count: '1,200+ items', color: 'bg-purple-100 text-purple-800' },
    { name: 'Green Books', icon: '📚', count: '900+ items', color: 'bg-indigo-100 text-indigo-800' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Shop Smart, 
                <span className="block text-green-300">Shop Sustainable</span>
              </h1>
              <p className="text-xl mb-8 text-green-100">
                Discover eco-friendly products, reduce your carbon footprint, and join millions in creating a sustainable future.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/green-store"
                  className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
                >
                  Explore Green Store
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
                  Calculate Your Impact
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
                src="https://images.pexels.com/photos/3738673/pexels-photo-3738673.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Sustainable Shopping"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-4 -left-4 bg-white text-gray-900 p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <Leaf className="w-6 h-6 text-green-500" />
                  <div>
                    <div className="font-semibold">75 kg CO₂ saved</div>
                    <div className="text-sm text-gray-600">This month</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* User Dashboard Quick Stats */}
      {user && (
        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{user.ecoScore || 75}</div>
                <div className="text-sm text-gray-600">Eco Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{user.carbonSaved || 125} kg</div>
                <div className="text-sm text-gray-600">CO₂ Saved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">₹{user.moneySaved || 2400}</div>
                <div className="text-sm text-gray-600">Money Saved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{user.circularityScore || 82}%</div>
                <div className="text-sm text-gray-600">Circularity</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Green Features */}
      <section className="bg-green-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Sustainable Shopping Features
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: <Leaf className="w-8 h-8 text-green-600" />,
                title: 'Green Lens',
                description: 'Scan products to see their environmental impact',
                link: '/green-lens'
              },
              {
                icon: <Users className="w-8 h-8 text-blue-600" />,
                title: 'Group Buy',
                description: 'Save money and planet with collective orders',
                link: '/group-buy'
              },
              {
                icon: <Award className="w-8 h-8 text-yellow-600" />,
                title: 'Eco Challenges',
                description: 'Monthly challenges for sustainable living',
                link: '/challenges'
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
                title: 'GreenBridge',
                description: 'Help sellers go green with analytics',
                link: '/greenbridge'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <Link
                  to={feature.link}
                  className="text-green-600 hover:text-green-700 font-medium inline-flex items-center"
                >
                  Learn more <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Today's Deals */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Today's Green Deals</h2>
            <Link
              to="/deals"
              className="text-green-600 hover:text-green-700 font-medium inline-flex items-center"
            >
              See all deals <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Shop by Green Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="text-center group cursor-pointer"
              >
                <div className="bg-gray-50 group-hover:bg-gray-100 rounded-lg p-6 transition-colors">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold mb-1 text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.count}</p>
                  <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs ${category.color}`}>
                    Eco-Friendly
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Products */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">
            Personalized Green Recommendations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.slice(8, 12).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white py-8 border-t">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: <Truck className="w-8 h-8 mx-auto mb-2 text-blue-600" />, text: 'Carbon-Neutral Delivery' },
              { icon: <Shield className="w-8 h-8 mx-auto mb-2 text-green-600" />, text: 'Verified Eco Products' },
              { icon: <Star className="w-8 h-8 mx-auto mb-2 text-yellow-600" />, text: '4.8/5 Customer Rating' },
              { icon: <Users className="w-8 h-8 mx-auto mb-2 text-purple-600" />, text: '2M+ Green Shoppers' }
            ].map((badge, index) => (
              <div key={index} className="text-center">
                {badge.icon}
                <p className="text-sm font-medium text-gray-900">{badge.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;