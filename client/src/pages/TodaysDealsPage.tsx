import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Star, Truck, Tag, Filter, Search, ArrowRight, Flame, TrendingUp, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';
import ProductCard from '../components/common/ProductCard';

const TodaysDealsPage = () => {
  const { products } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('discount');

  const categories = [
    { id: 'all', name: 'All Deals', icon: Flame, color: 'bg-red-500' },
    { id: 'electronics', name: 'Electronics', icon: Zap, color: 'bg-blue-500' },
    { id: 'fashion', name: 'Fashion', icon: TrendingUp, color: 'bg-purple-500' },
    { id: 'home', name: 'Home & Kitchen', icon: Truck, color: 'bg-green-500' },
    { id: 'beauty', name: 'Beauty', icon: Star, color: 'bg-pink-500' },
    { id: 'sports', name: 'Sports', icon: TrendingUp, color: 'bg-orange-500' }
  ];

  // Use only real product data from backend
  const deals = products;

  const filteredDeals = deals.filter(deal => 
    selectedCategory === 'all' || deal.category?.toLowerCase() === selectedCategory
  );

  const sortedDeals = [...filteredDeals].sort((a, b) => {
    switch (sortBy) {
      case 'discount':
        // Sort by discount if available, otherwise 0
        const discountA = a.discount ? parseInt(String(a.discount).replace(/[-%]/g, '')) : 0;
        const discountB = b.discount ? parseInt(String(b.discount).replace(/[-%]/g, '')) : 0;
        return discountB - discountA;
      case 'price':
        return parseFloat(a.price.replace(/[^0-9.]/g, '')) - parseFloat(b.price.replace(/[^0-9.]/g, ''));
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-3 mb-4">
            <Flame className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Today's Deals</h1>
          </div>
          <p className="text-orange-100 text-lg">
            Limited time offers on thousands of products. Don't miss out!
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-red-500" />
                <span>Deals end in 24 hours</span>
              </div>
              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4 text-green-500" />
                <span>{deals.length} active deals</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="discount">Sort by Discount</option>
                <option value="price">Sort by Price</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                  selectedCategory === category.id
                    ? 'bg-orange-500 text-white shadow-lg'
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

      {/* Featured Deal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-8 text-white mb-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Flame className="w-6 h-6" />
                <span className="text-lg font-semibold">Deal of the Day</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">Up to 70% Off Electronics</h2>
              <p className="text-red-100 mb-6">
                Premium electronics at unbeatable prices. Limited time offer!
              </p>
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                  <div className="text-sm text-red-100">Time Left</div>
                  <div className="text-xl font-bold">12:34:56</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                  <div className="text-sm text-red-100">Items Sold</div>
                  <div className="text-xl font-bold">2,847</div>
                </div>
              </div>
              <button className="bg-white text-red-500 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Shop Now
              </button>
            </div>
            <div className="relative">
              <div className="bg-white bg-opacity-20 rounded-lg p-6">
                <div className="text-center">
                  <div className="text-6xl font-bold mb-2">70%</div>
                  <div className="text-lg">OFF</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {sortedDeals.slice(0, 12).map((deal) => (
            <ProductCard key={deal._id} product={deal} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold">
            Load More Deals
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodaysDealsPage; 