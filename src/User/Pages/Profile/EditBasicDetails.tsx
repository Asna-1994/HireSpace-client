import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaTrash, FaUpload } from "react-icons/fa";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { toast } from "react-toastify";
import axiosInstance from "../../../Utils/Instance/axiosInstance";
import { validateFile } from "../../../Utils/helperFunctions/fileValidation";
import { userUpdate } from "../../../redux/slices/authSlice";
import CompanyHeader from "../../../Compnay/Components/Header/Header";
import { Area } from "react-easy-crop/types";
import CropImageModal from "./CropImageModal";




const UserProfileForm: React.FC = () => {
  const { user , company} = useSelector((state: RootState) => state.auth);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    user?.profilePhoto?.url || null
  );
  const dispatch = useDispatch()
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [form, setForm] = useState<{
    userName: string;
    dateOfBirth: string;
    phone: string;
    address: string;
    userRole: 'jobSeeker' | 'companyMember' | 'companyAdmin' | 'admin';
  }>({
    userName: user?.userName || "",
    dateOfBirth: user?.dateOfBirth
      ? new Date(user.dateOfBirth).toISOString().split("T")[0]
      : "",
    phone: user?.phone || "",
    address: user?.address || "",
    userRole: user?.userRole || 'jobSeeker',
  });
  


const [isCropping, setIsCropping] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      const maxFileSize = 5 * 1024 * 1024;
  
      const validationError = validateFile(file, allowedTypes, maxFileSize);
  
      if (validationError) {
        toast.error(validationError);
        return;
      }
  
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsCropping(true);
    }
  };
  
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

  
    formData.append("userName", form.userName || "");
    formData.append("dateOfBirth", form.dateOfBirth || "");
    formData.append("phone", form.phone || "");
    formData.append("address", form.address || "");
    formData.append('userRole' , form.userRole || 'jobSeeker');

    try{
const response = await axiosInstance.patch(`/user/update-basic-detail/${user?._id}`, formData)
if(response.data.success){
    const updatedUser = response.data.data.user;
toast.success("Updated successfully")
dispatch(userUpdate(updatedUser))
}else{
    toast.error(response.data.message);
}
    }
    catch(err : any){
        console.error("Error updating details:", err);
        toast.error(err.response?.data?.message || "Something went wrong");
    }
  };


  

  const handleCroppedImage = async (croppedImageUrl: string) => {
    try {
 
      const response = await fetch(croppedImageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
      
      setSelectedFile(file);
      setPreviewUrl(croppedImageUrl);
      
   
      const formData = new FormData();
      formData.append("profilePhoto", file);
  
      const uploadResponse = await axiosInstance.patch(
        `/user/upload-profile-image/${user?._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if (uploadResponse.data.success) {
        toast.success("Profile photo updated successfully!");
        const updatedUser = uploadResponse.data.data.user;
        dispatch(userUpdate(updatedUser));
      }
    } catch (error : any) {
      console.error("Error processing cropped image:", error);
      toast.error(error.response.data.message || "Error uploading cropped image. Please try again.");
    }
  };



  const handleDeleteImage = async () => {
  
    try {
      const res = await axiosInstance.delete(`/user/delete-profile-image/${user?._id}`);
      if (res.data.success) {
        toast.success("Deleted successfully");
        const updatedUser = res.data.data.user;
        dispatch(userUpdate(updatedUser))
        setPreviewUrl(null)
      } else {
        toast.error(res.data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error deleting resume");
      console.error(error);
    } 
  };


  return (
    <div>

{isCropping && previewUrl && (
        <CropImageModal
          image={previewUrl}
          onCancel={() => {
            setIsCropping(false);
            setSelectedFile(null);
            setPreviewUrl(user?.profilePhoto?.url || null);
          }}
          onSave={(croppedImage) => {
            handleCroppedImage(croppedImage);
            setIsCropping(false);
          }}
        />
      )}





        {company ? (<CompanyHeader/>) : (    <Header />)}
  
      <div className="container mx-auto px-6 py-8 bg-gradient-to-r from-blue-100 to-blue-200">
        <motion.div
          className="bg-gradient-to-r from-purple-400 to-blue-500 shadow-lg text-white rounded-lg p-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-semibold">Edit Your Profile</h2>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <form
            className="bg-white p-6 rounded-lg shadow"
            onSubmit={handleSubmit}
          >
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                name="userName"
                value={form.userName || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="dateOfBirth" className="block text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="Enter your phone number"
              />
            </div>
            <div className="mb-4">
  <label className="block text-gray-700 font-medium mb-2">
    User Role
  </label>
  <select
    name="userRole"
    value={form.userRole || "jobSeeker"}
    onChange={handleChange}
    className="w-full border border-gray-300 rounded-lg p-2"
  >
    <option value="jobSeeker">Job Seeker</option>
    <option value="companyMember">Company Member</option>
    <option value="companyAdmin">Company Admin</option>
  </select>
</div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={form.address || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="Enter your address"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition"
            >
              Save Changes
            </button>
          </form>

       
          <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center justify-center">
            <div className="text-blue-500 text-4xl mb-4">
              <FaUpload />
            </div>
            <p className="text-gray-700 text-lg mb-4">Upload Profile Photo</p>
            <input
              type="file"
              name="profilePhoto"
              onChange={handleFileChange}
              className="mb-4"
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Profile Preview"
                className="w-32 h-32 rounded-full mb-4 object-cover"
              />
            )}
            {user?.profilePhoto?.url &&  <button onClick={handleDeleteImage} className="bg-red-600 text-white rounded-lg px-2 py-1">Delete</button>}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfileForm;
