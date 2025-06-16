import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Leaf, Users, Package, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';

interface Product {
  _id: string;
  id: string;
  name: string;
  price: string;
  value: string;
  accValue: number;
  image?: string;
  url: string;
  rating?: number;
  reviews?: number;
  carbonFootprint?: number;
  ecoScore?: number;
  isEcoFriendly?: boolean;
  groupBuyEligible?: boolean;
  prime?: boolean;
  mrp?: string;
  discount?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, user } = useStore();
  
  const handleAddToCart = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }
    
    try {
      await addToCart(product.id);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const discount = product.discount ? parseInt(product.discount.replace(/[-%]/g, '')) : 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative">
          <img
            src={product.image || product.url}
            alt={product.name}
            className="w-full h-48 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1029236/pexels-photo-1029236.jpeg?auto=compress&cs=tinysrgb&w=400';
            }}
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 space-y-1">
            {product.isEcoFriendly && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                <Leaf className="w-3 h-3 mr-1" />
                Eco-Friendly
              </span>
            )}
            {product.groupBuyEligible && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                <Users className="w-3 h-3 mr-1" />
                Group Buy
              </span>
            )}
            {discount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {product.discount}
              </span>
            )}
          </div>

          {/* Prime Badge */}
          {product.prime && (
            <div className="absolute top-2 right-2">
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                Prime
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 hover:text-blue-600">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating || 4)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-1">
              ({(product.reviews || 100).toLocaleString()})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center mb-2">
            <span className="text-lg font-bold text-gray-900">
              {product.price}
            </span>
            {product.mrp && (
              <span className="text-sm text-gray-500 line-through ml-2">
                {product.mrp}
              </span>
            )}
          </div>

          {/* Eco Info */}
          {product.ecoScore && (
            <div className="space-y-1 mb-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Eco Score:</span>
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div
                      className={`h-2 rounded-full ${
                        product.ecoScore >= 80
                          ? 'bg-green-500'
                          : product.ecoScore >= 60
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${product.ecoScore}%` }}
                    />
                  </div>
                  <span className="font-medium">{product.ecoScore}/100</span>
                </div>
              </div>
              {product.carbonFootprint && (
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Carbon Footprint:</span>
                  <span className="font-medium">{product.carbonFootprint} kg CO₂e</span>
                </div>
              )}
            </div>
          )}

          {/* Delivery Info */}
          <div className="flex items-center text-xs text-gray-600 mb-3">
            <Truck className="w-3 h-3 mr-1" />
            <span>Free delivery by tomorrow</span>
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-2 px-4 rounded-md font-medium transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;