import { useLocation } from "react-router-dom";
import CompanyHeader from "../../Components/Header/Header";
import { HiDocumentText } from "react-icons/hi";
import { motion } from "framer-motion";
import { useState } from "react";
import axiosInstance from "../../../Utils/Instance/axiosInstance";
import { toast } from "react-toastify";

const ApplicationDetails = () => {
  const location = useLocation();
  const { application } = location.state;

  const [status, setStatus] = useState(application.status);

  const handleStatusUpdate = async () => {
    try {
      const response = await axiosInstance.patch(
        `/company/job-application-status/${application._id}`,
        { status },
      );
      if (response.data.success) {
        setStatus(response.data.application.status);
        toast.success("status updated");
      } else {
        toast.error(response.data.message);
      }
    } catch (err: any) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <>
      <CompanyHeader />
      <div className="container mx-auto px-6 py-12 space-y-8">
        {/* Header Section */}
        <motion.div
          className="bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg text-white rounded-lg p-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-3xl font-bold">Application Details</h2>
          <p className="mt-2 text-lg font-light">
            Explore all the details of the applicant's submission in one place.
          </p>
        </motion.div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Applicant Information */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Applicant Information
              </h3>
              <div className="space-y-3 text-gray-700">
                <p>
                  <span className="font-semibold text-gray-800">Name:</span>{" "}
                  {application.userId.userName}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Email:</span>{" "}
                  {application.userId.email}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">
                    Job Title:
                  </span>{" "}
                  {application.jobPostId.jobTitle}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">
                    Applied On:
                  </span>{" "}
                  {new Date(application.appliedDate).toLocaleDateString()}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-800">Status:</span>
                  <div
                    className={`relative inline-block rounded-lg overflow-hidden border ${
                      status === "pending"
                        ? "bg-yellow-100 border-yellow-300"
                        : status === "accepted"
                          ? "bg-green-100 border-green-300"
                          : status === "rejected"
                            ? "bg-red-100 border-red-300"
                            : "bg-blue-100 border-blue-300"
                    }`}
                  >
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className={`w-full h-full px-4 py-2 rounded-lg text-sm font-semibold ${
                        status === "pending"
                          ? "text-yellow-800"
                          : status === "accepted"
                            ? "text-green-800"
                            : status === "rejected"
                              ? "text-red-800"
                              : "text-blue-800"
                      } appearance-none bg-transparent`}
                    >
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                      <option value="reviewed">Reviewed</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleStatusUpdate}
                  className="mt-4 bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600"
                >
                  Update Status
                </button>
              </div>
            </div>

            {/* Resume Section */}
            {application.resumeUrl && (
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h4 className="text-2xl font-bold text-gray-900 mb-4">
                  Resume
                </h4>
                <div className="mt-4 flex flex-col space-y-4">
                  {application.resumeUrl.endsWith(".pdf") ? (
                    <iframe
                      src={application.resumeUrl}
                      title="Resume PDF"
                      className="w-full h-96 border rounded-md"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <HiDocumentText className="text-3xl text-gray-600" />
                      <a
                        href={application.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg text-indigo-600 hover:text-indigo-800 font-medium flex items-center space-x-1"
                      >
                        <span>View Resume</span>
                      </a>
                    </div>
                  )}
                  <a
                    href={application.resumeUrl}
                    download
                    className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 text-center"
                  >
                    Download Resume
                  </a>
                </div>
              </div>
            )}
          </motion.div>

          {/* Cover Letter Section */}
          <motion.div
            className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Cover Letter
            </h3>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p className="font-semibold text-gray-800">
                {application.coverLetter.salutation},
              </p>
              <p>{application.coverLetter.body}</p>
              <p className="font-semibold mt-4 text-gray-800">Sincerely,</p>
              <p className="font-semibold text-gray-800">
                {application.userId.userName}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ApplicationDetails;
