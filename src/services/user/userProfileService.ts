import { Education } from "../../User/Pages/Profile/AddEducation";
import axiosInstance from "../../Utils/Instance/axiosInstance";

export const fetchProfile = async (userId: string) => {
    try {
        const response = await axiosInstance.get(
            `/user/${userId}/complete-profile`
          );
      return response.data;
    } catch (error: any) {
      console.log(error)
      throw error.response?.data?.message || 'Something went wrong';
    }
  };


  export const deleteResume = async (userId: string) => {
    try {
        const response = await axiosInstance.patch(`/user/delete-resume/${userId}`);
      return response.data;
    } catch (error: any) {
      console.log(error)
      throw error.response?.data?.message || 'Something went wrong';
    }
  };


  export const getUserResume = async (userId: string) => {
    try {
        const response = await axiosInstance.get(`/user/get-resume/${userId}`);
      return response.data;
    } catch (error: any) {
      console.log(error)
      throw error.response?.data?.message || 'Something went wrong';
    }
  };


  export const uploadResume = async (userId: string, file: File) => {
    const formData = new FormData();
    formData.append("resume", file);
  
    try {
      const response = await axiosInstance.patch(
        `/user/upload-resume/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      return response.data; 
    } catch (err: any) {
      throw err.response?.data?.message || "Error uploading resume";
    }
  };




  
  export const deleteEducation = async (userId: string, educId : string) => {
    try {
        const response = await axiosInstance.delete(
            `/user/${userId}/education/${educId}`
          );
      return response.data;
    } catch (error: any) {
      console.log(error)
      throw error.response?.data?.message || 'Something went wrong';
    }
  };

  export const fetchEducation = async (userId: string) => {
    try {
        const response = await axiosInstance.get(
            `/user/${userId}/all-education`
          );
      return response.data;
    } catch (error: any) {
      console.log(error)
      throw error.response?.data?.message || 'Something went wrong';
    }
  };


  export const addOrUpdate = async (education: Education,  userId : string,educationId?: string) => {
    try {
        const response = await axiosInstance.patch(
            `/user/${userId}/add-education`,
            education,
            { params: { educationId } }
          );
          
      return response.data;
    } catch (error: any) {
      console.log(error)
      throw error.response?.data?.message || 'Something went wrong';
    }
  };