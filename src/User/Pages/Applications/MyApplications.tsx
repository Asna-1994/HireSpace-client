import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { Link } from 'react-router-dom';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import { FaBriefcase, FaTimes } from 'react-icons/fa';
import { getAllApplication } from '../../../services/user/jobServices';
import { Application } from '../../../Utils/Interfaces/applicationInterface';

const MyApplications = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const data = await getAllApplication(user?._id! , currentPage, searchTerm )
        setApplications(data.allApplications);
        setTotalPages(data.totalPages);
        console.log(data.allApplications);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchApplications();
    }
  }, [isAuthenticated, user?._id, currentPage, searchTerm]);

  if (loading) {
    return (
      // <div className="flex items-center justify-center h-screen">
      //   <div
      //     className="inline-block w-12 h-12 border-4 rounded-full spinner-border animate-spin"
      //     role="status"
      //   >
      //     <span className="sr-only">Loading...</span>
      //   </div>
      // </div>
            <div className="flex items-center justify-center py-8">
                <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
              </div>
    );
  }

  return (
    <>
      <Header />
      <div className="container min-h-screen px-4 py-8 mx-auto sm:px-6 lg:px-8">
        <div className="p-6 text-white rounded-lg shadow-lg bg-gradient-to-r from-green-400 to-blue-500 sm:p-8">
          <h2 className="text-3xl font-semibold">Your Job Applications</h2>
          <p className="mt-2 text-lg">
            View and manage your applications to various jobs.
          </p>
        </div>

        <div className="mt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-2xl font-semibold text-gray-800">
              Applications
            </h3>
            <input
              type="text"
              placeholder="Search Application.."
              className="w-full p-2 border border-gray-300 rounded-lg sm:w-1/3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {applications.length === 0 ? (
            <div className="p-4 mt-4 text-yellow-800 bg-yellow-100 rounded-lg">
              You haven't applied to any jobs yet. Explore new opportunities!
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {applications.map((application) => (
                <div
                  key={application._id}
                  className="flex flex-col p-6 bg-white rounded-lg shadow hover:shadow-lg sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    {application.jobPostId?.companyId.companyLogo.url ? (
                      <img
                        src={application.jobPostId?.companyId.companyLogo.url}
                        alt="Company Logo"
                        className="object-cover rounded-full h-11 w-11"
                      />
                    ) : (
                      <div className="flex items-center justify-center bg-gray-200 rounded-full h-11 w-11">
                        <FaBriefcase className="text-2xl text-gray-500" />
                      </div>
                    )}
                    <div className="leading-tight">
                      <h4 className="text-xl font-medium text-gray-700">
                        {application.jobPostId?.jobTitle}
                      </h4>
                      <h5 className="text-lg font-medium text-gray-700">
                        {application.jobPostId?.companyId.companyName}
                      </h5>
                      <p className="text-sm text-gray-600">
                        Applied on{' '}
                        <span className="font-semibold">
                          {new Date(
                            application.appliedDate
                          ).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center mt-4 space-x-4 sm:mt-0">
                    {user?.isPremium && (
                      <span
                        className={`${
                          application.status === 'pending'
                            ? 'bg-yellow-400'
                            : application.status === 'accepted'
                              ? 'bg-green-500'
                              : 'bg-red-500'
                        } text-white px-4 py-2 rounded-lg text-sm`}
                      >
                        {application.status}
                      </span>
                    )}
                    <Link
                      to={`/user/applications/${application._id}`}
                      state={{ application }}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View Details
                    </Link>
                    <button className="text-red-500 hover:text-red-700">
                      <FaTimes className="text-lg" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col items-center justify-between p-5 mt-6 sm:flex-row">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 mb-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 sm:mb-0"
          >
            Previous
          </button>
          <span className="mb-2 sm:mb-0">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyApplications;
