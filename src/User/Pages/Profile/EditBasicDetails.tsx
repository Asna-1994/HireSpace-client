import React from 'react';
import { motion } from 'framer-motion';
import { FaUpload } from 'react-icons/fa';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import {  useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import CompanyHeader from '../../../Compnay/Components/Header/Header';
import CropImageModal from './CropImageModal';
import useBasicDetails from '../../../CustomHooks/user/useBasicdetails';

const UserProfileForm: React.FC = () => {
  const { user, company } = useSelector((state: RootState) => state.auth);



  const {
    form,
    previewUrl,
    setPreviewUrl,
    isCropping,
    isSubmitting, 
    setSelectedFile,
    setIsCropping,
    handleChange,
    handleFileChange,
    handleSubmit,
    handleCroppedImage,
    handleDeleteImage,
  } = useBasicDetails();

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

      {company ? <CompanyHeader /> : <Header />}

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
                value={form.userRole || 'jobSeeker'}
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
                value={form.address || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="Enter your address"
              ></textarea>
            </div>
            <button type="submit" disabled={isSubmitting} className={`bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
  {isSubmitting ? 'Saving...' : 'Save Changes'}
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
            {user?.profilePhoto?.url && (
              <button
                onClick={handleDeleteImage}
                className="bg-red-600 text-white rounded-lg px-2 py-1"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfileForm;
