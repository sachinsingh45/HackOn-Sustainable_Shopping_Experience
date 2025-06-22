import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import axios from 'axios';

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

  const fetchProducts = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('http://localhost:8000/api/seller/products', { withCredentials: true });
      setProducts(res.data.products || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user, refreshTrigger]);

  if (!user) {
    return <div className="max-w-2xl mx-auto py-12 text-center text-lg">Please log in to view your seller dashboard.</div>;
  }

  if (loading) {
    return <div className="max-w-2xl mx-auto py-12 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="max-w-2xl mx-auto py-12 text-center text-red-600">{error}</div>;
  }

  // Aggregate stats
  const totalSales = products.reduce((sum, p) => sum + (p.salesCount || 0), 0);
  const avgEcoScore = products.length ? (products.reduce((sum, p) => sum + (p.ecoScore || 0), 0) / products.length).toFixed(2) : '0';
  const totalCarbon = products.reduce((sum, p) => sum + (p.carbonFootprint || 0), 0).toFixed(2);

  return (
    <div className="max-w-5xl mx-auto py-12">
      <h2 className="text-3xl font-bold mb-6">Seller Dashboard</h2>
      
      {/* ML Model Information */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          <h3 className="text-lg font-semibold text-blue-800">AI-Powered Sustainability Metrics</h3>
        </div>
        <p className="text-blue-700 text-sm">
          All CO2 emissions and eco scores are calculated using our advanced machine learning model that analyzes 
          material composition, weight, distance, recyclability, and other sustainability factors.
        </p>
      </div>
      
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow text-center">
          <div className="text-2xl font-bold">{totalSales}</div>
          <div className="text-gray-600">Total Sales</div>
        </div>
        <div className="bg-white p-6 rounded shadow text-center">
          <div className="text-2xl font-bold">{avgEcoScore}</div>
          <div className="text-gray-600">Average Eco Score</div>
        </div>
        <div className="bg-white p-6 rounded shadow text-center">
          <div className="text-2xl font-bold">{totalCarbon} kg</div>
          <div className="text-gray-600">Total Carbon Footprint</div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Sales</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Eco Score</th>
              <th className="px-4 py-2">Carbon Footprint</th>
              <th className="px-4 py-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id} className="border-t">
                <td className="px-4 py-2"><img src={product.url} alt={product.name} className="w-16 h-16 object-cover rounded" /></td>
                <td className="px-4 py-2 font-medium">{product.name}</td>
                <td className="px-4 py-2">{product.salesCount}</td>
                <td className="px-4 py-2">{product.unitsInStock}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    product.ecoScore >= 80 ? 'bg-green-100 text-green-800' :
                    product.ecoScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {product.ecoScore}%
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span className="text-sm font-medium text-gray-700">
                    {product.carbonFootprint} kg CO₂
                  </span>
                </td>
                <td className="px-4 py-2">{product.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerDashboardPage; 