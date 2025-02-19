import  { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { motion } from 'framer-motion';
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaMoneyBillAlt,
  FaClock,
} from 'react-icons/fa';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import axiosInstance from '../../../Utils/Instance/axiosInstance';
import { JobPost } from '../../../Compnay/Pages/JobPosts/AllJobPosts';
import { userUpdate } from '../../../redux/slices/authSlice';
import { fetchJobPostFromDB, saveJobToDB } from '../../../services/user/jobServices';

const ViewAllPosts = () => {
  const { user } = useSelector(
    (state: RootState) => state.auth
  );
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [savedJobs, setSavedJobs] = useState<JobPost[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [limit, setLimit] = useState<number>(10);
  const [hasMore, setHasMore] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchJobPosts = async () => {
      try {
        const data  = await fetchJobPostFromDB(currentPage, limit, searchTerm)
        const jobPosts = data.allJobPost.map((post: any) => post._doc);
        console.log(jobPosts)
        setJobPosts(jobPosts);
        if (jobPosts.length < limit) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchJobPosts();
  }, [currentPage, searchTerm]);

  const filteredJobPosts = jobPosts.filter((jobPost) =>
    jobPost.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveJob = async (jobPost: JobPost) => {
    try {
       const data = await saveJobToDB(user?._id!, jobPost._id!)
      if (data.success) {
        const user = data.user;
        dispatch(userUpdate(user));

        console.log(data.message);
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.log(err);
    }

    setSavedJobs((prevSavedJobs) => [...prevSavedJobs, jobPost]);
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-purple-400 to-blue-500 shadow-lg text-white rounded-lg p-6">
          <h2 className="text-3xl font-semibold">Job Posts by Companies</h2>
          <p className="mt-2 text-lg">View and Apply for Jobs</p>
        </div>

        <div className="mt-6 flex justify-end">
          <input
            type="text"
            placeholder="Search for jobs..."
            className="p-2 border border-gray-300 rounded-lg w-full sm:w-1/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-gray-800">
            Job Opportunities
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {filteredJobPosts.map((jobPost) => (
              <motion.div
                key={jobPost._id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex gap-4 items-center">
                  <div className="text-blue-500 border-2 rounded-full p-2 flex-shrink-0">
                    {jobPost?.companyId?.companyLogo?.url ? (
                      <img
                        src={jobPost.companyId.companyLogo.url}
                        alt="Company Logo"
                        className="h-11 w-11 object-cover rounded-full"
                      />
                    ) : (
                      <FaBriefcase className="text-2xl text-gray-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-gray-600 text-xl font-medium">
                      {jobPost.jobTitle}
                    </p>
                    <div className="flex items-center gap-3">
                      <p className="text-gray-600 text-lg font-medium">
                        {jobPost.companyId?.companyName}
                      </p>
                      <p className="text-sm text-gray-500">
                        <FaMapMarkerAlt className="inline-block mr-1" />
                        {jobPost.location.city} - {jobPost.location.country}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-gray-600 space-y-2">
                  <p className="flex items-center gap-2">
                    <FaMoneyBillAlt className="text-green-600" />
                    <strong>Salary:</strong> {jobPost.salaryRange.currency}
                    {jobPost.salaryRange.min} - {jobPost.salaryRange.max}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaBriefcase className="text-gray-600" />
                    <strong>Job Type:</strong> {jobPost.jobType}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaClock className="text-orange-600" />
                    <strong>Experience Level:</strong> {jobPost.experienceLevel}
                  </p>
                  <p>
                    <strong>Application Deadline:</strong>{' '}
                    {new Date(jobPost.applicationDeadline).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <Link
                    to={`/user/job-posts/${jobPost._id}`}
                    state={{ jobPost }}
                    className="text-blue-600 hover:underline"
                  >
                    View Details
                  </Link>
                  <button
                    className={`${
                      user?.savedJobs.some((job) => job === jobPost._id)
                        ? 'bg-green-500'
                        : 'bg-yellow-300'
                    } text-white px-2 rounded-lg hover:bg-blue-600 transition-colors duration-300`}
                    onClick={() => handleSaveJob(jobPost)}
                    disabled={user?.savedJobs.some(
                      (job) => job === jobPost._id
                    )}
                  >
                    {user?.savedJobs.some((job) => job === jobPost._id)
                      ? 'Saved'
                      : 'Save'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
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
            disabled={!hasMore} // Disable "Next" button if there are no more pages
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ViewAllPosts;
