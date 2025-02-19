import React from 'react';
import Header from '../../Components/Header/Header';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { motion } from 'framer-motion';
import useEducation from '../../../CustomHooks/user/useEducation';

export interface Education {
  educationName: string;
  subject: string;
  schoolOrCollege: string;
  yearOfPassing: string;
  universityOrBoard: string;
  markOrGrade: string;
  _id?: string;
}

const AddEducation: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const {       educations,
    loading,
    formValues,
    errors,
    handleChange,
    editIndex,
    handleSubmit,
    handleEdit,
    removeEducation,
 } = useEducation(user?._id);


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
          <h2 className="text-3xl font-semibold">Add Education</h2>
        </motion.div>

        <div className="max-w-6xl mx-auto mt-2 bg-white p-8 rounded-xl shadow-lg grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-blue-700 mb-6 text-center">
              {editIndex !== null ? 'Update Education' : 'Add Education'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              {[
                {
                  label: 'Education Name',
                  name: 'educationName',
                  placeholder: "e.g., Bachelor's Degree",
                },
                {
                  label: 'Subject',
                  name: 'subject',
                  placeholder: 'e.g., Computer Science',
                },
                {
                  label: 'School or College',
                  name: 'schoolOrCollege',
                  placeholder: 'e.g., XYZ University',
                },
                {
                  label: 'Year of Passing',
                  name: 'yearOfPassing',
                  placeholder: 'e.g., 2022',
                },
                {
                  label: 'University or Board',
                  name: 'universityOrBoard',
                  placeholder: 'e.g., ABC Board',
                },
                {
                  label: 'Mark or Grade',
                  name: 'markOrGrade',
                  placeholder: 'e.g., 85% or A+',
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
                    value={formValues[field.name as keyof Education]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="mt-1 w-full px-1 py-1 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}

              <div className="text-center">
                <button
                  type="submit"
                  className="px-4 py-1 text-lg text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  {editIndex !== null ? 'Update Education' : 'Add Education'}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-blue-700 mb-4">
              Your Education
            </h3>
            <div className="space-y-4">
              {educations.map((edu, index) => (
                <li
                  key={edu._id}
                  className="bg-white p-6 rounded-lg shadow-md flex justify-between items-start"
                >
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      {edu.educationName}
                    </p>
                    <p className="text-gray-600">
                      {edu.universityOrBoard} - {edu?.subject}{' '}
                    </p>
                    <p className="text-gray-600">
                      {edu?.schoolOrCollege} - {edu.yearOfPassing} -{' '}
                      {edu.markOrGrade}
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleEdit(index, edu._id!)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeEducation(edu._id!)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddEducation;
