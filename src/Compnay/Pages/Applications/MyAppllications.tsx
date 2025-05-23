
import { useEffect, useState, useCallback } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import CompanyHeader from '../../Components/Header/Header';
import Footer from '../../../User/Components/Footer/Footer';
import { getCompanyApplications } from '../../../services/company/applicationService';
import { Application } from '../../../Utils/Interfaces/applicationInterface';




const ListApplications = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const location = useLocation();
  const jobPost = location.state?.jobPost || {};

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCompanyApplications(companyId!, currentPage, statusFilter, searchTerm,jobPost._id)
      if (data.success) {
        setApplications(data.applications);
        console.log(data.applications)
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  }, [companyId, currentPage, statusFilter, searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchApplications();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchApplications]);

  return (
    <>
      <CompanyHeader />
      <div className="container min-h-screen px-4 py-8 mx-auto">
        <div className="p-6 text-center text-white rounded-lg shadow-lg bg-gradient-to-r from-blue-400 to-purple-500">
          <h2 className="text-2xl font-semibold sm:text-3xl">Applications</h2>
          <p className="mt-2 text-base sm:text-lg">
            Manage job applications efficiently.
          </p>
        </div>

        <div className="flex flex-col justify-between gap-4 mt-6 sm:flex-row">
          <input
            type="text"
            className="w-full p-2 border rounded-lg sm:w-1/3"
            placeholder="Search by Name or Job Title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="w-full p-2 border rounded-lg sm:w-1/4"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {loading ? (
                  <div className="flex items-center justify-center py-8">
                <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
              </div>
        ) : applications.length === 0 ? (
          <div className="mt-8 text-center">No applications found.</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
            {applications.map((application) => (
              <div
                key={application._id}
                className="p-6 bg-white border-l-4 border-blue-500 rounded-lg shadow-lg"
              >
                <h3 className="flex items-center text-xl font-semibold text-gray-800">
                  <FaUser className="mr-2 text-blue-500" />{' '}
                  {application.userId.userName}
                </h3>
                <p className="text-gray-800">{application.userId.email}</p>
                <p className="text-lg">
                  <strong>Job:</strong> {application.jobPostId.jobTitle}
                </p>
                <p className="text-lg">
                  <strong>Applied On:</strong>{' '}
                  {new Date(application.appliedDate).toLocaleDateString()}
                </p>
                <span
                  className={`mt-3 inline-block px-4 py-2 text-white rounded-lg ${
                    application.status === 'pending'
                      ? 'bg-yellow-400'
                      : application.status === 'accepted'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                  }`}
                >
                  {application.status}
                </span>
                <Link
                  to={`/company/applications/${application._id}`}
                  state={{ application }}
                  className="block mt-3 text-blue-600 hover:underline"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between p-5 mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Previous
        </button>
        <span>
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

      <Footer />
    </>
  );
};

export default ListApplications;
