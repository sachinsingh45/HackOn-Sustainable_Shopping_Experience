import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Gift, 
  Heart, 
  Plus, 
  Search, 
  Filter, 
  Share2, 
  Download,
  Calendar,
  Users,
  Star,
  ShoppingCart,
  Eye,
  Edit,
  Trash2,
  Copy,
  Link,
  Mail,
  MessageCircle,
  Camera,
  Tag,
  Package,
  Truck,
  CreditCard,
  Shield,
  Award,
  Sparkles,
  Crown,
  Zap,
  Target,
  TrendingUp,
  Book,
  Gamepad,
  ChefHat,
  Home,
  Leaf
} from 'lucide-react';

const RegistryPage = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Categories', icon: Package },
    { id: 'kitchen', name: 'Kitchen & Dining', icon: ChefHat },
    { id: 'home', name: 'Home & Garden', icon: Home },
    { id: 'tech', name: 'Electronics', icon: Zap },
    { id: 'fashion', name: 'Fashion & Beauty', icon: Sparkles },
    { id: 'sports', name: 'Sports & Outdoors', icon: Target },
    { id: 'books', name: 'Books & Media', icon: Book },
    { id: 'toys', name: 'Toys & Games', icon: Gamepad }
  ];

  const sampleRegistries = [
    {
      id: 1,
      name: "Sarah & Mike's Wedding",
      date: "2024-08-15",
      type: "Wedding",
      items: 45,
      purchased: 12,
      budget: "$5,000",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop&crop=center"
    },
    {
      id: 2,
      name: "Baby Emma's Arrival",
      date: "2024-06-20",
      type: "Baby Shower",
      items: 32,
      purchased: 8,
      budget: "$3,000",
      image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=300&fit=crop&crop=center"
    },
    {
      id: 3,
      name: "Housewarming Party",
      date: "2024-07-10",
      type: "Housewarming",
      items: 28,
      purchased: 15,
      budget: "$2,500",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop&crop=center"
    }
  ];

  const popularItems = [
    {
      id: 1,
      name: "Eco-Friendly Kitchen Set",
      price: "$89.99",
      category: "Kitchen",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop&crop=center",
      rating: 4.8,
      reviews: 1247,
      sustainable: true
    },
    {
      id: 2,
      name: "Bamboo Bedding Set",
      price: "$129.99",
      category: "Home",
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=200&h=200&fit=crop&crop=center",
      rating: 4.9,
      reviews: 892,
      sustainable: true
    },
    {
      id: 3,
      name: "Solar Power Bank",
      price: "$49.99",
      category: "Electronics",
      image: "https://images.unsplash.com/photo-1609592806598-04d4d2d88548?w=200&h=200&fit=crop&crop=center",
      rating: 4.7,
      reviews: 567,
      sustainable: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <Gift className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-bold">Gift Registry</h1>
            </div>
            <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
              Create and manage your perfect gift registry for any special occasion
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">10M+</div>
                <div className="text-pink-100 text-sm">Registries Created</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">$2.5B</div>
                <div className="text-pink-100 text-sm">Gifts Purchased</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">500K+</div>
                <div className="text-pink-100 text-sm">Happy Couples</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-pink-100 text-sm">Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-white rounded-2xl p-2 shadow-lg mb-8 max-w-2xl mx-auto">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'create'
                ? 'bg-pink-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Create Registry
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'manage'
                ? 'bg-pink-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Edit className="w-4 h-4 inline mr-2" />
            Manage Registry
          </button>
          <button
            onClick={() => setActiveTab('find')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'find'
                ? 'bg-pink-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Search className="w-4 h-4 inline mr-2" />
            Find Registry
          </button>
        </div>

        {activeTab === 'create' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Create Registry Form */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Registry</h2>
                <p className="text-gray-600">Start building your perfect gift list</p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Registry Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                      placeholder="e.g., Sarah & Mike's Wedding"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Registry Type
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all">
                      <option>Wedding Registry</option>
                      <option>Baby Shower</option>
                      <option>Housewarming</option>
                      <option>Birthday</option>
                      <option>Anniversary</option>
                      <option>Graduation</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Event Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Budget Range
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all">
                      <option>$0 - $1,000</option>
                      <option>$1,000 - $3,000</option>
                      <option>$3,000 - $5,000</option>
                      <option>$5,000+</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none"
                      placeholder="Tell your guests about your special day..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-xl font-semibold hover:from-pink-600 hover:to-rose-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Create Registry
                  </button>
                </form>
              </div>
            </div>

            {/* Popular Items */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Popular Registry Items</h2>
                <p className="text-gray-600">Trending items loved by our community</p>
              </div>
              
              <div className="space-y-6">
                {popularItems.map((item) => (
                  <div key={item._id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200">
                    <div className="flex space-x-4">
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-xl"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop&crop=center';
                          }}
                        />
                        {item.sustainable && (
                          <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full">
                            <Leaf className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                            <p className="text-sm text-gray-500">{item.category}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900 text-lg">{item.price}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1 font-medium">{item.rating}</span>
                          </div>
                          <span className="text-sm text-gray-500">({item.reviews.toLocaleString()} reviews)</span>
                        </div>
                        
                        <button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-200 font-medium">
                          Add to Registry
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Manage Your Registries</h2>
              <p className="text-gray-600">Keep track of all your gift registries in one place</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sampleRegistries.map((registry) => (
                <div key={registry._id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-200">
                  <div className="relative">
                    <img
                      src={registry.image}
                      alt={registry.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop&crop=center';
                      }}
                    />
                    <div className="absolute top-4 left-4 bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {registry.type}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{registry.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(registry.date).toLocaleDateString()}
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Items:</span>
                        <span className="font-semibold">{registry.items}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Purchased:</span>
                        <span className="font-semibold text-green-600">{registry.purchased}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Budget:</span>
                        <span className="font-semibold">{registry.budget}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-200 text-sm font-medium">
                        <Edit className="w-4 h-4 inline mr-2" />
                        Edit
                      </button>
                      <button className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 text-sm font-medium">
                        <Share2 className="w-4 h-4 inline mr-2" />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'find' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Find a Registry</h2>
              <p className="text-gray-600">Search for someone's gift registry by name or email</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-2xl mx-auto">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Search by Name or Email
                  </label>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                      placeholder="Enter name or email address"
                    />
                    <button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-200">
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Filter by Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="text-center py-16">
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Search for Registries</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Enter a name or email address to find someone's gift registry and help make their special day even more memorable.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistryPage;
