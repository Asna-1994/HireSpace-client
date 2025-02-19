import axiosInstance from "../../Utils/Instance/axiosInstance";


export const getAllCompanies = async (query: string, page : number, limit : number) => {
  try {
    const response = await axiosInstance.get(`/admin/all-companies`, {
        params: { search: query, page, limit },
      });

    return response.data;
  } catch (error: any) {
    console.log(error)
    throw error.response?.data?.message || 'Error while getting all companies';
  }
};


export const blockOrUnblock = async (selectedCompanyId: string, selectedAction  :string) => {
    try {

        const response = await axiosInstance.patch(
            `/admin/block-or-unblock-company/${selectedCompanyId}/${selectedAction}`
          );
  
      return response.data;
    } catch (error: any) {
      console.log(error)
      throw error.response?.data?.message || `Error while ${selectedAction}ing`;
    }
  };
  

  export const companyVerification = async (companyId: string) => {
    try {

        const response = await axiosInstance.patch(
            `/admin/${companyId}/verify-company`
          );
  
      return response.data;
    } catch (error: any) {
      console.log(error)
      throw error.response?.data?.message || `Error while verifying`;
    }
  };

