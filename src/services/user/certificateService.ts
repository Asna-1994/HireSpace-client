import { CertificateObject } from "../../User/Pages/Profile/AddCertificates";
import axiosInstance from "../../Utils/Instance/axiosInstance";

export const deleteCertificate = async (userId: string, certificateId : string) => {
    try {
        const response = await axiosInstance.delete(
            `/user/${userId}/certificates/${certificateId}`
          );
      return response.data;
    } catch (error: any) {
      console.log(error)
      throw error.response?.data?.message || 'Something went wrong';
    }
  };

  export const fetchCertificate = async (userId: string) => {
    try {
        const response = await axiosInstance.get(`/user/${userId}/all-certificates`);
      return response.data;
    } catch (error: any) {
      console.log(error)
      throw error.response?.data?.message || 'Something went wrong';
    }
  };


  export const addOrUpdate = async (certificate: CertificateObject,  userId : string,certificateId?: string) => {
    try {
        const response = await axiosInstance.patch(
            `/user/add-or-update-certificates/${userId}`,
            certificate,
            { params: { certificateId } }
          );
          
      return response.data;
    } catch (error: any) {
      console.log(error)
      throw error.response?.data?.message || 'Something went wrong';
    }
  };