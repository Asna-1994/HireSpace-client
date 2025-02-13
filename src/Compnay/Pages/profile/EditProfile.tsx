import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../../Components/Header/Header';
import Footer from '../../../User/Components/Footer/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { toast } from 'react-toastify';
import axiosInstance from '../../../Utils/Instance/axiosInstance';
import { companyUpdate } from '../../../redux/slices/authSlice';
import CompanyHeader from '../../../Compnay/Components/Header/Header';

const EditCompanyDetails: React.FC = () => {
  const { user, company } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  //   const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [form, setForm] = useState<{
    companyName: string | undefined;
    establishedDate: string | undefined;
    industry: string | undefined;
    phone: string | undefined;
    address: string | undefined;
  }>({
    companyName: company?.companyName,
    establishedDate: company?.establishedDate
      ? new Date(company.establishedDate).toISOString().split('T')[0]
      : '',
    industry: company?.industry,
    phone: company?.phone,
    address: company?.address,
  });

  const [additionalDetails, setAdditionalDetails] = useState({
    mission: '',
    vision: '',
    founder: '',
    ceo: '',
    description: '',
    aboutUs: '',
    website: '',
    socialLinks: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
    },
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

  const handleAdditionalChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (['facebook', 'instagram', 'twitter', 'linkedin'].includes(name)) {
      setAdditionalDetails((prevDetails) => ({
        ...prevDetails,
        socialLinks: {
          ...prevDetails.socialLinks,
          [name]: value, // Update the specific social link field
        },
      }));
    } else {
      setAdditionalDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value, // Update other fields
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('companyName', form.companyName || '');
    formData.append('establishedDate', form.establishedDate || '');
    formData.append('industry', form.industry || '');
    formData.append('phone', form.phone || '');
    formData.append('address', form.address || '');

    try {
      const response = await axiosInstance.patch(
        `/company/update-basic-detail/${company?._id}`,
        formData
      );
      if (response.data.success) {
        const updatedCompany = response.data.data.company;
        toast.success('Updated successfully');
        dispatch(companyUpdate(updatedCompany));
      } else {
        toast.error(response.data.message);
      }
    } catch (err: any) {
      console.error('Error updating details:', err);
      toast.error(err.response.data.message);
    }
  };

  const handleAdditionalSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const payload = {
      ...additionalDetails,
      socialLinks: additionalDetails.socialLinks,
    };

    console.log(payload);
    try {
      const response = await axiosInstance.patch(
        `/company/complete-profile/${company?._id}`,
        payload
      );
      if (response.data.success) {
        toast.success('Details updated successfully');
        fetchAdditionalDetails();
      } else {
        toast.error(response.data.message);
      }
    } catch (err: any) {
      console.error('Error updating additional details:', err);
      toast.error(err.response?.data?.message || 'An error occurred');
    }
  };

  //fetch companyProfile
  const fetchAdditionalDetails = async () => {
    try {
      const response = await axiosInstance.get(
        `/company/company-profile-details/${company?._id}`
      );
      if (response.data.success) {
        const data = response.data.data.profile;
        setAdditionalDetails({
          mission: data.mission || '',
          vision: data.vision || '',
          founder: data.founder || '',
          ceo: data.ceo || '',
          description: data.description || '',
          aboutUs: data.aboutUs || '',
          website: data.website || '',
          socialLinks: data.socialLinks || {},
        });
      } else {
        console.log('Failed to fetch additional details.');
      }
    } catch (err: any) {
      console.error('Error fetching additional details:', err);
      console.log(err.response?.data?.message || 'An error occurred.');
    }
  };

  useEffect(() => {
    fetchAdditionalDetails();
  }, []);

  return (
    <div>
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
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={form.companyName || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter Company Name"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="dateOfBirth" className="block text-gray-700">
                Established Date
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={form.establishedDate || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your phone number"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Industry
              </label>
              <input
                type="text"
                name="industry"
                value={form.industry || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your industry"
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
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
          <form
            className="bg-white p-6 rounded-lg shadow"
            onSubmit={handleAdditionalSubmit}
          >
            <h3 className="text-xl font-bold mb-4">Additional Details</h3>
            {/* Mission */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Mission
              </label>
              <input
                type="text"
                name="mission"
                value={additionalDetails.mission}
                onChange={handleAdditionalChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Vision
              </label>
              <input
                type="text"
                name="vision"
                value={additionalDetails.vision}
                onChange={handleAdditionalChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Founder
              </label>
              <input
                type="text"
                name="founder"
                value={additionalDetails.founder}
                onChange={handleAdditionalChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                CEO
              </label>
              <input
                type="text"
                name="ceo"
                value={additionalDetails.ceo}
                onChange={handleAdditionalChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={additionalDetails.description}
                onChange={handleAdditionalChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Website
              </label>
              <input
                type="text"
                name="website"
                value={additionalDetails.website}
                onChange={handleAdditionalChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Social Links */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Facebook
              </label>
              <input
                type="text"
                name="facebook"
                value={additionalDetails.socialLinks.facebook}
                onChange={handleAdditionalChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Instagram
              </label>
              <input
                type="text"
                name="instagram"
                value={additionalDetails.socialLinks.instagram}
                onChange={handleAdditionalChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Twitter
              </label>
              <input
                type="text"
                name="twitter"
                value={additionalDetails.socialLinks.twitter}
                onChange={handleAdditionalChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                LinkedIn
              </label>
              <input
                type="text"
                name="linkedin"
                value={additionalDetails.socialLinks.linkedin}
                onChange={handleAdditionalChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Save Additional Details
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditCompanyDetails;
