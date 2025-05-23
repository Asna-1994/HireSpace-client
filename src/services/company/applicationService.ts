


import axiosInstance from "../../Utils/Instance/axiosInstance";


export const getCompanyApplications = async (companyId: string, currentPage : number, statusFilter : string, searchTerm : string, jobPostId : string) => {
  try {
    const response = await axiosInstance.get(
        `/company/all-applications/${companyId}`,
        {
          params: {
            page: currentPage,
            status: statusFilter,
            limit: 10,
            search: searchTerm,
            jobPostId: jobPostId
          },
        }
      );

    return response.data;
  } catch (error: any) {
    console.log(error)
    throw error.response?.data?.message || 'Something went wrong';
  }
};



export const updateStatus = async (applicationId: string, status : string) => {
    try {
        const response = await axiosInstance.patch(
            `/company/job-application-status/${applicationId}`,
            { status }
          );
  
      return response.data;
    } catch (error: any) {
      console.log(error)
      throw error.response?.data?.message || 'Something went wrong';
    }
  };


  export const deleteJobPost = async (jobPostId : string) => {
    try {
        const response = await axiosInstance.delete(
            `/company/job-post/${jobPostId}`
          );
  
      return response.data;
    } catch (error: any) {
      console.log(error)
        const message = error.response?.data?.message || 'Something went wrong';
    throw new Error(message); // Make it a real Error object
    }
  };

