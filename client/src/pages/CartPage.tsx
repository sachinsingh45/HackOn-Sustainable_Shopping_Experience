import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, Package, Truck, Shield, CreditCard, Leaf, AlertTriangle, BarChart3, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useToast } from '../context/ToastContext';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, user, checkout } = useStore();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedPackaging, setSelectedPackaging] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

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
      return total + carbonFootprint * item.qty;
    }, 0);
  };

  const calculateWasteGenerated = () => {
    return cart.reduce((total, item) => {
      return total + (item.qty * 0.15); // 0.15kg waste per item
    }, 0);
  };

  const packagingOptions = [
    { id: 'standard', label: 'Standard Packaging', co2: 0.5, cost: 0, description: 'Regular plastic packaging' },
    { id: 'minimal', label: 'Minimal Packaging', co2: 0.2, cost: 0, description: 'Reduced packaging materials' },
    { id: 'biodegradable', label: 'Biodegradable Packaging', co2: 0.1, cost: 25, description: 'Compostable materials' }
  ];

  const getEcoAlternatives = (productId: string) => {
    // Mock eco alternatives
    return [
      { name: 'Eco-friendly alternative', savings: '2.5 kg CO₂', price: 1899 },
      { name: 'Recycled version', savings: '1.8 kg CO₂', price: 2199 }
    ];
  };

  const handleCheckout = async () => {
    try {
      setLoading(true);
      await checkout();
      showToast('Order placed successfully!', 'success');
      navigate('/orders'); // Redirect to orders page
    } catch (error: any) {
      showToast(error.message || 'Failed to place order', 'error');
    } finally {
      setLoading(false);
    }
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Environmental Impact Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Leaf className="w-5 h-5 text-green-600 mr-2" />
              Environmental Impact
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-orange-600">{calculateEcoImpact().toFixed(1)} kg</div>
                <div className="text-sm text-gray-600">CO₂ Footprint</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{calculateWasteGenerated().toFixed(1)} kg</div>
                <div className="text-sm text-gray-600">Waste Generated</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {Math.round((cart.filter(item => item.cartItem.isEcoFriendly).length / cart.length) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Eco Products</div>
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
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.cartItem.image || item.cartItem.url}
                    alt={item.cartItem.name}
                    className="w-24 h-24 object-contain rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.pexels.com/photos/1029236/pexels-photo-1029236.jpeg?auto=compress&cs=tinysrgb&w=400';
                    }}
                  />
                  <div className="flex-1">
                    <Link to={`/product/${item.cartItem.id}`} className="text-lg font-medium text-gray-900 hover:text-green-600">
                      {item.cartItem.name}
                    </Link>
                    <div className="flex items-center space-x-2 mt-1">
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
                      <span className="text-lg font-semibold text-gray-900">
                        ₹{parseFloat(item.cartItem.price.replace(/[^0-9.]/g, '')).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.qty - 1)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center">{item.qty}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.qty + 1)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Packaging Options */}
                <div className="mt-4 border-t pt-4">
                  <h4 className="font-medium mb-2 text-sm text-gray-700">Packaging Options:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {packagingOptions.map((option) => (
                      <label
                        key={option.id}
                        className={`flex items-center p-2 border rounded cursor-pointer text-sm ${
                          selectedPackaging[item.id] === option.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`packaging-${item.id}`}
                          value={option.id}
                          checked={selectedPackaging[item.id] === option.id}
                          onChange={(e) => setSelectedPackaging({
                            ...selectedPackaging,
                            [item.id]: e.target.value
                          })}
                          className="sr-only"
                        />
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-gray-600">{option.description}</div>
                          {option.cost > 0 && (
                            <div className="text-xs text-green-600">+₹{option.cost}</div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Eco Alternatives */}
                <div className="mt-4 bg-green-50 p-3 rounded-lg">
                  <h4 className="font-medium mb-2 text-green-800 flex items-center text-sm">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Eco-Friendly Alternatives
                  </h4>
                  <div className="space-y-1">
                    {getEcoAlternatives(item.id).map((alt, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-green-700">{alt.name}</span>
                        <span className="text-green-600 font-medium">Save {alt.savings}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Group Buy Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 rounded-lg p-6 border border-blue-200"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Users className="w-5 h-5 text-blue-600 mr-2" />
              Group Buy Opportunities
            </h3>
            <p className="text-gray-700 mb-4">
              Save money and reduce environmental impact by joining group purchases with others in your area.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium mb-2">Eco Electronics Bundle</h4>
                <p className="text-sm text-gray-600 mb-2">3 people needed to unlock 15% discount</p>
                <div className="flex items-center justify-between">
                  <span className="text-green-600 font-medium">Save ₹450 + 2kg CO₂</span>
                  <button 
                    onClick={() => showToast('Joining group buy...', 'info')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
                  >
                    Join Group
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{calculateSubtotal().toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">₹{(calculateSubtotal() * 0.18).toLocaleString()}</span>
              </div>
              
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{(calculateSubtotal() * 1.18).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || cart.length === 0}
              className={`mt-6 w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white ${
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

            <div className="mt-4 space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Truck className="w-4 h-4 mr-2" />
                Free delivery on orders above ₹499
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Shield className="w-4 h-4 mr-2" />
                Secure checkout
              </div>
              <div className="flex items-center text-sm text-gray-600">
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