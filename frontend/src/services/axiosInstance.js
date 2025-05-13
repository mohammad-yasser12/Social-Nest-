import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3039/api', // Your backend base URL
  withCredentials: true, // Optional: use if you're handling cookies
});

// Add a request interceptor to attach the token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;

