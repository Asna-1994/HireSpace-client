import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { FaBriefcase,FaMapMarkerAlt, FaMoneyBillAlt, FaClock } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../Utils/Instance/axiosInstance';
import { toast } from 'react-toastify';
import { userUpdate } from '../../../redux/slices/authSlice';
import TaglineSection from './Tagline';
import { JobPost } from '../JobPosts/AllSavedJobs';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const UserHome = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [tagline, setTagline] = useState(user?.tagLine || '');
  const [recommendedJobs, setRecommendedJobs] = useState<JobPost[]>([]);
  
  const dispatch = useDispatch();

  const totalJobPosts = 120; 
  const totalApplications = 45;
  const totalConnections = user?.connections.length

  const handleTaglineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagline(e.target.value);
  };

  const saveTagline = async () => {
    try {
      const response = await axiosInstance.patch(`/user/profile-tag-line/${user?._id}`, { tagline });
      if (response.data.success) {
        toast.success("Tagline updated");
        dispatch(userUpdate(response.data.user));
      } else {
        toast.error(response.data.message);
      }
    } catch (err: any) {
      toast.error(err.response.data.message);
    }
  };





  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      try {
        const response = await axiosInstance.get(`/user/all-job-posts?tagLine=${tagline}`);
        if (response.data.success) {
          const jobPosts = response.data.allJobPost.map((post : any) => post._doc)
      
          setRecommendedJobs(jobPosts);
        
        }
      } catch (err) {
        console.error('Error fetching recommended jobs:', err);
      }
    };

    if (tagline) {
      fetchRecommendedJobs();
    }
  }, [tagline]);

  return (
    <div>
      <Header />
      <div className="container mx-auto px-6 py-8">
  

<TaglineSection
  user={user}
  tagline={tagline}
  setTagline={setTagline}
  saveTagline={saveTagline}
/>


        {/* Metrics Section */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold text-gray-700">Total Job Posts</h3>
            <p className="mt-2 text-3xl text-blue-500 font-bold">{totalJobPosts}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold text-gray-700">Total Applications</h3>
            <p className="mt-2 text-3xl text-blue-500 font-bold">{totalApplications}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold text-gray-700">Connections</h3>
            <p className="mt-2 text-3xl text-blue-500 font-bold">{totalConnections}</p>
          </div>
        </div>

        
   
  {/* Recommendations Section */}
 {/* Recommendations Section */}
<div className="mt-10">
  <h3 className="text-2xl font-semibold text-gray-800 mb-6">
    Recommended for You
  </h3>

  {recommendedJobs.length > 0 && (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      pagination={{ clickable: true }}
      spaceBetween={30}
      loop={true}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      slidesPerView={1}
      breakpoints={{
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
      className="pb-8"
    >
      {recommendedJobs.map((jobPost) => (
        <SwiperSlide key={jobPost._id}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
          >
            {/* Company Info */}
            <div className="flex gap-4 items-center">
              <div className="border-2 rounded-full p-2 flex-shrink-0 bg-gray-100">
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
                <p className="text-gray-800 text-xl font-semibold">
                  {jobPost.jobTitle || "Unknown Job"}
                </p>
                <div className="flex items-center gap-3 text-gray-600">
                  <p className="text-lg font-medium">
                    {jobPost.companyId?.companyName || "Unknown Company"}
                  </p>
                  {jobPost.location?.city && (
                    <p className="text-sm text-gray-500">
                      <FaMapMarkerAlt className="inline-block mr-1" />
                      {jobPost.location.city}, {jobPost.location?.country || ""}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div className="mt-4 text-gray-600 space-y-2">
              {jobPost.salaryRange?.min ? (
                <p className="flex items-center gap-2">
                  <FaMoneyBillAlt className="text-green-600" />
                  <strong>Salary:</strong> {jobPost.salaryRange.currency}
                  {jobPost.salaryRange.min} - {jobPost.salaryRange.max}
                </p>
              ) : (
                <p className="text-sm text-gray-400">Salary not disclosed</p>
              )}

              <p className="flex items-center gap-2">
                <FaBriefcase className="text-gray-600" />
                <strong>Job Type:</strong> {jobPost.jobType || "N/A"}
              </p>

              <p className="flex items-center gap-2">
                <FaClock className="text-orange-600" />
                <strong>Experience Level:</strong> {jobPost.experienceLevel || "N/A"}
              </p>
            </div>

            {/* CTA Button */}
            <div className="mt-4 flex justify-between items-center">
              <Link
                to={`/user/job-posts/${jobPost._id}`}
                state={{ jobPost }}
                className="text-blue-600 hover:underline font-medium"
              >
                View Details
              </Link>
            </div>
          </motion.div>
        </SwiperSlide>
      ))}
    </Swiper>
  ) }
</div>

      </div>
      <Footer />
    </div>
  );
};

export default UserHome;
