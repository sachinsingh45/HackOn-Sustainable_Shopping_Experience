import React, { useState } from 'react';
import { Store, TrendingUp, Users, Package, ArrowRight, CheckCircle, Leaf, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import axios from 'axios';
import SellerDashboardPage from './SellerDashboardPage';
import { api } from '../services/api';

const SellOnAmazonPage = () => {
  const { user } = useStore();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [form, setForm] = useState({
    name: '',
    price: '',
    mrp: '',
    url: '',
    category: '',
    subCategory: '',
    points: '',
    unitsInStock: '',
    weight: '',
    materialComposition: '',
    packaging: '',
    recyclability: false,
    distance: '',
    lifespan: '',
    repairability: false,
  });
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [message, setMessage] = useState<string|null>(null);
  const [error, setError] = useState<string|null>(null);
  const [calculatedValues, setCalculatedValues] = useState<{
    carbonFootprint: number | null;
    ecoScore: number | null;
    isEcoFriendly: boolean | null;
  }>({
    carbonFootprint: null,
    ecoScore: null,
    isEcoFriendly: null
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Category presets optimized for ML model
  const categoryPresets = {
    'Electronics': {
      subCategories: ['Smartphones', 'Laptops', 'Headphones', 'Cameras', 'Gaming', 'Accessories'],
      materials: ['Plastic:70, Aluminum:20, Glass:10', 'Aluminum:60, Plastic:30, Steel:10', 'Plastic:80, Metal:20'],
      packaging: ['Cardboard box', 'Plastic bubble wrap', 'Styrofoam'],
      lifespan: '3-5',
      repairability: true
    },
    'Personal Care': {
      subCategories: ['Shampoo', 'Soap', 'Skincare', 'Hair Care', 'Oral Care', 'Fragrances'],
      materials: ['Plastic:90, Organic:10', 'Organic:80, Plastic:20', 'Glass:70, Plastic:30'],
      packaging: ['Plastic bottle', 'Glass bottle', 'Cardboard box'],
      lifespan: '1-2',
      repairability: false
    },
    'Grocery': {
      subCategories: ['Organic Foods', 'Beverages', 'Snacks', 'Dairy', 'Fruits', 'Vegetables'],
      materials: ['Organic:100', 'Plastic:80, Organic:20', 'Glass:90, Plastic:10'],
      packaging: ['Plastic bag', 'Glass container', 'Cardboard box', 'Paper bag'],
      lifespan: '0.1-0.5',
      repairability: false
    }
  };

  const handleCategoryChange = (category: string) => {
    const preset = categoryPresets[category as keyof typeof categoryPresets];
    if (preset) {
      setForm(prev => ({
        ...prev,
        category,
        subCategory: preset.subCategories[0],
        materialComposition: preset.materials[0],
        packaging: preset.packaging[0],
        lifespan: preset.lifespan,
        repairability: preset.repairability
      }));
    } else {
      setForm(prev => ({ ...prev, category }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const input = e.target as HTMLInputElement;
      setForm(f => ({ ...f, [name]: input.checked }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const res = await api.post('/products', {
        ...form,
        unitsInStock: form.unitsInStock ? Number(form.unitsInStock) : undefined,
        weight: Number(form.weight),
        distance: Number(form.distance),
        lifespan: form.lifespan ? Number(form.lifespan) : undefined,
        repairability: !!form.repairability,
        materialComposition: form.materialComposition,
        points: form.points ? form.points.split('\n') : [],
        carbonFootprint: calculatedValues.carbonFootprint,
        ecoScore: calculatedValues.ecoScore,
        isEcoFriendly: calculatedValues.isEcoFriendly,
      });
      setMessage('Product created successfully! Dashboard will refresh automatically.');
      setForm({
        name: '', price: '', mrp: '', url: '', category: '', subCategory: '', points: '', unitsInStock: '', weight: '', materialComposition: '', packaging: '', recyclability: false, distance: '', lifespan: '', repairability: false,
      });
      setCalculatedValues({
        carbonFootprint: null,
        ecoScore: null,
        isEcoFriendly: null
      });
      // Trigger dashboard refresh
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const [activeTab, setActiveTab] = useState('overview');

  const benefits = [
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: 'Reach Millions of Customers',
      description: 'Access to over 400 million customers across India and globally'
    },
    {
      icon: <Package className="w-8 h-8 text-green-600" />,
      title: 'Fulfillment by Amazon',
      description: 'Let us handle storage, packaging, and delivery for you'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
      title: 'Grow Your Business',
      description: 'Scale your business with our advertising and analytics tools'
    },
    {
      icon: <Leaf className="w-8 h-8 text-green-600" />,
      title: 'Go Green with GreenBridge',
      description: 'Get sustainability insights and eco-friendly certifications'
    }
  ];

  const steps = [
    {
      step: 1,
      title: 'Create Your Account',
      description: 'Sign up for a seller account and provide your business information'
    },
    {
      step: 2,
      title: 'List Your Products',
      description: 'Add your products with detailed descriptions and high-quality images'
    },
    {
      step: 3,
      title: 'Set Up Fulfillment',
      description: 'Choose between self-fulfillment or Fulfillment by Amazon (FBA)'
    },
    {
      step: 4,
      title: 'Start Selling',
      description: 'Launch your products and start reaching customers immediately'
    }
  ];

  const pricingPlans = [
    {
      name: 'Individual',
      price: '₹0',
      period: 'monthly fee',
      features: [
        'Sell up to 40 items per month',
        '₹25 per item sold',
        'Basic selling tools',
        'Customer support'
      ],
      recommended: false
    },
    {
      name: 'Professional',
      price: '₹999',
      period: 'per month',
      features: [
        'Unlimited items',
        'No per-item fee',
        'Advanced selling tools',
        'Bulk listing tools',
        'API access',
        'GreenBridge analytics'
      ],
      recommended: true
    }
  ];

  const handleCalculateCO2 = async () => {
    // Validate required fields for calculation
    const requiredFields = ['weight', 'distance', 'packaging', 'materialComposition'];
    const missingFields = requiredFields.filter(field => !form[field as keyof typeof form]);
    
    if (missingFields.length > 0) {
      setError(`Please fill in required fields for calculation: ${missingFields.join(', ')}`);
      return;
    }

    setCalculating(true);
    setError(null);
    setCalculatedValues({
      carbonFootprint: null,
      ecoScore: null,
      isEcoFriendly: null
    });

    try {
      // Parse materialComposition
      let parsedMaterialComposition = {};
      if (typeof form.materialComposition === 'string') {
        form.materialComposition.split(',').forEach(pair => {
          const [mat, val] = pair.split(':');
          if (mat && val) parsedMaterialComposition[mat.trim()] = Number(val.trim());
        });
      }

      // Convert material composition to ML server format
      const mlMaterialFeatures = {
        "Material_Plastic": 0,
        "Material_Aluminum": 0,
        "Material_Steel": 0,
        "Material_Copper": 0,
        "Material_Silicon": 0,
        "Material_Organic": 0,
        "Material_Glass": 0,
        "Material_Insulation Foam": 0,
        "Material_Drum Metal": 0
      };

      // Map parsed materials to ML server format
      Object.keys(parsedMaterialComposition).forEach(material => {
        const percentage = parsedMaterialComposition[material];
        const mlKey = `Material_${material}`;
        if (mlMaterialFeatures.hasOwnProperty(mlKey)) {
          mlMaterialFeatures[mlKey] = percentage;
        }
      });

      // Prepare data for ML server
      const mlPayload = {
        "Weight (kg)": Number(form.weight),
        "Distance (km)": Number(form.distance),
        "Recyclable": form.recyclability ? 1 : 0,
        "Repairable": form.repairability ? 1 : 0,
        "Lifespan (yrs)": form.lifespan ? Number(form.lifespan) : 5,
        "Packaging Used": form.packaging || "Cardboard box",
        "Category": form.category || 'General',
        "Subcategory": form.subCategory || '',
        ...mlMaterialFeatures
      };

      console.log('🚀 Sending ML payload:', JSON.stringify(mlPayload, null, 2));

      // Call ML server directly
      const mlServerUrl = import.meta.env.VITE_ML_SERVER_URL || 'http://127.0.0.1:8001';
      const mlRes = await axios.post(`${mlServerUrl}/predict`, mlPayload);
      
      const { carbon_footprint, eco_score, isEcoFriendly, status, warning } = mlRes.data;
      
      setCalculatedValues({
        carbonFootprint: carbon_footprint,
        ecoScore: eco_score * 100, // Convert to percentage
        isEcoFriendly: (eco_score * 100) >= 60 // Mark as eco friendly if eco score >= 60
      });

      if (status === 'fallback' && warning) {
        setMessage(`CO2 emissions calculated using fallback method. ${warning}`);
      } else {
        setMessage('CO2 emissions calculated successfully!');
      }
    } catch (err: any) {
      console.error('ML Server Error:', err);
      
      // Handle different types of errors
      if (err.response) {
        // Server responded with error status
        const status = err.response.status;
        const errorData = err.response.data;
        
        switch (status) {
          case 400:
            setError(`Invalid data: ${errorData.detail || 'Please check your input values'}`);
            break;
          case 503:
            setError('ML model is temporarily unavailable. Please try again in a few minutes.');
            break;
          case 500:
            setError('ML server error. Please try again or contact support if the problem persists.');
            break;
          default:
            setError(errorData.detail || `Server error (${status}). Please try again.`);
        }
      } else if (err.request) {
        // Network error - server not reachable
        setError('Cannot connect to ML server. Please check if the ML server is running on port 8001.');
      } else {
        // Other errors
        setError(err.message || 'Failed to calculate CO2 emissions. Please try again.');
      }
    } finally {
      setCalculating(false);
    }
  };

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Seller Dashboard
                </h1>
                <p className="text-gray-600 text-lg">
                  Manage your products and track your sustainability impact
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
        <button
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg shadow-lg hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200"
          onClick={() => setShowAddProduct(v => !v)}
        >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {showAddProduct ? 'Close Form' : 'Add New Product'}
        </button>
              </div>
            </div>
          </div>

          {/* Add Product Form */}
        {showAddProduct && (
          <div className="mb-8">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 px-6 py-4">
                  <h2 className="text-2xl font-bold text-white">Add New Product</h2>
                  <p className="text-green-100 mt-1">Fill in the details below to list your product</p>
              </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {/* Basic Information */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
                    <input 
                      name="name" 
                      value={form.name} 
                      onChange={handleChange} 
                      placeholder="Enter product name" 
                          className="w-full border-2 border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors" 
                      required 
                    />
                  </div>
                  <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL *</label>
                    <input 
                      name="url" 
                      value={form.url} 
                      onChange={handleChange} 
                      placeholder="https://example.com/image.jpg" 
                          className="w-full border-2 border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors" 
                      required 
                    />
                  </div>
                  <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹) *</label>
                    <input 
                      name="price" 
                      value={form.price} 
                      onChange={handleChange} 
                      placeholder="999" 
                      type="number" 
                      min="0" 
                      step="0.01"
                          className="w-full border-2 border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors" 
                      required 
                    />
                  </div>
                  <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">MRP (₹)</label>
                    <input 
                      name="mrp" 
                      value={form.mrp} 
                      onChange={handleChange} 
                      placeholder="1299" 
                      type="number" 
                      min="0" 
                      step="0.01"
                          className="w-full border-2 border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors" 
                    />
                  </div>
                  <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Units in Stock *</label>
                    <input 
                      name="unitsInStock" 
                      value={form.unitsInStock} 
                      onChange={handleChange} 
                      placeholder="100" 
                      type="number" 
                      min="0"
                          className="w-full border-2 border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors" 
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* Category Selection */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Category & Classification</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                    <select 
                      name="category" 
                      value={form.category} 
                      onChange={(e) => handleCategoryChange(e.target.value)}
                          className="w-full border-2 border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Personal Care">Personal Care</option>
                      <option value="Grocery">Grocery</option>
                      <option value="Other">Other</option>
                    </select>
                        <p className="text-xs text-gray-500 mt-2">Our ML model is optimized for Electronics, Personal Care, and Grocery</p>
                  </div>
                  <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Subcategory</label>
                    <select 
                      name="subCategory" 
                      value={form.subCategory} 
                      onChange={handleChange}
                          className="w-full border-2 border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    >
                      <option value="">Select Subcategory</option>
                      {form.category && categoryPresets[form.category as keyof typeof categoryPresets]?.subCategories.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Sustainability Parameters */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Sustainability Parameters</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Weight (kg) *</label>
                    <input 
                      name="weight" 
                      value={form.weight} 
                      onChange={handleChange} 
                      placeholder="0.5" 
                      type="number" 
                      min="0" 
                          step="0.1"
                          className="w-full border-2 border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors" 
                      required 
                    />
                  </div>
                  <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Distance (km) *</label>
                    <input 
                      name="distance" 
                      value={form.distance} 
                      onChange={handleChange} 
                          placeholder="100" 
                      type="number" 
                      min="0"
                          step="0.1"
                          className="w-full border-2 border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors" 
                      required 
                    />
                  </div>
                  <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Lifespan (years)</label>
                    <input 
                      name="lifespan" 
                      value={form.lifespan} 
                      onChange={handleChange} 
                      placeholder="3" 
                      type="number" 
                      min="0" 
                      step="0.1"
                          className="w-full border-2 border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors" 
                    />
                  </div>
                  <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Packaging</label>
                    <select 
                      name="packaging" 
                      value={form.packaging} 
                      onChange={handleChange}
                          className="w-full border-2 border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    >
                      <option value="">Select Packaging</option>
                      <option value="Cardboard box">Cardboard box</option>
                      <option value="Plastic bag">Plastic bag</option>
                      <option value="Glass container">Glass container</option>
                      <option value="Plastic bottle">Plastic bottle</option>
                      <option value="Paper bag">Paper bag</option>
                      <option value="Styrofoam">Styrofoam</option>
                      <option value="Plastic bubble wrap">Plastic bubble wrap</option>
                    </select>
                  </div>
                </div>

                    <div className="mt-6 space-y-4">
                  <div className="flex items-center">
                    <input 
                      name="recyclability" 
                      type="checkbox" 
                      checked={!!form.recyclability} 
                      onChange={handleChange} 
                          className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded transition-colors" 
                    />
                        <label className="ml-3 text-sm font-medium text-gray-700">Product is recyclable</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      name="repairability" 
                      type="checkbox" 
                      checked={!!form.repairability} 
                      onChange={handleChange} 
                          className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded transition-colors" 
                    />
                        <label className="ml-3 text-sm font-medium text-gray-700">Product is repairable</label>
                  </div>
                </div>
              </div>

              {/* Material Composition */}
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Material Composition</h3>
                    </div>
                <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Material Composition *</label>
                  <select 
                    name="materialComposition" 
                    value={form.materialComposition} 
                    onChange={handleChange}
                        className="w-full border-2 border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    required
                  >
                    <option value="">Select Material Composition</option>
                    <option value="Plastic:90, Organic:10">Plastic:90, Organic:10</option>
                    <option value="Aluminum:60, Plastic:30, Steel:10">Aluminum:60, Plastic:30, Steel:10</option>
                    <option value="Organic:100">Organic:100</option>
                    <option value="Glass:70, Plastic:30">Glass:70, Plastic:30</option>
                        <option value="Plastic:80, Steel:20">Plastic:80, Steel:20</option>
                    <option value="Organic:80, Plastic:20">Organic:80, Plastic:20</option>
                    <option value="Glass:90, Plastic:10">Glass:90, Plastic:10</option>
                    <option value="Plastic:70, Aluminum:20, Glass:10">Plastic:70, Aluminum:20, Glass:10</option>
                        <option value="Steel:50, Plastic:30, Copper:20">Steel:50, Plastic:30, Copper:20</option>
                        <option value="Silicon:40, Plastic:40, Steel:20">Silicon:40, Plastic:40, Steel:20</option>
                  </select>
                      <p className="text-xs text-gray-500 mt-2">Format: Material:Percentage, Material:Percentage (e.g., Plastic:70, Aluminum:30)</p>
                </div>
              </div>

              {/* Product Description */}
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-200">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Product Description</h3>
                    </div>
                <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Product Points (one per line)</label>
                  <textarea 
                    name="points" 
                    value={form.points} 
                    onChange={handleChange} 
                    placeholder="• High quality product&#10;• Eco-friendly packaging&#10;• Long lasting" 
                        className="w-full border-2 border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors" 
                    rows={4} 
                  />
                </div>
              </div>

                  {/* CO2 Calculation Button and Results */}
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-200">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                      <div className="mb-4 lg:mb-0">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900">CO2 Emission Calculator</h3>
                        </div>
                        <p className="text-sm text-gray-600">
                          Calculate your product's environmental impact before adding it. This uses our AI model to analyze 
                          materials, weight, distance, and sustainability factors.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleCalculateCO2}
                        disabled={calculating}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg shadow-lg hover:from-emerald-600 hover:to-teal-600 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {calculating ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Calculating...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Calculate CO2 Emission
                          </>
                        )}
                      </button>
                    </div>
                    
                    {calculatedValues.carbonFootprint !== null && (
                      <div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="text-center p-6 bg-white rounded-xl border border-emerald-200 shadow-lg">
                            <div className="text-3xl font-bold text-emerald-600 mb-2">
                              {calculatedValues.carbonFootprint} kg
                            </div>
                            <div className="text-sm text-gray-600 font-medium">Carbon Footprint</div>
                          </div>
                          <div className="text-center p-6 bg-white rounded-xl border border-blue-200 shadow-lg">
                            <div className="text-3xl font-bold text-blue-600 mb-2">
                              {calculatedValues.ecoScore?.toFixed(1)}%
                            </div>
                            <div className="text-sm text-gray-600 font-medium">Eco Score</div>
                          </div>
                          <div className="text-center p-6 bg-white rounded-xl border border-orange-200 shadow-lg">
                            <div className="text-3xl font-bold text-orange-600 mb-2">
                              {calculatedValues.isEcoFriendly ? 'Yes' : 'No'}
                            </div>
                            <div className="text-sm text-gray-600 font-medium">Eco Friendly</div>
                          </div>
                        </div>
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-700 text-center font-medium">
                            ✓ These calculated values will be automatically used when you submit the product
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {message && (
                      <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-green-700 font-medium">{message}</span>
                        </div>
                      </div>
                    )}
                    {error && (
                      <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-red-700 font-medium">{error}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Form Actions */}
                  <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddProduct(false)}
                      className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                      className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg" 
                  disabled={loading}
                >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Adding Product...
                        </div>
                      ) : (
                        'Add Product'
                      )}
                </button>
              </div>
            </form>
              </div>
          </div>
        )}

          {/* Dashboard Content */}
          <SellerDashboardPage refreshTrigger={refreshTrigger} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Sell on Amazon
              </h1>
              <p className="text-xl mb-8 text-orange-100">
                Start your business journey with India's most trusted e-commerce platform. 
                Reach millions of customers and grow your business with our powerful tools.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center">
                  Start Selling Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors">
                  Watch Demo
                </button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img
                src="https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Selling on Amazon"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-4 -left-4 bg-white text-gray-900 p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <Store className="w-6 h-6 text-orange-500" />
                  <div>
                    <div className="font-semibold">2M+ Sellers</div>
                    <div className="text-sm text-gray-600">Trust Amazon</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'benefits', label: 'Benefits' },
              { id: 'pricing', label: 'Pricing' },
              { id: 'getting-started', label: 'Getting Started' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
                <div className="text-3xl font-bold text-orange-600 mb-2">400M+</div>
                <div className="text-gray-600">Active Customers</div>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
                <div className="text-3xl font-bold text-blue-600 mb-2">2M+</div>
                <div className="text-gray-600">Sellers Worldwide</div>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
                <div className="text-3xl font-bold text-green-600 mb-2">185+</div>
                <div className="text-gray-600">Countries Served</div>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
                <div className="text-3xl font-bold text-purple-600 mb-2">₹50K+</div>
                <div className="text-gray-600">Avg Monthly Revenue</div>
              </div>
            </div>

            {/* Success Stories */}
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <h2 className="text-2xl font-bold text-center mb-8">Success Stories</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    name: 'Rajesh Kumar',
                    business: 'Handmade Crafts',
                    growth: '300% increase in sales',
                    image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150'
                  },
                  {
                    name: 'Priya Sharma',
                    business: 'Organic Foods',
                    growth: '₹5L monthly revenue',
                    image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150'
                  },
                  {
                    name: 'Tech Solutions Ltd',
                    business: 'Electronics',
                    growth: 'Expanded to 15 cities',
                    image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150'
                  }
                ].map((story, index) => (
                  <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                    <img
                      src={story.image}
                      alt={story.name}
                      className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="font-semibold mb-1">{story.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{story.business}</p>
                    <p className="text-sm font-medium text-green-600">{story.growth}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'benefits' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Sell on Amazon?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Join millions of sellers who trust Amazon to grow their business and reach customers worldwide.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-lg shadow-sm border"
                >
                  <div className="mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </motion.div>
              ))}
            </div>

            {/* GreenBridge Feature */}
            <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-8">
              <div className="flex items-center mb-4">
                <Leaf className="w-8 h-8 text-green-600 mr-3" />
                <h3 className="text-2xl font-bold text-green-800">
                  Introducing GreenBridge for Sellers
                </h3>
              </div>
              <p className="text-green-700 mb-6">
                Get detailed analytics on your products' environmental impact, receive AI-powered 
                sustainability recommendations, and earn green certifications to attract eco-conscious customers.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-green-600 mb-2" />
                  <h4 className="font-semibold mb-1">GreenScore Analytics</h4>
                  <p className="text-sm text-gray-600">Track packaging waste, carbon footprint, and recyclability</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-blue-600 mb-2" />
                  <h4 className="font-semibold mb-1">Eco Certifications</h4>
                  <p className="text-sm text-gray-600">Earn Climate Pledge Friendly and other green badges</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600 mb-2" />
                  <h4 className="font-semibold mb-1">Community Hub</h4>
                  <p className="text-sm text-gray-600">Share best practices with other sustainable sellers</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'pricing' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Choose the plan that works best for your business. No hidden fees, no long-term contracts.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-lg shadow-sm border-2 p-8 relative ${
                    plan.recommended ? 'border-orange-500' : 'border-gray-200'
                  }`}
                >
                  {plan.recommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Recommended
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="text-4xl font-bold text-gray-900 mb-1">{plan.price}</div>
                    <div className="text-gray-600">{plan.period}</div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                      plan.recommended
                        ? 'bg-orange-500 hover:bg-orange-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    Get Started
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'getting-started' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Start Selling in 4 Easy Steps
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Get your business up and running on Amazon in just a few simple steps.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start mb-8">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg mr-6">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center">
                Start Your Seller Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SellOnAmazonPage;