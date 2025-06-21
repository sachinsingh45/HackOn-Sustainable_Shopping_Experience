import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Gift, 
  CreditCard, 
  ShoppingCart, 
  Search, 
  Filter, 
  Heart,
  Star,
  Download,
  Share2,
  Mail,
  MessageCircle,
  Calendar,
  Clock,
  DollarSign,
  Percent,
  Zap,
  Sparkles,
  Crown,
  Award,
  Target,
  TrendingUp,
  Users,
  Package,
  Truck,
  Shield,
  CheckCircle,
  Eye,
  Plus,
  Minus,
  ShoppingBag,
  Tag,
  Bookmark,
  Send,
  Copy,
  Link,
  QrCode,
  Smartphone,
  Monitor,
  Headphones,
  Camera,
  Gamepad,
  ChefHat,
  Home,
  Car,
  Plane,
  Coffee,
  Pizza,
  ShoppingBasket,
  Leaf,
  Recycle,
  Sun,
  Cloud,
  Droplets
} from 'lucide-react';

const GiftCardsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All Categories', icon: Gift, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { id: 'entertainment', name: 'Entertainment', icon: Gamepad, color: 'bg-gradient-to-r from-blue-500 to-purple-500' },
    { id: 'dining', name: 'Dining & Food', icon: ChefHat, color: 'bg-gradient-to-r from-orange-500 to-red-500' },
    { id: 'shopping', name: 'Shopping', icon: ShoppingBag, color: 'bg-gradient-to-r from-green-500 to-teal-500' },
    { id: 'travel', name: 'Travel', icon: Plane, color: 'bg-gradient-to-r from-indigo-500 to-blue-500' },
    { id: 'tech', name: 'Technology', icon: Smartphone, color: 'bg-gradient-to-r from-gray-500 to-black' },
    { id: 'beauty', name: 'Beauty & Health', icon: Sparkles, color: 'bg-gradient-to-r from-pink-500 to-rose-500' },
    { id: 'eco', name: 'Eco-Friendly', icon: Leaf, color: 'bg-gradient-to-r from-green-400 to-emerald-500' }
  ];

  const giftCards = [
    {
      id: 1,
      name: "Amazon.com",
      category: "shopping",
      image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=200&h=200&fit=crop",
      rating: 4.9,
      reviews: 15420,
      popular: true,
      sustainable: false,
      amounts: [25, 50, 100, 200, 500],
      description: "Shop millions of products with fast delivery"
    },
    {
      id: 2,
      name: "Starbucks",
      category: "dining",
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop",
      rating: 4.7,
      reviews: 8920,
      popular: true,
      sustainable: true,
      amounts: [10, 25, 50, 100],
      description: "Premium coffee and beverages"
    },
    {
      id: 3,
      name: "Netflix",
      category: "entertainment",
      image: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=200&h=200&fit=crop",
      rating: 4.8,
      reviews: 12340,
      popular: true,
      sustainable: false,
      amounts: [30, 60, 120],
      description: "Stream your favorite movies and shows"
    },
    {
      id: 4,
      name: "EcoStore",
      category: "eco",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop",
      rating: 4.9,
      reviews: 2340,
      popular: false,
      sustainable: true,
      amounts: [25, 50, 100, 200],
      description: "Sustainable and eco-friendly products"
    },
    {
      id: 5,
      name: "Apple Store",
      category: "tech",
      image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200&h=200&fit=crop",
      rating: 4.6,
      reviews: 5670,
      popular: true,
      sustainable: true,
      amounts: [25, 50, 100, 200, 500],
      description: "Latest technology and accessories"
    },
    {
      id: 6,
      name: "Sephora",
      category: "beauty",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop",
      rating: 4.5,
      reviews: 3450,
      popular: false,
      sustainable: false,
      amounts: [25, 50, 100, 200],
      description: "Beauty products and cosmetics"
    }
  ];

  const filteredCards = giftCards.filter(card => {
    const matchesCategory = selectedCategory === 'all' || card.category === selectedCategory;
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const popularCards = giftCards.filter(card => card.popular);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Gift className="w-10 h-10" />
              <h1 className="text-4xl font-bold">Gift Cards</h1>
            </div>
            <p className="text-xl text-purple-100 mb-8">
              Give the perfect gift with our wide selection of digital and physical gift cards
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-purple-100 text-sm">Brands Available</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl font-bold">Instant</div>
                <div className="text-purple-100 text-sm">Digital Delivery</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl font-bold">Secure</div>
                <div className="text-purple-100 text-sm">Payment Processing</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-purple-100 text-sm">Customer Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Gift Cards
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Search by brand name..."
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <select
                value={selectedAmount}
                onChange={(e) => setSelectedAmount(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value={25}>$25</option>
                <option value={50}>$50</option>
                <option value={100}>$100</option>
                <option value={200}>$200</option>
                <option value={500}>$500</option>
              </select>
            </div>
          </div>
        </div>

        {/* Popular Gift Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Gift Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCards.map((card) => (
              <div key={card._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img
                    src={card.image}
                    alt={card.name}
                    className="w-full h-48 object-cover"
                  />
                  {card.popular && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Popular
                    </div>
                  )}
                  {card.sustainable && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Eco-Friendly
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-2">{card.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{card.description}</p>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{card.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({card.reviews.toLocaleString()} reviews)</span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="text-sm text-gray-600">Available amounts:</div>
                    <div className="flex flex-wrap gap-2">
                      {card.amounts.map((amount) => (
                        <span
                          key={amount}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            amount === selectedAmount
                              ? 'bg-purple-500 text-white'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          ${amount}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition-colors font-semibold">
                    Buy Gift Card
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Gift Cards */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Gift Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCards.map((card) => (
              <div key={card._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img
                    src={card.image}
                    alt={card.name}
                    className="w-full h-40 object-cover"
                  />
                  {card.popular && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Popular
                    </div>
                  )}
                  {card.sustainable && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Eco
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{card.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">{card.description}</p>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-600">{card.rating}</span>
                    <span className="text-xs text-gray-500">({card.reviews.toLocaleString()})</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {card.amounts.slice(0, 3).map((amount) => (
                      <span
                        key={amount}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          amount === selectedAmount
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        ${amount}
                      </span>
                    ))}
                    {card.amounts.length > 3 && (
                      <span className="px-2 py-1 rounded text-xs text-gray-500">+{card.amounts.length - 3} more</span>
                    )}
                  </div>
                  
                  <button className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium">
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Delivery</h3>
            <p className="text-gray-600">Digital gift cards are delivered instantly via email</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Safe</h3>
            <p className="text-gray-600">All transactions are encrypted and secure</p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Perfect Gift</h3>
            <p className="text-gray-600">Let them choose exactly what they want</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftCardsPage;
