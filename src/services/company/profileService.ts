

import axiosInstance from "../../Utils/Instance/axiosInstance";


export const uploadCompanyLogo = async (selectedFile: File, companyId : string) => {
  try {
    const formData = new FormData();
    formData.append('companyLogo', selectedFile);
    
    
      const response = await axiosInstance.patch(
        `/company/upload-company-logo/${companyId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    return response.data;
  } catch (error: any) {
    console.log(error)
    throw error.response?.data?.message || 'Error while uploading logo';
  }
};



export const deleteCompanyLogo = async (companyId : string) => {
    try {

        const response = await axiosInstance.patch(
        `/company/delete-logo/${companyId}`
      );
      return response.data;
    } catch (error: any) {
      console.log(error)
      throw error.response?.data?.message || 'Error while deleting logo';
    }
  };


  export const uploadCompanyDocument = async (selectedFile: File, documentNumber: string, companyId : string) => {
    try {
        const formData = new FormData();
        formData.append('verificationDocument', selectedFile);
        formData.append('documentNumber', documentNumber);
      const response = await axiosInstance.patch(
        `/company/upload-document/${companyId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.log(error)
      throw error.response?.data?.message || 'Error while uploading document';
    }
  };


  export const deleteCompanyDocument = async (selectedCompanyId : string) => {
    try {

        const response = await axiosInstance.patch(
            `/company/delete-document/${selectedCompanyId}`
          );
      return response.data;
    } catch (error: any) {
      console.log(error)
      throw error.response?.data?.message || 'Error while deleting document';
    }
  };


  export const getAllMembers = async (selectedCompanyId : string) => {
    try {

        const response = await axiosInstance.get(
            `/company/${selectedCompanyId}/all-members`
          );
      return response.data;
    } catch (error: any) {
      console.log(error)
      throw error.response?.data?.message || 'Error while getting all members';
    }
  };



  export const addMember = async (selectedCompanyId : string, email :string, role : string) => {
    try {
       const response = await axiosInstance.patch(
            `/company/${selectedCompanyId}/add-member`,
            { userEmail: email, userRole: role }
          );
      return response.data;
    } catch (error: any) {
      console.log(error)
      throw error.response?.data?.message || 'Error while adding members';
    }
  };


  export const removeMember = async (selectedCompanyId : string, memberId :string) => {
    try {
        const response = await axiosInstance.delete(
            `/company/${selectedCompanyId}/remove-member/${memberId}`
          );
      return response.data;
    } catch (error: any) {
      console.log(error)
      throw error.response?.data?.message || 'Error while removing members';
    }
  };

  export const getCompanyProfile = async (selectedCompanyId : string) => {
    try {
        const response = await axiosInstance.get(
            `/company/company-profile-details/${selectedCompanyId}`
          );
      return response.data;
    } catch (error: any) {
      console.log(error)
      throw error.response?.data?.message || 'Error while getting company profile';
    }
  };


  export const updateCompanyDetails = async (companyId : string,companyName : string, establishedDate : string, industry : string, phone  :string, address : string) => {
    try {
        const formData = new FormData();

        formData.append('companyName', companyName || '');
        formData.append('establishedDate', establishedDate || '');
        formData.append('industry', industry || '');
        formData.append('phone', phone || '');
        formData.append('address', address || '');
      
      
          const response = await axiosInstance.patch(
            `/company/update-basic-detail/${companyId}`,
            formData
          );
      return response.data;
    } catch (error: any) {
      console.log(error)
      throw error.response?.data?.message || 'Error while updating company profile';
    }
  };




  export const getAdditionalDetails = async (selectedCompanyId : string) => {
    try {
      const response = await axiosInstance.get(
        `/company/company-profile-details/${selectedCompanyId}`
      );
      return response.data;
    } catch (error: any) {
      console.log(error)
      throw error.response?.data?.message || 'Error while getting company details';
    }
  };
