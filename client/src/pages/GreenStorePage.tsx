import React, { useState } from 'react';
import { Leaf, Filter, Star, Users, Package, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import ProductCard from '../components/common/ProductCard';

const GreenStorePage = () => {
  const { products, addToCart } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('eco-score');
  const [priceRange, setPriceRange] = useState([0, 10000]);

  // Calculate category counts
  const categoryCounts = products.reduce((acc, product) => {
    const category = product.category?.toLowerCase() || 'general';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const categories = [
    { id: 'all', name: 'All Green Products', count: products.length },
    { id: 'electronics', name: 'Green Electronics', count: categoryCounts['electronics'] || 0 },
    { id: 'fashion', name: 'Sustainable Fashion', count: categoryCounts['fashion'] || 0 },
    { id: 'home', name: 'Eco Home & Garden', count: categoryCounts['home'] || 0 },
    { id: 'beauty', name: 'Organic Beauty', count: categoryCounts['beauty'] || 0 },
    { id: 'books', name: 'Eco Books', count: categoryCounts['books'] || 0 }
  ];

  const sortOptions = [
    { value: 'eco-score', label: 'Highest Eco Score' },
    { value: 'carbon-footprint', label: 'Lowest Carbon Footprint' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Rating' }
  ];

  const filteredProducts = products
    .filter(product => product.isEcoFriendly)
    .filter(product => {
      if (selectedCategory === 'all') return true;
      return product.category?.toLowerCase() === selectedCategory;
    })
    .filter(product => {
      const price = parseFloat(product.price.replace(/[^0-9.]/g, ''));
      return price >= priceRange[0] && price <= priceRange[1];
    })
    .sort((a, b) => {
      const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ''));
      const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ''));
      
      switch (sortBy) {
        case 'eco-score':
          return (b.ecoScore || 0) - (a.ecoScore || 0);
        case 'carbon-footprint':
          return (a.carbonFootprint || 0) - (b.carbonFootprint || 0);
        case 'price-low':
          return priceA - priceB;
        case 'price-high':
          return priceB - priceA;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center mb-4"
            >
              <Leaf className="w-12 h-12 mr-3" />
              <h1 className="text-4xl md:text-6xl font-bold">Green Store</h1>
            </motion.div>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Discover curated eco-friendly products that help you live sustainably while saving money and the planet.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold">2,400+</div>
                <div className="text-green-200">Eco Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">95%</div>
                <div className="text-green-200">Customer Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50 kg</div>
                <div className="text-green-200">Avg CO₂ Saved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">₹2,500</div>
                <div className="text-green-200">Avg Money Saved</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </h3>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-green-100 text-green-800'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{category.name}</span>
                        <span className="text-gray-500">({category.count})</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Eco Features */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Eco Features</h4>
                <div className="space-y-2">
                  {[
                    'Biodegradable',
                    'Recycled Materials',
                    'Carbon Neutral',
                    'Fair Trade',
                    'Organic',
                    'Renewable Energy'
                  ].map((feature) => (
                    <label key={feature} className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Sort and Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredProducts.length} Green Products
                </h2>
                <p className="text-gray-600">
                  Showing eco-friendly products sorted by {sortOptions.find(opt => opt.value === sortBy)?.label.toLowerCase()}
                </p>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Featured Green Products */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-2 text-green-800">
                  🌟 Featured Sustainable Products
                </h3>
                <p className="text-green-700">
                  Hand-picked products with the highest environmental impact and customer satisfaction ratings.
                </p>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Leaf className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters to see more eco-friendly products.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Green Impact Section */}
        <section className="mt-16 bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your Green Shopping Impact
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every purchase in our Green Store contributes to a more sustainable future. 
              Here's the collective impact of our community.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-green-600 mb-2">2.5M kg</div>
              <div className="text-gray-700">CO₂ Emissions Avoided</div>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <Package className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-blue-600 mb-2">150K</div>
              <div className="text-gray-700">Plastic Packages Avoided</div>
            </div>
            <div className="text-center p-6 bg-yellow-50 rounded-lg">
              <Users className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-yellow-600 mb-2">50K+</div>
              <div className="text-gray-700">Green Shoppers</div>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <Star className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-purple-600 mb-2">4.8/5</div>
              <div className="text-gray-700">Average Eco Rating</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GreenStorePage;