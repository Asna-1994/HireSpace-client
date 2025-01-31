import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Link } from "react-router-dom";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import { FaClipboardList, FaCalendarAlt, FaBriefcase, FaTimes } from "react-icons/fa";
import axiosInstance from "../../../Utils/Instance/axiosInstance";

const MyApplications = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm , setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);


  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/user/all-job-applications/${user?._id}`,{
          params: {
            page: currentPage,
            limit: 10, 
            searchTerm,
          },
        });
        setApplications(response.data.allApplications);
        setTotalPages(response.data.totalPages);
        console.log(response.data.allApplications)
        setLoading(false);
      } catch (error) {
        console.error("Error fetching applications:", error);
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchApplications();
    }
  }, [isAuthenticated, user?._id, currentPage, searchTerm]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-6 py-8 min-h-screen">
        <div className="bg-gradient-to-r from-green-400 to-blue-500 shadow-lg text-white rounded-lg p-6">
          <h2 className="text-3xl font-semibold">Your Job Applications</h2>
          <p className="mt-2 text-lg">View and manage your applications to various jobs.</p>
        </div>

        <div className="mt-8">

          <div className="flex justify-between">
          <h3 className="text-2xl font-semibold text-gray-800">Applications</h3>
          
          <input
            type="text"
            placeholder="Search Application.."
            className="p-2 border border-gray-300 rounded-lg w-full sm:w-1/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
      
          </div>
        
          {applications.length === 0 ? (
            <div className="mt-4 p-4 bg-yellow-100 text-yellow-800 rounded-lg">
              You haven't applied to any jobs yet. Explore new opportunities!
            </div>
          ) : (

            <>

           
   
            
            <div className="space-y-4 mt-6">
              {applications.map((application) => (
                <div
                  key={application._id}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-lg flex items-center justify-between"
                >
                  <div className="flex items-center">

                    {/* {application.jobPostId?.companyId.companyLogo.url ? 
                (<img src={application.jobPostId?.companyId.companyLogo.url} className="w-11"></img>)     : ( <FaBriefcase className="text-2xl text-blue-500 mr-4" />)
                } */}
                     {application.jobPostId?.companyId.companyLogo.url ? (
                      <img
                        src={application.jobPostId?.companyId.companyLogo.url}
                        alt="Company Logo"
                        className="h-11 w-11 object-cover rounded-full"
                      />
                    ) : (
                      <div className="h-11 w-11 flex items-center justify-center bg-gray-200 rounded-full">
                        <FaBriefcase className="text-2xl text-gray-500" />
                      </div>
                    )}
                   
                    <div>
                      <h4 className="text-xl font-medium text-gray-700">{application.jobPostId?.jobTitle}</h4>
                      <h5 className="text-lg font-medium text-gray-700">{application.jobPostId?.companyId.companyName}</h5>
                      <p className="text-gray-600">
                        Applied on <span className="font-semibold">{new Date(application.appliedDate).toLocaleDateString()}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
              {user?.isPremium &&    <span
                      className={`${
                        application.status === "pending" ? "bg-yellow-400" : application.status === "accepted" ? "bg-green-500" : "bg-red-500"
                      } text-white px-4 py-2 rounded-lg text-sm`}
                    >
                      {application.status}
                    </span>}     
                    <Link
                      to={`/user/applications/${application._id}`}
                      state={{ application }}
                      className="text-blue-600 hover:underline"
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
            </>
           
          )}
        </div>

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

export default MyApplications;
