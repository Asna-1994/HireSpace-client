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
          <h2 className="text-3xl font-semibold">Add Education</h2>
        </motion.div>

        <div className="grid max-w-6xl grid-cols-1 gap-8 p-8 mx-auto mt-2 bg-white shadow-lg rounded-xl lg:grid-cols-2">
          <div className="p-4 rounded-lg shadow-md bg-gray-50">
            <h3 className="mb-4 text-2xl font-semibold text-center text-blue-700">
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
                    className="w-full px-1 py-1 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {errors[field.name] && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}

              <div className="text-center">
                <button
                  type="submit"
                  className="px-3 py-1 text-lg text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  {editIndex !== null ? 'Update Education' : 'Add Education'}
                </button>
              </div>
            </form>
          </div>

          {/* <div className="p-6 rounded-lg shadow-md bg-gray-50"> */}
          <div className="p-6 rounded-lg shadow-md bg-gray-50 h-[600px] overflow-y-auto">

            <h3 className="mb-4 text-xl font-semibold text-blue-700">
              Your Education
            </h3>
            <div className="space-y-4 overflow-y-auto">
              {educations.map((edu, index) => (
                <li
                  key={edu._id}
                  className="flex items-start justify-between p-6 bg-white rounded-lg shadow-md"
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
