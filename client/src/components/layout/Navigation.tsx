import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Leaf, Users, Zap, Award, TrendingUp, Camera, Sparkles, Store, Target, Calculator, Gift } from 'lucide-react';
import MaterialInfoScanner from '../common/biodegradable';

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showGreenLens, setShowGreenLens] = useState(false);

  const categories = [
    'Electronics',
    'Fashion',
    'Home & Kitchen',
    'Books',
    'Sports',
    'Beauty',
    'Automotive',
    'Health'
  ];

  const greenFeatures = [
    { icon: Camera, label: 'Green Lens', path: null, description: 'Analyze sustainability', action: () => setShowGreenLens(true) },
    { icon: Store, label: 'Green Store', path: '/green-store', description: 'Eco-friendly products' },
    { icon: Users, label: 'Group Buy', path: '/group-buy', description: 'Collective purchasing' },
    { icon: Award, label: 'Eco Challenges', path: '/challenges', description: 'Sustainability challenges' },
    { icon: TrendingUp, label: 'GreenBridge', path: '/greenbridge', description: 'Seller analytics' }
  ];

  const sustainableShoppingLinks = [
    { icon: Store, label: 'Green Store', path: '/green-store', description: 'Eco-friendly products' },
    { icon: Target, label: 'Eco Recommendations', path: '/eco-recommendations', description: 'Personalized suggestions' },
    { icon: Users, label: 'Group Buy Options', path: '/group-buy', description: 'Collective purchasing' },
    { icon: Calculator, label: 'Carbon Calculator', path: '/carbon-calculator', description: 'Calculate your impact' },
    { icon: Gift, label: 'Eco Rewards', path: '/eco-rewards', description: 'Green loyalty program' }
  ];

  const handleGreenLensClick = () => {
    setShowGreenLens(true);
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-10">
          {/* Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center space-x-2 hover:bg-gray-700 px-2 py-1 rounded transition-colors flex-shrink-0"
          >
            <Menu className="w-4 h-4" />
            <span className="text-sm font-medium">All</span>
          </button>

          {/* Horizontal Scrollable Navigation */}
          <div className="flex items-center space-x-6 text-sm overflow-x-auto scrollbar-hide flex-1 ml-4">
            <Link to="/todays-deals" className="hover:bg-gray-700 px-2 py-1 rounded transition-colors whitespace-nowrap flex-shrink-0">
              Today's Deals
            </Link>
            <Link to="/sell" className="hover:bg-gray-700 px-2 py-1 rounded transition-colors whitespace-nowrap flex-shrink-0">
              Sell on Amazon
            </Link>
            <Link to="/customer-service" className="hover:bg-gray-700 px-2 py-1 rounded transition-colors whitespace-nowrap flex-shrink-0">
              Customer Service
            </Link>
            <Link to="/registry" className="hover:bg-gray-700 px-2 py-1 rounded transition-colors whitespace-nowrap flex-shrink-0">
              Registry
            </Link>
            <Link to="/gift-cards" className="hover:bg-gray-700 px-2 py-1 rounded transition-colors whitespace-nowrap flex-shrink-0">
              Gift Cards
            </Link>
            
            {/* Green Features */}
            {greenFeatures.map(({ icon: Icon, label, path, description, action }) => (
              path ? (
                <Link
                  key={path}
                  to={path}
                  className="flex items-center space-x-2 text-green-400 hover:text-green-300 hover:bg-green-900 hover:bg-opacity-20 px-3 py-1.5 rounded-md transition-all duration-200 whitespace-nowrap flex-shrink-0"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{label}</span>
                </Link>
              ) : (
                <button
                  key={label}
                  onClick={action}
                  className="flex items-center space-x-2 text-green-400 hover:text-green-300 hover:bg-green-900 hover:bg-opacity-20 px-3 py-1.5 rounded-md transition-all duration-200 whitespace-nowrap flex-shrink-0"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Green Lens Modal */}
      {showGreenLens && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Green Lens Analysis</h2>
                    <p className="text-green-100 text-sm">Analyze product sustainability</p>
                  </div>
                </div>
                <button
                  className="text-white hover:text-gray-200 transition-colors"
                  onClick={() => setShowGreenLens(false)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <MaterialInfoScanner />
            </div>
          </div>
        </div>
      )}

      {/* Slide-out Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMenuOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-80 bg-white text-gray-900 shadow-lg overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Browse</h2>
                <button 
                  onClick={() => setMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-gray-800">Shop by Category</h3>
                <div className="space-y-1">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      to={`/category/${category.toLowerCase()}`}
                      className="block py-2 px-3 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
                      onClick={() => setMenuOpen(false)}
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Green Store Section */}
              <div className="mb-6 p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-200">
                <h3 className="font-semibold mb-4 text-green-800 flex items-center">
                  <Leaf className="w-5 h-5 mr-2" />
                  Sustainable Shopping
                </h3>
                
                <div className="space-y-2">
                  {sustainableShoppingLinks.map(({ icon: Icon, label, path, description }) => (
                    <Link
                      key={path}
                      to={path}
                      className="flex items-center space-x-3 p-3 hover:bg-green-100 rounded-lg text-green-700 transition-all duration-200 group"
                      onClick={() => setMenuOpen(false)}
                    >
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <Icon className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-green-800">{label}</div>
                        <div className="text-xs text-green-600">{description}</div>
                      </div>
                    </Link>
                  ))}
                  
                  {/* Green Lens Button in Menu */}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setShowGreenLens(true);
                    }}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-green-100 rounded-lg text-green-700 transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <Camera className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-green-800">Green Lens Analysis</div>
                      <div className="text-xs text-green-600">Analyze sustainability</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Programs and Features */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-gray-800">Programs & Features</h3>
                <div className="space-y-1">
                  <Link
                    to="/shop-by-interest"
                    className="block py-2 px-3 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    Shop by Interest
                  </Link>
                  <Link
                    to="/amazon-prime"
                    className="block py-2 px-3 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    Amazon Prime
                  </Link>
                  <Link
                    to="/amazon-business"
                    className="block py-2 px-3 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    Amazon Business
                  </Link>
                </div>
              </div>

              {/* Help & Settings */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3 text-gray-800">Help & Settings</h3>
                <div className="space-y-1">
                  <Link
                    to="/customer-service"
                    className="block py-2 px-3 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    Customer Service
                  </Link>
                  <Link
                    to="/settings"
                    className="block py-2 px-3 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    Settings
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;