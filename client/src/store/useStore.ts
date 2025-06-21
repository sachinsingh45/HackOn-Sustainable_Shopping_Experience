import { create } from 'zustand';
import { authAPI, productsAPI, cartAPI, ordersAPI, challengeAPI, aiAPI } from '../services/api';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  price: string;
  image: string;
  url: string;
  category: string;
  subCategory?: string;
  rating?: number;
  reviews?: number;
  carbonFootprint?: number;
  ecoScore?: number;
  isEcoFriendly?: boolean;
  groupBuyEligible?: boolean;
  description?: string;
  features?: string[];
  points: string[];
  mrp?: string;
  weight?: number;
}

interface CartItem {
  cartItem: Product;
  qty: number;
  id?: string;
}

interface Badge {
  id?: string;
  name: string;
  description?: string;
  iconUrl?: string;
  challengeId?: string;
  dateEarned?: string;
}

export type Challenge = {
  _id: string;
  id?: string;
  name: string;
  description: string;
  type: string;
  targetValue: number;
  rewardBadge: Badge;
  isActive: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
};

interface User {
  _id: string;
  name: string;
  email: string;
  number: string;
  cart: CartItem[];
  orders: any[];
  ecoScore: number;
  carbonSaved: number;
  moneySaved: number;
  circularityScore: number;
  achievements?: string[];
  location: string | {
    city: string;
    state: string;
    country: string;
    pin: string;
  };
  currentChallenges: string[];
  badges: Badge[];
}

interface Store {
  user: User | null;
  products: Product[];
  cart: CartItem[];
  searchQuery: string;
  selectedCategory: string;
  chatOpen: boolean;
  loading: boolean;
  error: string | null;
  challenges: Challenge[];
  chatPrefillMessage: string;
  
  // Actions
  setUser: (user: User | null) => void;
  setProducts: (products: Product[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setChallenges: (challenges: Challenge[]) => void;
  
  // Auth actions
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  
  // Product actions
  fetchProducts: () => Promise<void>;
  fetchProduct: (id: string) => Promise<Product | null>;
  searchProducts: (query: string) => Promise<void>;
  
  // Cart actions
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  checkout: (orderData?: any) => Promise<void>;
  
  // UI actions
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  toggleChat: () => void;
  
  // AI actions
  getEcoAlternatives: (productId: string) => Promise<any>;
  analyzeCart: () => Promise<any>;
  getChallenges: () => Promise<any>;
  chatWithAI: (message: string) => Promise<any>;

  // New actions
  fetchChallenges: () => Promise<void>;
  joinChallenge: (challengeId: string) => Promise<any>;
  completeChallenge: (challengeId: string) => Promise<any>;
  checkCompletion: () => Promise<any>;

  calculateCartFootprint: () => number;

  // If you need to implement orderProduct, use ordersAPI.createOrder or similar here

  setChatPrefillMessage: (msg: string) => void;
}

export const useStore = create<Store>((set, get) => ({
  user: null,
  products: [],
  cart: [],
  searchQuery: '',
  selectedCategory: 'all',
  chatOpen: false,
  loading: false,
  error: null,
  challenges: [],
  chatPrefillMessage: '',

  setUser: (user) => set({ user, cart: user?.cart || [] }),
  setProducts: (products) => set({ products }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setChallenges: (challenges) => set({ challenges }),

  // Auth actions
  login: async (credentials) => {
    try {
      set({ loading: true, error: null });
      const response = await authAPI.login(credentials);
      
      if (response.status) {
        // Fetch user data after successful login
        const userData = await authAPI.getAuthUser();
        set({ user: userData, cart: (userData.cart || []).map(item => ({ ...item, id: item.cartItem?._id })) });
        return true;
      }
      return false;
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Login failed' });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  register: async (userData) => {
    try {
      set({ loading: true, error: null });
      const response = await authAPI.register(userData);
      if (response.status) {
        return true;
      }
      // Handle validation errors from server
      if (response.message && Array.isArray(response.message)) {
        const errorMessage = response.message.map((err: any) => err.msg).join(', ');
        set({ error: errorMessage });
      } else {
        set({ error: 'Registration failed' });
      }
      return false;
    } catch (error: any) {
      // Clear any previous errors before setting new ones
      set({ error: null });
      
      if (error.response?.data?.message && Array.isArray(error.response.data.message)) {
        const errorMessage = error.response.data.message.map((err: any) => err.msg).join(', ');
        set({ error: errorMessage });
      } else {
        set({ error: error.response?.data?.message || 'Registration failed' });
      }
      return false;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await authAPI.logout();
      set({ user: null, cart: [] });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  checkAuth: async () => {
    try {
      const userData = await authAPI.getAuthUser();
      set({ user: userData, cart: (userData.cart || []).map(item => ({ ...item, id: item.cartItem?._id })) });
    } catch (error) {
      set({ user: null, cart: [] });
    }
  },

  // Product actions
  fetchProducts: async () => {
    try {
      set({ loading: true, error: null });
      const products = await productsAPI.getAllProducts();
      // Use only backend values, do not override or randomize any fields
      set({ products });
    } catch (error: any) {
      set({ error: 'Failed to fetch products' });
      console.error('Error fetching products:', error);
    } finally {
      set({ loading: false });
    }
  },

  fetchProduct: async (id) => {
    try {
      const product = await productsAPI.getProduct(id);
      return product;
    } catch (error) {
      return null;
    }
  },

  calculateCartFootprint: () => {
    const state = get();
    return state.cart.reduce((total, item) => {
      const cf = item.cartItem.carbonFootprint || 0;
      return total + cf * item.qty;
    }, 0);
  },

  searchProducts: async (query) => {
    try {
      set({ loading: true });
      const products = await productsAPI.searchProducts(query);
      set({ products });
    } catch (error) {
      set({ error: 'Search failed' });
    } finally {
      set({ loading: false });
    }
  },

  // Cart actions
  addToCart: async (productId) => {
    try {
      set({ loading: true, error: null });
      const response = await cartAPI.addToCart(productId);
      const userData = await authAPI.getAuthUser();
      set({ user: userData, cart: (userData.cart || []).map(item => ({ ...item, id: item.cartItem?._id })) });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to add to cart' });
    } finally {
      set({ loading: false });
    }
  },

  removeFromCart: async (productId) => {
    try {
      set({ loading: true, error: null });
      await cartAPI.removeFromCart(productId);
      const userData = await authAPI.getAuthUser();
      set({ user: userData, cart: (userData.cart || []).map(item => ({ ...item, id: item.cartItem?._id })) });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to remove from cart' });
    } finally {
      set({ loading: false });
    }
  },

  updateQuantity: async (productId, quantity) => {
    try {
      set({ loading: true, error: null });
      await cartAPI.updateCartQuantity(productId, quantity);
      const userData = await authAPI.getAuthUser();
      set({ user: userData, cart: (userData.cart || []).map(item => ({ ...item, id: item.cartItem?._id })) });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update quantity' });
    } finally {
      set({ loading: false });
    }
  },

  checkout: async (orderData?: any) => {
    try {
      set({ loading: true, error: null });
      const { cart, user } = get();
      
      if (!user) {
        throw new Error('User must be logged in to checkout');
      }

      if (cart.length === 0) {
        throw new Error('Cart is empty');
      }

      // Use provided order data or calculate from cart
      let finalOrderData;
      if (orderData) {
        // Use packaging data from cart page
        finalOrderData = {
          ...orderData,
          totalAmount: orderData.items.reduce((sum: number, item: any) => {
            const price = parseFloat(cart.find(c => c.cartItem._id === item.productId)?.cartItem.price.replace(/[^0-9.]/g, '') || '0');
            return sum + (price * item.quantity);
          }, 0),
          totalEcoScore: orderData.items.reduce((sum: number, item: any) => {
            const ecoScore = cart.find(c => c.cartItem._id === item.productId)?.cartItem.ecoScore || 0;
            return sum + (ecoScore * item.quantity);
          }, 0),
          totalCarbonSaved: orderData.totalCarbonFootprint || 0
        };
      } else {
        // Calculate order details from cart (fallback)
        const orderItems = cart.map((item: CartItem) => ({
          productId: item.cartItem._id,
          name: item.cartItem.name,
          quantity: item.qty,
          price: parseFloat(item.cartItem.price.replace(/[^0-9.]/g, '')),
          ecoScore: item.cartItem.ecoScore || 0,
          carbonFootprint: item.cartItem.carbonFootprint || 0
        }));

        const totalAmount = orderItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
        const totalEcoScore = orderItems.reduce((sum: number, item: any) => sum + (item.ecoScore * item.quantity), 0);
        const totalCarbonSaved = orderItems.reduce((sum: number, item: any) => sum + (item.carbonFootprint * item.quantity), 0);
        
        finalOrderData = {
          items: orderItems,
          totalAmount,
          totalEcoScore,
          totalCarbonSaved,
          moneySaved: 0
        };
      }

      await ordersAPI.createOrder(finalOrderData);

      // Update product sales count for each product
      await Promise.all(finalOrderData.items.map((item: any) =>
        axios.patch(`http://localhost:8000/api/products/${item.productId}/sales`, { quantity: item.quantity }, { withCredentials: true })
      ));
      
      // Refresh user data to get updated stats
      const userData = await authAPI.getAuthUser();
      set({ user: userData, cart: [] });
      
    } catch (error: any) {
      set({ error: error.response?.data?.message || error.message || 'Checkout failed' });
    } finally {
      set({ loading: false });
    }
  },

  // UI actions
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  toggleChat: () => set((state) => ({ chatOpen: !state.chatOpen })),

  // AI actions
  getEcoAlternatives: async (productId) => {
    try {
      const state = get();
      const product = state.products.find(p => p._id === productId);
      if (!product) return { alternatives: [] };

      const userHistory = state.user?.orders || [];
      // Remove GeminiAI call, return empty or static for now
      return { alternatives: [], insights: 'Not available' };
    } catch (error) {
      return { alternatives: [], insights: 'Unable to get recommendations' };
    }
  },

  analyzeCart: async () => {
    try {
      // Remove GeminiAI call, return static for now
      return {
        totalCarbonFootprint: "0",
        wasteGenerated: "0",
        ecoScore: 50,
        improvements: []
      };
    } catch (error) {
      return {
        totalCarbonFootprint: "0",
        wasteGenerated: "0",
        ecoScore: 50,
        improvements: []
      };
    }
  },

  getChallenges: async () => {
    try {
      const state = get();
      if (!state.user) return { challenges: [] };
      // Remove GeminiAI call, return static for now
      return { challenges: [] };
    } catch (error) {
      return { challenges: [] };
    }
  },

  chatWithAI: async (message) => {
    try {
      const state = get();
      const userId = state.user?._id;
      // Add summarization prompt for general chat
      let prompt = message;
      // Only add the summarization instruction if not a special intent
      if (!/eco alternative|eco-friendly alternative|carbon footprint|challenge|badge|progress|order|cart|product|analyze/i.test(message)) {
        prompt = `${message}\n\nPlease respond in a single, complete summary under 40 words. Do not use ellipses (...), 'etc.', or any indication of omitted content. Always provide a full, self-contained answer.`;
      }
      // Use new backend DeepSeek/Cohere endpoint
      const response = await aiAPI.greenPartnerChat(prompt, userId);
      return response; // Return all fields for custom rendering
    } catch (error) {
      return {
        message: "I'm here to help you make sustainable choices!",
        suggestions: []
      };
    }
  },

  fetchChallenges: async () => {
    const challenges = await challengeAPI.getChallenges();
    // Map _id to id for frontend compatibility
    const mapped = challenges.map((c: any) => ({
      ...c,
      id: c._id,
    }));
    set({ challenges: mapped });
  },

  joinChallenge: async (challengeId: string) => {
    const response = await challengeAPI.joinChallenge(challengeId);
    if (response.status) {
      set((state) => ({
        user: state.user ? { ...state.user, currentChallenges: response.currentChallenges } : null
      }));
    }
    return response;
  },

  completeChallenge: async (challengeId: string) => {
    const response = await challengeAPI.completeChallenge(challengeId);
    if (response.status) {
      set((state) => ({
        user: state.user ? { ...state.user, badges: response.badges } : null
      }));
    }
    return response;
  },

  checkCompletion: async () => {
    const response = await challengeAPI.checkCompletion();
    if (response.status) {
      set((state) => ({
        user: state.user ? { ...state.user, badges: response.badges } : null
      }));
    }
    return response;
  },

  // If you need to implement orderProduct, use ordersAPI.createOrder or similar here

  setChatPrefillMessage: (msg: string) => set({ chatPrefillMessage: msg }),
}));