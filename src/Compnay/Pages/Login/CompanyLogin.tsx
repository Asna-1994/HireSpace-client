import React, { useRef } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { companyLogin } from '../../../redux/slices/authSlice';
import CompanyHeader from '../../Components/Header/Header';
import { loginCompany } from '../../../services/company/authService';

const CompanyLogin = () => {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    try {
const data = await loginCompany(email, password)
      if (data.success) {
        const { company, user } = data.data;
        console.log(data.data)
        toast.success(data.message);
        dispatch(companyLogin({ company,  user }));
        console.log('User details:',user, company);
        navigate(`/company/home`);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <>
      <CompanyHeader />
      <div
        className="flex items-center justify-center min-h-screen bg-center bg-cover"
        style={{
          backgroundImage: `url('https://media.istockphoto.com/id/612014886/photo/influencer-and-opinion-leader.webp?a=1&b=1&s=612x612&w=0&k=20&c=JjXwbT3xRNv2BubQYb0XXXvXiJ3TqvZCjXiOpLVjrsM=')`,
        }}
      >
        <div className="w-full max-w-md p-8 text-white bg-black rounded-lg shadow-lg bg-opacity-65">
          {/* <h2 className="mb-6 text-3xl font-bold text-center">User Login<h2/> */}
          <h2 className="mb-6 text-3xl font-bold text-center">
            Company Log In
          </h2>
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
            <div className="flex items-center gap-2"></div>
            <Link
              to="/company/forgot-password"
              className="text-sm text-gray-200 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <p className="mt-6 text-center text-gray-200">
            New Company?{' '}
            <Link
              to="/company/signin"
              className="font-medium text-white hover:underline"
            >
              Sign up now
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
};

export default CompanyLogin;
