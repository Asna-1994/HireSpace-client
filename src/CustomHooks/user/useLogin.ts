import { toast } from 'react-toastify';
import axiosInstance from '../../Utils/Instance/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userLogin } from '../../redux/slices/authSlice';
import { useState } from 'react';

const useLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const loginUser = async (email: string, password: string) => {
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/user/login', {
        email,
        password,
      });

      if (response.data.success) {
        const { token, user } = response.data.data;
        toast.success(response.data.message);
        dispatch(userLogin({ user, token }));
        console.log('User details:', user);
        if (
          user.userRole === 'companyAdmin' ||
          user.userRole === 'companyMember'
        ) {
          navigate(`/company/home/${user.companyId}`);
        } else {
          navigate(`/user/home/${user._id}`);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Something went wrong';
      toast.error(errorMessage);
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { loginUser, loading };
};

export default useLogin;
