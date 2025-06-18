import React, { useEffect, useState } from 'react';
import { ordersAPI } from '../services/api';
import { Leaf, Package, Calendar, Loader2 } from 'lucide-react';

interface Order {
  _id: string;
  orderInfo?: {
    name: string;
    image?: string;
    price: number;
    date: string;
    carbonFootprint?: number;
    status?: string;
  };
  name?: string;
  image?: string;
  price?: number;
  date?: string;
  carbonFootprint?: number;
  status?: string;
}

const OrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await ordersAPI.getUserOrders();
        setOrders(data.orders || data);
      } catch (err) {
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Summary calculations
  const totalOrders = orders.length;
  const totalCO2 = orders.reduce((sum, o) => sum + (o.orderInfo?.carbonFootprint || o.carbonFootprint || 0), 0);
  const totalSpent = orders.reduce((sum, o) => sum + (o.orderInfo?.price || o.price || 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-green-700 flex items-center gap-2">
        <Package className="w-8 h-8 text-green-500" /> Order History
      </h1>
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center border">
          <span className="text-2xl font-bold text-green-600">{totalOrders}</span>
          <span className="text-gray-600 mt-1">Total Orders</span>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center border">
          <span className="text-2xl font-bold text-blue-600">₹{totalSpent}</span>
          <span className="text-gray-600 mt-1">Total Spent</span>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center border">
          <span className="text-2xl font-bold text-green-700 flex items-center gap-1">
            {totalCO2} <Leaf className="w-5 h-5 text-green-400" />
          </span>
          <span className="text-gray-600 mt-1">CO₂ Saved (kg)</span>
        </div>
      </div>
      {/* Orders List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin w-10 h-10 text-green-500" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-10">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-gray-500 text-center py-16 text-lg">No orders yet. Start shopping to see your order history!</div>
      ) : (
        <div className="grid gap-6">
          {orders.slice().reverse().map((order, idx) => {
            const info = order.orderInfo || order;
            return (
              <div key={order._id || idx} className="bg-white rounded-xl shadow-md border flex flex-col sm:flex-row items-center p-4 gap-4 hover:shadow-lg transition-shadow">
                <img
                  src={info.image || 'https://images.pexels.com/photos/1029236/pexels-photo-1029236.jpeg?auto=compress&cs=tinysrgb&w=100'}
                  alt={info.name}
                  className="w-24 h-24 object-cover rounded-lg border"
                />
                <div className="flex-1 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{info.name}</h2>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                      <Calendar className="w-4 h-4" />
                      <span>Ordered on {info.date ? new Date(info.date).toLocaleDateString() : '-'}</span>
                    </div>
                    <div className="mt-2">
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {info.status || 'Delivered'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600">₹{info.price}</div>
                    <div className="text-xs text-green-700 mt-1 flex items-center gap-1">
                      Saved {info.carbonFootprint || 0} kg <Leaf className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage; 