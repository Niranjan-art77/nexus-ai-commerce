import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add Auth Token automatically
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const apiService = {
  // Auth endpoints
  login: async (credentials: any) => {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  },
  register: async (userData: any) => {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },
  getMe: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },
  elevateRole: async (role?: string) => {
    const { data } = await api.put('/auth/elevate', { role });
    return data;
  },

  // Products
  getProducts: async (params?: any) => {
    const { data } = await api.get('/products', { params });
    return data;
  },
  getProductById: async (id: string) => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },
  createProduct: async (productData: any) => {
    const { data } = await api.post('/products', productData);
    return data;
  },
  updateProduct: async (id: string, productData: any) => {
    const { data } = await api.put(`/products/${id}`, productData);
    return data;
  },
  deleteProduct: async (id: string) => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  },
  addProductReview: async (id: string, review: any) => {
    const { data } = await api.post(`/products/${id}/reviews`, review);
    return data;
  },

  // Orders
  getOrders: async () => {
    const { data } = await api.get('/orders');
    return data;
  },
  createOrder: async (orderData: any) => {
    const { data } = await api.post('/orders', orderData);
    return data;
  },
  getOrderById: async (id: string) => {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },
  updateOrderStatus: async (id: string, status: string) => {
    const { data } = await api.put(`/orders/${id}/status`, { status });
    return data;
  },

  // AI
  chatCopilot: async (message: string) => {
    const { data } = await api.post('/ai/copilot', { message });
    return data;
  },
  getAIProfile: async () => {
    const { data } = await api.get('/ai/profile');
    return data;
  },
  generateProfileDNA: async (answers: string[]) => {
    const { data } = await api.post('/ai/dna', { answers });
    return data;
  },
};
