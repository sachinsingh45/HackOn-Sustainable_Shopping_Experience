import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Heart, Share2, Truck, Shield, ArrowLeft, Plus, Minus, Leaf, Users, Package, Info, ChevronDown, ChevronUp, ShoppingCart, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useToast } from '../context/ToastContext';

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
  const { products, addToCart, user, fetchProduct, orderProduct } = useStore();
  const { showToast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState('default');
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    details: true,
    shipping: false,
    returns: false,
    eco: true
  });
  const [isWishlist, setIsWishlist] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fallbackImage = 'https://images.pexels.com/photos/1029236/pexels-photo-1029236.jpeg?auto=compress&cs=tinysrgb&w=400';

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
              rating: fetchedProduct.rating || Math.random() * 2 + 3,
              reviews: fetchedProduct.reviews || Math.floor(Math.random() * 5000) + 100,
              carbonFootprint: fetchedProduct.carbonFootprint || Math.random() * 5 + 0.5,
              ecoScore: fetchedProduct.ecoScore || Math.floor(Math.random() * 40) + 60,
              isEcoFriendly: fetchedProduct.isEcoFriendly || Math.random() > 0.6,
              groupBuyEligible: fetchedProduct.groupBuyEligible || Math.random() > 0.7,
              category: fetchedProduct.category || 'General',
              image: fetchedProduct.image || fetchedProduct.url || fallbackImage,
              price: fetchedProduct.price || '₹0',
              value: fetchedProduct.value || '0',
              accValue: fetchedProduct.accValue || 0,
              _id: fetchedProduct._id
            };
          }
        }

        if (foundProduct) {
          setProduct(foundProduct);
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

  const handleAddToCart = async () => {
    if (!user) {
      showToast('Please login to add items to cart', 'warning');
      navigate('/login');
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

  const handleBuyNow = async () => {
    if (!user) {
      showToast('Please login to proceed with purchase', 'warning');
      navigate('/login');
      return;
    }

    try {
      const response = await orderProduct(product._id);
      if (response.status) {
        showToast('Order placed successfully!', 'success');
      } else {
        showToast('Failed to place order', 'error');
      }
    } catch (error) {
      console.error('Failed to place order:', error);
      showToast('Failed to place order', 'error');
    }
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

  const images = [product.image || product.url, product.image || product.url, product.image || product.url];
  const ecoAlternatives = [
    { name: 'Eco-friendly version', price: parseFloat(product.price.replace(/[^0-9.]/g, '')) + 200, savings: '2.5 kg CO₂' },
    { name: 'Recycled material option', price: parseFloat(product.price.replace(/[^0-9.]/g, '')) + 150, savings: '1.8 kg CO₂' }
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
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                  {product.discount}
                </span>
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
              <motion.button
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
              </motion.button>
            </div>
          </div>

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
        <div className="grid md:grid-cols-2 gap-4">
          {ecoAlternatives.map((alt, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow"
            >
              <h4 className="font-medium mb-2">{alt.name}</h4>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">₹{alt.price.toLocaleString()}</span>
                <span className="text-green-600 text-sm font-medium">Save {alt.savings}</span>
              </div>
            </motion.div>
          ))}
        </div>
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