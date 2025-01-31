import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AxiosResponse} from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../../Utils/Instance/axiosInstance";
import { ApiResponse, CompanyFormData } from "../../../Utils/Interfaces/interface";
import CompanyHeader from "../../Components/Header/Header";


const schema = yup.object().shape({
  companyName: yup
    .string()
    .min(3, "company name must be at least 3 characters")
    .required("company name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]+$/,
      "Password must contain uppercase, lowercase, number, and special character"
    )
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
  establishedDate: yup
    .date()
    .required("Established year is required"),
industry: yup
    .string()
   .min(3, "Industry must be at least 3 characters")
    .required("Industry is required"),
  phone: yup
    .string()
    .matches(
      /^(?:(?!^[012345])[6-9]\d{9})$/,
      "Phone number must not start with 0, 1, 2, 3, 4, or 5 and cannot have all digits the same"
    )
    .required("Phone number is required"),
  address: yup.string().required("Address is required"),
  companyAdminEmail: yup
  .string()
  .email("Invalid email format")
  .required("Admin Email is required"),
  
});






const CompanySignup = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {

    document.body.classList.add("bg-slate-950");
    return () => {
      document.body.classList.remove("bg-slate-950");
    };
  }, []);


  const navigate = useNavigate()

  const submitSignupForm = async (formData: CompanyFormData): Promise<void> => {
    try {
      const response: AxiosResponse<ApiResponse> = await axiosInstance.post("/company/signup", formData);
    console.log(response.data.data?.company)
      toast.success(response.data.message)
   
      navigate("/company/otp-verification", { state: { company: response.data.data.company} });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };





  return (
    <>
      <CompanyHeader/>
      <div className="max-w-md  mx-auto bg  bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-xl shadow-lg mt-8 mb-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sign Up as Company
        </h2>
        <form onSubmit={handleSubmit(submitSignupForm)}>
          {/* Username */}
          <div className="mb-4">
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-gray-700"
            >
            Company Name
            </label>
            <Controller
              control={control}
              name="companyName"
              render={({ field }) => (
                <input
                  {...field}
                  className={`w-full mt-1 p-2 border rounded-lg shadow-sm focus:outline-none focus:ring ${
                    errors.companyName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="Enter your companyName"
                />
              )}
            />
            {errors.companyName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.companyName.message as React.ReactNode}
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
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
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

        
          <div className="mb-4">
            <label
              htmlFor="establishedDate"
              className="block text-sm font-medium text-gray-700"
            >
           Established Date
            </label>
            <Controller
              control={control}
              name="establishedDate"
              render={({ field }) => (
                <input
                  {...field}
                  type="date"
                  className={`w-full mt-1 p-2 border rounded-lg shadow-sm focus:outline-none 
          ${
            errors.establishedDate
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
                  value={
                    field.value
                      ? new Date(field.value).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => field.onChange(new Date(e.target.value))} 
                />
              )}
            />
            {errors.establishedDate && (
              <p className="text-sm text-red-500 mt-1">
                {errors.establishedDate.message as React.ReactNode}
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
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
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
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
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

          <div className="mb-4">
            <label
              htmlFor="companyAdminEmail"
              className="block text-sm font-medium text-gray-700"
            >
             Admin Email
            </label>
            <Controller
              control={control}
              name="companyAdminEmail"
              render={({ field }) => (
                <input
                  {...field}
                  className={`w-full mt-1 p-2 border rounded-lg shadow-sm focus:outline-none focus:ring ${
                    errors.companyAdminEmail
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="Enter Admin Email"
                />
              )}
            />
            {errors.companyAdminEmail && (
              <p className="text-sm text-red-500 mt-1">
                {errors.companyAdminEmail.message as React.ReactNode}
              </p>
            )}
          </div>

       
          <div className="mb-4">
  <label
    htmlFor="industry"
    className="block text-sm font-medium text-gray-700"
  >
  Industry
  </label>
  <Controller
    control={control}
    name="industry"
    render={({ field }) => (
        <input
        {...field}
        className={`w-full mt-1 p-2 border rounded-lg shadow-sm focus:outline-none focus:ring ${
          errors.industry
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-blue-500"
        }`}
        placeholder="Enter your Industry"
      />
    )}
  />
  {errors.industry && (
    <p className="text-sm text-red-500 mt-1">
      {errors.industry.message as React.ReactNode}
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
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
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
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
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
              className="w-full bg-blue-800 hover:bg-blue-700 text-white p-2 rounded-lg transition duration-300"
            >
              Sign Up
            </button>
          </div>

        </form>
        <p className="text-center p-3">Already have account ? <Link className=" hover:text-gray-700" to={'/company/login'}>Login</Link></p>
      </div>
    </>
  );
};

export default CompanySignup;


