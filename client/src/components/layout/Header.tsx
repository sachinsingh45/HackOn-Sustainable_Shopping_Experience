import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdNotificationsNone } from "react-icons/md";
import { MessageSquare,Users, Bell,  ShoppingCart, User, MapPin, Leaf, Menu, X, Search, Mail } from 'lucide-react';
import { useStore } from '../../store/useStore';
import SearchBar from '../common/SearchBar';

import { notificationSocket } from "../../services/socket";

const Header = () => {
  const { cart, user, logout } = useStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const navigate = useNavigate();

  const [isJoining, setIsJoining] = useState({ });
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [chatNotifications, setChatNotifications] = useState([])
  const [groupBuyNotifications, setGroupBuyNotifications] = useState([])

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    navigate('/');
  };



  useEffect(() => {
    let userId = user?._id;

    if(!userId) return;

    // If already connected, emit directly
    if (notificationSocket.connected) {
      notificationSocket.emit('join-room', userId);
    } else {
      notificationSocket.on('connect', () => {
        notificationSocket.emit('join-room', userId);
      });
    }
  
    // Handle notification events
    notificationSocket.on('previous-notification', (data) => {
      
      if(data?.message)
        setChatNotifications(data.message), console.log(data?.message);

      if(data?.notification)
        setGroupBuyNotifications(data.notification);
    });

    notificationSocket.on('receive-notification', (data) => {

      if (data?.notification) {
        setGroupBuyNotifications(prev => {
          const newNotifications = Array.isArray(data.notification)
            ? data.notification
            : [data.notification];
    
          const existingIds = new Set(prev.map(n => n._id));
          const uniqueNew = newNotifications.filter(n => !existingIds.has(n._id));
    
          return [...uniqueNew, ...prev];
        });
      }
    });
    
    
  
    return () => {
      notificationSocket.off('receive-notification');
    };

  }, [user?._id]);
  
  const handleJoinGroup = ({ _id, groupId, userId }) => {
    setIsJoining(true);

    notificationSocket.emit('join-group', { _id: _id, groupId: groupId, userId: userId });
  };

  const unreadChatCount = chatNotifications.length;
  const unreadGroupCount = groupBuyNotifications.length;
  const totalUnread = unreadChatCount + unreadGroupCount;


  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',  hour12: true, }).toUpperCase();
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

          {/* Notification Icon - Mobile */}
          <div className="relative p-2">
            <MdNotificationsNone 
              className="w-6 h-6 hover:cursor-pointer" 
              onClick={handleNotificationClick}
            />
            {totalUnread > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-400 text-gray-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {totalUnread}
              </span>
            )}
          </div>
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
              <div className="font-semibold">
                {user?.location && typeof user.location === 'object' && user.location.city
                  ? `${user.location.city}, ${user.location.state}, ${user.location.country} - ${user.location.pin}`
                  : typeof user?.location === 'string' ? user.location : 'India'}
              </div>
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

            {/* Notification Icon - Desktop */}
            <div className="relative p-1">
              <MdNotificationsNone 
                className="w-6 h-6 hover:cursor-pointer" 
                onClick={handleNotificationClick}
              />
              {totalUnread > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-400 text-gray-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalUnread}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      


      {/* Notifications Popup */}
      {showNotifications && (
        <div className="fixed right-4 top-16 z-50 w-80 bg-white text-gray-900 rounded-md shadow-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Notifications</h3>
              <button 
                onClick={() => setShowNotifications(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-gray-200 -mx-4 -mb-1">
              <button
                onClick={() => {
                  setActiveTab('chat');
                }}
                className={`flex-1 py-2 px-4 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'chat' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <MessageSquare className="w-4 h-4" />
                Messages {unreadChatCount > 0 && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                    {unreadChatCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  setActiveTab('group');
                }}
                className={`flex-1 py-2 px-4 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'group' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Users className="w-4 h-4" />
                Groups {unreadGroupCount > 0 && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                    {unreadGroupCount}
                  </span>
                )}
              </button>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {activeTab === 'chat' ? (
              chatNotifications.length > 0 ? (
                chatNotifications.map((group) => (
                  group.message.map((data) => (
                    <div 
                      key={data._id} 
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 bg-blue-50`}
                    >
                      <div className="flex items-start gap-3">
                        <MessageSquare className={`w-5 h-5 mt-1 text-blue-500`} />
                        <div className="flex-1">
                          <h4 className="font-medium">{data?.senderId?.name}</h4>
                          <p className="text-sm text-gray-600">{data.content}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatTime(data?.senderId?.sentAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No new messages
                </div>
              )
            ) : (
              groupBuyNotifications.length > 0 ? (
                groupBuyNotifications.map((data) => (
                  <div 
                    key={data._id} 
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${!data.isRead ? 'bg-green-50' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Users className={`w-5 h-5 mt-1 ${data.isRead ? 'text-gray-400' : 'text-green-500'}`} />
                          {data.groupId && (
                            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {data.groupId.members.length}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium">{data.groupId.name}</h4>
                          <div>
                            <p className="text-[10px] text-gray-600">{data.sender.name}</p>
                            <p className="text-[10px] text-gray-600">{data.sender.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      <button className="text-sm text-blue-500 hover:text-blue-700" onClick={() => handleJoinGroup({ _id: data._id, groupId: data.groupId._id, userId: user._id })}>
                        {isJoining ? 'Joining...' : 'Join'}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No group notifications
                </div>
              )
            )}
          </div>
          
          <div className="p-3 border-t border-gray-200 text-center">
            <Link 
              to={'/notification'}
              className="text-sm text-blue-600 hover:underline"
              onClick={() => setShowNotifications(false)}
            >
              View all
            </Link>
          </div>
        </div>
      )}

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
              <div className="mb-6 p-4 bg-gray-50 rounded-lg flex flex-col items-start gap-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-gray-900">Hello, {user.name.split(' ')[0]}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Leaf className="w-4 h-4 text-green-500" /> Eco Score: <span className="font-semibold">{user.ecoScore}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <span>
                        {user.location && typeof user.location === 'object' && user.location.city
                          ? `${user.location.city}, ${user.location.state}, ${user.location.country} - ${user.location.pin}`
                          : typeof user.location === 'string' ? user.location : 'No location set'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-semibold">CO₂ Saved:</span> {user.carbonSaved} kg
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-1">
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