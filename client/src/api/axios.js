import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Interceptor to add JWT token and API Key to headers if they exist
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Circulate the API key in all requests
  const apiKey = import.meta.env.VITE_API_KEY;
  if (apiKey) {
    config.headers['x-api-key'] = apiKey;
  }
  
  return config;
});

export default api;
