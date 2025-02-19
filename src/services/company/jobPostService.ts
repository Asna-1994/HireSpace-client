import { JobPost } from "../../User/Pages/JobPosts/AllSavedJobs";
import axiosInstance from "../../Utils/Instance/axiosInstance";


export const createOrUpdateJobPost = async (
  companyId: string,
  userId: string,
  jobData: JobPost,
  jobPostId?: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axiosInstance.post(
      `/company/job-post/${companyId}/${userId}`,
      jobData,
      { params: { jobPostId } }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message ?? 'An error occurred');
  }
};
