import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axiosInstance from '../../../Utils/Instance/axiosInstance';
import { toast } from 'react-toastify';
import { userLogin } from '../../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const GoogleSignInButton: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleSignup = async (response: any) => {
    try {
      const idToken = response.credential;
      const res = await axiosInstance.post('/user/google/callback', {
        credential: idToken,
      });

      if (res.data.success) {
        const { token, user } = res.data.data;
        console.log(token);
        dispatch(userLogin({ user, token }));
        console.log('User details:', user);
        navigate(`/user/home/${user._id}`);
        toast.success('Login successful');
      } else {
        toast.error(res.data.message);
        console.error('Error during Google Sign-In:', res.data.message);
      }
    } catch (err: any) {
      console.error('Error during Google Sign-In:', err);
      toast.error(err.response.data.message);
    }
  };

  const handleError = () => {
    console.error('Google Sign-In failed');
    toast.error('Google Sign-In failed');
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleSignup}
      onError={handleError}
      useOneTap
    />
  );
};

export default GoogleSignInButton;
