import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Leaf, Users, Package, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { useToast } from '../../context/ToastContext';

interface Product {
  _id: string;
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
  category?: string;
  outOfStock?: boolean;
  unitsInStock?: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, user } = useStore();
  const { showToast } = useToast();
  
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking add to cart
    if (!user) {
      showToast('Please login to add items to cart', 'warning');
      window.location.href = '/login';
      return;
    }
    
    try {
      await addToCart(product._id);
      showToast(`${product.name} added to cart successfully!`, 'success');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      showToast('Failed to add item to cart', 'error');
    }
  };

  const discount = product.discount
    ? parseInt(String(product.discount).replace(/[-%]/g, ''))
    : 0;
  const price = parseFloat(product.price.replace(/[^0-9.]/g, ''));

  return (
    <Link to={`/product/${product._id}`} className="block group">
      <motion.div
        whileHover={{ y: -6, scale: 1.03 }}
        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden h-full flex flex-col group-hover:border-green-400"
      >
        <div className="relative">
          <img
            src={product.url || 'https://images.pexels.com/photos/1029236/pexels-photo-1029236.jpeg?auto=compress&cs=tinysrgb&w=400'}
            alt={product.name || ''}
            className="w-full aspect-square h-40 sm:h-52 object-contain p-4 bg-white transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1029236/pexels-photo-1029236.jpeg?auto=compress&cs=tinysrgb&w=400';
            }}
          />
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2 z-10">
            {(product.isEcoFriendly ?? true) && (
              <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center shadow-md">
                <Leaf className="w-4 h-4 mr-1" /> Eco-Friendly
              </span>
            )}
            {(product.groupBuyEligible ?? false) && (
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center shadow-md">
                <Users className="w-4 h-4 mr-1" /> Group Buy
              </span>
            )}
            {(product.discount || '').length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
                {product.discount}
              </span>
            )}
            {/* Out of Stock Badge */}
            {((product.outOfStock) || (product.unitsInStock ?? 0) === 0) && (
              <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded-full shadow-md">
                Out of Stock
              </span>
            )}
          </div>
          {/* Prime Badge */}
          {product.prime && (
            <div className="absolute top-2 right-2">
              <span className="bg-yellow-400 text-gray-900 text-xs px-2 py-1 rounded shadow-md font-semibold">
                Prime
              </span>
            </div>
          )}
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-base sm:text-lg group-hover:text-green-700 transition-colors">
            {product.name || ''}
          </h3>
          <div className="flex items-center mb-2 gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.rating ?? 4) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="ml-1 text-xs text-gray-500">{(product.reviews ?? 100).toLocaleString()} reviews</span>
          </div>
          <div className="flex items-baseline justify-between mb-3 flex-wrap gap-1">
            <div className="flex items-baseline flex-wrap gap-2">
              <span className="text-lg font-bold text-green-700">{product.price || '₹0'}</span>
              {product.mrp && (
                <span className="text-xs text-gray-400 line-through">{product.mrp}</span>
              )}
            </div>
            {(product.carbonFootprint ?? 2.5) && (
              <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                {product.carbonFootprint ?? 2.5} kg CO₂
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className={`w-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white py-2 px-4 rounded-xl font-semibold transition-colors text-sm mt-auto shadow-md ${(product.outOfStock || (product.unitsInStock ?? 0) === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={product.outOfStock || (product.unitsInStock ?? 0) === 0}
          >
            Add to Cart
          </button>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;