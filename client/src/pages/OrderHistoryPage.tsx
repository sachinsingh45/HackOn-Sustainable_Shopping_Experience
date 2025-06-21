import React, { useEffect, useState } from 'react';
import { ordersAPI } from '../services/api';
import { Leaf, Package, Calendar, Loader2, IndianRupee } from 'lucide-react';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  carbonFootprint: number;
  ecoScore: number;
}

interface Order {
  _id: string;
  orderInfo?: {
    items: OrderItem[];
    totalAmount: number;
    totalEcoScore: number;
    totalCarbonSaved: number;
    moneySaved: number;
    orderDate: string;
    status: string;
    summary: {
      name: string;
      price: number;
      carbonFootprint: number;
      date: string;
      status: string;
    };
  };
  items?: OrderItem[];
  totalAmount?: number;
  totalEcoScore?: number;
  totalCarbonSaved?: number;
  moneySaved?: number;
  orderDate?: string;
  status?: string;
  summary?: {
    name: string;
    price: number;
    carbonFootprint: number;
    date: string;
    status: string;
  };
}

const OrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await ordersAPI.getUserOrders();
        if (response.status && Array.isArray(response.orders)) {
          setOrders(response.orders);
        } else {
          console.error('Invalid orders response:', response);
          setError('Failed to load orders: Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Helper function to get order data
  const getOrderData = (order: Order) => {
    const data = order.orderInfo || order;
    
    // Defensive: use first item if summary is missing
    const firstItem = (data.items && data.items.length > 0) ? data.items[0] : null;
    const itemCount = data.items ? data.items.length : 0;
    
    // Calculate total amount from items if totalAmount is missing
    const calculatedTotal = data.totalAmount || (data.items ? 
      data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) : 0);
    
    // Calculate total carbon saved from items if missing
    const calculatedCarbonSaved = data.totalCarbonSaved || (data.items ? 
      data.items.reduce((sum, item) => sum + (item.carbonFootprint * item.quantity), 0) : 0);
    
    return {
      items: data.items || [],
      totalAmount: calculatedTotal,
      totalEcoScore: data.totalEcoScore || 0,
      totalCarbonSaved: calculatedCarbonSaved,
      moneySaved: data.moneySaved || 0,
      orderDate: data.orderDate || new Date().toISOString(),
      status: data.status || 'Completed',
      summary: data.summary || {
        name: firstItem ? 
          (itemCount > 1 ? `${firstItem.name} +${itemCount - 1} more items` : firstItem.name) : 
          'Order',
        price: calculatedTotal,
        carbonFootprint: calculatedCarbonSaved,
        date: data.orderDate || new Date().toISOString(),
        status: data.status || 'Completed'
      }
    };
  };

  // Summary calculations
  const totalOrders = orders.length;
  const totalCO2 = orders.reduce((sum, order) => {
    const data = getOrderData(order);
    return sum + data.totalCarbonSaved;
  }, 0);
  const totalSpent = orders.reduce((sum, order) => {
    const data = getOrderData(order);
    return sum + data.totalAmount;
  }, 0);
  const totalSaved = orders.reduce((sum, order) => {
    const data = getOrderData(order);
    return sum + data.moneySaved;
  }, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-green-700 flex items-center gap-2">
        <Package className="w-8 h-8 text-green-500" /> Order History
      </h1>
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center border">
          <span className="text-2xl font-bold text-green-600">{totalOrders}</span>
          <span className="text-gray-600 mt-1">Total Orders</span>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center border">
          <span className="text-2xl font-bold text-blue-600 flex items-center">
            <IndianRupee className="w-5 h-5" />{totalSpent.toLocaleString()}
          </span>
          <span className="text-gray-600 mt-1">Total Spent</span>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center border">
          <span className="text-2xl font-bold text-green-700 flex items-center gap-1">
            {totalCO2.toFixed(1)} <Leaf className="w-5 h-5 text-green-400" />
          </span>
          <span className="text-gray-600 mt-1">CO₂ Saved (kg)</span>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center border">
          <span className="text-2xl font-bold text-green-600 flex items-center">
            <IndianRupee className="w-5 h-5" />{totalSaved.toLocaleString()}
          </span>
          <span className="text-gray-600 mt-1">Money Saved</span>
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
          {orders.map((order, idx) => {
            const data = getOrderData(order);
            return (
              <div key={order._id || idx} className="bg-white rounded-xl shadow-md border p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-800">{data.summary.name}</h2>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                      <Calendar className="w-4 h-4" />
                      <span>Ordered on {new Date(data.orderDate).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-2">
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {data.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600 flex items-center justify-end">
                      <IndianRupee className="w-5 h-5" />{data.totalAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {data.items.length} {data.items.length === 1 ? 'item' : 'items'}
                    </div>
                    <div className="text-xs text-green-700 mt-1 flex items-center gap-1">
                      Saved {data.totalCarbonSaved.toFixed(1)} kg <Leaf className="w-4 h-4" />
                    </div>
                  </div>
                </div>
                {/* Order Items */}
                {data.items.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Order Items:</h3>
                    <div className="space-y-2">
                      {data.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {item.name} x {item.quantity}
                          </span>
                          <span className="text-gray-800">
                            <IndianRupee className="w-3 h-3 inline" />{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage; 