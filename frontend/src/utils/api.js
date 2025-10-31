import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('artist');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Artist APIs
export const artistAPI = {
  getAll: () => api.get('/artists'),
  getByUsername: (username) => api.get(`/artists/${username}`),
  getStats: (username) => api.get(`/artists/${username}/stats`),
};

// Art APIs
export const artAPI = {
  getMyArt: () => api.get('/art/my-artworks'),
  create: (data) => api.post('/art', data),
  update: (id, data) => api.put(`/art/${id}`, data),
  delete: (id) => api.delete(`/art/${id}`),
};

// Upload API
export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteImage: (publicId) => api.delete('/upload', { data: { publicId } }),
};

// Competition API
export const competitionAPI = {
  getCurrent: () => api.get('/competition/current'),
  getLeaderboard: () => api.get('/competition/leaderboard'),
  getMyRank: () => api.get('/competition/my-rank'),
  recalculate: () => api.post('/competition/recalculate'),
};

export default api;
