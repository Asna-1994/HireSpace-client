import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUpload } from 'react-icons/fa';
import Footer from '../../../User/Components/Footer/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { toast } from 'react-toastify';
import axiosInstance from '../../../Utils/Instance/axiosInstance';
import { validateFile } from '../../../Utils/helperFunctions/fileValidation';
import { userUpdate } from '../../../redux/slices/authSlice';
import CompanyHeader from '../../../Compnay/Components/Header/Header';
import AdminHeader from '../../Components/Header/AdminHeader';

const AdminProfile: React.FC = () => {
  const { user, company } = useSelector((state: RootState) => state.auth);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    user?.profilePhoto?.url || null
  );
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [form, setForm] = useState<{
    userName: string | undefined;
    dateOfBirth: string | undefined;
    phone: string | undefined;
    address: string | undefined;
  }>({
    userName: user?.userName,
    dateOfBirth: user?.dateOfBirth
      ? new Date(user.dateOfBirth).toISOString().split('T')[0]
      : '',
    phone: user?.phone,
    address: user?.address,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxFileSize = 5 * 1024 * 1024;
    const file = e.target.files?.[0] || null;

    if (file) {
      const validationError = validateFile(file, allowedTypes, maxFileSize);

      if (validationError) {
        toast.error(validationError);
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('userName', form.userName || '');
    formData.append('dateOfBirth', form.dateOfBirth || '');
    formData.append('phone', form.phone || '');
    formData.append('address', form.address || '');

    try {
      const response = await axiosInstance.patch(
        `/user/update-basic-detail/${user?._id}`,
        formData
      );
      if (response.data.success) {
        const updatedUser = response.data.data.user;
        toast.success('Updated successfully');
        dispatch(userUpdate(updatedUser));
      } else {
        toast.error(response.data.message);
      }
    } catch (err: any) {
      console.error('Error updating details:', err);
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a photo to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('profilePhoto', selectedFile);

    try {
      const response = await axiosInstance.patch(
        `/user/upload-profile-image/${user?._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        toast.success('Profile photo updated successfully!');

        const updatedUser = response.data.data.user;
        setPreviewUrl(updatedUser.profilePhoto.url);
        dispatch(userUpdate(updatedUser));
      }
    } catch (err) {
      console.error('Error uploading photo:', err);
      toast.error('Error uploading photo. Please try again.');
    }
  };

  return (
    <>
      <AdminHeader />

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
                value={form.userName || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3"
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
                value={form.dateOfBirth || ''}
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
                value={form.phone || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3"
                placeholder="Enter your phone number"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={form.address || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3"
                placeholder="Enter your address"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
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
            <button
              type="button"
              onClick={handleImageUpload}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Upload Photo
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminProfile;
