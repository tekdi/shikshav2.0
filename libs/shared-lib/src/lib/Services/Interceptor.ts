import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
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
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined') {
      if (error.response?.status === 401) {
        console.error('Unauthorized, logging out...');
        localStorage.removeItem('authToken');
        navigate('/login');
      } else if (!error.response) {
        console.error('Network error occurred');
      }
    }
    if (!(error instanceof Error)) {
      return Promise.reject(
        new Error(error?.message || 'An unknown error occurred')
      );
    }
    return Promise.reject(error);
  }
);

export default instance;
