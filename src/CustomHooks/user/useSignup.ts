import { useState } from 'react';
import axiosInstance from '../../Utils/Instance/axiosInstance';
import { ApiResponse, SignupFormData } from '../../Utils/Interfaces/interface';
import { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const useSignup = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const submitSignupForm = async (formData: SignupFormData): Promise<void> => {
    setLoading(true);

    try {
      const response: AxiosResponse<ApiResponse> = await axiosInstance.post(
        '/user/signup',
        formData
      );
      console.log(response.data.data.user);
      if (response.data.success && response.data.data?.user) {
        const user = response.data.data.user;
        toast.success(response.data.message);
        navigate('/user/verify-otp', { state: { user } });
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return { submitSignupForm, loading };
};

export default useSignup;
