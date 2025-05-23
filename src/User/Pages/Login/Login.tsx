import React, { useRef, useState } from 'react';
import Header from '../../Components/Header/Header';
import { Link, useNavigate } from 'react-router-dom';
import GoogleSignInButton from '../../Components/GoogleSignin/GoogleSignin';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import axiosInstance from '../../../Utils/Instance/axiosInstance';
import { userLogin } from '../../../redux/slices/authSlice';

const Login = () => {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);




 const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);


  const handleLogin = async (event: React.FormEvent) => {
    
       event.preventDefault();

             const email = emailRef.current?.value || '';
    const password = passwordRef.current?.value || '';
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
        const {  user } = response.data.data;
        console.log(user)
        toast.success(response.data.message);
        dispatch(userLogin({ user}));
        console.log('User details:', user);
        if (
          user.userRole === 'companyAdmin' ||
          user.userRole === 'companyMember'
        ) {
          navigate(`/company/home`);
        } else {
          navigate(`/user/home`);
        }
      } else {
        toast.error(response.data.message);
        console.log(response)
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Something went wrong';
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
            <div className="flex items-center justify-center py-8">
                <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
              </div>
    );
  }

  return (
    <>
      <Header />
      <div
        className="flex items-center justify-center min-h-screen bg-center bg-cover"
        style={{
          backgroundImage: `url('https://plus.unsplash.com/premium_photo-1678917827802-721b5f5b4bf0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8am9iJTIwc2VhcmNofGVufDB8fDB8fHww')`,
        }}
      >
        <div className="w-full max-w-md p-8 text-white bg-black rounded-lg shadow-lg bg-opacity-65">
          <h2 className="mb-6 text-3xl font-bold text-center">User Log In</h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="email"
              name="email"
              ref={emailRef}
              className="p-2 text-white placeholder-gray-400 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Email"
              required
            />
            <input
              type="password"
              name="password"
              ref={passwordRef}
              className="p-2 text-white placeholder-gray-400 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Password"
              required
            />
            <button
              type="submit"
              className="w-full py-2 font-semibold text-white transition duration-300 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 hover:bg-blue-700"
            >
              Log In
            </button>
          </form>

          <div className="flex items-center justify-between mt-4">
            <Link
              to="/user/forgot-password"
              className="text-sm text-gray-200 hover:underline"
            >
              Forgot Password?
            </Link>
            <p className="text-sm text-gray-200">
              New Here?{' '}
              <Link
                to="/user/signup"
                className="font-medium text-white hover:underline"
              >
                Signup
              </Link>
            </p>
          </div>

          <p className="p-2 text-center">OR</p>
          <div className="flex justify-center w-full">
            <div className="w-full">
              <GoogleSignInButton />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
