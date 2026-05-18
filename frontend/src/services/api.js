import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me')
};

// Employee services
export const employeeService = {
  addEmployee: (data) => api.post('/employees', data),
  getAllEmployees: () => api.get('/employees'),
  getMyProfile: () => api.get('/employees/me'),
  getEmployeeById: (id) => api.get(`/employees/${id}`),
  searchEmployees: (params) => api.get('/employees/search', { params }),
  updateEmployee: (id, data) => api.put(`/employees/${id}`, data),
  deleteEmployee: (id) => api.delete(`/employees/${id}`)
};

// AI services
export const aiService = {
  getRecommendation: (employeeId) => api.post('/ai/recommend', { employeeId }),
  rankEmployees: (params) => api.get('/ai/rank', { params }),
  getBatchRecommendations: (params) => api.get('/ai/batch-recommendations', { params })
};

export default api;
