
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import store from '../../redux/store';
// import { logout } from '../../redux/slices/authSlice';

// const BASE_URL =
//   import.meta.env.MODE === 'production'
//     ? import.meta.env.VITE_BACKEND_URL
//     : `${import.meta.env.VITE_BACKEND_URL}/api`;

// const axiosInstance = axios.create({
//   baseURL: BASE_URL,
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });


// let isRefreshing = false;

// let failedQueue : any = [];


// const processQueue = (error  :any, token = null) => {
//   failedQueue.forEach((prom : any) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
  

//   failedQueue = [];
// };


// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;


//     if (!error.response || (error.response.status !== 401 && error.response.data.message !== 'Token expired') || originalRequest._retry) {

//       if (error.response) {
//         const { status, data } = error.response;

//         if (status === 403 && data.message === 'Account is blocked, Please contact admin') {
//           store.dispatch(logout());
//           toast.error('Your account is blocked. You have been logged out.');
//           window.location.href = '/';
//         } else if (status === 401 && data.message === 'Invalid refresh token, please login again') {
//           store.dispatch(logout());
//           toast.error('Session expired. Please log in again.');
//           window.location.href = '/';
//         }
//       }
//       return Promise.reject(error);
//     }


//     originalRequest._retry = true;


//     if (isRefreshing) {
//       return new Promise((resolve, reject) => {
//         failedQueue.push({ resolve, reject });
//       })
//         .then(() => {
//           return axiosInstance(originalRequest);
//         })
//         .catch(err => Promise.reject(err));
//     }

  
//     isRefreshing = true;

//     try {
//   const { data } = await axiosInstance.post('/auth/refresh');
//   processQueue(null, data.token);

//   isRefreshing = false;

//   return axiosInstance(originalRequest);
// } catch (refreshError) {
//   processQueue(refreshError);

//   isRefreshing = false;

//   store.dispatch(logout());
//   toast.error('Session expired. Please log in again.');
//   window.location.href = '/';

//   return Promise.reject(refreshError);
// }

//   }
// );

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

let isRefreshing = false;
let failedQueue: any = [];

const processQueue = (error: any, token = null) => {
  failedQueue.forEach((prom: any) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // First, handle specific error cases that don't need token refresh
    if (error.response) {
      const { status, data } = error.response;

      if (status === 403 && data.message === 'Account is blocked, Please contact admin') {
        store.dispatch(logout());
        toast.error('Your account is blocked. You have been logged out.');
        window.location.href = '/';
        return Promise.reject(error);
      }

      if (status === 401 && data.message === 'Invalid token. Please login again') {
        store.dispatch(logout());
        toast.error('Session expired. Please log in again.');
        window.location.href = '/';
        return Promise.reject(error);
      }
     if (status === 400 && data.message === 'Refresh token required for new access token') {
        store.dispatch(logout());
        toast.error('Session expired. Please log in again.');
        window.location.href = '/';
        return Promise.reject(error);
      }


    }

    // DEBUG: Log all 401 errors to see what we're getting
    if (error.response && error.response.status === 401) {
      console.log('=== 401 ERROR DEBUG ===');
  
    }

    // Only proceed with token refresh if:
    // 1. There's a response
    // 2. Status is 401
    // 3. Message is exactly "Token expired"
    // 4. This is not a retry attempt
    if (
      !error.response ||
      error.response.status !== 401 ||
        !['Token expired', 'Authorization token missing'].includes(error.response.data?.message) ||
      // error.response.data?.message !== 'Token expired' ||
      originalRequest._retry
    ) {

      return Promise.reject(error);
    }

    console.log('✅ Proceeding with token refresh');

    // Token refresh logic for expired tokens
    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => {
          return axiosInstance(originalRequest);
        })
        .catch(err => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      const { data } = await axiosInstance.post('/auth/refresh');
      processQueue(null, data.token);
      isRefreshing = false;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      isRefreshing = false;
      store.dispatch(logout());
      toast.error('Session expired. Please log in again.');
      window.location.href = '/';
      return Promise.reject(refreshError);
    }
  }
);




export default axiosInstance;
