import axios from 'axios';

const baseURL = 'http://localhost:3000';
console.log('Base URL-services:', baseURL);
const instance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
instance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const refresh_token = localStorage.getItem('refreshToken');
      if (refresh_token) {
        config.headers.Authorization = `Bearer ${refresh_token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      console.error('Unauthorized, logging out...');
      localStorage.removeItem('authToken');
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default instance;
