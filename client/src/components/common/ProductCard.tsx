import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Leaf, Users, Package, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { useToast } from '../../context/ToastContext';

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
  category?: string;
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
      await addToCart(product.id);
      showToast(`${product.name} added to cart successfully!`, 'success');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      showToast('Failed to add item to cart', 'error');
    }
  };

  const discount = product.discount ? parseInt(product.discount.replace(/[-%]/g, '')) : 0;
  const price = parseFloat(product.price.replace(/[^0-9.]/g, ''));

  return (
    <Link to={`/product/${product.id}`} className="block">
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden"
      >
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
          <div className="absolute top-2 left-2 flex flex-col gap-2">
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
          <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
          
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
              <span className="ml-1 text-sm text-gray-600">
                ({product.reviews?.toLocaleString() || '0'})
              </span>
            </div>
          </div>

          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-lg font-bold text-gray-900">{product.price}</span>
              {product.mrp && (
                <span className="ml-2 text-sm text-gray-500 line-through">
                  {product.mrp}
                </span>
              )}
            </div>
            {product.carbonFootprint && (
              <span className="text-sm text-green-600">
                {product.carbonFootprint} kg CO₂
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;