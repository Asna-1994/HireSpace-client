import React, { useRef } from "react";

import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../../Utils/Instance/axiosInstance";
import CompanyHeader from "../../Components/Header/Header";

const CompanyForgotPassword = () => {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const newPasswordRef = useRef<HTMLInputElement | null>(null);
  const confirmPasswordRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const email = emailRef.current?.value;
    const newPassword = newPasswordRef.current?.value;
    const confirmPassword = confirmPasswordRef.current?.value;

    if (!email || !newPassword || !confirmPassword) {
      toast.error("Please enter both email and password.");
      return;
    }
    if (!newPassword || !confirmPassword) {
      toast.error("Password does not match");
      return;
    }

    try {
      const response = await axiosInstance.patch("/company/forgot-password", {
        email,
        newPassword,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        console.log(response.data);
        navigate(`/company/login`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
      console.error("Login error:", error);
    }
  };

  return (
    <>
      <CompanyHeader />
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url('https://plus.unsplash.com/premium_photo-1678917827802-721b5f5b4bf0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8am9iJTIwc2VhcmNofGVufDB8fDB8fHww')`,
        }}
      >
        <div className="bg-black bg-opacity-65 text-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6">
            Forgot Password
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              name="email"
              ref={emailRef}
              className="rounded-md p-2 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Company Email"
              required
            />
            <input
              type="password"
              name="newPassword"
              ref={newPasswordRef}
              className="rounded-md p-2 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="New Password"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              ref={confirmPasswordRef}
              className="rounded-md p-2 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Confirm Password"
              required
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition duration-300"
            >
              Update
            </button>
          </form>

          <div className="flex justify-center items-center mt-4">
            <p className="text-sm text-gray-200 text-center">
              GoBack to{" "}
              <Link
                to="/company/login"
                className="text-white font-medium hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyForgotPassword;
