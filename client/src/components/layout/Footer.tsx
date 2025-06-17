import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Leaf, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Back to Top */}
      <div className="bg-gray-700 hover:bg-gray-600 transition-colors">
        <button
          onClick={scrollToTop}
          className="w-full py-3 text-center font-medium flex items-center justify-center text-sm sm:text-base"
        >
          <ArrowUp className="w-4 h-4 mr-2" />
          Back to top
        </button>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Get to Know Us */}
          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Get to Know Us</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-gray-300 text-sm sm:text-base">
              <li><Link to="/about" className="hover:text-white transition-colors">About Amazon</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/press" className="hover:text-white transition-colors">Press Releases</Link></li>
              <li><Link to="/sustainability" className="hover:text-white transition-colors">
                <span className="flex items-center">
                  <Leaf className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-green-400" />
                  Sustainability
                </span>
              </Link></li>
              <li><Link to="/amazon-cares" className="hover:text-white transition-colors">Amazon Cares</Link></li>
              <li><Link to="/gift-card" className="hover:text-white transition-colors">Gift a Smile</Link></li>
            </ul>
          </div>

          {/* Make Money with Us */}
          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Make Money with Us</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-gray-300 text-sm sm:text-base">
              <li><Link to="/sell" className="hover:text-white transition-colors">Sell on Amazon</Link></li>
              <li><Link to="/greenbridge" className="hover:text-white transition-colors">
                <span className="flex items-center">
                  <Leaf className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-green-400" />
                  GreenBridge for Sellers
                </span>
              </Link></li>
              <li><Link to="/amazon-business" className="hover:text-white transition-colors">Sell on Amazon Business</Link></li>
              <li><Link to="/amazon-global" className="hover:text-white transition-colors">Sell apps on Amazon</Link></li>
              <li><Link to="/advertise" className="hover:text-white transition-colors">Advertise Your Products</Link></li>
              <li><Link to="/self-publish" className="hover:text-white transition-colors">Self-Publish with Us</Link></li>
              <li><Link to="/host-hub" className="hover:text-white transition-colors">Host an Amazon Hub</Link></li>
            </ul>
          </div>

          {/* Amazon Payment Products */}
          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Amazon Payment Products</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-gray-300 text-sm sm:text-base">
              <li><Link to="/amazon-business-card" className="hover:text-white transition-colors">Amazon Business Card</Link></li>
              <li><Link to="/shop-points" className="hover:text-white transition-colors">Shop with Points</Link></li>
              <li><Link to="/reload-balance" className="hover:text-white transition-colors">Reload Your Balance</Link></li>
              <li><Link to="/currency-converter" className="hover:text-white transition-colors">Amazon Currency Converter</Link></li>
              <li><Link to="/green-rewards" className="hover:text-white transition-colors">
                <span className="flex items-center">
                  <Leaf className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-green-400" />
                  Green Rewards Program
                </span>
              </Link></li>
            </ul>
          </div>

          {/* Let Us Help You */}
          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Let Us Help You</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-gray-300 text-sm sm:text-base">
              <li><Link to="/your-account" className="hover:text-white transition-colors">Your Account</Link></li>
              <li><Link to="/orders" className="hover:text-white transition-colors">Your Orders</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping Rates & Policies</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Returns & Replacements</Link></li>
              <li><Link to="/assistant" className="hover:text-white transition-colors">Manage Your Content and Devices</Link></li>
              <li><Link to="/help" className="hover:text-white transition-colors">Amazon Assistant</Link></li>
              <li><Link to="/carbon-calculator" className="hover:text-white transition-colors">
                <span className="flex items-center">
                  <Leaf className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-green-400" />
                  Carbon Footprint Calculator
                </span>
              </Link></li>
              <li><Link to="/help" className="hover:text-white transition-colors">Help</Link></li>
            </ul>
          </div>
        </div>

        {/* Separator */}
        <hr className="my-6 sm:my-8 border-gray-700" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/logo.png"
                alt="Amazon Logo"
                className="w-20 sm:w-24 h-auto object-contain"
              />
              <Leaf className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-400" />
            </Link>
            
            <select className="bg-gray-800 border border-gray-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm">
              <option>English</option>
              <option>हिन्दी</option>
              <option>తెలుగు</option>
              <option>தமிழ்</option>
            </select>
            
            <div className="flex items-center space-x-1 text-xs sm:text-sm">
              <img src="https://flagcdn.com/w20/in.png" alt="India" className="w-4 h-2.5 sm:w-5 sm:h-3" />
              <span>India</span>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link to="#" className="text-gray-400 hover:text-white transition-colors">
              <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link to="#" className="text-gray-400 hover:text-white transition-colors">
              <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link to="#" className="text-gray-400 hover:text-white transition-colors">
              <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link to="#" className="text-gray-400 hover:text-white transition-colors">
              <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>

        {/* Legal Links */}
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-700">
          <div className="flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400 justify-center">
            <Link to="/conditions" className="hover:text-white transition-colors">Conditions of Use</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Notice</Link>
            <Link to="/interest-ads" className="hover:text-white transition-colors">Your Ads Privacy Choices</Link>
            <Link to="/carbon-neutral" className="hover:text-white transition-colors text-green-400">
              Carbon Neutral Shipping
            </Link>
          </div>
          <div className="text-center text-xs sm:text-sm text-gray-400 mt-3 sm:mt-4">
            © 1996-2024, Amazon.com, Inc. or its affiliates
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;