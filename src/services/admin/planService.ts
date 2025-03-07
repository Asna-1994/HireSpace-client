import axiosInstance from "../../Utils/Instance/axiosInstance";

  
export const deletePlans = async (planId : string) => {
    try {
      const response = await axiosInstance.delete(
        `/plans/delete/${planId}`
      );
      return response
    } catch (error: any) {
        console.log(error)
      throw new Error('Failed to delete plan. Please try again.');
    }
  };


  export const fetchPlansFromDB = async (page : number,limit : number,searchTerm? : string) => {
    try {
        const response = await axiosInstance.get('/plans/all-plans', {
            params: { page, limit, search: searchTerm },
          });
      return response
    } catch (error: any) {
        console.log(error)
      throw new Error('Failed to fetch plan. Please try again.');
    }
  };