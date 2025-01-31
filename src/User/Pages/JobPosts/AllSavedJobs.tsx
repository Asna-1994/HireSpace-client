import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../../redux/store";
import NotAuthenticated from "../../../Shared/Pages/NotAuthenticated";
import Footer from "../../../User/Components/Footer/Footer";
import axiosInstance from "../../../Utils/Instance/axiosInstance";
import { HiOutlineEye } from "react-icons/hi";
import { FaBriefcase, FaClock, FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa";
import {motion} from 'framer-motion'
import Header from "../../Components/Header/Header";

export interface SalaryRange {
  min: string;
  max: string;
  currency: string;
}

export interface Location {
  city: string;
  state: string;
  country: string;
  remote: boolean;
}

export interface PostedBy{
    userName : string;
    email : string;
    _id : string;
}

export interface JobPost {
    companyId? : {
        _id : string;
        companyName : string,
        email  :string;
        phone : string;
        industry : string;
        address : string;
        companyLogo?:{
url : string;
publicId  :string;
        }
    }
  _id?: string;
  jobTitle: string;
  description: string;
  skillsRequired : string[];
  responsibilities: string[];
  educationRequired: string;
  salaryRange: SalaryRange;
  location: Location;
  jobType: string;
  workMode : string;
  employmentStartDate: Date;
  experienceLevel: string;
  postedBy: PostedBy;
  applicationDeadline: Date;
  numberOfVacancies: number;
  benefits: string[];
  status: string;
}

const SavedJobPosts = () => {
  const { company,user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [page, setPage] = useState<number>(1);
      const [limit, setLimit] = useState<number>(10);
         const [hasMore, setHasMore] = useState(true);


  useEffect(() => {
    const fetchJobPosts = async () => {
      try {
        const response = await axiosInstance.get(`/user/all-saved-job-posts/${user?._id}`,{params:{page, limit}});
        console.log(response.data)
        let jobPosts = response.data.allSavedJobs;
        jobPosts = jobPosts.map((post  :any) => post._doc);
        setJobPosts(jobPosts);
        if (jobPosts.length < limit) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } catch (error) {
        console.error("Error fetching job posts", error);
      }
    };
      fetchJobPosts();
  }, []);

  if (!isAuthenticated) {
    return <NotAuthenticated />;
  }



  return (
    <div>
    <Header/>
    <main className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 p-6">
    <motion.div
          className="bg-gradient-to-r from-purple-400 to-blue-500 shadow-lg text-white rounded-lg p-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-semibold">Saved Jobs</h2>
        </motion.div>

      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {jobPosts.length === 0 ? (
            <p className="text-center text-gray-600">No job posts available.</p>
          ) : (
         <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
  {jobPosts.map((job) => (
    <div key={job._id} className="bg-white shadow-md p-6 rounded-lg hover:shadow-lg transition-shadow duration-200">
      {/* Company Logo and Name */}
      <div className="flex items-center gap-4 mb-4">
        {job.companyId?.companyLogo?.url ? (
          <img
            className="w-12 h-12 rounded-full object-cover"
            src={job.companyId?.companyLogo?.url}
            alt={`${job.companyId?.companyName} Logo`}
          />
        ) : <><FaBriefcase/></>}
        <div>
          <h3 className="text-lg font-semibold">{job.companyId?.companyName}</h3>
          <h4 className="text-gray-500 text-sm">{job.jobTitle}</h4>
        </div>
      </div>

      {/* Job Details */}
      <div className="text-gray-700 space-y-3">
        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-blue-500" />
          <span>
            <strong>Location:</strong> {job.location.city}, {job.location.state}, {job.location.country}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FaMoneyBillWave className="text-green-500" />
          <span>
            <strong>Salary:</strong> {job.salaryRange.currency}
            {job.salaryRange.min} - {job.salaryRange.max}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FaBriefcase className="text-gray-500" />
          <span>
            <strong>Job Type:</strong> {job.jobType}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FaClock className="text-orange-500" />
          <span>
            <strong>Experience Level:</strong> {job.experienceLevel}
          </span>
        </div>
        <div>
          <strong>Application Deadline:</strong>{" "}
          {new Date(job.applicationDeadline).toLocaleDateString()}
        </div>
      </div>

      {/* View Details Button */}
      <div className="mt-4 text-right">
        <Link
          to={`/user/job-posts/${job._id}`}
          state={{ jobPost: job }}
          className="text-blue-600 hover:underline font-medium"
        >
          View Details
        </Link>
      </div>
    </div>
  ))}
</div>

          )}
        </div>
      </section>
    </main>

    <div className="mt-4 flex justify-between items-center p-2">
  <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
  >
    Previous
  </button>
  <span>Page {currentPage}</span>
  <button
    onClick={() => setCurrentPage((prev) => prev + 1)}
    disabled={!hasMore}  // Disable "Next" button if there are no more pages
    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
  >
    Next
  </button>
</div>

    <Footer />


  </div>
  );
};

export default SavedJobPosts;
