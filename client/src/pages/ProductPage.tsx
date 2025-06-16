import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Heart, Share2, Truck, Shield, ArrowLeft, Plus, Minus, Leaf, Users, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { products, addToCart, user } = useStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState('default');

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link to="/" className="text-green-600 hover:text-green-700">
          Return to homepage
        </Link>
      </div>
    );
  }

  const images = [product.image, product.image, product.image]; // Mock multiple images
  const ecoAlternatives = [
    { name: 'Eco-friendly version', price: product.price + 200, savings: '2.5 kg CO₂' },
    { name: 'Recycled material option', price: product.price + 150, savings: '1.8 kg CO₂' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-green-600">Home</Link>
        <span>/</span>
        <Link to={`/category/${product.category}`} className="hover:text-green-600">{product.category}</Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-white rounded-lg border overflow-hidden">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex space-x-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-16 h-16 rounded border-2 overflow-hidden ${
                  selectedImage === index ? 'border-green-500' : 'border-gray-300'
                }`}
              >
                <img src={image} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-gray-600">({product.reviews.toLocaleString()} reviews)</span>
              </div>
            </div>
          </div>

          {/* Eco Score */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold mb-3 text-green-800 flex items-center">
              <Leaf className="w-5 h-5 mr-2" />
              Environmental Impact
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Eco Score:</span>
                <div className="flex items-center mt-1">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                    <div
                      className={`h-2 rounded-full ${
                        product.ecoScore >= 80 ? 'bg-green-500' : 
                        product.ecoScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${product.ecoScore}%` }}
                    />
                  </div>
                  <span className="font-medium">{product.ecoScore}/100</span>
                </div>
              </div>
              <div>
                <span className="text-gray-600">Carbon Footprint:</span>
                <div className="font-medium text-orange-600">{product.carbonFootprint} kg CO₂e</div>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-900">
              ₹{product.price.toLocaleString()}
            </div>
            {product.originalPrice && (
              <div className="flex items-center space-x-2">
                <span className="text-lg text-gray-500 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                  Save ₹{(product.originalPrice - product.price).toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => addToCart(product)}
                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                Add to Cart
              </button>
              <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors">
                Buy Now
              </button>
            </div>
          </div>

          {/* Group Buy */}
          {product.groupBuyEligible && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold mb-2 text-blue-800 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Group Buy Available
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                Join with 2 more people to save ₹{Math.round(product.price * 0.15)} and reduce packaging waste!
              </p>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium text-sm">
                Start Group Buy
              </button>
            </div>
          )}

          {/* Delivery Info */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-2">
              <Truck className="w-5 h-5 text-green-600" />
              <span>Free delivery by tomorrow for Prime members</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span>1 year warranty included</span>
            </div>
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-purple-600" />
              <span>Carbon-neutral packaging available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Eco Alternatives */}
      <div className="mt-12 bg-green-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-green-800">
          More Sustainable Alternatives
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {ecoAlternatives.map((alt, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium mb-2">{alt.name}</h4>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">₹{alt.price.toLocaleString()}</span>
                <span className="text-green-600 text-sm font-medium">Save {alt.savings}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;