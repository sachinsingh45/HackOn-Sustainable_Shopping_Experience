import React, { useState } from 'react';
import { FiDollarSign, FiBarChart2, FiFilter, FiShoppingBag } from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa'; // Using FontAwesome leaf instead of Feather

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  sustainabilityScore: number;
  co2Reduction: number; // in kg
  waterSaved: number; // in liters
  materials: string[];
  isSustainable: boolean;
}

const ECORecommendationEngine: React.FC = () => {
  const [sortBy, setSortBy] = useState<'default' | 'price' | 'sustainability'>('default');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Hardcoded product data with working image links
  const products: Product[] = [
    {
      id: 1,
      name: 'Organic Cotton T-Shirt',
      brand: 'EcoWear',
      price: 1299,
      originalPrice: 1199,
      image: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
      sustainabilityScore: 92,
      co2Reduction: 2.1,
      waterSaved: 1200,
      materials: ['Organic Cotton'],
      isSustainable: true
    },
    {
      id: 2,
      name: 'Classic Cotton Tee',
      brand: 'FastFashion',
      price: 899,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
      sustainabilityScore: 45,
      co2Reduction: 0,
      waterSaved: 0,
      materials: ['Cotton'],
      isSustainable: false
    },
    {
      id: 3,
      name: 'Recycled Polyester Jacket',
      brand: 'GreenOutdoor',
      price: 2499,
      originalPrice: 2299,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
      sustainabilityScore: 88,
      co2Reduction: 3.5,
      waterSaved: 800,
      materials: ['Recycled Polyester'],
      isSustainable: true
    },
    {
      id: 4,
      name: 'Hemp Canvas Tote Bag',
      brand: 'NaturalGoods',
      price: 599,
      image: 'https://images.unsplash.com/photo-1560884941-6f2d5a8671d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
      sustainabilityScore: 95,
      co2Reduction: 1.8,
      waterSaved: 2500,
      materials: ['Hemp'],
      isSustainable: true
    },
    {
      id: 5,
      name: 'Regular Jeans',
      brand: 'DenimCo',
      price: 1599,
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
      sustainabilityScore: 30,
      co2Reduction: 0,
      waterSaved: 0,
      materials: ['Cotton', 'Synthetic Dyes'],
      isSustainable: false
    },
    {
      id: 6,
      name: 'Bamboo Fiber Socks',
      brand: 'EcoFeet',
      price: 349,
      originalPrice: 299,
      image: 'https://images.unsplash.com/photo-1589674783810-20d8d1f8c5fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
      sustainabilityScore: 85,
      co2Reduction: 0.8,
      waterSaved: 600,
      materials: ['Bamboo Fiber'],
      isSustainable: true
    }
  ];

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'sustainability') return b.sustainabilityScore - a.sustainabilityScore;
    // Default sorting: balance of sustainability and price
    return (b.sustainabilityScore / b.price * 100) - (a.sustainabilityScore / a.price * 100);
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-green-100 rounded-full p-3 mb-4">
            <FaLeaf className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Sustainable Shopping Recommendations
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Products ranked by value + sustainability score
          </p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="flex-1">
                <h2 className="text-lg font-medium text-gray-900">Cotton T-Shirts</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Showing {products.length} results
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Sort by:</span>
                <div className="relative">
                  <select
                    className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                  >
                    <option value="default">Best Value</option>
                    <option value="price">Price (Low to High)</option>
                    <option value="sustainability">Sustainability</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <FiFilter className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 sm:p-6">
            {sortedProducts.map((product) => (
              <div
                key={product.id}
                className={`border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 ${product.isSustainable ? 'border-green-200' : 'border-gray-200'}`}
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  {product.isSustainable && (
                    <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                      <FaLeaf className="mr-1" /> Eco
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
                  
                  <div className="flex items-center mb-3">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{ width: `${product.sustainabilityScore}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs font-medium text-gray-700">
                      {product.sustainabilityScore}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <span className="text-lg font-bold text-gray-900">
                        {formatCurrency(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    {product.isSustainable && (
                      <div className="flex items-center text-green-600 text-sm">
                        <FaLeaf className="mr-1" />
                        <span>+{product.co2Reduction}kg CO₂e saved</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                    <div className="bg-blue-50 p-2 rounded flex items-center">
                      <FiBarChart2 className="text-blue-500 mr-1" />
                      <span>{product.co2Reduction}kg CO₂e saved</span>
                    </div>
                    <div className="bg-blue-50 p-2 rounded flex items-center">
                      <FiBarChart2 className="text-blue-500 mr-1" />
                      <span>{product.waterSaved}L water saved</span>
                    </div>
                  </div>

                  <button
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex items-center justify-center transition-colors duration-200"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <FiShoppingBag className="mr-2" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-2">
              <div className="relative">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-64 object-cover"
                />
                <button
                  className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                  onClick={() => setSelectedProduct(null)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h2>
                    <p className="text-lg text-gray-600">{selectedProduct.brand}</p>
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Sustainability Score: {selectedProduct.sustainabilityScore}/100
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatCurrency(selectedProduct.price)}
                    </span>
                    {selectedProduct.originalPrice && (
                      <span className="ml-2 text-lg text-gray-500 line-through">
                        {formatCurrency(selectedProduct.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Sustainability Benefits</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <FaLeaf className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Saves {selectedProduct.co2Reduction} kg of CO₂ emissions compared to conventional options</span>
                      </li>
                      <li className="flex items-start">
                        <FaLeaf className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Reduces water usage by {selectedProduct.waterSaved} liters</span>
                      </li>
                      <li className="flex items-start">
                        <FaLeaf className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Made from {selectedProduct.materials.join(', ')}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Why This Matters</h3>
                    <p className="text-gray-700">
                      Choosing sustainable products helps reduce environmental impact. This item has a {selectedProduct.sustainabilityScore}% 
                      better sustainability profile compared to conventional alternatives in its category.
                    </p>
                    <div className="mt-3 bg-white p-3 rounded border border-green-200">
                      <div className="flex items-center text-green-700">
                        <FaLeaf className="mr-2" />
                        <span className="font-medium">Eco Choice</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        This product meets our strict sustainability criteria for materials, manufacturing, and supply chain.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-md font-medium transition-colors duration-200 flex items-center justify-center">
                    <FiShoppingBag className="mr-2" />
                    Add to Cart
                  </button>
                  <button className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-6 rounded-md font-medium transition-colors duration-200">
                    View Similar Products
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ECORecommendationEngine;