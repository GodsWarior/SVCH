import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Customers API
export const customersAPI = {
  getAll: (params) => api.get('/customers', { params }),
  getAllSorted: (params) => api.get('/customers/all', { params }),
  getAllFiltered: (params) => api.get('/customers/filtered', { params }),
  getById: (id) => api.get(`/customers/${id}`),
  exists: (id) => api.get(`/customers/${id}/exists`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
  search: (params) => api.get('/customers/search', { params }),
  getWithOrders: (id) => api.get(`/customers/${id}/with-orders`),
  getStatistics: (id) => api.get(`/customers/${id}/statistics`)
};

// Couriers API
export const couriersAPI = {
  getAll: (params) => api.get('/couriers', { params }),
  getAllSorted: (params) => api.get('/couriers/all', { params }),
  getAllFiltered: (params) => api.get('/couriers/filtered', { params }),
  getById: (id) => api.get(`/couriers/${id}`),
  exists: (id) => api.get(`/couriers/${id}/exists`),
  create: (data) => api.post('/couriers', data),
  update: (id, data) => api.put(`/couriers/${id}`, data),
  delete: (id) => api.delete(`/couriers/${id}`),
  search: (params) => api.get('/couriers/search', { params }),
  getWithOrders: (id) => api.get(`/couriers/${id}/with-orders`)
};

// Products API
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getAllSorted: (params) => api.get('/products/all', { params }),
  getAllFiltered: (params) => api.get('/products/filtered', { params }),
  getById: (id) => api.get(`/products/${id}`),
  exists: (id) => api.get(`/products/${id}/exists`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  search: (params) => api.get('/products/search', { params }),
  getWithOrderItems: (id) => api.get(`/products/${id}/with-order-items`),
  getStatistics: (id) => api.get(`/products/${id}/statistics`)
};

// Orders API
export const ordersAPI = {
  getAll: (params) => api.get('/orders', { params }),
  getAllSorted: (params) => api.get('/orders/all', { params }),
  getAllFiltered: (params) => api.get('/orders/filtered', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  exists: (id) => api.get(`/orders/${id}/exists`),
  create: (data) => api.post('/orders', data),
  update: (id, data) => api.put(`/orders/${id}`, data),
  delete: (id) => api.delete(`/orders/${id}`),
  search: (params) => api.get('/orders/search', { params }),
  getAllDetailed: (params) => api.get('/orders/detailed/all', { params }),
  getDetailed: (id) => api.get(`/orders/${id}/detailed`),
  getByStatus: (status, params) => api.get(`/orders/status/${status}`, { params })
};

export default api;
