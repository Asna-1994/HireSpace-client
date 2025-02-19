import axiosInstance from "../../Utils/Instance/axiosInstance";

export const fetchRecommendationForJobs = async (tagline: string) => {
    try {
        const response = await axiosInstance.get(
            `/user/all-job-posts?tagLine=${tagline}`
          );
      return response.data;
    } catch (error: any) {
      console.log(error)
      throw error.response?.data?.message || 'Something went wrong';
    }
  };


  export const fetchTotalApplicationCount = async (userId: string) => {
    try {
        const response = await axiosInstance.get(`/user/${userId}/statics`);
      return response.data;
    } catch (error: any) {
      console.log(error)
      throw error.response?.data?.message || 'Something went wrong';
    }
  };


  export const updateTagline = async (userId: string, tagline  :string) => {
    try {
      const response = await axiosInstance.patch(
        `/user/profile-tag-line/${userId}`,
        { tagline }
      );
      return response.data;
    } catch (error: any) {
      console.log(error)
      throw error.response?.data?.message || 'Something went wrong';
    }
  };