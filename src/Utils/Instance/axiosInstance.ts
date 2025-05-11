
import axios from 'axios';
import { toast } from 'react-toastify';
import store from '../../redux/store';
import { logout } from '../../redux/slices/authSlice';

const BASE_URL =
  import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_BACKEND_URL
    : `${import.meta.env.VITE_BACKEND_URL}/api`;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple refresh requests
let isRefreshing = false;
// Queue of requests to retry after token refresh
let failedQueue : any = [];

// Process the queue of failed requests
const processQueue = (error  :any, token = null) => {
  failedQueue.forEach((prom : any) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  // Reset the queue
  failedQueue = [];
};

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is not a 401 or we've already tried to refresh, reject
    if (!error.response || error.response.status !== 401 || originalRequest._retry) {
      // Handle specific error cases
      if (error.response) {
        const { status, data } = error.response;

        if (status === 403 && data.message === 'Account is blocked, Please contact admin') {
          store.dispatch(logout());
          toast.error('Your account is blocked. You have been logged out.');
          window.location.href = '/';
        } else if (status === 401 && data.message === 'Invalid refresh token, please login again') {
          // If refresh token is invalid, logout
          store.dispatch(logout());
          toast.error('Session expired. Please log in again.');
          window.location.href = '/';
        }
      }
      return Promise.reject(error);
    }

    // Mark that we've attempted to retry this request
    originalRequest._retry = true;

    // If we're already refreshing, add this request to the queue
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => {
          return axiosInstance(originalRequest);
        })
        .catch(err => Promise.reject(err));
    }

    // Start refreshing
    isRefreshing = true;

    try {
      // Call refresh token endpoint
      await axiosInstance.post('/auth/refresh');
      
      // Process the queue with success
      processQueue(null);
      
      // Reset refreshing flag
      isRefreshing = false;
      
      // Retry the original request
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      // Process the queue with error
      processQueue(refreshError);
      
      // Reset refreshing flag
      isRefreshing = false;

      // If refresh token request fails, logout the user
      store.dispatch(logout());
      toast.error('Session expired. Please log in again.');
      window.location.href = '/';
      
      return Promise.reject(refreshError);
    }
  }
);

export default axiosInstance;