
import axiosInstance from "../../Utils/Instance/axiosInstance";


export const getAllDashboardStats = async (start: Date,end  : Date) => {
  try {
    const response = await axiosInstance.get('/admin/dashboard-stats', {
        params: {
          startDate: start.toISOString(),
          endDate: end.toISOString(),
        },
      });
    return response.data;
  } catch (error: any) {
    console.log(error)
    throw error.response?.data?.message || 'Error while getting dashboard stats';
  }
};

export const adminLogin = async (data : { email: string; password: string }) => {
    try {
        const response = await axiosInstance.post('/admin/login', data);
      return response.data;
    } catch (error: any) {
      console.log(error)
      throw error.response?.data?.message || 'Error while admin login';
    }
  };

