import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Header from '../../Components/Header/Header';
import { subYears } from 'date-fns';
import { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../Utils/Instance/axiosInstance';
import {
  ApiResponse,
  SignupFormData,
  User,
} from '../../../Utils/Interfaces/interface';

import GoogleSignInButton from '../../Components/GoogleSignin/GoogleSignin';

const schema = yup.object().shape({
  userName: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]+$/,
      'Password must contain uppercase, lowercase, number, and special character'
    )
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
  dateOfBirth: yup
    .date()
    .max(subYears(new Date(), 18), 'Must be 18 years old or older')
    .required('Date of birth is required'),
  phone: yup
    .string()
    .matches(
      /^(?:(?!^[012345])[6-9]\d{9})$/,
      'Phone number must not start with 0, 1, 2, 3, 4, or 5 and cannot have all digits the same'
    )
    .required('Phone number is required'),
  address: yup.string().required('Address is required'),
  userRole: yup.string().required('User role is required'),
});

const UserSignUp = () => {
  const [userRole, setUserRole] = useState<string>('');
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const submitSignupForm = async (formData: SignupFormData): Promise<void> => {
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
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-md mx-auto  bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-xl shadow-lg mt-8 mb-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sign Up as User
        </h2>
        <form onSubmit={handleSubmit(submitSignupForm)}>
          {/* Username */}
          <div className="mb-4">
            <label
              htmlFor="userName"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <Controller
              control={control}
              name="userName"
              render={({ field }) => (
                <input
                  {...field}
                  className={`w-full mt-1 p-2 border rounded-lg shadow-sm focus:outline-none focus:ring ${
                    errors.userName
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-purple-700'
                  }`}
                  placeholder="Enter your username"
                />
              )}
            />
            {errors.userName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.userName.message as React.ReactNode}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <input
                  {...field}
                  className={`w-full mt-1 p-2 border rounded-lg shadow-sm focus:outline-none focus:ring ${
                    errors.email
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-purple-700'
                  }`}
                  placeholder="Enter your email"
                />
              )}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message as React.ReactNode}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div className="mb-4">
            <label
              htmlFor="dateOfBirth"
              className="block text-sm font-medium text-gray-700"
            >
              Date of Birth
            </label>
            <Controller
              control={control}
              name="dateOfBirth"
              render={({ field }) => (
                <input
                  {...field}
                  type="date"
                  className={`w-full mt-1 p-2 border rounded-lg shadow-sm focus:outline-none 
          ${
            errors.dateOfBirth
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-purple-700'
          }`}
                  value={
                    field.value
                      ? new Date(field.value).toISOString().split('T')[0]
                      : ''
                  }
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                />
              )}
            />
            {errors.dateOfBirth && (
              <p className="text-sm text-red-500 mt-1">
                {errors.dateOfBirth.message as React.ReactNode}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone
            </label>
            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <input
                  {...field}
                  className={`w-full mt-1 p-2 border rounded-lg shadow-sm focus:outline-none focus:ring ${
                    errors.phone
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-purple-700'
                  }`}
                  placeholder="Enter your phone number"
                />
              )}
            />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">
                {errors.phone.message as React.ReactNode}
              </p>
            )}
          </div>

          {/* Address (TextArea) */}
          <div className="mb-4">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <Controller
              control={control}
              name="address"
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={4}
                  className={`w-full mt-1 p-2 border rounded-lg shadow-sm focus:outline-none focus:ring ${
                    errors.address
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-purple-700'
                  }`}
                  placeholder="Enter your address"
                />
              )}
            />
            {errors.address && (
              <p className="text-sm text-red-500 mt-1">
                {errors.address.message as React.ReactNode}
              </p>
            )}
          </div>

          {/* User Role */}
          <div className="mb-4">
            <label
              htmlFor="userRole"
              className="block text-sm font-medium text-gray-700"
            >
              User Role
            </label>
            <Controller
              control={control}
              name="userRole"
              render={({ field }) => (
                <select
                  {...field}
                  defaultValue=""
                  className={`w-full mt-1 p-2 border rounded-lg shadow-sm focus:outline-none focus:ring ${
                    errors.userRole
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-purple-700'
                  }`}
                  onChange={(e) => {
                    field.onChange(e);
                    setUserRole(e.target.value);
                  }}
                >
                  <option value="" disabled>
                    {' '}
                    Select Role
                  </option>
                  <option value="jobSeeker">Job Seeker</option>
                  <option value="companyAdmin"> Company Admin</option>
                  <option value="companyMember">Company Member</option>
                  <option value="admin" disabled>
                    {' '}
                    Admin{' '}
                  </option>
                </select>
              )}
            />
            {errors.userRole && (
              <p className="text-sm text-red-500 mt-1">
                {errors.userRole.message as React.ReactNode}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <input
                  {...field}
                  type="password"
                  className={`w-full mt-1 p-2 border rounded-lg shadow-sm focus:outline-none focus:ring ${
                    errors.password
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-purple-700'
                  }`}
                  placeholder="Enter your password"
                />
              )}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message as React.ReactNode}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <input
                  {...field}
                  type="password"
                  className={`w-full mt-1 p-2 border rounded-lg shadow-sm focus:outline-none focus:ring ${
                    errors.confirmPassword
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-purple-700'
                  }`}
                  placeholder="Confirm your password"
                />
              )}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.confirmPassword.message as React.ReactNode}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-blue-800 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-300"
            >
              Sign Up
            </button>
          </div>
          <h1 className="text-center p-2">OR</h1>
          <GoogleSignInButton />
        </form>
        <p className="text-center p-3">
          Already have account ?{' '}
          <Link className=" hover:text-gray-700" to={'/user/login'}>
            Login
          </Link>
        </p>
        <p className="text-center ">
          Register for company ?{' '}
          <Link className=" hover:text-gray-700" to={'/company/signin'}>
            Click Here
          </Link>
        </p>
      </div>
    </>
  );
};

export default UserSignUp;
