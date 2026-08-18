// API Service Wrapper for Backend Microservices
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('auth_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Parse response json
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage = (typeof data === 'object' && data?.detail) 
        ? data.detail 
        : `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error.message);
    throw error;
  }
}

export const api = {
  // Health
  getHealth: () => request('/health'),

  // Auth
  register: (email, password) => 
    request('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  login: (email, password) => 
    request('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // Products
  getProducts: () => request('/api/v1/products'),

  createProduct: (productData) => 
    request('/api/v1/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }),

  // Orders
  getOrders: () => request('/api/v1/orders'),

  createOrder: (orderData) => 
    request('/api/v1/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),
};
