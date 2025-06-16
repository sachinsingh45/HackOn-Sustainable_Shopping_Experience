import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, Package, Truck, Leaf, AlertTriangle, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, calculateCartFootprint } = useStore();
  const [selectedPackaging, setSelectedPackaging] = useState<{ [key: string]: string }>({});
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalFootprint = calculateCartFootprint();
  const wasteGenerated = cart.reduce((sum, item) => sum + (item.quantity * 0.15), 0); // kg of waste

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

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-lg shadow-sm p-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Start shopping for eco-friendly products!</p>
          <Link
            to="/"
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Environmental Impact Summary */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Leaf className="w-5 h-5 text-green-600 mr-2" />
              Environmental Impact
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-orange-600">{totalFootprint.toFixed(1)} kg</div>
                <div className="text-sm text-gray-600">CO₂ Footprint</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{wasteGenerated.toFixed(1)} kg</div>
                <div className="text-sm text-gray-600">Waste Generated</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">15%</div>
                <div className="text-sm text-gray-600">Eco Products</div>
              </div>
            </div>
          </div>

          {/* Cart Items */}
          {cart.map((item) => (
            <motion.div
              key={item.id}
              layout
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <div className="flex gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                  
                  {/* Eco Info */}
                  <div className="flex items-center space-x-4 mb-3 text-sm">
                    <div className="flex items-center">
                      <Leaf className="w-4 h-4 text-green-500 mr-1" />
                      <span>Eco Score: {item.ecoScore}/100</span>
                    </div>
                    <div className="text-gray-600">
                      CO₂: {(item.carbonFootprint * item.quantity).toFixed(1)} kg
                    </div>
                  </div>

                  {/* Price and Quantity */}
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="p-2 hover:bg-gray-100"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Packaging Options */}
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Packaging Options:</h4>
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
                    <h4 className="font-medium mb-2 text-green-800 flex items-center">
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
                </div>
              </div>
            </motion.div>
          ))}

          {/* Group Buy Options */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Package className="w-5 h-5 text-blue-600 mr-2" />
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
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm">
                    Join Group
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Eco packaging upgrade</span>
                <span>₹25</span>
              </div>
              <hr />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₹{(subtotal + 25).toLocaleString()}</span>
              </div>
            </div>

            {/* Environmental Impact */}
            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <h4 className="font-medium mb-3 text-green-800">Your Impact</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Carbon Footprint:</span>
                  <span className="font-medium">{totalFootprint.toFixed(1)} kg CO₂</span>
                </div>
                <div className="flex justify-between">
                  <span>Packaging Waste:</span>
                  <span className="font-medium">{wasteGenerated.toFixed(1)} kg</span>
                </div>
                <div className="flex justify-between text-green-700">
                  <span>Trees to Offset:</span>
                  <span className="font-medium">{Math.ceil(totalFootprint / 10)} trees</span>
                </div>
              </div>
            </div>

            {/* Waste Visualization */}
            <div className="mb-6">
              <h4 className="font-medium mb-3 flex items-center">
                <BarChart3 className="w-4 h-4 mr-1" />
                Waste Visualization
              </h4>
              <div className="text-sm text-gray-600 mb-2">
                Your cart will generate approximately:
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Plastic packaging</span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                    {(wasteGenerated * 0.6).toFixed(1)} kg
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Cardboard</span>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    {(wasteGenerated * 0.4).toFixed(1)} kg
                  </span>
                </div>
              </div>
            </div>

            <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-3 px-4 rounded-lg font-semibold mb-3 transition-colors">
              Proceed to Checkout
            </button>
            
            <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors">
              Checkout with Carbon Offset
            </button>
            
            <div className="mt-4 text-center">
              <Link to="/" className="text-green-600 hover:text-green-700 text-sm">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;