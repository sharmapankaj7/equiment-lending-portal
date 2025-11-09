import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
};

// Equipment API
export const equipmentAPI = {
  getAll: (params) => api.get('/equipment', { params }),
  getById: (id) => api.get(`/equipment/${id}`),
  create: (data) => api.post('/equipment', data),
  update: (id, data) => api.put(`/equipment/${id}`, data),
  delete: (id) => api.delete(`/equipment/${id}`),
};

// Borrow Request API
export const borrowRequestAPI = {
  getAll: (params) => api.get('/borrow-requests', { params }),
  getById: (id) => api.get(`/borrow-requests/${id}`),
  create: (data) => api.post('/borrow-requests', data),
  approve: (id) => api.put(`/borrow-requests/${id}/approve`),
  reject: (id, reason) => api.put(`/borrow-requests/${id}/reject`, { reason }),
  markReturned: (id, notes) => api.put(`/borrow-requests/${id}/return`, { notes }),
};

export default api;
