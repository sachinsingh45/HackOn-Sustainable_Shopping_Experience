import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface SellerProduct {
  _id: string;
  name: string;
  salesCount: number;
  unitsInStock: number;
  ecoScore: number;
  carbonFootprint: number;
  price: string;
  url: string;
}

interface SellerDashboardPageProps {
  refreshTrigger?: number;
}

const SellerDashboardPage: React.FC<SellerDashboardPageProps> = ({ refreshTrigger = 0 }) => {
  const { user } = useStore();
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchProducts();
    // eslint-disable-next-line
  }, [user, refreshTrigger]);

  const fetchProducts = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/seller/products');
      setProducts(res.data.products || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Products</h3>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  // Aggregate stats
  const totalSales = products.reduce((sum, p) => sum + (p.salesCount || 0), 0);
  const avgEcoScore = products.length ? (products.reduce((sum, p) => sum + (p.ecoScore || 0), 0) / products.length).toFixed(1) : '0';
  const totalCarbon = products.reduce((sum, p) => sum + (p.carbonFootprint || 0), 0).toFixed(1);

  const getEcoScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className="space-y-6">
      {/* AI Information Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">AI-Powered Sustainability Metrics</h3>
            <p className="text-blue-800 text-sm leading-relaxed">
              All CO2 emissions and eco scores are calculated using our advanced machine learning model that analyzes 
              material composition, weight, distance, recyclability, and other sustainability factors.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{totalSales}</div>
          <div className="text-sm text-gray-600 font-medium">Total Sales</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{avgEcoScore}%</div>
          <div className="text-sm text-gray-600 font-medium">Average Eco Score</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{totalCarbon} kg</div>
          <div className="text-sm text-gray-600 font-medium">Total Carbon Footprint</div>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Your Products ({products.length})</h3>
        </div>
        
        {products.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-600">Start by adding your first product to see it here.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Eco Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carbon Footprint</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map(product => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img src={product.url} alt={product.name} className="w-12 h-12 object-cover rounded-lg mr-4" />
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">{product.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.salesCount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.unitsInStock}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getEcoScoreColor(product.ecoScore)}`}>
                          {product.ecoScore}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.carbonFootprint} kg CO₂</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden">
              <div className="divide-y divide-gray-200">
                {products.map(product => (
                  <div key={product._id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start space-x-4">
                      <img src={product.url} alt={product.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate mb-2">{product.name}</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Sales:</span>
                            <span className="ml-1 font-medium text-gray-900">{product.salesCount}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Stock:</span>
                            <span className="ml-1 font-medium text-gray-900">{product.unitsInStock}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Price:</span>
                            <span className="ml-1 font-medium text-gray-900">{product.price}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Carbon:</span>
                            <span className="ml-1 font-medium text-gray-900">{product.carbonFootprint} kg</span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getEcoScoreColor(product.ecoScore)}`}>
                            Eco Score: {product.ecoScore}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SellerDashboardPage; 