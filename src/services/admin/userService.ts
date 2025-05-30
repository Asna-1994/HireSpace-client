import axiosInstance from "../../Utils/Instance/axiosInstance";


export const getAllUsers = async (query: string, page : number, limit : number) => {
  try {
      const response = await axiosInstance.get(`/admin/all-users`, {
        params: { search: query, page, limit },
      });
    return response.data;
  } catch (error: any) {
    console.log(error)
    throw error.response?.data?.message || 'Error while getting all users';
  }
};


export const blockOrUnblockUser = async (selectedUserId: string,selectedAction :string) => {
    try {
        const response = await axiosInstance.patch(
            `/admin/block-or-unblock-user/${selectedUserId}/${selectedAction}`
          );
      return response;
    } catch (error: any) {
      console.log(error)
      throw error.response?.data?.message || `Error while ${selectedAction}ing `;
    }
  };


  export const getAllSpam = async (query :string, page: number , limit : number, date:  string) => {
    try {
      console.log('date' , date)
      const response = await axiosInstance.get(`/admin/spam-reports`, {
        params: { search: query, page, limit, date },
      });
      return response.data
    } catch (error: any) {
      console.log(error)
      throw error.response?.data?.message || `Error while getting spam list `;
    }
  };



  export const getPremiumUsers = async (query :string, page: number , limit : number,filterStartDate :string, filterEndDate : string) => {
    try {
      const response = await axiosInstance.get(`/admin/premium-users`, {
        params: { search: query, page, limit , startDate : filterStartDate, endDate : filterEndDate},
      });
      return response.data
    } catch (error: any) {
      console.log(error)
      throw error.response?.data?.message || `Error while getting premium `;
    }
  };




