import axiosInstance from '../../Utils/Instance/axiosInstance';

export const getSkills = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/user/${userId}/all-skills`);
    return response.data;
  } catch (err: any) {
    console.log(err)
    throw new Error(err.response?.data?.message || 'Error fetching skills');
  }
};

export const addOrUpdateSkills = async (userId: string, skills: any) => {
  try {
    const response = await axiosInstance.patch(
        `/user/add-or-update-skills/${userId}`,
        skills
      );
    return response.data;
  } catch (err: any) {
    console.log(err)
    throw new Error(err.response?.data?.message || 'Error updating skills');
  }
};

export const deleteSkill = async (userId: string, skillName: string) => {
  try {
    const response = await axiosInstance.delete(
        `/user/${userId}/delete-skills`,
        {
          data: { skillName },
        }
      );
    return response.data;
  } catch (err: any) {
    console.log(err)
    throw new Error(err.response?.data?.message || 'Error deleting skill');
  }
};
