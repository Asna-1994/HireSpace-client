import axiosInstance from '../../Utils/Instance/axiosInstance';

export const getPendingRequestFromDB = async (userId: string, page : number, limit: number) => {
  try {
    const response = await axiosInstance.get(
        `/connection-request/to-user/${userId}`,
        {
          params: {
            page,
            limit,
          },
        }
      );
    return response.data;
  } catch (err: any) {
    console.log(err)
    throw new Error(err.response?.data?.message || 'Error getting requests');
  }
};

export const getAllConnectionFromDB = async (userId: string, page : number, limit: number, search : string) => {
    try {
        const response = await axiosInstance.get(
            `/connection-request/user/all-connections/${userId}`,
            {
              params: { page, limit, search },
            }
          );
      return response.data;
    } catch (err: any) {
      console.log(err)
      throw new Error(err.response?.data?.message || 'Error fetching all connections');
    }
  };



  export const manageConnectionRequest = async (requestId: string, action : string) => {
    try {
        const response = await axiosInstance.put(
            `/connection-request/${requestId}/${action}`
          );
      return response.data;
    } catch (err: any) {
      console.log(err)
      throw new Error(err.response?.data?.message || 'Error managing connections');
    }
  };


  export const getRecommendationFromDB = async (userId: string, page : number , limit: number) => {
    try {
        const response = await axiosInstance.get(
            `/connection-request/recommendations/${userId}?page=${page}&limit=${limit}`
          );
      return response.data;
    } catch (err: any) {
      console.log(err)
      throw new Error(err.response?.data?.message || 'Error fetching recommendation');
    }
  };




  

  export const sendConnectionRequest = async (sender: string, receiver : string) => {
    try {
        const response = await axiosInstance.post(`/connection-request`, {
            fromUser: sender,
            toUser: receiver,
          });
      return response.data;
    } catch (err: any) {
      console.log(err)
      throw new Error(err.response?.data?.message || 'Error sending request');
    }
  };


  export const fetchUsersFromDb = async (query: string, page : number,limit : number) => {
    try {

        const response = await axiosInstance.get(`/admin/all-users`, {
            params: { search: query, page, limit, role: 'jobSeeker' },
          });
      return response.data;
    } catch (err: any) {
      console.log(err)
      throw new Error(err.response?.data?.message || 'Error fetching user');
    }
  };



