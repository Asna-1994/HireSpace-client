import React from 'react';
import Header from '../../Components/Header/Header';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { motion } from 'framer-motion';
import useExperience from '../../../CustomHooks/user/useExperience';


export interface ExperienceObject {
  company: string;
  designation: string;
  yearCompleted: string;
  dateFrom: string;
  dateTo: string;
  skillsGained: string[];
  _id?: string;
}

const AddWorkExperience: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  

  const {    
    experiences,
    form,
    errors,
    editIndex,
    handleChange,
    handleSubmit,
    handleEdit,
    removeExperience
 } = useExperience(user?._id);


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
          <h2 className="text-3xl font-semibold">Add Work Experience</h2>
        </motion.div>
        <div className="grid max-w-6xl grid-cols-1 gap-8 p-8 mx-auto mt-2 bg-white shadow-lg rounded-xl lg:grid-cols-2">
          {/* Form Section */}
          <div className="p-6 rounded-lg shadow-md bg-gray-50">
            <h3 className="mb-6 text-2xl font-semibold text-center text-blue-700">
              {editIndex !== null
                ? 'Update Work Experience'
                : 'Add Work Experience'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              {[
                {
                  label: 'Company',
                  name: 'company',
                  placeholder: 'e.g., ABC Corp',
                },
                {
                  label: 'Designation',
                  name: 'designation',
                  placeholder: 'e.g., Front End Developer',
                },
                {
                  label: 'Year Completed',
                  name: 'yearCompleted',
                  placeholder: 'e.g., 2022',
                },
                {
                  label: 'Start Date',
                  name: 'dateFrom',
                  placeholder: 'e.g., 2020-01-01',
                },
                {
                  label: 'End Date',
                  name: 'dateTo',
                  placeholder: 'e.g., 2022-01-01',
                },
                {
                  label: 'Skills Gained',
                  name: 'skillsGained',
                  placeholder: 'e.g., React, Node.js',
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
                    value={form[field.name as keyof ExperienceObject]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full px-1 py-1 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {errors[field.name] && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}
              <div className="text-center">
                <button
                  type="submit"
                  className="px-4 py-2 text-white transition bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
                >
                  {editIndex !== null ? 'Update' : 'Add'} Experience
                </button>
              </div>
            </form>
          </div>
          {/* List Section */}
          <div>
            <h3 className="mb-6 text-2xl font-semibold text-center text-blue-700">
              Work Experience Details
            </h3>
            {experiences?.length === 0 ? (
              <p className="text-center text-gray-600">
                No work experience details added yet.
              </p>
            ) : (
             
              <ul className="space-y-4 ">
                {experiences?.map((exp, index) => (
                  <li
                    key={exp._id}
                    className="flex items-start justify-between p-6 bg-white rounded-lg shadow-md"
                  >
                    <div>
                      <p className="text-lg font-semibold text-gray-800">
                        {exp.company}
                      </p>
                      <p className="text-lg font-medium text-gray-800">
                        {exp.designation}
                      </p>
                      <p className="text-gray-600">
                        {exp.dateFrom} - {exp.dateTo} ({exp.yearCompleted})
                      </p>
                      <p className="text-gray-600">
                        Skills: {exp.skillsGained.join(', ')}
                      </p>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleEdit(index, exp?._id as string)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removeExperience( exp?._id as string)}
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

export default AddWorkExperience;
