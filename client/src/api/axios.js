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
  
  // VISUAL DEBUGGER FOR DEPLOYMENT:
  console.log("🚀 SENDING API REQUEST TO: ", config.baseURL + config.url);
  if (config.baseURL === '/api' && !window.location.hostname.includes('localhost')) {
     alert("⚠️ DEPLOYMENT ERROR: Your app is trying to send data to Vercel's static server instead of your real backend. You forgot to set VITE_API_URL in your Vercel Dashboard, or you forgot to Redeploy after setting it!");
  }
  
  return config;
});

export default api;
