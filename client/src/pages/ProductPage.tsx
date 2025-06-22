import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Heart, Share2, Truck, Shield, ArrowLeft, Plus, Minus, Leaf, Users, Package, Info, ChevronDown, ChevronUp, ShoppingCart, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useToast } from '../context/ToastContext';
import { productsAPI } from '../services/api';

import { api } from "../services/api";

type SectionKey = 'details' | 'shipping' | 'returns' | 'eco';

interface ExpandedSections {
  details: boolean;
  shipping: boolean;
  returns: boolean;
  eco: boolean;
}

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, user, fetchProduct } = useStore();
  const { showToast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState('default');
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    details: true,
    shipping: false,
    returns: false,
    eco: true
  });

  const [groupDiscounts, setGroupDiscounts] = useState<Record<string, number>>({});

  const [userGroups, setUserGroups] = useState([]);
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  const [isWishlist, setIsWishlist] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fallbackImage = 'https://images.pexels.com/photos/1029236/pexels-photo-1029236.jpeg?auto=compress&cs=tinysrgb&w=400';


  const fetchJoinedGroup = async() => {
    try {
      const response = await api.get('/pending-group');

      if(response.data.data)
        setUserGroups(response.data.data.PendingGroup);

      console.log(response.data.data.PendingGroup);
    } catch (error) {
      console.log("fetch joined group data error");
    }
  };

  useEffect(() => {
    fetchJoinedGroup();
  }, []);


  const handleAddToCartClick = () => {
    if (userGroups.length > 0) {
      const discounts = {};
      userGroups.forEach(group => {
        discounts[group._id] = getRandomInt(5, 30); // Generate once
      });
      setGroupDiscounts(discounts);

      setShowChoiceModal(true); // Show modal with options
    } else {
      handleAddToCart();
    }
  };


  const handleFinalSelection = async () => {
    setModalLoading(true);
    try {
      await api.post(`/group/${selectedOption}/add-item`, {
        productId: product._id,
        count: quantity,
      });
      showToast(`${product.name} added to cart successfully!`, 'success');
      console.log('Item added to group cart');
    } catch (err) {
      showToast('Failed to add item to cart', 'error');
      console.error('Error adding to group cart', err);
    } finally {
      setModalLoading(false);
      setShowChoiceModal(false);
    }
  };

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setError('Product ID is missing');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        // First try to find the product in the local store
        let foundProduct = products.find(p => p._id === id);
        
        // If not found in local store, try to fetch from server
        if (!foundProduct) {
          const fetchedProduct = await fetchProduct(id);
          if (fetchedProduct) {
            foundProduct = {
              ...fetchedProduct,
              image: fetchedProduct.image || fetchedProduct.url || fallbackImage,
              price: fetchedProduct.price || '₹0',
              _id: fetchedProduct._id
            };
          }
        }

        if (foundProduct) {
          setProduct(foundProduct);
          await fetchRecommendations(id);
        } else {
          setError('Product not found');
          setTimeout(() => navigate('/'), 2000);
        }
      } catch (error) {
        console.error('Error loading product:', error);
        setError('Failed to load product');
        setTimeout(() => navigate('/'), 2000);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, products, fetchProduct, navigate]);

  const toggleSection = (section: SectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleShare = () => {
    setShowShareModal(true);
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this eco-friendly product: ${product.name}`,
        url: window.location.href
      }).catch(console.error);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImageError(true);
    e.currentTarget.src = fallbackImage;
  };

  const fetchRecommendations = async (productId: string) => {
    try {
      setRecommendationsLoading(true);
      const response = await productsAPI.getEcoRecommendations(productId);
      if (response.status) {
        setRecommendations(response.recommendations || []);
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      // Don't show error toast for recommendations failure
    } finally {
      setRecommendationsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      showToast('Please login to add items to cart', 'warning');
      navigate('/login');
      return;
    }

    setModalLoading(true);
    try {
      await addToCart(product._id);
      showToast(`${product.name} added to cart successfully!`, 'success');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      showToast('Failed to add item to cart', 'error');
    }finally {
      setModalLoading(false);
      setShowChoiceModal(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      showToast('Please login to proceed with purchase', 'warning');
      navigate('/login');
      return;
    }
    showToast('Buy Now feature coming soon! Please use the cart to checkout.', 'info');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Product not found'}</p>
          <Link to="/" className="text-green-600 hover:text-green-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const images = [product.url, product.url, product.url];

  // Calculate discount percentage if both price and mrp exist
  let discountPercent = 0;
  if (product.price && product.mrp) {
    const price = parseFloat(product.price.replace(/[^0-9.]/g, ''));
    const mrp = parseFloat(product.mrp.replace(/[^0-9.]/g, ''));
    if (mrp > price) {
      discountPercent = Math.round(((mrp - price) / mrp) * 100);
    }
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  

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

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <motion.div 
            className="aspect-square bg-white rounded-lg border overflow-hidden max-w-md mx-auto"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={imageError ? fallbackImage : (images[selectedImage] || fallbackImage)}
              alt={product.name}
              className="w-full h-full object-contain p-4"
              onError={handleImageError}
            />
          </motion.div>
          <div className="flex space-x-2 justify-center">
            {images.map((image, index) => (
              <motion.button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-14 h-14 rounded border-2 overflow-hidden ${
                  selectedImage === index ? 'border-green-500' : 'border-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img 
                  src={image || fallbackImage} 
                  alt="" 
                  className="w-full h-full object-contain p-1"
                  onError={handleImageError}
                />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6 max-w-lg">
          <div>
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsWishlist(!isWishlist)}
                  className={`p-2 rounded-full ${
                    isWishlist ? 'text-red-500' : 'text-gray-400'
                  } hover:bg-gray-100`}
                >
                  <Heart className="w-6 h-6" fill={isWishlist ? 'currentColor' : 'none'} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare}
                  className="p-2 rounded-full text-gray-400 hover:bg-gray-100"
                >
                  <Share2 className="w-6 h-6" />
                </motion.button>
              </div>
            </div>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating || 4)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-gray-600">({(product.reviews || 100).toLocaleString()} reviews)</span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-900">
              {product.price}
            </div>
            {product.mrp && (
              <div className="flex items-center space-x-2">
                <span className="text-lg text-gray-500 line-through">
                  {product.mrp}
                </span>
                {discountPercent > 0 && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            {/* Out of Stock Message */}
            {(product.outOfStock || product.unitsInStock === 0) ? (
              <div className="text-red-600 font-semibold mb-2">Out of Stock</div>
            ) : (
              <div className="text-green-700 text-sm mb-2">{product.unitsInStock - product.unitsSold} of {product.unitsInStock} units available</div>
            )}
            <div className="flex items-center space-x-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100"
                  disabled={product.outOfStock || product.unitsInStock === 0}
                >
                  <Minus className="w-4 h-4" />
                </motion.button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-100"
                  disabled={product.outOfStock || product.unitsInStock === 0 || quantity >= product.unitsInStock}
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            <div className="flex space-x-4">
              {/* <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className={`flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center ${product.outOfStock || product.unitsInStock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={product.outOfStock || product.unitsInStock === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBuyNow}
                className={`flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center ${product.outOfStock || product.unitsInStock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={product.outOfStock || product.unitsInStock === 0}
              >
                <Zap className="w-5 h-5 mr-2" />
                Buy Now
              </motion.button> */}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCartClick}
                className={`flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                  product.outOfStock || product.unitsInStock === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={product.outOfStock || product.unitsInStock === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBuyNow}
                className={`flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                  product.outOfStock || product.unitsInStock === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={product.outOfStock || product.unitsInStock === 0}
              >
                <Zap className="w-5 h-5 mr-2" />
                Buy Now
              </motion.button>
            </div>
          </div>


          {showChoiceModal && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", damping: 25, stiffness: 400 }}
      className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
    >
      {/* Modal Header */}
      <div className="p-2 border-b border-gray-100 relative">
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Add to Cart
        </h2>
        <p className="text-sm text-gray-500 mt-1 text-center">
          Choose where to add this item
        </p>
        <button 
          onClick={() => setShowChoiceModal(false)}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Scrollable Content Area */}
      <div className="overflow-y-auto max-h-[60vh] p-6 space-y-4">
        {/* Individual Cart Option */}
        <div 
          onClick={() => setSelectedOption('individual')}
          className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
            selectedOption === 'individual' 
              ? 'border-green-500 bg-green-50/50' 
              : 'border-gray-200 hover:border-green-300'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`mt-0.5 flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
              selectedOption === 'individual' 
                ? 'border-green-600 bg-green-600' 
                : 'border-gray-300 group-hover:border-green-400'
            }`}>
              {selectedOption === 'individual' && (
                <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Personal Cart</h3>
              <p className="text-sm text-gray-500 mt-1">
                Add only to your personal shopping cart
              </p>
            </div>
          </div>
        </div>

        {/* Group Options */}
        {userGroups.map((group) => (
          <div 
            key={group._id}
            onClick={() => setSelectedOption(group._id)}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer group ${
              selectedOption === group._id 
                ? 'border-green-500 bg-green-50/50' 
                : 'border-gray-200 hover:border-green-300'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`mt-0.5 flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                selectedOption === group._id 
                  ? 'border-green-600 bg-green-600' 
                  : 'border-gray-300 group-hover:border-green-400'
              }`}>
                {selectedOption === group._id && (
                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                  <span className="flex text-sm items-center bg-gray-100 px-2 py-1 rounded-full">
                    <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {group?.adminId?.location?.city}, {group?.adminId?.location?.state}, ({group?.adminId?.location?.pin})
                  </span>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-2">
                  <span className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
                    <Users className="h-3 w-3 mr-1" />
                    {group?.members?.length} members
                  </span>
                  <span className="flex items-center bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                    <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    Save {groupDiscounts[group._id]}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Modal Footer */}
      <div className="p-6 border-t border-gray-100">
        <button
          onClick={() => {
            selectedOption === 'individual' ? handleAddToCart() : handleFinalSelection();
          }}
          disabled={!selectedOption || modalLoading}
          className={`w-full px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center ${
            selectedOption
              ? 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          } ${modalLoading ? 'opacity-90' : ''}`}
        >
          {modalLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5 mr-2" />
              {selectedOption === 'individual' ? 'Add to Personal Cart' : 'Add to Group Cart'}
            </>
          )}
        </button>
      </div>
    </motion.div>
  </div>
)}


          {/* Eco Info */}
          {product.ecoScore && (
            <motion.div 
              className="mt-6 p-4 bg-green-50 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="font-semibold mb-2 text-green-800 flex items-center">
                <Leaf className="w-5 h-5 mr-2" />
                Eco Score: {product.ecoScore}/100
              </h3>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <motion.div
                  className={`h-2 rounded-full ${
                    product.ecoScore >= 80
                      ? 'bg-green-500'
                      : product.ecoScore >= 60
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${product.ecoScore}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              {product.carbonFootprint && (
                <p className="text-sm text-green-700">
                  Carbon Footprint: {product.carbonFootprint} kg CO₂e
                </p>
              )}
              {product.isEcoFriendly !== undefined && (
                <div className="flex items-center mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.isEcoFriendly ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}> 
                    <Leaf className="w-3 h-3 mr-1" />
                    {product.isEcoFriendly ? 'Eco-Friendly' : 'Not Eco-Friendly'}
                  </span>
                </div>
              )}
              {product.lifespan && (
                <div className="text-sm text-gray-700 mt-1">Lifespan: <span className="font-semibold">{product.lifespan} years</span></div>
              )}
              {product.repairability !== undefined && (
                <div className="text-sm text-gray-700 mt-1">Repairable: <span className="font-semibold">{product.repairability ? 'Yes' : 'No'}</span></div>
              )}
            </motion.div>
          )}

          {/* Delivery Info */}
          <div className="mt-6 space-y-3 text-sm">
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

      {/* Expandable Sections */}
      <div className="mt-12 space-y-4">
        {/* Product Details */}
        <div className="bg-white rounded-lg border">
          <button
            onClick={() => toggleSection('details')}
            className="w-full px-6 py-4 flex items-center justify-between text-left"
          >
            <h2 className="text-xl font-semibold flex items-center">
              <Info className="w-5 h-5 mr-2 text-gray-500" />
              Product Details
            </h2>
            {expandedSections.details ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          <AnimatePresence>
            {expandedSections.details && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-4">
                  <ul className="space-y-3">
                    {product.points?.map((point: string, index: number) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start"
                      >
                        <span className="text-green-500 mr-2">•</span>
                        <span>{point}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Shipping Info */}
        <div className="bg-white rounded-lg border">
          <button
            onClick={() => toggleSection('shipping')}
            className="w-full px-6 py-4 flex items-center justify-between text-left"
          >
            <h2 className="text-xl font-semibold flex items-center">
              <Truck className="w-5 h-5 mr-2 text-gray-500" />
              Shipping Information
            </h2>
            {expandedSections.shipping ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          <AnimatePresence>
            {expandedSections.shipping && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Standard Shipping</h3>
                      <p className="text-gray-600">3-5 business days</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Express Shipping</h3>
                      <p className="text-gray-600">1-2 business days</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Free Shipping</h3>
                      <p className="text-gray-600">Available for orders over ₹500</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Returns Policy */}
        <div className="bg-white rounded-lg border">
          <button
            onClick={() => toggleSection('returns')}
            className="w-full px-6 py-4 flex items-center justify-between text-left"
          >
            <h2 className="text-xl font-semibold flex items-center">
              <Shield className="w-5 h-5 mr-2 text-gray-500" />
              Returns & Warranty
            </h2>
            {expandedSections.returns ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          <AnimatePresence>
            {expandedSections.returns && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Return Policy</h3>
                      <p className="text-gray-600">30-day return policy for unused items</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Warranty</h3>
                      <p className="text-gray-600">1 year manufacturer warranty</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Eco Alternatives */}
      <div className="mt-12 bg-green-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-green-800 flex items-center">
          <Leaf className="w-5 h-5 mr-2" />
          More Sustainable Alternatives
        </h3>
        
        {recommendationsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            <span className="ml-3 text-gray-600">Finding eco-friendly alternatives...</span>
          </div>
        ) : recommendations.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendations.map((rec, index) => (
              <motion.div
                key={rec._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/product/${rec._id}`)}
              >
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                  <img
                    src={rec.url || fallbackImage}
                    alt={rec.name}
                    className="w-full h-full object-contain p-2"
                    onError={(e) => {
                      e.currentTarget.src = fallbackImage;
                    }}
                  />
                </div>
                <h4 className="font-medium text-sm mb-2 line-clamp-2">{rec.name}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-green-600">₹{rec.price}</span>
                    {rec.isEcoFriendly && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Eco-Friendly
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Carbon: {rec.carbonFootprint?.toFixed(1)} kg CO₂</span>
                    <span>Eco Score: {rec.ecoScore?.toFixed(0)}%</span>
                  </div>
                  {product && rec.carbonFootprint && product.carbonFootprint && (
                    <div className="text-xs text-green-600 font-medium">
                      Save {(product.carbonFootprint - rec.carbonFootprint).toFixed(1)} kg CO₂
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Leaf className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No eco-friendly alternatives found</p>
            <p className="text-sm text-gray-500">This product might already be one of the most sustainable options in its category!</p>
          </div>
        )}
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded-lg max-w-md w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-4">Share this product</h3>
              <div className="space-y-4">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                    setShowShareModal(false);
                  }}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium"
                >
                  Copy Link
                </button>
                <button
                  onClick={() => {
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this eco-friendly product: ${product.name}`)}&url=${encodeURIComponent(window.location.href)}`);
                    setShowShareModal(false);
                  }}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium"
                >
                  Share on Twitter
                </button>
                <button
                  onClick={() => {
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`);
                    setShowShareModal(false);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium"
                >
                  Share on Facebook
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductPage;