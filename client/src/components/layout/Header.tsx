import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, MapPin, Leaf, Menu, X, Search } from 'lucide-react';
import { useStore } from '../../store/useStore';
import SearchBar from '../common/SearchBar';

const Header = () => {
  const { cart, user, logout } = useStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <header className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Mobile Header */}
        <div className="flex items-center justify-between h-16 lg:hidden">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-1 p-2">
            <img
              src="/logo.png"
              alt="Amazon Logo"
              className="w-20 h-auto object-contain"
            />
            <Leaf className="w-4 h-4 text-green-400" />
          </Link>

          {/* Mobile Search Button */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
          >
            <Search className="w-6 h-6" />
          </button>

          {/* Mobile Cart */}
          <Link to="/cart" className="relative p-2 hover:bg-gray-700 rounded transition-colors">
            <ShoppingCart className="w-6 h-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-400 text-gray-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="lg:hidden pb-4">
            <SearchBar />
          </div>
        )}

        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-1 p-2">
            <img
              src="/logo.png"
              alt="Amazon Logo"
              className="w-24 h-auto object-contain"
            />
            <Leaf className="w-5 h-5 text-green-400" />
          </Link>

          {/* Delivery Location */}
          <div className="hidden xl:flex items-center space-x-1 text-sm">
            <MapPin className="w-4 h-4" />
            <div>
              <div className="text-xs text-gray-300">Deliver to</div>
              <div className="font-semibold">{user?.location || 'India'}</div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <SearchBar />
          </div>

          {/* Right Navigation */}
          <div className="flex items-center space-x-4 xl:space-x-6">
            {/* Language */}
            <div className="hidden xl:flex items-center space-x-1 text-sm">
              <img src="https://flagcdn.com/w20/in.png" alt="India" className="w-5 h-3" />
              <span>EN</span>
            </div>

            {/* Account */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-1 text-sm hover:border-white border border-transparent p-1"
              >
                <User className="w-4 h-4" />
                <div className="text-left hidden xl:block">
                  <div className="text-xs">
                    Hello, {user ? user.name.split(' ')[0] : 'Sign in'}
                  </div>
                  <div className="font-semibold">Account & Lists</div>
                </div>
                <div className="xl:hidden">
                  <div className="text-xs">Account</div>
                </div>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded-md shadow-lg z-50">
                  {user ? (
                    <>
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Your Profile
                      </Link>
                      <Link 
                        to="/orders" 
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Your Orders
                      </Link>
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        EcoHealth Dashboard
                      </Link>
                      <hr className="my-1" />
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/login" 
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Sign In
                      </Link>
                      <Link 
                        to="/register" 
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Returns & Orders */}
            <Link to="/orders" className="hidden xl:flex flex-col text-sm">
              <span className="text-xs">Returns</span>
              <span className="font-semibold">& Orders</span>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="flex items-center space-x-1 hover:border-white border border-transparent p-1">
              <div className="relative">
                <ShoppingCart className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-400 text-gray-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <span className="text-sm font-semibold hidden xl:block">Cart</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileMenu(false)} />
          <div className="fixed left-0 top-0 h-full w-80 bg-white text-gray-900 shadow-lg overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button 
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile User Section */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                {user ? (
                  <div>
                    <div className="font-semibold text-gray-900">Hello, {user.name.split(' ')[0]}</div>
                    <div className="text-sm text-gray-600">Eco Score: {user.ecoScore || 75}</div>
                  </div>
                ) : (
                  <div>
                    <div className="font-semibold text-gray-900">Hello, Sign in</div>
                    <div className="text-sm text-gray-600">Account & Lists</div>
                  </div>
                )}
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-1">
                <Link
                  to="/profile"
                  className="block py-3 px-4 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Your Profile
                </Link>
                <Link
                  to="/orders"
                  className="block py-3 px-4 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Your Orders
                </Link>
                <Link
                  to="/green-store"
                  className="block py-3 px-4 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Green Store
                </Link>
                <Link
                  to="/group-buy"
                  className="block py-3 px-4 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Group Buy
                </Link>
                <Link
                  to="/challenges"
                  className="block py-3 px-4 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Eco Challenges
                </Link>
                <Link
                  to="/carbon-calculator"
                  className="block py-3 px-4 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Carbon Calculator
                </Link>
                <Link
                  to="/customer-service"
                  className="block py-3 px-4 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Customer Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;