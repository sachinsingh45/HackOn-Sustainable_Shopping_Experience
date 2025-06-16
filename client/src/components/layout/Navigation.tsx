import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Leaf, Users, Zap, Award, TrendingUp } from 'lucide-react';

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);

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
    { icon: Leaf, label: 'Green Store', path: '/green-store' },
    { icon: Users, label: 'Group Buy', path: '/group-buy' },
    { icon: Award, label: 'Eco Challenges', path: '/challenges' },
    { icon: TrendingUp, label: 'GreenBridge', path: '/greenbridge' }
  ];

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-10">
          {/* Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center space-x-2 hover:border-white border border-transparent px-2 py-1"
          >
            <Menu className="w-4 h-4" />
            <span className="text-sm font-semibold">All</span>
          </button>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6 text-sm">
            <Link to="/todays-deals" className="hover:border-white border border-transparent px-2 py-1">
              Today's Deals
            </Link>
            <Link to="/sell" className="hover:border-white border border-transparent px-2 py-1">
              Sell on Amazon
            </Link>
            <Link to="/customer-service" className="hover:border-white border border-transparent px-2 py-1">
              Customer Service
            </Link>
            <Link to="/registry" className="hover:border-white border border-transparent px-2 py-1">
              Registry
            </Link>
            <Link to="/gift-cards" className="hover:border-white border border-transparent px-2 py-1">
              Gift Cards
            </Link>
          </div>

          {/* Green Features */}
          <div className="hidden md:flex items-center space-x-4">
            {greenFeatures.map(({ icon: Icon, label, path }) => (
              <Link
                key={path}
                to={path}
                className="flex items-center space-x-1 text-green-400 hover:text-green-300 text-sm"
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Slide-out Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMenuOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-80 bg-white text-gray-900 shadow-lg overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Browse</h2>
                <button onClick={() => setMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Shop by Category</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      to={`/category/${category.toLowerCase()}`}
                      className="block py-2 hover:bg-gray-100 px-2 rounded"
                      onClick={() => setMenuOpen(false)}
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Green Store Section */}
              <div className="mb-6 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                <h3 className="font-semibold mb-3 text-green-800 flex items-center">
                  <Leaf className="w-5 h-5 mr-2" />
                  Sustainable Shopping
                </h3>
                <div className="space-y-2">
                  <Link
                    to="/green-store"
                    className="block py-2 hover:bg-green-100 px-2 rounded text-green-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    Green Store
                  </Link>
                  <Link
                    to="/eco-recommendations"
                    className="block py-2 hover:bg-green-100 px-2 rounded text-green-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    Personalized Green Recommendations
                  </Link>
                  <Link
                    to="/group-buy"
                    className="block py-2 hover:bg-green-100 px-2 rounded text-green-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    Group Buy Options
                  </Link>
                  <Link
                    to="/carbon-calculator"
                    className="block py-2 hover:bg-green-100 px-2 rounded text-green-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    Carbon Calculator
                  </Link>
                </div>
              </div>

              {/* Programs and Features */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Programs & Features</h3>
                <div className="space-y-2">
                  <Link
                    to="/shop-by-interest"
                    className="block py-2 hover:bg-gray-100 px-2 rounded"
                    onClick={() => setMenuOpen(false)}
                  >
                    Shop by Interest
                  </Link>
                  <Link
                    to="/amazon-prime"
                    className="block py-2 hover:bg-gray-100 px-2 rounded"
                    onClick={() => setMenuOpen(false)}
                  >
                    Amazon Prime
                  </Link>
                  <Link
                    to="/amazon-business"
                    className="block py-2 hover:bg-gray-100 px-2 rounded"
                    onClick={() => setMenuOpen(false)}
                  >
                    Amazon Business
                  </Link>
                </div>
              </div>

              {/* Help & Settings */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Help & Settings</h3>
                <div className="space-y-2">
                  <Link
                    to="/customer-service"
                    className="block py-2 hover:bg-gray-100 px-2 rounded"
                    onClick={() => setMenuOpen(false)}
                  >
                    Customer Service
                  </Link>
                  <Link
                    to="/settings"
                    className="block py-2 hover:bg-gray-100 px-2 rounded"
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