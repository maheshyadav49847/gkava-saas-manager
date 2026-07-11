import axios from 'axios';
import { appsettings } from '../config/appsettings';

const api = axios.create({
  baseURL: appsettings.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // We can add the Auth Token here later for Admin APIs
    // const token = localStorage.getItem('adminToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors (e.g., 401 Unauthorized -> redirect to login)
    return Promise.reject(error);
  }
);

export default api;
