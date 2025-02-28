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



axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (
        status === 403 &&
        data.message === 'Account is blocked, Please contact admin'
      ) {
        store.dispatch(logout());
        toast.error('Your account is blocked. You have been logged out.');
        window.location.href = '/';
      } else if (
        status === 401 &&
        data.message === 'Token expired, please login again'
      ) {
        store.dispatch(logout());
        toast.error('Session expired. Please log in again.');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
