import axiosInstance from "../../Utils/Instance/axiosInstance";
import { Experience } from "../../CustomHooks/user/useExperience";

export const deleteExperience = async (userId: string, expId : string) => {
    try {
        const response = await axiosInstance.delete(
            `/user/${userId}/experience/${expId}`
          );
      return response.data;
    } catch (error: any) {
      console.log(error)
      throw error.response?.data?.message || 'Something went wrong';
    }
  };

  export const fetchExperience = async (userId: string) => {
    try {
        const response = await axiosInstance.get(
            `/user/${userId}/all-experience`
          );
      return response.data;
    } catch (error: any) {
      console.log(error)
      throw error.response?.data?.message || 'Something went wrong';
    }
  };


  export const addOrUpdateExperienceToDB = async (experience:Experience,  userId : string,expId?: string) => {
    try {
        const response = await axiosInstance.patch(
            `/user/add-or-update-experience/${userId}`,
          experience,
            { params: { experienceId  :expId } }
          );
          
      return response.data;
    } catch (error: any) {
      console.log(error)
      throw error.response?.data?.message || 'Something went wrong';
    }
  };