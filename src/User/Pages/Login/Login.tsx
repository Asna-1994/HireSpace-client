import React, { useRef } from "react";
import Header from "../../Components/Header/Header";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../../Utils/Instance/axiosInstance";
import { useDispatch } from "react-redux";
import {userLogin } from "../../../redux/slices/authSlice";
import GoogleSignInButton from "../../Components/GoogleSignin/GoogleSignin";

const Login = () => {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    try {
      const response = await axiosInstance.post("/user/login", {
        email,
        password,
      });

      if (response.data.success) {

        const { token, user,  } = response.data.data;
        // console.log(jobSeekerProfile)
        toast.success(response.data.message);
        dispatch(userLogin({ user, token}));
        console.log("User details:", user);
        if(user.userRole === 'companyAdmin' || user.userRole === 'companyMember'){
          navigate(`/company/home/${user.companyId}`); 
        }else{
          navigate(`/user/home/${user._id}`); 
        }
    
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Something went wrong"
      toast.error(errorMessage);
      console.error("Login error:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center" 
     style={{ backgroundImage: `url('https://plus.unsplash.com/premium_photo-1678917827802-721b5f5b4bf0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8am9iJTIwc2VhcmNofGVufDB8fDB8fHww')` }}>
  <div className="bg-black bg-opacity-65 text-white p-8 rounded-lg shadow-lg w-full max-w-md">
    <h2 className="text-3xl font-bold text-center mb-6">User Log In</h2>
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      <input
        type="email"
        name="email"
        ref={emailRef}
        className="rounded-md p-2 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
        placeholder="Email"
        required
      />
      <input
        type="password"
        name="password"
        ref={passwordRef}
        className="rounded-md p-2 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
        placeholder="Password"
        required
      />
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition duration-300"
      >
        Log In
      </button>
    </form>

    <div className="flex justify-between items-center mt-4">
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
      className="text-white font-medium hover:underline"
    >
    Signup
    </Link>
  </p>
</div>


    <p className="p-2 text-center">OR</p>
    <GoogleSignInButton/>
  </div>

</div>

    </>
  );
};

export default Login;
