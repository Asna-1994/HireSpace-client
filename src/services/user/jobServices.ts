import { CoverLetter } from '../../User/Pages/JobPosts/ApplyModal';
import axiosInstance from '../../Utils/Instance/axiosInstance';

export const getSavedJobsForUser = async (userId: string, page : number, limit: number) => {
  try {
    const response = await axiosInstance.get(
        `/user/all-saved-job-posts/${userId}`,
        { params: { page, limit } }
      );
    return response.data;
  } catch (err: any) {
    console.log(err)
    throw new Error(err.response?.data?.message || 'Error fetching skills');
  }
};


export const applyForJob = async (coverLetter : CoverLetter, userId : string, jobPostId : string, companyId : string) => {
    try {
        const response = await axiosInstance.post(
            `/user/apply-for-job/${userId}/${jobPostId}/${companyId}`,
            { coverLetter }
          );
      return response.data;
    } catch (err: any) {
      console.log(err)
      throw new Error(err.response?.data?.message || 'Error fetching skills');
    }
  };



  export const fetchJobPostFromDB = async (currentPage : number , limit : number, searchTerm  :string) => {
    try {
        const response = await axiosInstance.get('/user/all-job-posts', {
            params: {
              page: currentPage,
              limit,
              search: searchTerm,
            },
          });
      return response.data;
    } catch (err: any) {
      console.log(err)
      throw new Error(err.response?.data?.message || 'Error fetching skills');
    }
  };

  export const saveJobToDB = async (userId  :string, jobPostId : string) => {
    try {
        const response = await axiosInstance.patch(
            `/user/save-job-post/${userId}/${jobPostId}`
          );
      return response.data;
    } catch (err: any) {
      console.log(err)
      throw new Error(err.response?.data?.message || 'Error fetching skills');
    }
  };


  export const getAllApplication = async (userId  :string,currentPage : number, searchTerm  :string) => {
    try {
        const response = await axiosInstance.get(
            `/user/all-job-applications/${userId}`,
            {
              params: {
                page: currentPage,
                limit: 10,
                searchTerm,
              },
            }
          );
      return response.data;
    } catch (err: any) {
      console.log(err)
      throw new Error(err.response?.data?.message || 'Error fetching skills');
    }
  };

