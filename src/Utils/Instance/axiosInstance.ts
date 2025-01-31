
import axios from "axios";
import { toast } from "react-toastify";
import store from "../../redux/store";
import { logout } from "../../redux/slices/authSlice";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api", 
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});




axiosInstance.interceptors.response.use(
  response => response,
  error => {
      if (error.response && error.response.status === 403 && error.response.data.message === 'Account is blocked, Please contact admin') {
        store.dispatch(logout());
        window.location.href = '/';
         toast.error('Your account is blocked. You have been logged out.');
     
      }
      return Promise.reject(error);
  }
);


export default axiosInstance;
