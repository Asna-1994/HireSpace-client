import axiosInstance from "../../Utils/Instance/axiosInstance";

export const resendOtp = async (email: string) => {
  try {
    const response = await axiosInstance.post('/user/resend-otp', { email });
    return response.data;
  } catch (error: any) {
    console.log(error)
    throw error.response?.data?.message || 'Something went wrong';
  }
};

export const verifyOtp = async (email: string, otp: string) => {
  try {
    const response = await axiosInstance.post('/user/verify-otp', { email, otp });
    return response.data;
  } catch (error: any) {
    console.log(error)
    throw error.response?.data?.message || 'Something went wrong';
  }
};


export const googleSignin = async (idToken: string) => {
    try {
        const response = await axiosInstance.post('/user/google/callback', {
            credential: idToken,
          });
      return response.data;
    } catch (error: any) {
      console.log(error)
      throw error.response?.data?.message || 'Something went wrong';
    }
  };
  
  export const logoutUser = async () => {
    try {
        const response = await axiosInstance.post('/auth/logout');
      return response.data;
    } catch (error: any) {
      console.log(error)
      throw error.response?.data?.message || 'Something went wrong';
    }
  };


