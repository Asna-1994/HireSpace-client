import { AxiosResponse } from "axios";
import axiosInstance from "../../Utils/Instance/axiosInstance";
import { ApiResponse, CompanyFormData } from "../../Utils/Interfaces/interface";

export const updatePassword = async (email: string, newPassword : string) => {
  try {
      const response = await axiosInstance.patch('/company/forgot-password', {
        email,
        newPassword,
      });

    return response.data;
  } catch (error: any) {
    console.log(error)
    throw error.response?.data?.message || 'Something went wrong';
  }
};

export const registerNewCompany = async (formData : CompanyFormData) => {
    try {
        const response: AxiosResponse<ApiResponse> = await axiosInstance.post(
            '/company/signup',
            formData
          );
      return response.data;
    } catch (error: any) {
      console.log(error)
      throw error.response?.data?.message || 'Something went wrong';
    }
  };


  export const loginCompany = async (email : string, password : string) => {
    try {
        const response = await axiosInstance.post('/company/login', {
            email,
            password,
          });
      return response.data;
    } catch (error: any) {
      console.log(error)
      throw error.response?.data?.message || 'Error while login to company';
    }
  };

  export const resendOtp = async (email : string) => {
    try {

        const response = await axiosInstance.post('/company/resend-otp', {
            email,
          });
      return response.data;
    } catch (error: any) {
      console.log(error)
      throw error.response?.data?.message || 'Error while resending otp';
    }
  };



  export const otpVerification = async (email : string, otp : string) => {
    try {

        const response = await axiosInstance.post('/company/verify-otp', {
            email,
            otp,
          });
      return response.data;
    } catch (error: any) {
      console.log(error)
      throw error.response?.data?.message || 'Error while verifying otp';
    }
  };




