import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, Package, Truck, Shield, CreditCard, Leaf, AlertTriangle, BarChart3, Users, MessageCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useToast } from '../context/ToastContext';
import { productsAPI } from '../services/api';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, user, checkout, toggleChat, setChatPrefillMessage } = useStore();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedPackaging, setSelectedPackaging] = useState<{ [key: string]: string }>({});
  const [recommendations, setRecommendations] = useState<{ [key: string]: any[] }>({});
  const [recommendationsLoading, setRecommendationsLoading] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();

  // Fetch recommendations for each cart item
  useEffect(() => {
    const fetchRecommendations = async () => {
      for (const item of cart) {
        if (!recommendations[item.cartItem._id] && !recommendationsLoading[item.cartItem._id]) {
          try {
            setRecommendationsLoading(prev => ({ ...prev, [item.cartItem._id]: true }));
            const response = await productsAPI.getEcoRecommendations(item.cartItem._id);
            if (response.status && response.recommendations) {
              setRecommendations(prev => ({
                ...prev,
                [item.cartItem._id]: response.recommendations
              }));
            }
          } catch (error) {
            console.error('Failed to fetch recommendations for:', item.cartItem._id);
          } finally {
            setRecommendationsLoading(prev => ({ ...prev, [item.cartItem._id]: false }));
          }
        }
      }
    };

    if (cart.length > 0) {
      fetchRecommendations();
    }
  }, [cart]);

  // Set default packaging selections for new cart items
  useEffect(() => {
    const newSelections = { ...selectedPackaging };
    let hasChanges = false;
    
    cart.forEach(item => {
      const itemId = item.id || item.cartItem._id;
      if (!selectedPackaging[itemId]) {
        newSelections[itemId] = 'standard';
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      setSelectedPackaging(newSelections);
    }
  }, [cart, selectedPackaging]);

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeFromCart(productId);
      showToast('Item removed from cart', 'success');
    } catch (error) {
      showToast('Failed to remove item', 'error');
    }
  };

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      showToast('Failed to update quantity', 'error');
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.cartItem.price.replace(/[^0-9.]/g, ''));
      return total + price * item.qty;
    }, 0);
  };

  const calculateEcoImpact = () => {
    return cart.reduce((total, item) => {
      const carbonFootprint = item.cartItem.carbonFootprint || 0;
      const packagingCarbon = getPackagingCarbonFootprint(item);
      return total + (carbonFootprint + packagingCarbon) * item.qty;
    }, 0);
  };

  const calculateWasteGenerated = () => {
    return cart.reduce((total, item) => {
      return total + (item.qty * 0.15); // 0.15kg waste per item
    }, 0);
  };

  // Updated packaging options with carbon footprint per kg
  const packagingOptions = [
    { 
      id: 'standard', 
      label: 'Standard Packaging', 
      co2PerKg: 0.5, 
      cost: 0, 
      description: 'Regular plastic packaging',
      color: 'border-gray-300'
    },
    { 
      id: 'minimal', 
      label: 'Minimal Packaging', 
      co2PerKg: 0.2, 
      cost: 0, 
      description: 'Reduced packaging materials',
      color: 'border-blue-300'
    },
    { 
      id: 'biodegradable', 
      label: 'Biodegradable Packaging', 
      co2PerKg: 0.1, 
      cost: 25, 
      description: 'Compostable materials',
      color: 'border-green-300'
    }
  ];

  const getPackagingCarbonFootprint = (item: any) => {
    const selectedPackagingType = selectedPackaging[item.id || item.cartItem._id] || 'standard';
    const packagingOption = packagingOptions.find(opt => opt.id === selectedPackagingType);
    const productWeight = item.cartItem.weight || 1; // Default to 1kg if weight not available
    return packagingOption ? packagingOption.co2PerKg * productWeight : 0.5 * productWeight;
  };

  const getEcoAlternatives = (productId: string) => {
    const productRecommendations = recommendations[productId] || [];
    return productRecommendations.slice(0, 2).map(rec => ({
      name: rec.name,
      savings: `${(rec.carbonFootprint ? (rec.carbonFootprint * -1).toFixed(1) : '0')} kg CO₂`,
      price: rec.price,
      id: rec._id
    }));
  };

  const handleCheckout = async () => {
    try {
      setLoading(true);
      
      // Calculate total carbon footprint including packaging
      const totalCarbonFootprint = calculateEcoImpact();
      
      // Prepare order data with packaging information
      const orderData = {
        items: cart.map(item => ({
          productId: item.cartItem._id,
          quantity: item.qty,
          packaging: selectedPackaging[item.id || item.cartItem._id] || 'standard',
          packagingCarbon: getPackagingCarbonFootprint(item)
        })),
        totalCarbonFootprint,
        packagingSelections: selectedPackaging
      };
      
      await checkout(orderData);
      showToast('Order placed successfully!', 'success');
      navigate('/orders'); // Redirect to orders page
    } catch (error: any) {
      showToast(error.message || 'Failed to place order', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEcoAltCTA = () => {
    setChatPrefillMessage('Show eco alternatives for my cart');
    toggleChat();
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Link
            to="/green-store"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6 sm:py-8">
      {/* Eco-Friendly Alternatives CTA */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-green-200 via-green-50 to-blue-100 border border-green-300 rounded-2xl p-4 sm:p-6 shadow-lg relative overflow-hidden"
      >
        <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto mb-4 sm:mb-0">
          <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-green-500 animate-spin-slow" />
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-green-900 mb-1 flex items-center">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600 animate-bounce" />
              Get Eco-Friendly Alternatives!
            </h2>
            <p className="text-green-800 text-xs sm:text-sm">Let our AI suggest greener options for your cart and help you shop more sustainably.</p>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-20 h-20 sm:w-32 sm:h-32 bg-green-100 rounded-full opacity-30 blur-2xl animate-pulse pointer-events-none" />
        <button
          onClick={handleEcoAltCTA}
          className="w-full sm:w-auto mt-2 sm:mt-0 sm:ml-6 px-4 sm:px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold shadow transition-all text-sm sm:text-base animate-pulse focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Ask Green Partner
        </button>
      </motion.div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Environmental Impact Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 sm:p-6 border border-green-200"
          >
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center">
              <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2" />
              Environmental Impact
            </h3>
            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
              <div>
                <div className="text-lg sm:text-2xl font-bold text-orange-600">{calculateEcoImpact().toFixed(1)} kg</div>
                <div className="text-xs sm:text-sm text-gray-600">CO₂ Footprint</div>
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-red-600">{calculateWasteGenerated().toFixed(1)} kg</div>
                <div className="text-xs sm:text-sm text-gray-600">Waste Generated</div>
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-green-600">
                  {Math.round((cart.filter(item => item.cartItem.isEcoFriendly).length / cart.length) * 100)}%
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Eco Products</div>
              </div>
            </div>
          </motion.div>

          {/* Cart Items */}
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 flex flex-col gap-3 sm:gap-0"
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                  <img
                    src={item.cartItem.image || item.cartItem.url}
                    alt={item.cartItem.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-lg border"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.pexels.com/photos/1029236/pexels-photo-1029236.jpeg?auto=compress&cs=tinysrgb&w=400';
                    }}
                  />
                  <div className="flex-1 w-full">
                    <Link to={`/product/${item.cartItem._id}`} 
                      className="text-base sm:text-lg font-medium text-gray-900 hover:text-green-600 block truncate sm:whitespace-normal sm:line-clamp-2 line-clamp-1 max-w-full break-words"
                      style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                    >
                      {item.cartItem.name}
                    </Link>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {item.cartItem.isEcoFriendly && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Leaf className="w-3 h-3 mr-1" />
                          Eco-Friendly
                        </span>
                      )}
                      {item.cartItem.groupBuyEligible && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Group Buy Eligible
                        </span>
                      )}
                    </div>
                    <div className="mt-2">
                      <span className="text-base sm:text-lg font-semibold text-gray-900">
                        ₹{parseFloat(item.cartItem.price.replace(/[^0-9.]/g, '')).toLocaleString()}
                      </span>
                      {item.cartItem.mrp && (
                        <span className="text-xs text-gray-400 line-through ml-2">{item.cartItem.mrp}</span>
                      )}
                      {/* Discount badge if applicable */}
                      {item.cartItem.price && item.cartItem.mrp && (() => {
                        const price = parseFloat(item.cartItem.price.replace(/[^0-9.]/g, ''));
                        const mrp = parseFloat(item.cartItem.mrp.replace(/[^0-9.]/g, ''));
                        if (mrp > price) {
                          const discountPercent = Math.round(((mrp - price) / mrp) * 100);
                          return (
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium ml-2">
                              {discountPercent}% OFF
                            </span>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col items-center sm:items-end space-x-2 sm:space-x-0 sm:space-y-2 mt-2 sm:mt-0">
                    <div className="flex items-center space-x-2">
                      <button
                        aria-label="Decrease quantity"
                        onClick={() => handleUpdateQuantity(item.id, item.qty - 1)}
                        className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-base">{item.qty}</span>
                      <button
                        aria-label="Increase quantity"
                        onClick={() => handleUpdateQuantity(item.id, item.qty + 1)}
                        className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      aria-label="Remove item"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Packaging Options */}
                <div className="mt-3 sm:mt-4 border-t pt-3 sm:pt-4">
                  <h4 className="font-medium mb-2 text-xs sm:text-sm text-gray-700">Packaging Options:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {packagingOptions.map((option) => {
                      const productWeight = item.cartItem.weight || 1;
                      const packagingCarbon = option.co2PerKg * productWeight;
                      return (
                        <label
                          key={option.id}
                          className={`flex items-center p-2 border rounded cursor-pointer text-xs sm:text-sm transition-all duration-150 focus-within:ring-2 focus-within:ring-green-400 ${
                            selectedPackaging[item.id || item.cartItem._id] === option.id
                              ? 'border-green-500 bg-green-50'
                              : option.color
                          }`}
                          tabIndex={0}
                        >
                          <input
                            type="radio"
                            name={`packaging-${item.id || item.cartItem._id}`}
                            value={option.id}
                            checked={selectedPackaging[item.id || item.cartItem._id] === option.id}
                            onChange={(e) => setSelectedPackaging({
                              ...selectedPackaging,
                              [item.id || item.cartItem._id]: e.target.value
                            })}
                            className="sr-only"
                          />
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-gray-600">{option.description}</div>
                            <div className="text-xs text-orange-600">+{packagingCarbon.toFixed(1)} kg CO₂</div>
                            {option.cost > 0 && (
                              <div className="text-xs text-green-600">+₹{option.cost}</div>
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Eco Alternatives */}
                <div className="mt-3 sm:mt-4 bg-green-50 p-2 sm:p-3 rounded-lg">
                  <h4 className="font-medium mb-2 text-green-800 flex items-center text-xs sm:text-sm">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Eco-Friendly Alternatives
                  </h4>
                  {recommendationsLoading[item.cartItem._id] ? (
                    <div className="flex items-center justify-center py-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                      <span className="ml-2 text-xs text-gray-600">Finding alternatives...</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {getEcoAlternatives(item.cartItem._id).map((alt, index) => (
                        <div key={index} className="flex justify-between items-center text-xs sm:text-sm">
                          <span className="text-green-700">{alt.name}</span>
                          <div className="text-right">
                            <span className="text-green-600 font-medium">Save {alt.savings}</span>
                            <div className="text-xs text-gray-500">₹{alt.price}</div>
                          </div>
                        </div>
                      ))}
                      {getEcoAlternatives(item.cartItem._id).length === 0 && (
                        <div className="text-xs text-gray-500 text-center py-2">
                          No alternatives found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Group Buy Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 rounded-xl p-4 sm:p-6 border border-blue-200"
          >
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2" />
              Group Buy Opportunities
            </h3>
            <p className="text-gray-700 mb-3 sm:mb-4 text-xs sm:text-sm">
              Save money and reduce environmental impact by joining group purchases with others in your area.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-white p-3 sm:p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-xs sm:text-base">Eco Electronics Bundle</h4>
                <p className="text-xs sm:text-sm text-gray-600 mb-2">3 people needed to unlock 15% discount</p>
                <div className="flex items-center justify-between">
                  <span className="text-green-600 font-medium text-xs sm:text-base">Save ₹450 + 2kg CO₂</span>
                  <button 
                    onClick={() => showToast('Joining group buy...', 'info')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    Join Group
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 mt-6 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 sticky top-4 lg:top-24 z-10"
          >
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Order Summary</h3>
            
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{calculateSubtotal().toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">₹{(calculateSubtotal() * 0.18).toLocaleString()}</span>
              </div>
              
              <div className="border-t pt-2 sm:pt-3 mt-2 sm:mt-3">
                <div className="flex justify-between font-semibold text-sm sm:text-base">
                  <span>Total</span>
                  <span>₹{(calculateSubtotal() * 1.18).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || cart.length === 0}
              className={`mt-5 w-full flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-white transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-green-400 ${
                loading || cart.length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                'Proceed to Checkout'
              )}
            </button>

            <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
              <div className="flex items-center text-xs sm:text-sm text-gray-600">
                <Truck className="w-4 h-4 mr-2" />
                Free delivery on orders above ₹499
              </div>
              <div className="flex items-center text-xs sm:text-sm text-gray-600">
                <Shield className="w-4 h-4 mr-2" />
                Secure checkout
              </div>
              <div className="flex items-center text-xs sm:text-sm text-gray-600">
                <CreditCard className="w-4 h-4 mr-2" />
                Multiple payment options
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;