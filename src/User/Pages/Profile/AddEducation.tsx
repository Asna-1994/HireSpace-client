import React, { useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import axiosInstance from "../../../Utils/Instance/axiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export interface Education {
  educationName: string;
  subject: string;
  schoolOrCollege: string;
  yearOfPassing: string;
  universityOrBoard: string;
  markOrGrade: string;
  _id? : string;
}

const AddEducation: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [educations, setEducations] = useState<Education[]>([]);
  const [form, setForm] = useState<Education>({
    educationName: "",
    subject: "",
    schoolOrCollege: "",
    yearOfPassing: "",
    universityOrBoard: "",
    markOrGrade: "",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [educationId, setEducationId] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleAddOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
      try {
        const res = await axiosInstance.patch(
          `/user/${user?._id}/add-education`,
          form,{
            params :{educationId}
          }
        );
        if (res.data.success) {
          toast.success("Education updated successfully");
        console.log(res.data.data.educations)
        // setEducations(res.data.data.educations)
        getEducations()
         resetForm()
        } else {
          toast.error(res.data.message);
        }
      } catch (err: any) {
        toast.error(err.response.data.message);
        console.error(err.response.data.message || err.message);
      }

  };

  const handleEdit = (index: number , educationId : string) => {
    setForm(educations[index]);
    setEditIndex(index);
    setEducationId(educationId);
  };


  const resetForm = () => {
    setForm({
      educationName: "",
      subject: "",
      schoolOrCollege: "",
      yearOfPassing: "",
      universityOrBoard: "",
      markOrGrade: "",
    });
    setEditIndex(null);
    setEducationId(null);
  };

  const handleDelete =async (index: number, educationId : string) => {
    try{
        const response  = await axiosInstance.delete(`/user/${user?._id}/education/${educationId}`)
        if(response.data.success){
            toast.success("successfully deleted")
            setEducations(response.data.data.educations)
        }else{
            toast.error(response?.data?.message);
        }
    }
    catch(error : any){
          toast.error(error.response?.data?.message);
    }

  };

  const getEducations = async () => {
    try {
      const response = await axiosInstance.get(`/user/${user?._id}/all-education`);
      if (response.data.success) {
        setEducations(response.data.data.educations)
        
      } else {
        console.log("Error in fetching education", response.data.message);
      }
    } catch (err: any) {
      console.log(err?.response?.data?.message);
      console.log(err);
    }
  };

  useEffect(() => {
    getEducations();
  }, []);

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
          {/* Form Section */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-blue-700 mb-6 text-center">
              {editIndex !== null ? "Update Education" : "Add Education"}
            </h3>
            <form onSubmit={handleAddOrUpdate} className="space-y-6">
              {[
                {
                  label: "Education Name",
                  name: "educationName",
                  placeholder: "e.g., Bachelor's Degree",
                },
                {
                  label: "Subject",
                  name: "subject",
                  placeholder: "e.g., Computer Science",
                },
                {
                  label: "School or College",
                  name: "schoolOrCollege",
                  placeholder: "e.g., XYZ University",
                },
                {
                  label: "Year of Passing",
                  name: "yearOfPassing",
                  placeholder: "e.g., 2022",
                },
                {
                  label: "University or Board",
                  name: "universityOrBoard",
                  placeholder: "e.g., ABC Board",
                },
                {
                  label: "Mark or Grade",
                  name: "markOrGrade",
                  placeholder: "e.g., 85% or A+",
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
                    value={form[field.name as keyof Education]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="mt-1 w-full px-2 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              ))}
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-8 rounded-lg shadow-md hover:bg-blue-700 transition"
                >
                  {editIndex !== null ? "Update" : "Add"} Education
                </button>
              </div>
            </form>
          </div>
          {/* List Section */}
          <div>
            <h3 className="text-2xl font-semibold text-blue-700 mb-6 text-center">
            Education Details
            </h3>
            {educations?.length === 0 ? (
              <p className="text-gray-600 text-center">
                No education details added yet.
              </p>
            ) : (
              <ul className="space-y-4">
                {educations?.map((edu, index) => (
                  <li
                    key={edu._id}
                    className="bg-white p-6 rounded-lg shadow-md flex justify-between items-start"
                  >
                    <div>
                      <p className="text-lg font-semibold text-gray-800">
                        {edu?.educationName}
                      </p>
                      <p className="text-gray-600">
                        {edu?.subject} at {edu.schoolOrCollege} ({edu.yearOfPassing})
                      </p>
                      <p className="text-gray-600">
                        {edu.universityOrBoard} - {edu.markOrGrade}
                      </p>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleEdit(index, edu?._id as string)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(index, edu?._id as string)}
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

export default AddEducation;
