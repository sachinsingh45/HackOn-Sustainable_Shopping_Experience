import { create } from 'zustand';
import { authAPI, productsAPI, cartAPI, ordersAPI } from '../services/api';
import { geminiAI } from '../services/geminiAI';

interface Product {
  _id: string;
  id: string;
  name: string;
  price: string;
  value: string;
  accValue: number;
  image: string;
  url: string;
  category: string;
  rating?: number;
  reviews?: number;
  carbonFootprint?: number;
  ecoScore?: number;
  isEcoFriendly?: boolean;
  groupBuyEligible?: boolean;
  description?: string;
  features?: string[];
  points: string[];
}

interface CartItem {
  id: string;
  cartItem: Product;
  qty: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
  number: string;
  cart: CartItem[];
  orders: any[];
  ecoScore?: number;
  carbonSaved?: number;
  moneySaved?: number;
  circularityScore?: number;
  achievements?: string[];
  location?: string;
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
  
  // Actions
  setUser: (user: User | null) => void;
  setProducts: (products: Product[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
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
  
  // UI actions
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  toggleChat: () => void;
  
  // AI actions
  getEcoAlternatives: (productId: string) => Promise<any>;
  analyzeCart: () => Promise<any>;
  getChallenges: () => Promise<any>;
  chatWithAI: (message: string) => Promise<any>;

// Add this to the Store interface:
calculateCartFootprint: () => number;
}

// Add this implementation inside your zustand store:



export const useStore = create<Store>((set, get) => ({
  user: null,
  products: [],
  cart: [],
  searchQuery: '',
  selectedCategory: 'all',
  chatOpen: false,
  loading: false,
  error: null,

  setUser: (user) => set({ user, cart: user?.cart || [] }),
  setProducts: (products) => set({ products }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Auth actions
  login: async (credentials) => {
    try {
      set({ loading: true, error: null });
      const response = await authAPI.login(credentials);
      
      if (response.status) {
        // Fetch user data after successful login
        const userData = await authAPI.getAuthUser();
        set({ user: userData, cart: userData.cart || [] });
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
      return true;
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Registration failed' });
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
      set({ user: userData, cart: userData.cart || [] });
    } catch (error) {
      set({ user: null, cart: [] });
    }
  },

  // Product actions
  fetchProducts: async () => {
    try {
      set({ loading: true, error: null });
      const products = await productsAPI.getAllProducts();
      
      // Enhance products with eco data
      const enhancedProducts = products.map((product: any) => ({
        ...product,
        rating: Math.random() * 2 + 3, // Random rating between 3-5
        reviews: Math.floor(Math.random() * 5000) + 100,
        carbonFootprint: Math.random() * 5 + 0.5,
        ecoScore: Math.floor(Math.random() * 40) + 60,
        isEcoFriendly: Math.random() > 0.6,
        groupBuyEligible: Math.random() > 0.7,
        category: product.category || 'General',
        image: product.url || 'https://images.pexels.com/photos/1029236/pexels-photo-1029236.jpeg'
      }));
      
      set({ products: enhancedProducts });
    } catch (error: any) {
      set({ error: 'Failed to fetch products' });
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
      const response = await cartAPI.addToCart(productId);
      if (response.status) {
        set({ user: response.message, cart: response.message.cart });
      }
    } catch (error: any) {
      set({ error: 'Failed to add to cart' });
    }
  },

  removeFromCart: async (productId) => {
    try {
      await cartAPI.removeFromCart(productId);
      const state = get();
      if (state.user) {
        const updatedCart = state.cart.filter(item => item.id !== productId);
        set({ cart: updatedCart });
      }
    } catch (error) {
      set({ error: 'Failed to remove from cart' });
    }
  },

  updateQuantity: async (productId, quantity) => {
    try {
      await cartAPI.updateCartQuantity(productId, quantity);
      const state = get();
      if (state.user) {
        const updatedCart = state.cart.map(item =>
          item.id === productId ? { ...item, qty: quantity } : item
        );
        set({ cart: updatedCart });
      }
    } catch (error) {
      set({ error: 'Failed to update quantity' });
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
      const product = state.products.find(p => p.id === productId);
      if (!product) return { alternatives: [] };

      const userHistory = state.user?.orders || [];
      return await geminiAI.getEcoAlternatives(product, state.products, userHistory);
    } catch (error) {
      return { alternatives: [], insights: 'Unable to get recommendations' };
    }
  },

  analyzeCart: async () => {
    try {
      const state = get();
      return await geminiAI.analyzeCartSustainability(state.cart, state.products);
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
      
      return await geminiAI.generatePersonalizedChallenges(
        state.user,
        state.user.orders
      );
    } catch (error) {
      return { challenges: [] };
    }
  },

  chatWithAI: async (message) => {
    try {
      const state = get();
      const context = {
        user: state.user,
        cart: state.cart,
        recentProducts: state.products.slice(0, 10)
      };
      
      return await geminiAI.chatResponse(message, context);
    } catch (error) {
      return {
        message: "I'm here to help you make sustainable choices!",
        suggestions: []
      };
    }
  }
}));