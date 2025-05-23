// import  { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../../../redux/store';
// import { motion } from 'framer-motion';
// import {
//   FaBriefcase,
//   FaMapMarkerAlt,
//   FaMoneyBillAlt,
//   FaClock,
// } from 'react-icons/fa';
// import Header from '../../Components/Header/Header';
// import Footer from '../../Components/Footer/Footer';
// import { JobPost } from '../../../Compnay/Pages/JobPosts/AllJobPosts';
// import { userUpdate } from '../../../redux/slices/authSlice';
// import { fetchJobPostFromDB, saveJobToDB } from '../../../services/user/jobServices';

// const ViewAllPosts = () => {
//   const { user } = useSelector(
//     (state: RootState) => state.auth
//   );
//   const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
//   const [savedJobs, setSavedJobs] = useState<JobPost[]>([]);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [limit, setLimit] = useState<number>(10);
//   const [hasMore, setHasMore] = useState(true);

//   const dispatch = useDispatch();

//   useEffect(() => {
//     const fetchJobPosts = async () => {
//       try {
//         const data  = await fetchJobPostFromDB(currentPage, limit, searchTerm)
//         const jobPosts = data.allJobPost.map((post: any) => post._doc);
//         console.log(jobPosts)
//         setJobPosts(jobPosts);
//         if (jobPosts.length < limit) {
//           setHasMore(false);
//         } else {
//           setHasMore(true);
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchJobPosts();
//   }, [currentPage, searchTerm]);

//   const filteredJobPosts = jobPosts.filter((jobPost) =>
//     jobPost.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleSaveJob = async (jobPost: JobPost) => {
//     try {
//        const data = await saveJobToDB(user?._id!, jobPost._id!)
//       if (data.success) {
//         const user = data.user;
//         dispatch(userUpdate(user));

//         console.log(data.message);
//       } else {
//         console.log(data.message);
//       }
//     } catch (err) {
//       console.log(err);
//     }

//     setSavedJobs((prevSavedJobs) => [...prevSavedJobs, jobPost]);
//   };

//   return (
//     <div>
//       <Header />
//       <div className="container px-6 py-8 mx-auto">
//         <div className="p-6 text-white rounded-lg shadow-lg bg-gradient-to-r from-purple-400 to-blue-500">
//           <h2 className="text-3xl font-semibold">Job Posts by Companies</h2>
//           <p className="mt-2 text-lg">View and Apply for Jobs</p>
//         </div>

//         <div className="flex justify-end mt-6">
//           <input
//             type="text"
//             placeholder="Search for jobs..."
//             className="w-full p-2 border border-gray-300 rounded-lg sm:w-1/3"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         <div className="mt-8">
//           <h3 className="text-2xl font-semibold text-gray-800">
//             Job Opportunities
//           </h3>
//           <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2 lg:grid-cols-3">
//             {filteredJobPosts.map((jobPost) => (
//               <motion.div
//                 key={jobPost._id}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="p-6 transition-shadow duration-300 bg-white rounded-lg shadow hover:shadow-lg"
//               >
//                 <div className="flex items-center gap-4">
//                   <div className="flex-shrink-0 p-2 text-blue-500 border-2 rounded-full">
//                     {jobPost?.companyId?.companyLogo?.url ? (
//                       <img
//                         src={jobPost.companyId.companyLogo.url}
//                         alt="Company Logo"
//                         className="object-cover rounded-full h-11 w-11"
//                       />
//                     ) : (
//                       <FaBriefcase className="text-2xl text-gray-500" />
//                     )}
//                   </div>
//                   <div>
//                     <p className="text-xl font-medium text-gray-600">
//                       {jobPost.jobTitle}
//                     </p>
//                     <div className="flex items-center gap-3">
//                       <p className="text-lg font-medium text-gray-600">
//                         {jobPost.companyId?.companyName}
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         <FaMapMarkerAlt className="inline-block mr-1" />
//                         {jobPost.location.city} - {jobPost.location.country}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="mt-4 space-y-2 text-gray-600">
//                   <p className="flex items-center gap-2">
//                     <FaMoneyBillAlt className="text-green-600" />
//                     <strong>Salary:</strong> {jobPost.salaryRange.currency}
//                     {jobPost.salaryRange.min} - {jobPost.salaryRange.max}
//                   </p>
//                   <p className="flex items-center gap-2">
//                     <FaBriefcase className="text-gray-600" />
//                     <strong>Job Type:</strong> {jobPost.jobType}
//                   </p>
//                   <p className="flex items-center gap-2">
//                     <FaClock className="text-orange-600" />
//                     <strong>Experience Level:</strong> {jobPost.experienceLevel}
//                   </p>
//                   <p>
//                     <strong>Application Deadline:</strong>{' '}
//                     {new Date(jobPost.applicationDeadline).toLocaleDateString()}
//                   </p>
//                 </div>
//                 <div className="flex items-center justify-between mt-4">
//                   <Link
//                     to={`/user/job-posts/${jobPost._id}`}
//                     state={{ jobPost }}
//                     className="text-blue-600 hover:underline"
//                   >
//                     View Details
//                   </Link>
//                   <button
//                     className={`${
//                       user?.savedJobs.some((job) => job === jobPost._id)
//                         ? 'bg-green-500'
//                         : 'bg-yellow-300'
//                     } text-white px-2 rounded-lg hover:bg-blue-600 transition-colors duration-300`}
//                     onClick={() => handleSaveJob(jobPost)}
//                     disabled={user?.savedJobs.some(
//                       (job) => job === jobPost._id
//                     )}
//                   >
//                     {user?.savedJobs.some((job) => job === jobPost._id)
//                       ? 'Saved'
//                       : 'Save'}
//                   </button>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//         <div className="flex items-center justify-between p-2 mt-4">
//           <button
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//             className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
//           >
//             Previous
//           </button>
//           <span>Page {currentPage}</span>
//           <button
//             onClick={() => setCurrentPage((prev) => prev + 1)}
//             disabled={!hasMore} // Disable "Next" button if there are no more pages
//             className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default ViewAllPosts;
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
  FaFilter,
  FaTimes,
} from 'react-icons/fa';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
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
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
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

  // Get unique companies from job posts
  const uniqueCompanies = Array.from(
    new Set(
      jobPosts
        .filter(job => job.companyId?.companyName)
        .map(job => job.companyId?.companyName)
    )
  ).sort();

  // Filter job posts based on search term and selected companies
  const filteredJobPosts = jobPosts.filter((jobPost) => {
    const matchesSearch = jobPost.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany = selectedCompanies.length === 0 || 
      selectedCompanies.includes(jobPost.companyId?.companyName || '');
    
    return matchesSearch && matchesCompany;
  });

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

  const handleCompanyFilter = (companyName: string) => {
    setSelectedCompanies(prev => {
      if (prev.includes(companyName)) {
        return prev.filter(company => company !== companyName);
      } else {
        return [...prev, companyName];
      }
    });
  };

  const clearAllFilters = () => {
    setSelectedCompanies([]);
    setSearchTerm('');
  };

  return (
    <div>
      <Header />
      <div className="container px-6 py-8 mx-auto">
        <div className="p-6 text-white rounded-lg shadow-lg bg-gradient-to-r from-purple-400 to-blue-500">
          <h2 className="text-3xl font-semibold">Job Posts by Companies</h2>
          <p className="mt-2 text-lg">View and Apply for Jobs</p>
        </div>

        {/* Search and Filter Section */}
        <div className="mt-6 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <input
              type="text"
              placeholder="Search for jobs..."
              className="flex-1 p-2 border border-gray-300 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <FaFilter />
              Filter by Company
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 border rounded-lg bg-gray-50"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-800">Filter by Companies</h4>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {uniqueCompanies.map((company) => (
                  <label
                    key={company}
                    className="flex items-center p-2 bg-white border rounded cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      className="mr-2 text-blue-600"
                      checked={selectedCompanies.includes(company!)}
                      onChange={() => handleCompanyFilter(company!)}
                    />
                    <span className="text-sm text-gray-700 truncate" title={company}>
                      {company}
                    </span>
                  </label>
                ))}
              </div>
              
              {selectedCompanies.length > 0 && (
                <div className="pt-3 mt-3 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {selectedCompanies.length} company(ies) selected
                    </span>
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Clear all filters
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Active Filters Display */}
          {selectedCompanies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedCompanies.map((company) => (
                <span
                  key={company}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-blue-800 bg-blue-100 rounded-full"
                >
                  {company}
                  <button
                    onClick={() => handleCompanyFilter(company)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <FaTimes size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-gray-800">
              Job Opportunities
            </h3>
            <span className="text-sm text-gray-600">
              {filteredJobPosts.length} job(s) found
            </span>
          </div>
          
          {filteredJobPosts.length === 0 ? (
            <div className="py-12 text-center">
              <FaBriefcase className="mx-auto mb-4 text-6xl text-gray-300" />
              <h4 className="mb-2 text-xl font-medium text-gray-500">No jobs found</h4>
              <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredJobPosts.map((jobPost) => (
                <motion.div
                  key={jobPost._id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-6 transition-shadow duration-300 bg-white rounded-lg shadow hover:shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 p-2 text-blue-500 border-2 rounded-full">
                      {jobPost?.companyId?.companyLogo?.url ? (
                        <img
                          src={jobPost.companyId.companyLogo.url}
                          alt="Company Logo"
                          className="object-cover rounded-full h-11 w-11"
                        />
                      ) : (
                        <FaBriefcase className="text-2xl text-gray-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-xl font-medium text-gray-600">
                        {jobPost.jobTitle}
                      </p>
                      <div className="flex items-center gap-3">
                        <p className="text-lg font-medium text-gray-600">
                          {jobPost.companyId?.companyName}
                        </p>
                        <p className="text-sm text-gray-500">
                          <FaMapMarkerAlt className="inline-block mr-1" />
                          {jobPost.location.city} - {jobPost.location.country}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 text-gray-600">
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
                  <div className="flex items-center justify-between mt-4">
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
          )}
        </div>
        
        <div className="flex items-center justify-between p-2 mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Previous
          </button>
          <span>Page {currentPage}</span>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={!hasMore} // Disable "Next" button if there are no more pages
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
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