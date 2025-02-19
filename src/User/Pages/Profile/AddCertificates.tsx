import React from 'react';
import Header from '../../Components/Header/Header';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { motion } from 'framer-motion';
import useCertificate from '../../../CustomHooks/user/useCertificate';

export interface CertificateObject {
  certificateTitle: string;
  description?: string;
  certificateUrl?: string;
  issuer: string;
  issuedDate: string;
  _id?: string;
}


const AddCertificates: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const {     certificates,
    loading,
    form,
    errors,
    editIndex,
    handleChange,
    addOrUpdateCertificate,
    removeCertificate,
    handleEdit,
    } = useCertificate(user?._id)


  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 p-6">
        <motion.div
          className="bg-gradient-to-r from-purple-400 to-blue-500 shadow-lg text-white rounded-lg p-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-semibold">Add Certificates</h2>
        </motion.div>

        <div className="max-w-6xl mx-auto mt-2 bg-white p-8 rounded-xl shadow-lg grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-blue-700 mb-6 text-center">
              {editIndex !== null ? 'Update Certificate' : 'Add Certificate'}
            </h3>

            {/* <form onSubmit={handleAddOrUpdate} className="space-y-6"> */}
            <form onSubmit={(e) => {
          e.preventDefault();
          addOrUpdateCertificate();
        }} 
        className='space-y-6'
        >
              {[
                {
                  label: 'Certificate Title',
                  name: 'certificateTitle',
                  placeholder: 'e.g., React Certification',
                },
                {
                  label: 'Description',
                  name: 'description',
                  placeholder: 'e.g., Front End Developer',
                },
                {
                  label: 'Issuer',
                  name: 'issuer',
                  placeholder: 'e.g., Google',
                },
                {
                  label: 'Issued Date',
                  name: 'issuedDate',
                  placeholder: 'e.g., 22-06-2023',
                },
                {
                  label: 'Certificate URL',
                  name: 'certificateUrl',
                  placeholder: 'e.g., https://certificate.com',
                },
              ].map((field, idx) => (
                <div key={idx}>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    type="text"
                    name={field.name}
                    value={form[field.name as keyof CertificateObject]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="mt-1 w-full px-1 py-1 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-1 px-6 rounded-lg shadow-md hover:bg-blue-700 transition"
                >
                  {editIndex !== null ? 'Update' : 'Add'} Certificate
                </button>
              </div>
            </form>
          </div>

          {/* List Section */}
          <div>
            <h3 className="text-2xl font-semibold text-blue-700 mb-6 text-center">
              Certificates
            </h3>
            {certificates.length === 0 ? (
              <p className="text-gray-600 text-center">
                No certificates added yet.
              </p>
            ) : (
              <ul className="space-y-4">
                {certificates.map((cert, index) => (
                  <li
                    key={cert._id}
                    className="bg-white p-6 rounded-lg shadow-md flex justify-between items-start"
                  >
                    <div>
                      <p className="text-lg font-semibold text-gray-800">
                        {cert.certificateTitle}
                      </p>
                      <p className="text-gray-600">{cert?.description}</p>
                      <p className="text-gray-600">
                        {cert.issuer} - {cert.issuedDate}
                      </p>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleEdit(index, cert._id!)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removeCertificate(cert._id!)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCertificates;
