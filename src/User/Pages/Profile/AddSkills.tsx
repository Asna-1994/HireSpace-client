import React from 'react';
import Header from '../../Components/Header/Header';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { motion } from 'framer-motion';
import { useSkills } from '../../../CustomHooks/user/useSkills';


export interface Skills {
  softSkills?: string[];
  hardSkills?: string[];
  technicalSkills?: string[];
  _id?: string;
}

const AddSkills: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const {    skills,
    skillsList,
    errors,
    handleAddOrUpdate,
    handleDeleteSkill,
    handleEdit,
    handleChange,} = useSkills(user?._id)


  const getArrayValue = (value: string | string[] | undefined): string => {
    if (Array.isArray(value)) {
      return value.join(',');
    }
    return '';
  };



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
          <h2 className="text-3xl font-semibold">Manage Skills</h2>
        </motion.div>
        <div className="max-w-6xl mx-auto mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-blue-700 mb-6 text-center">
              Add or Edit Skills
            </h3>
            <form onSubmit={handleAddOrUpdate} className="space-y-6">
              {[
                {
                  label: 'Soft Skills',
                  name: 'softSkills',
                  placeholder: 'e.g., Communication, Leadership',
                },
                {
                  label: 'Hard Skills',
                  name: 'hardSkills',
                  placeholder: 'e.g., Project Management',
                },
                {
                  label: 'Technical Skills',
                  name: 'technicalSkills',
                  placeholder: 'e.g., JavaScript, React',
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
                    value={getArrayValue(skills[field.name as keyof Skills])}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="mt-1 w-full px-1 py-1 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  {errors[field.name] && (
                    <div className="text-red-500 text-sm">
                      {errors[field.name]}
                    </div>
                  )}
                </div>
              ))}
              <div className="text-center">
                <button
                  type="submit"
                  className="mb-2 bg-indigo-600 text-white py-2 px-3 rounded-lg shadow-lg hover:bg-indigo-700 transition"
                >
                  Save Skills
                </button>
              </div>
            </form>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-blue-600 mb-4 text-center">
              Skills Details
            </h3>
            {!skillsList.softSkills?.length &&
            !skillsList.hardSkills?.length &&
            !skillsList.technicalSkills?.length ? (
              <p className="text-gray-600 text-center">No skills added yet.</p>
            ) : (
              <div className="max-h-64 overflow-y-auto">
                <ul className="space-y-4">
                  {[
                    { label: 'Soft Skills', skills: skillsList.softSkills },
                    { label: 'Hard Skills', skills: skillsList.hardSkills },
                    {
                      label: 'Technical Skills',
                      skills: skillsList.technicalSkills,
                    },
                  ].map((category, idx) => (
                    <li
                      key={idx}
                      className="bg-gray-50 p-4 rounded-lg shadow-sm"
                    >
                      <div className="flex justify-between">
                        <h4 className="text-xl font-semibold text-gray-800">
                          {category.label}
                        </h4>
                        {category.skills && category?.skills?.length > 0 && (
                          <button
                            onClick={() =>
                              handleDeleteSkill(
                                category.label.toLowerCase().replace(' ', '')
                              )
                            }
                            className="text-red-500 ml-4"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      <ul className="list-disc list-inside ml-4">
                        {category.skills?.map((skill, index) => (
                          <li key={index} className="text-gray-600">
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="text-center mt-6">
              <button
                onClick={handleEdit}
                className="bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-indigo-700 transition"
              >
                Edit Skills
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddSkills;
