import { useLocation } from 'react-router-dom';
import CompanyHeader from '../../Components/Header/Header';
import { HiDocumentText } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { updateStatus } from '../../../services/company/applicationService';

const ApplicationDetails = () => {
  const location = useLocation();
  const { application } = location.state;

  const [status, setStatus] = useState(application.status);

  const handleStatusUpdate = async () => {
    try {
      const data = await updateStatus(application._id, status)
      if (data.success) {
        setStatus(data.application.status);
        toast.success('status updated');
      } else {
        toast.error(data.message);
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <CompanyHeader />
      <div className="container px-6 py-12 mx-auto space-y-8">
        {/* Header Section */}
        <motion.div
          className="p-8 text-white rounded-lg shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2 className="text-3xl font-bold">Application Details</h2>
          <p className="mt-2 text-lg font-light">
            Explore all the details of the applicant's submission in one place.
          </p>
        </motion.div>

        {/* Content Section */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Applicant Information */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="p-8 bg-white border border-gray-100 shadow-lg rounded-2xl">
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                Applicant Information
              </h3>
              <div className="space-y-3 text-gray-700">
                <p>
                  <span className="font-semibold text-gray-800">Name:</span>{' '}
                  {application.userId.userName}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Email:</span>{' '}
                  {application.userId.email}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">
                    Job Title:
                  </span>{' '}
                  {application.jobPostId.jobTitle}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">
                    Applied On:
                  </span>{' '}
                  {new Date(application.appliedDate).toLocaleDateString()}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-800">Status:</span>
                  <div
                    className={`relative inline-block rounded-lg overflow-hidden border ${
                      status === 'pending'
                        ? 'bg-yellow-100 border-yellow-300'
                        : status === 'accepted'
                          ? 'bg-green-100 border-green-300'
                          : status === 'rejected'
                            ? 'bg-red-100 border-red-300'
                            : 'bg-blue-100 border-blue-300'
                    }`}
                  >
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className={`w-full h-full px-4 py-2 rounded-lg text-sm font-semibold ${
                        status === 'pending'
                          ? 'text-yellow-800'
                          : status === 'accepted'
                            ? 'text-green-800'
                            : status === 'rejected'
                              ? 'text-red-800'
                              : 'text-blue-800'
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
                  className="px-6 py-2 mt-4 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600"
                >
                  Update Status
                </button>
              </div>
            </div>

            {/* Resume Section */}
            {application.resumeUrl && (
              <div className="p-8 bg-white border border-gray-100 shadow-lg rounded-2xl">
                <h4 className="mb-4 text-2xl font-bold text-gray-900">
                  Resume
                </h4>
                <div className="flex flex-col mt-4 space-y-4">
                  {application.resumeUrl.endsWith('.pdf') ? (
                    <iframe
                      src={application.resumeUrl}
                      title="Resume PDF"
                      className="w-full border rounded-md h-96"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <HiDocumentText className="text-3xl text-gray-600" />
                      <a
                        href={application.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-lg font-medium text-indigo-600 hover:text-indigo-800"
                      >
                        <span>View Resume</span>
                      </a>
                    </div>
                  )}
                  <a
                    href={application.resumeUrl}
                    download
                    className="px-6 py-2 text-center text-white bg-indigo-500 rounded-lg hover:bg-indigo-600"
                  >
                    Download Resume
                  </a>
                </div>
              </div>
            )}
          </motion.div>

          {/* Cover Letter Section */}
          <motion.div
            className="p-8 bg-white border border-gray-100 shadow-lg rounded-2xl"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="mb-6 text-2xl font-bold text-gray-900">
              Cover Letter
            </h3>
            <div className="space-y-4 leading-relaxed text-gray-700">
              <p className="font-semibold text-gray-800">
                {application.coverLetter.salutation},
              </p>
              <p>{application.coverLetter.body}</p>
              <p className="mt-4 font-semibold text-gray-800">Sincerely,</p>
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
