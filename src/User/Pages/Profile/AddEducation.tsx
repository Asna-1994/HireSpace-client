import React, { useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import axiosInstance from "../../../Utils/Instance/axiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import * as Yup from "yup";

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
  const [educations, setEducations] = useState<Education[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [educationId, setEducationId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Education>({
    educationName: "",
    subject: "",
    schoolOrCollege: "",
    yearOfPassing: "",
    universityOrBoard: "",
    markOrGrade: "",
  });
  const [errors, setErrors] = useState<any>({});

  const validationSchema = Yup.object().shape({
    educationName: Yup.string()
      .min(3, "Must be at least 3 characters")
      .required("Required"),
    subject: Yup.string()
      .min(3, "Must be at least 3 characters")
      .required("Required"),
    schoolOrCollege: Yup.string()
      .min(3, "Must be at least 3 characters")
      .required("Required"),
    yearOfPassing: Yup.string()
      .matches(/^\d{4}$/, "Enter a valid 4-digit year")
      .required("Required"),
    universityOrBoard: Yup.string()
      .min(3, "Must be at least 3 characters")
      .required("Required"),
    markOrGrade: Yup.string()
      .matches(
        /^(\d{1,3}%|[A-F][+-]?)$/,
        "Enter a valid percentage (e.g., 85%) or grade (e.g., A+)",
      )
      .required("Required"),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = async () => {
    try {
      await validationSchema.validate(formValues, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err: any) {
      const errorObj: any = {};
      err.inner.forEach((error: any) => {
        errorObj[error.path] = error.message;
      });
      setErrors(errorObj);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = await validateForm();
    if (!isValid) return;

    try {
      const res = await axiosInstance.patch(
        `/user/${user?._id}/add-education`,
        formValues,
        {
          params: { educationId },
        },
      );
      if (res.data.success) {
        toast.success("Education updated successfully");
        getEducations();
        setFormValues({
          educationName: "",
          subject: "",
          schoolOrCollege: "",
          yearOfPassing: "",
          universityOrBoard: "",
          markOrGrade: "",
        });
        setEditIndex(null);
        setEducationId(null);
      } else {
        toast.error(res.data.message);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (index: number, eduId: string) => {
    const selectedEducation = educations[index];
    setFormValues(selectedEducation);
    setEditIndex(index);
    setEducationId(eduId);
  };

  const handleDelete = async (index: number, eduId: string) => {
    try {
      const response = await axiosInstance.delete(
        `/user/${user?._id}/education/${eduId}`,
      );
      if (response.data.success) {
        toast.success("Education deleted successfully");
        setEducations(response.data.data.educations);
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error deleting education");
    }
  };

  const getEducations = async () => {
    try {
      const response = await axiosInstance.get(
        `/user/${user?._id}/all-education`,
      );
      if (response.data.success) {
        setEducations(response.data.data.educations);
      }
    } catch (err: any) {
      console.error(
        "Error fetching education data:",
        err.response?.data?.message,
      );
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
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-blue-700 mb-6 text-center">
              {editIndex !== null ? "Update Education" : "Add Education"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  {editIndex !== null ? "Update Education" : "Add Education"}
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
                      {edu.universityOrBoard} - {edu?.subject}{" "}
                    </p>
                    <p className="text-gray-600">
                      {edu?.schoolOrCollege} - {edu.yearOfPassing} -{" "}
                      {edu.markOrGrade}
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleEdit(index, edu._id as string)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index, edu._id as string)}
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
