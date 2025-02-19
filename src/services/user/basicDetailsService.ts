
import axiosInstance from '../../Utils/Instance/axiosInstance';

export const deleteProfilePictureFromDB = async (userId: string) => {
  try {
    const response = await axiosInstance.delete( `/user/delete-profile-image/${userId}` );
    return response.data;
  } catch (err: any) {
    console.log(err)
    throw new Error(err.response?.data?.message || 'Error fetching skills');
  }
};

export const uploadProfilePictureToDB = async (userId: string, file : File ) => {
  try {
    const formData = new FormData();
    formData.append('profilePhoto', file);

    const response = await axiosInstance.patch(
      `/user/upload-profile-image/${userId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (err: any) {
    console.log(err)
    throw new Error(err.response?.data?.message || 'Error uploading profile picture');
  }
};

export const updateUserDetails = async (userId: string,userName : string, dateOfBirth : string, phone : string, address : string, userRole :string) => {

    const formData = new FormData();

    formData.append('userName', userName || '');
    formData.append('dateOfBirth', dateOfBirth);
    formData.append('phone', phone || '');
    formData.append('address', address || '');
    formData.append('userRole', userRole );

    try {
      const response = await axiosInstance.patch(
        `/user/update-basic-detail/${userId}`,
        formData
      );
    return response.data;
  } catch (err: any) {
    console.log(err)
    throw new Error(err.response?.data?.message || 'Error updating basic details');
  }
};



export const updateUserPassword = async (email: string, newPassword : string) => {
    try {
        const response = await axiosInstance.patch('/user/forgot-password', {
            email,
            newPassword,
          });
    
      return response.data;
    } catch (err: any) {
      console.log(err)
      throw new Error(err.response?.data?.message || 'Error fetching skills');
    }
  };