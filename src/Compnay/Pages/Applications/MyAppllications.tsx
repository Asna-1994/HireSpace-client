
import { useEffect, useState, useCallback } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axiosInstance from "../../../Utils/Instance/axiosInstance";
import { FaBriefcase, FaUser, FaCalendarAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import CompanyHeader from "../../Components/Header/Header";
import Footer from "../../../User/Components/Footer/Footer";

const ListApplications = () => {
  const { companyId } = useParams<{ companyId: string }>();
const location = useLocation()
const jobPost = location.state?.jobPost || {}; 

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
    const [page, setPage] = useState<number>(1);
      const [limit, setLimit] = useState<number>(10);
      

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/company/all-applications/${companyId}`, {
        params: {
          page: currentPage,
          status: statusFilter,
          limit :10,
          search: searchTerm,
          jobPostId : jobPost?._id,
        },
      });
      if (response.data.success) {
        setApplications(response.data.applications);
        setTotalPages(response.data.totalPages);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
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

  const handlePagination = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
  };

  return (
    <>
      <CompanyHeader />
      <div className="container mx-auto px-6 py-8 min-h-screen">
        <div className="bg-gradient-to-r from-blue-400 to-purple-500 shadow-lg text-white rounded-lg p-6">
          <h2 className="text-3xl font-semibold">Applications for Your Company</h2>
          <p className="mt-2 text-lg">Manage all the applications for your company's job postings.</p>
        </div>

        {/* Search and Filters */}
        <div className="mt-8 flex justify-between items-center">
          <div className="flex space-x-4">
            <input
              type="text"
              className="p-2 border rounded-lg"
              placeholder="Search by Applicant Name or Job Title"
              value={searchTerm}
              onChange={handleSearch}
            />
            <select
              className="p-2 border rounded-lg"
              value={statusFilter}
              onChange={handleStatusFilter}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Application List */}
        {loading ? (
          <div className="mt-8 text-center">Loading...</div>
        ) : (
          <div className="mt-8 space-y-6">
            {applications.length === 0 ? (
              <div className="mt-8 text-center">No applications found.</div>
            ) : (
              applications.map((application) => (
                <div
                  key={application._id}
                  className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                        <FaUser className="mr-2 text-blue-500" />
                        {application.userId.userName}
                      </h3>
                      <p className=" text-gray-800 flex items-center">
                        {application.userId.email}
                      </p>
                      <p className="text-lg">
                        <span className="font-semibold">Job Title: </span>
                        {application.jobPostId.jobTitle}
                      </p>
                      <p className="text-lg">
                        <span className="font-semibold">Applied On: </span>
                        {new Date(application.appliedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`${
                          application.status === "pending"
                            ? "bg-yellow-400"
                            : application.status === "accepted"
                            ? "bg-green-500"
                            : "bg-red-500"
                        } text-white px-4 py-2 rounded-lg`}
                      >
                        {application.status}
                      </span>
                    </div>
                  </div>
                     <div>
               
                        <Link
                      to={`/company/applications/${application._id}`}
                      state={{ application }}
                      className="text-blue-600 hover:underline"
                    >
                      View Details
                    </Link>
                   </div>


                </div>
              ))
            )}
          </div>
        )}

   
      </div>
      <div className="flex justify-between mt-6 p-5">
  <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
  >
    Previous
  </button>
  <span>Page {currentPage} of {totalPages}</span>
  <button
    onClick={() => setCurrentPage((prev) => prev + 1)}
    disabled={currentPage === totalPages}
    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
  >
    Next
  </button>
</div>
      <Footer />
    </>
  );
};

export default ListApplications;

