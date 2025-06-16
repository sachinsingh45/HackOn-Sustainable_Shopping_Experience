import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, MapPin,Leaf } from 'lucide-react';
import { useStore } from '../../store/useStore';
import SearchBar from '../common/SearchBar';

const Header = () => {
  const { cart, user, logout } = useStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
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
        <div className="flex items-center justify-between h-16">
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
          <div className="hidden md:flex items-center space-x-1 text-sm">
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
          <div className="flex items-center space-x-6">
            {/* Language */}
            <div className="hidden md:flex items-center space-x-1 text-sm">
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
                <div className="text-left">
                  <div className="text-xs">
                    Hello, {user ? user.name.split(' ')[0] : 'Sign in'}
                  </div>
                  <div className="font-semibold">Account & Lists</div>
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
            <Link to="/orders" className="hidden md:flex flex-col text-sm">
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
              <span className="text-sm font-semibold">Cart</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;