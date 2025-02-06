// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import { RootState } from "../../../redux/store";
// import CompanyHeader from "../../Components/Header/Header";
// import NotAuthenticated from "../../../Shared/Pages/NotAuthenticated";
// import Footer from "../../../User/Components/Footer/Footer";
// import axiosInstance from "../../../Utils/Instance/axiosInstance";
// import JobDetailsModal from "./JobDetailsModel";
// import { HiOutlineEye } from "react-icons/hi";
// import { FaBriefcase, FaClock, FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa";

// export interface SalaryRange {
//   min: string;
//   max: string;
//   currency: string;
// }

// export interface Location {
//   city: string;
//   state: string;
//   country: string;
//   remote: boolean;
// }

// export interface PostedBy{
//     userName : string;
//     email : string;
//     _id : string;
// }

// export interface JobPost {
//     companyId? : {
//         _id : string;
//         companyName : string,
//         email  :string;
//         phone : string;
//         industry : string;
//         address : string;
//         companyLogo?:{
// url : string;
// publicId  :string;
//         }
//     }
//   _id?: string;
//   jobTitle: string;
//   description: string;
//   skillsRequired : string[];
//   responsibilities: string[];
//   educationRequired: string;
//   salaryRange: SalaryRange;
//   location: Location;
//   jobType: string;
//   workMode : string;
//   employmentStartDate: Date;
//   experienceLevel: string;
//   postedBy: PostedBy;
//   applicationDeadline: Date;
//   numberOfVacancies: number;
//   benefits: string[];
//   status: string;
// }

// const CompanyJobPosts = () => {
//   const { company, isAuthenticated } = useSelector((state: RootState) => state.auth);
//   const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
//   const [selectedJobPost, setSelectedJobPost] = useState<JobPost | null>(null); 
//   const [isModalOpen, setIsModalOpen] = useState(false); 

//   useEffect(() => {
//     const fetchJobPosts = async () => {
//       try {
//         const response = await axiosInstance.get(`/company/all-job-posts/${company?._id}`);
//         let jobPosts = response.data.allJobPost;
//         jobPosts = jobPosts.map((post  :any) => post._doc);
//         setJobPosts(jobPosts);
   
//       } catch (error) {
//         console.error("Error fetching job posts", error);
//       }
//     };
//       fetchJobPosts();
//   }, []);

//   if (!isAuthenticated) {
//     return <NotAuthenticated />;
//   }

//   const openModal = (jobPost: JobPost) => {
//     setSelectedJobPost(jobPost);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedJobPost(null);
//   };

//   return (
//     <div>
//     <CompanyHeader />
//     <main className="bg-gray-50 min-h-screen">
//       <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-6 text-center">
//         <div className="max-w-4xl mx-auto">
//           <h1 className="text-4xl font-bold mb-4">Your Job Posts</h1>
//           <p className="text-lg mb-6">Manage all your job posts in one place.</p>
//           <Link
//             to={`/company/${company?._id}/create-job-posts`}
//             className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium shadow-lg hover:bg-gray-200 transition"
//           >
//             Create Job Post
//           </Link>
//         </div>
//       </section>

//       <section className="py-12 px-6">
//         <div className="max-w-6xl mx-auto">
//           {jobPosts.length === 0 ? (
//             <p className="text-center text-gray-600">No job posts available.</p>
//           ) : (
//             <div className="grid grid-cols-1 gap-8">
//               {jobPosts.map((job) => (
//                 <div key={job._id} className="bg-white shadow-md p-8 rounded-lg">
//                   <div className="flex justify-between items-center mb-4">
//                     <h3 className="text-2xl font-bold">{job.jobTitle}</h3>
//                     <Link
//                       to={`/company/${company?._id}/all-applications`}
//                       state={{ jobPost: job }}
//                       className="text-blue-600 hover:underline flex items-center gap-1"
//                     >
//                       <HiOutlineEye /> View Applications
//                     </Link>
//                   </div>

//                   <div className="text-gray-600 mb-4 space-y-2">
//                     <div className="flex gap-4">
//                     <p className="flex items-center gap-2">
//                       <FaMapMarkerAlt className="text-blue-600" />
//                       <strong>Location:</strong> {job.location.city}, {job.location.state}, {job.location.country}
//                     </p>
//                     <p className="flex items-center gap-2">
//                       <FaMoneyBillWave className="text-green-600" />
//                       <strong>Salary:</strong> {job.salaryRange.currency}
//                       {job.salaryRange.min} - {job.salaryRange.max}
//                     </p>
//                       </div>
//                       <div className="flex gap-4">
//                       <p className="flex items-center gap-2">
//                       <FaBriefcase className="text-gray-600" />
//                       <strong>Job Type:</strong> {job.jobType}
//                     </p>
//                     <p className="flex items-center gap-2">
//                       <FaClock className="text-orange-600" />
//                       <strong>Experience Level:</strong> {job.experienceLevel}
//                     </p>
//                          </div>
//                          <div className="flex justify-between">

 
//                          <p>
//                       <strong>Application Deadline:</strong>{" "}
//                       {new Date(job.applicationDeadline).toLocaleDateString()}
//                     </p>
//                          <div className="flex justify-end">
//                     <button
//                       onClick={() => openModal(job)}
//                       className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
//                     >
//                       <HiOutlineEye /> View Details
//                     </button>
//                   </div>
//                           </div>
                   
//                   </div>

               

//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </section>
//     </main>

//     <Footer />
//     <JobDetailsModal jobPost={selectedJobPost} isOpen={isModalOpen} onClose={closeModal} />
//   </div>
//   );
// };

// export default CompanyJobPosts;


import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../../redux/store";
import CompanyHeader from "../../Components/Header/Header";
import NotAuthenticated from "../../../Shared/Pages/NotAuthenticated";
import Footer from "../../../User/Components/Footer/Footer";
import axiosInstance from "../../../Utils/Instance/axiosInstance";
import JobDetailsModal from "./JobDetailsModel";
import { HiOutlineEye } from "react-icons/hi";
import { FaBriefcase, FaClock, FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa";

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

const CompanyJobPosts = () => {
  const { company, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [selectedJobPost, setSelectedJobPost] = useState<JobPost | null>(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 

  useEffect(() => {
    const fetchJobPosts = async () => {
      try {
        const response = await axiosInstance.get(`/company/all-job-posts/${company?._id}`);
        let jobPosts = response.data.allJobPost;
        jobPosts = jobPosts.map((post  :any) => post._doc);
        setJobPosts(jobPosts);
   
      } catch (error) {
        console.error("Error fetching job posts", error);
      }
    };
      fetchJobPosts();
  }, []);

  if (!isAuthenticated) {
    return <NotAuthenticated />;
  }

  const openModal = (jobPost: JobPost) => {
    setSelectedJobPost(jobPost);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJobPost(null);
  };

  return (
    <div>
      <CompanyHeader />
      <main className="bg-gray-50 min-h-screen">
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Your Job Posts</h1>
            <p className="text-lg mb-6">Manage all your job posts in one place.</p>
            <Link
              to={`/company/${company?._id}/create-job-posts`}
              className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium shadow-lg hover:bg-gray-200 transition"
            >
              Create Job Post
            </Link>
          </div>
        </section>

        <section className="py-12 px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            {jobPosts.length === 0 ? (
              <p className="text-center text-gray-600">No job posts available.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobPosts.map((job) => (
                  <div key={job?._id} className="bg-white shadow-md p-6 rounded-lg flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold">{job.jobTitle}</h3>
                      <Link
                        to={`/company/${company?._id}/all-applications`}
                        state={{ jobPost: job }}
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <HiOutlineEye /> View Applications
                      </Link>
                    </div>

                    <div className="text-gray-600 mb-4 space-y-2">
                      <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-blue-600" /><strong>Location:</strong> {job.location.city}, {job.location.state}, {job.location.country}</p>
                      <p className="flex items-center gap-2"><FaMoneyBillWave className="text-green-600" /><strong>Salary:</strong> {job.salaryRange.currency}{job.salaryRange.min} - {job.salaryRange.max}</p>
                      <p className="flex items-center gap-2"><FaBriefcase className="text-gray-600" /><strong>Job Type:</strong> {job.jobType}</p>
                      <p className="flex items-center gap-2"><FaClock className="text-orange-600" /><strong>Experience Level:</strong> {job.experienceLevel}</p>
                      <p><strong>Application Deadline:</strong> {new Date(job.applicationDeadline).toLocaleDateString()}</p>
                    </div>

                    <div className="mt-auto flex justify-end">
                      <button
                        onClick={() => { setSelectedJobPost(job); setIsModalOpen(true); }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                      >
                        <HiOutlineEye /> View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <JobDetailsModal jobPost={selectedJobPost} isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedJobPost(null); }} />
    </div>
  );
};

export default CompanyJobPosts;
