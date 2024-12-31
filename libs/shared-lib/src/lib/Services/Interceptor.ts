import axios from 'axios';
const instance = axios.create({
  baseURL: process.env.NX_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
instance.interceptors.request.use(
  (config) => {
    // Add authorization token or other headers if needed
    const refresh_token = localStorage.getItem('refreshToken');
    if (refresh_token !== '' && refresh_token !== null) {
      try {
        config.headers.Authorization = `Bearer ${refresh_token}`;
      } catch (error) {
        console.error('Token refresh failed:', error);
        throw error;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    if (error.response?.status === 401) {
      console.error('Unauthorized, logging out...');
      localStorage.removeItem('authToken');
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default instance;
