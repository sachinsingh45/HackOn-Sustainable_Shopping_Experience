import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API calls
export const authAPI = {
  register: async (userData: {
    name: string;
    number: string;
    email: string;
    password: string;
    confirmPassword: string;
    location?: string;
  }) => {
    const response = await api.post('/register', userData);
    return response.data;
  },

  login: async (credentials: { 
    email: string; 
    password: string;
    rememberMe?: boolean;
  }) => {
    const response = await api.post('/login', credentials);
    return response.data;
  },

  logout: async () => {
    const response = await api.get('/logout');
    return response.data;
  },

  getAuthUser: async () => {
    const response = await api.get('/getAuthUser');
    return response.data;
  },
};

// Products API calls
export const productsAPI = {
  getAllProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  getProduct: async (id: string) => {
    const response = await api.get(`/product/${id}`);
    return response.data;
  },

  searchProducts: async (query: string) => {
    const response = await api.get(`/products/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  getProductsByCategory: async (category: string) => {
    const response = await api.get(`/products/category/${category}`);
    return response.data;
  },
};

// Cart API calls
export const cartAPI = {
  addToCart: async (productId: string) => {
    const response = await api.post(`/addtocart/${productId}`);
    return response.data;
  },

  removeFromCart: async (productId: string) => {
    const response = await api.delete(`/delete/${productId}`);
    return response.data;
  },

  updateCartQuantity: async (productId: string, quantity: number) => {
    const response = await api.put(`/cart/update/${productId}`, { quantity });
    return response.data;
  },
};

// Orders API calls
export const ordersAPI = {
  createOrder: async (orderData: any) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  getUserOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  getOrder: async (orderId: string) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },
};

// AI API calls
export const aiAPI = {
  getEcoAlternatives: async (productId: string, userPreferences: any) => {
    const response = await api.post('/ai/eco-alternatives', {
      productId,
      userPreferences,
    });
    return response.data;
  },

  analyzeCart: async (cartItems: any[]) => {
    const response = await api.post('/ai/analyze-cart', { cartItems });
    return response.data;
  },

  getChallenges: async (userId: string) => {
    const response = await api.get(`/ai/challenges/${userId}`);
    return response.data;
  },

  chatWithBot: async (message: string, context: any) => {
    const response = await api.post('/ai/chat', { message, context });
    return response.data;
  },
};

// Challenge API
export const challengeAPI = {
  getChallenges: async () => {
    const response = await api.get('/challenges');
    return response.data;
  },
  joinChallenge: async (challengeId: string) => {
    const response = await api.post(`/challenges/join/${challengeId}`);
    return response.data;
  },
  completeChallenge: async (challengeId: string) => {
    const response = await api.post(`/challenges/complete/${challengeId}`);
    return response.data;
  },
};

export const orderAPI = {
  orderProduct: async (productId: string) => {
    const response = await api.post(`/order/${productId}`);
    return response.data;
  },
};

export default api;