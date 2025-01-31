import React, { useRef } from "react";
import Header from "../../Components/Header/Header";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../../Utils/Instance/axiosInstance";
import { useDispatch } from "react-redux";
import { companyLogin } from "../../../redux/slices/authSlice";
import CompanyHeader from "../../Components/Header/Header";

const CompanyLogin = () => {
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
      const response = await axiosInstance.post("/company/login", {
        email,
        password,
      });

      if (response.data.success) {

        const { token, company, user } = response.data.data;
        toast.success(response.data.message);
        console.log()
        dispatch(companyLogin({ company, token , user}));
        console.log("User details:", company);
        navigate(`/company/home/${company._id}`); 
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
    //   const errorMessage = error.response?.data?.error || "Something went wrong";
    //   toast.error(errorMessage);
       const errorMessage = error.response?.data?.message || "Something went wrong"
          toast.error(errorMessage);
      console.error("Login error:", error);
    }
  };

  return (
    <>
      <CompanyHeader/>
<div className="min-h-screen flex items-center justify-center bg-cover bg-center" 
     style={{ backgroundImage: `url('https://media.istockphoto.com/id/612014886/photo/influencer-and-opinion-leader.webp?a=1&b=1&s=612x612&w=0&k=20&c=JjXwbT3xRNv2BubQYb0XXXvXiJ3TqvZCjXiOpLVjrsM=')` }}>
  <div className="bg-black bg-opacity-65 text-white p-8 rounded-lg shadow-lg w-full max-w-md">
    {/* <h2 className="text-3xl font-bold text-center mb-6">User Login<h2/> */}
    <h2 className="text-3xl font-bold text-center mb-6">Company Log In</h2>
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
      <div className="flex items-center gap-2">
   
    
      </div>
      <Link to="/company/forgot-password" className="text-sm text-gray-200 hover:underline">Forgot Password?</Link>
    </div>
    <p className="mt-6 text-center text-gray-200">
      New Company?{' '}
      <Link to="/company/signin" className="text-white font-medium hover:underline">Sign up now</Link>.
    </p>
  </div>
</div>
    </>
  );
};

export default CompanyLogin;

