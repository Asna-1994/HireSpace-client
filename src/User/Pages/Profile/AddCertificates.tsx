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

    if(loading){
      return (
              <div className="flex items-center justify-center py-8">
                <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
              </div>
      )
    }

  return (
    <>
      <Header />
      <div className="min-h-screen p-6 bg-gradient-to-r from-blue-100 to-blue-200">
        <motion.div
          className="p-6 text-white rounded-lg shadow-lg bg-gradient-to-r from-purple-400 to-blue-500"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-semibold">Add Certificates</h2>
        </motion.div>

        <div className="grid max-w-6xl grid-cols-1 gap-8 p-8 mx-auto mt-2 bg-white shadow-lg rounded-xl lg:grid-cols-2">
          {/* Form Section */}
          <div className="p-6 rounded-lg shadow-md bg-gray-50">
            <h3 className="mb-6 text-2xl font-semibold text-center text-blue-700">
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
                    className="w-full px-1 py-1 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {errors[field.name] && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}

              <div className="text-center">
                <button
                  type="submit"
                  className="px-6 py-1 text-white transition bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
                >
                  {editIndex !== null ? 'Update' : 'Add'} Certificate
                </button>
              </div>
            </form>
          </div>

          {/* List Section */}
          <div>
            <h3 className="mb-6 text-2xl font-semibold text-center text-blue-700">
              Certificates
            </h3>
            {certificates.length === 0 ? (
              <p className="text-center text-gray-600">
                No certificates added yet.
              </p>
            ) : (
              <ul className="space-y-4">
                {certificates.map((cert, index) => (
                  <li
                    key={cert._id}
                    className="flex items-start justify-between p-6 bg-white rounded-lg shadow-md"
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
