import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import { userLogin } from '../../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { googleSignin } from '../../../services/user/authServices';

const GoogleSignInButton: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleSignup = async (response: any) => {
    try {
      const idToken = response.credential;
      const data = await googleSignin(idToken)

      if (data.success) {
        const {  user } = data.data;
        dispatch(userLogin({ user }));
        console.log('User details:', user);
        navigate(`/user/home`);
        toast.success('Login successful');
      } else {
        toast.error(data.message);
        console.error('Error during Google Sign-In:', data.message);
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
