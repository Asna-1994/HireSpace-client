
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { FaBriefcase, FaCalendarAlt, FaClipboardList, FaMapMarkerAlt } from "react-icons/fa";
import axiosInstance from "../../../Utils/Instance/axiosInstance";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";

const ViewApplicationDetails = () => {
  const { applicationId } = useParams<{ applicationId: string }>();

  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation()

  const { application } = location.state ;
  console.log(application)


  const {
    coverLetter,
    userId,
    jobPostId,
    appliedDate,
    status
  } = application;

  return (
    <div>
      <Header />
      <div className="container mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-green-400 to-blue-500 shadow-lg text-white rounded-lg p-6">
          <h2 className="text-3xl font-semibold">Application Details</h2>
          <p className="mt-2 text-lg">Review all the details related to your job application.</p>
        </div>

        <div className="mt-8 space-y-6">
          {/* Application Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-800">Job Details</h3>
            <div className="mt-4">
              <p className="text-lg">
                <span className="font-semibold">Job Title: </span>{jobPostId?.jobTitle}
              </p>
              <p className="text-lg">
                <span className="font-semibold">Company: </span>{jobPostId?.companyId?.companyName}
              </p>
              <p className="text-lg">
                <span className="font-semibold">Location: </span>{jobPostId?.location?.city}, {jobPostId?.location?.state}
              </p>
              <p className="text-lg">
                <span className="font-semibold">Salary: </span>
                {jobPostId?.salaryRange?.currency} {jobPostId?.salaryRange?.min} - {jobPostId?.salaryRange?.max}
              </p>
              <p className="text-lg">
                <span className="font-semibold">Job Type: </span>{jobPostId?.jobType}
              </p>
              <p className="text-lg">
                <span className="font-semibold">Experience Level: </span>{jobPostId?.experienceLevel}
              </p>
              <p className="text-lg">
                <span className="font-semibold">Application Deadline: </span>{new Date(jobPostId?.applicationDeadline).toLocaleDateString()}
              </p>
              <p className="text-lg">
                <span className="font-semibold">Posted On: </span>{new Date(jobPostId?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Cover Letter */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-800">Cover Letter</h3>
            <p className="mt-4">
              <span className="font-semibold">Salutation: </span>{coverLetter?.salutation}
            </p>
            <p className="mt-2">
              <span className="font-semibold">Body: </span>{coverLetter?.body}
            </p>
            <p className="mt-2">
              <span className="font-semibold">Closing: </span>{coverLetter?.closing}
            </p>
          </div>


          {/* Status and Dates */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-800">Application Status</h3>
            <div className="mt-4">
              <p className="text-lg">
                <span className="font-semibold">Applied On: </span>{new Date(appliedDate).toLocaleDateString()}
              </p>
              <p className="text-lg">
                <span className="font-semibold">Status: </span>
                {userId.isPremium ? ( <span className={`${
                  status === "pending" ? "bg-yellow-400" : status === "accepted" ? "bg-green-500" : "bg-red-500"
                } text-white px-2 py-1 rounded-lg`}>
                  {status}
                </span>)  : (<>Premium feature </>)         
                }
        
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
