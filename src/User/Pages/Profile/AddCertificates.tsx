
import React, { useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import axiosInstance from "../../../Utils/Instance/axiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import * as yup from "yup";  

export interface CertificateObject {
  certificateTitle: string;
  description?: string;
  certificateUrl?: string;
  issuer: string;
  issuedDate: string;
  _id?: string;
}

const certificateSchema = yup.object().shape({
  certificateTitle: yup.string().required("Certificate Title is required"),
  description: yup.string().optional(),
  certificateUrl: yup
    .string()
    .nullable() 
    .notRequired()
    .matches(
      /^(https?:\/\/[^\s]+)?$/,
      "Must be a valid URL (if provided)"
    ),
  issuer: yup.string().required("Issuer is required"),
  issuedDate: yup
    .string()
    .matches(/^\d{2}-\d{2}-\d{4}$/, "Date must be in DD-MM-YYYY format")
    .test("isValidDate", "Invalid date", (value) => {
      if (!value) return false;
      const [day, month, year] = value.split("-").map(Number);
      const parsedDate = new Date(`${year}-${month}-${day}`);
      return !isNaN(parsedDate.getTime()) && parsedDate.getDate() === day;
    })
    .test("isPastOrToday", "Issued Date cannot be in the future", (value) => {
      if (!value) return false;
      const [day, month, year] = value.split("-").map(Number);
      const parsedDate = new Date(`${year}-${month}-${day}`);
      return parsedDate.getTime() <= new Date().getTime();
    })
    .required("Issued Date is required"),
});


const AddCertificates: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [certificates, setCertificates] = useState<CertificateObject[]>([]);
  const [form, setForm] = useState<CertificateObject>({
    certificateTitle: "",
    description: "",
    certificateUrl: "",
    issuer: "",
    issuedDate: "",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [certificateId, setCertificateId] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
      await certificateSchema.validate(form, { abortEarly: false });
      setErrors({}); 
  
      const res = await axiosInstance.patch(
        `/user/add-or-update-certificates/${user?._id}`,
        form,
        { params: { certificateId } }
      );
  
      if (res.data.success) {
        toast.success("Certificate updated successfully");
        getCertificates();
        resetForm();
      } else {
        toast.error(res.data.message);
      }
    } catch (err: any) {
      if (err.name === "ValidationError") {
        const validationErrors: { [key: string]: string } = {};
        err.inner.forEach((error: any) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      } else {
        toast.error(err.response?.data?.message);
      }
    }
  };
  

  const handleEdit = (index: number, certificateId: string) => {
    setForm(certificates[index]);
    setEditIndex(index);
    setCertificateId(certificateId);
  };

  const resetForm = () => {
    setForm({
      certificateTitle: "",
      description: "",
      certificateUrl: "",
      issuer: "",
      issuedDate: "",
    });
    setEditIndex(null);
    setCertificateId(null);
    setErrors({});
  };

  const getCertificates = async () => {
    try {
      const response = await axiosInstance.get(`/user/${user?._id}/all-certificates`);
      if (response.data.success) {
        setCertificates(response.data.data.certificates);
      } else {
        console.log("Error in fetching certificates", response.data.message);
      }
    } catch (err: any) {
      console.log(err.response?.data?.message);
    }
  };

  useEffect(() => {
    getCertificates();
  }, []);

  const handleDelete = async (index: number, certificateId: string) => {
    try {
      const response = await axiosInstance.delete(`/user/${user?._id}/certificates/${certificateId}`);
      if (response.data.success) {
        toast.success("Successfully deleted");
        setCertificates(response.data.data.certificates);
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
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
          <h2 className="text-3xl font-semibold">Add Certificates</h2>
        </motion.div>
        
        <div className="max-w-6xl mx-auto mt-2 bg-white p-8 rounded-xl shadow-lg grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-blue-700 mb-6 text-center">
              {editIndex !== null ? "Update Certificate" : "Add Certificate"}
            </h3>
            
            <form onSubmit={handleAddOrUpdate} className="space-y-6">
              {[
                { label: "Certificate Title", name: "certificateTitle", placeholder: "e.g., React Certification" },
                { label: "Description", name: "description", placeholder: "e.g., Front End Developer" },
                { label: "Issuer", name: "issuer", placeholder: "e.g., Google" },
                { label: "Issued Date", name: "issuedDate", placeholder: "e.g., 22-06-2023" },
                { label: "Certificate URL", name: "certificateUrl", placeholder: "e.g., https://certificate.com" },
              ].map((field, idx) => (
                <div key={idx}>
                  <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
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
                    <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                  )}
                </div>
              ))}
              
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-1 px-6 rounded-lg shadow-md hover:bg-blue-700 transition"
                >
                  {editIndex !== null ? "Update" : "Add"} Certificate
                </button>
              </div>
            </form>
          </div>
          
          {/* List Section */}
          <div>
            <h3 className="text-2xl font-semibold text-blue-700 mb-6 text-center">Certificates</h3>
            {certificates.length === 0 ? (
              <p className="text-gray-600 text-center">No certificates added yet.</p>
            ) : (
              <ul className="space-y-4">
                {certificates.map((cert, index) => (
                  <li key={cert._id} className="bg-white p-6 rounded-lg shadow-md flex justify-between items-start">
                    <div>
                      <p className="text-lg font-semibold text-gray-800">{cert.certificateTitle}</p>
                      <p className="text-gray-600">{cert?.description}</p>
                      <p className="text-gray-600">{cert.issuer} - {cert.issuedDate}</p>
                    </div>
                    <div className="flex space-x-4">
                      <button onClick={() => handleEdit(index, cert._id as string)} className="text-blue-600 hover:text-blue-800">Edit</button>
                      <button onClick={() => handleDelete(index, cert._id as string)} className="text-red-600 hover:text-red-800">Delete</button>
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


