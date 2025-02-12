import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";

const ViewApplicationDetails = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();

  // Application data passed via state
  const { application } = location.state;
  console.log(application);

  const { coverLetter, userId, jobPostId, appliedDate, status } = application;

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-400 to-blue-500 shadow-lg text-white rounded-lg p-6 sm:p-8">
          <h2 className="text-3xl sm:text-4xl font-semibold">
            Application Details
          </h2>
          <p className="mt-2 text-lg sm:text-xl">
            Review all the details related to your job application.
          </p>
        </div>

        {/* Application Details Section */}
        <div className="mt-8 space-y-6">
          {/* Job Details */}
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow">
            <h3 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              Job Details
            </h3>
            <div className="mt-4 space-y-2">
              <p className="text-lg sm:text-xl">
                <span className="font-semibold">Job Title: </span>
                {jobPostId?.jobTitle}
              </p>
              <p className="text-lg sm:text-xl">
                <span className="font-semibold">Company: </span>
                {jobPostId?.companyId?.companyName}
              </p>
              <p className="text-lg sm:text-xl">
                <span className="font-semibold">Location: </span>
                {jobPostId?.location?.city}, {jobPostId?.location?.state}
              </p>
              <p className="text-lg sm:text-xl">
                <span className="font-semibold">Salary: </span>
                {jobPostId?.salaryRange?.currency} {jobPostId?.salaryRange?.min}{" "}
                - {jobPostId?.salaryRange?.max}
              </p>
              <p className="text-lg sm:text-xl">
                <span className="font-semibold">Job Type: </span>
                {jobPostId?.jobType}
              </p>
              <p className="text-lg sm:text-xl">
                <span className="font-semibold">Experience Level: </span>
                {jobPostId?.experienceLevel}
              </p>
              <p className="text-lg sm:text-xl">
                <span className="font-semibold">Application Deadline: </span>
                {new Date(jobPostId?.applicationDeadline).toLocaleDateString()}
              </p>
              <p className="text-lg sm:text-xl">
                <span className="font-semibold">Posted On: </span>
                {new Date(jobPostId?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Cover Letter Section */}
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow">
            <h3 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              Cover Letter
            </h3>
            <div className="mt-4 space-y-3">
              <p className="text-lg sm:text-xl">
                <span className="font-semibold">Salutation: </span>
                {coverLetter?.salutation}
              </p>
              <p className="text-lg sm:text-xl">
                <span className="font-semibold">Body: </span>
                {coverLetter?.body}
              </p>
              <p className="text-lg sm:text-xl">
                <span className="font-semibold">Closing: </span>
                {coverLetter?.closing}
              </p>
            </div>
          </div>

          {/* Status and Dates */}
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow">
            <h3 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              Application Status
            </h3>
            <div className="mt-4 space-y-2">
              <p className="text-lg sm:text-xl">
                <span className="font-semibold">Applied On: </span>
                {new Date(appliedDate).toLocaleDateString()}
              </p>
              <p className="text-lg sm:text-xl flex items-center">
                <span className="font-semibold">Status: </span>
                {userId.isPremium ? (
                  <span
                    className={`ml-2 ${
                      status === "pending"
                        ? "bg-yellow-400"
                        : status === "accepted"
                          ? "bg-green-500"
                          : "bg-red-500"
                    } text-white px-2 py-1 rounded-lg`}
                  >
                    {status}
                  </span>
                ) : (
                  <span className="ml-2 text-gray-600 italic">
                    Premium feature
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ViewApplicationDetails;
