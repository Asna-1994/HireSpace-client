
import React, { useEffect, useState } from "react";
import { JobPost } from "../../../Compnay/Pages/JobPosts/AllJobPosts";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import { FaBriefcase, FaExclamationTriangle } from "react-icons/fa";
import ApplyModal from "./ApplyModal";
import ReportSpamModal from "../../../Shared/CompanyProfileUtilities/companyProfileUtilities";

const ViewJobDetails: React.FC = () => {
  const { company, user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const location = useLocation();
  const { jobPost } = location.state as { jobPost: JobPost };
  const navigate = useNavigate();

  const handleApplyClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Prevent background scroll when a modal is open
  useEffect(() => {
    if (isModalOpen || isReportModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen, isReportModalOpen]);

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className="text-blue-500 border-2 rounded-full p-2">
                  {jobPost?.companyId?.companyLogo ? (
                    <img
                      src={jobPost.companyId.companyLogo.url}
                      alt="Company Logo"
                      className="h-11 w-11 object-cover"
                    />
                  ) : (
                    <FaBriefcase className="text-2xl" />
                  )}
                </div>
                <h2 className="text-gray-600 font-bold text-2xl">
                  {jobPost.companyId?.companyName}
                </h2>
              </div>
              <button
                className="flex items-center gap-1 px-3 py-2 rounded-md bg-red-600 text-white shadow-lg transition-all duration-300 hover:bg-red-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-400"
                onClick={() => setIsReportModalOpen(true)}
              >
                <FaExclamationTriangle className="text-lg" />
                <span className="font-medium">Report Spam</span>
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-4">
              {jobPost.jobTitle}
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              {jobPost.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Skills, Responsibilities, and Benefits */}
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-700">
                  Skills Required
                </h2>
                <ul className="list-disc list-inside text-gray-600 mt-2 text-sm sm:text-base">
                  {jobPost.skillsRequired.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-700">
                  Responsibilities
                </h2>
                <ul className="list-disc list-inside text-gray-600 mt-2 text-sm sm:text-base">
                  {jobPost.responsibilities.map((responsibility, index) => (
                    <li key={index}>{responsibility}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-700">
                  Benefits
                </h2>
                <ul className="list-disc list-inside text-gray-600 mt-2 text-sm sm:text-base">
                  {jobPost.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Job Details and Apply Button */}
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-700">
                  Job Details
                </h2>
                <div className="mt-2 text-gray-600 text-sm sm:text-base space-y-2">
                  <p>
                    <strong>Location:</strong>{" "}
                    {jobPost.location.city}, {jobPost.location.state},{" "}
                    {jobPost.location.country}
                  </p>
                  <p>
                    <strong>Work Mode:</strong> {jobPost.workMode}
                  </p>
                  <p>
                    <strong>Salary:</strong> {jobPost.salaryRange.currency}{" "}
                    {jobPost.salaryRange.min} - {jobPost.salaryRange.max}
                  </p>
                  <p>
                    <strong>Job Type:</strong> {jobPost.jobType}
                  </p>
                  <p>
                    <strong>Experience Level:</strong> {jobPost.experienceLevel}
                  </p>
                  <p>
                    <strong>Education Required:</strong>{" "}
                    {jobPost.educationRequired}
                  </p>
                  <p>
                    <strong>Application Deadline:</strong>{" "}
                    {new Date(jobPost.applicationDeadline).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Employment Start Date:</strong>{" "}
                    {new Date(jobPost.employmentStartDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Number of Vacancies:</strong>{" "}
                    {jobPost.numberOfVacancies}
                  </p>
                  <p>
                    <strong>Status:</strong> {jobPost.status}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <button
                  className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors text-base font-medium"
                  onClick={handleApplyClick}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Apply Modal */}
        {isModalOpen &&
          user?._id &&
          jobPost._id &&
          jobPost.companyId?._id && (
            <ApplyModal
              jobPostId={jobPost._id}
              userId={user._id}
              companyId={jobPost.companyId._id}
              onClose={handleCloseModal}
            />
          )}

        {/* Report Spam Modal */}
        {isReportModalOpen &&
          user?._id &&
          jobPost.companyId?._id && (
            <ReportSpamModal
              isOpen={isReportModalOpen}
              onClose={() => setIsReportModalOpen(false)}
              userId={user._id}
              companyId={jobPost.companyId._id}
            />
          )}
      </div>
      <Footer />
    </>
  );
};

export default ViewJobDetails;
