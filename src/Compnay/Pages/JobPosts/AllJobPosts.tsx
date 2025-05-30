import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../../redux/store';
import CompanyHeader from '../../Components/Header/Header';
import NotAuthenticated from '../../../Shared/Pages/NotAuthenticated';
import Footer from '../../../User/Components/Footer/Footer';
import axiosInstance from '../../../Utils/Instance/axiosInstance';
import JobDetailsModal from './JobDetailsModel';
import { HiOutlineEye } from 'react-icons/hi';
import {
  FaBriefcase,
  FaClock,
  FaMapMarkerAlt,
  FaMoneyBillWave,
} from 'react-icons/fa';

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

export interface PostedBy {
  userName: string;
  email: string;
  _id: string;
}

export interface JobPost {
  companyId?: {
    _id: string;
    companyName: string;
    email: string;
    phone: string;
    industry: string;
    address: string;
    companyLogo?: {
      url: string;
      publicId: string;
    };
  };
  _id?: string;
  jobTitle: string;
  description: string;
  skillsRequired: string[];
  responsibilities: string[];
  educationRequired: string;
  salaryRange: SalaryRange;
  location: Location;
  jobType: string;
  workMode: string;
  employmentStartDate: Date;
  experienceLevel: string;
  postedBy: PostedBy;
  applicationDeadline: Date;
  numberOfVacancies: number;
  benefits: string[];
  status: string;
}

const CompanyJobPosts = () => {
  const { company, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [selectedJobPost, setSelectedJobPost] = useState<JobPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchJobPosts = async () => {
      try {
        const response = await axiosInstance.get(
          `/company/all-job-posts/${company?._id}`
        );
        let jobPosts = response.data.allJobPost;
        jobPosts = jobPosts.map((post: any) => post._doc);
        setJobPosts(jobPosts);
      } catch (error) {
        console.error('Error fetching job posts', error);
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
      <main className="min-h-screen bg-gray-50">
        <section className="px-4 py-12 text-center text-white bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto">
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">
              Your Job Posts
            </h1>
            <p className="mb-6 text-lg">
              Manage all your job posts in one place.
            </p>
            {company?.isVerified ? (
  <Link
    to={`/company/${company?._id}/create-job-posts`}
    className="px-6 py-2 font-medium text-blue-600 transition bg-white rounded-lg shadow-lg hover:bg-gray-200"
  >
    Create Job Post
  </Link>
) : (
  <div className="max-w-xl p-4 mx-auto mt-4 text-yellow-800 bg-yellow-100 rounded-lg shadow-md">
    <p className="font-semibold">Your company verification is pending.</p>
    <p className="mt-1 text-sm">
      You can start creating job posts once your company is verified by the admin.
    </p>
    <p className="text-sm">You will receive a confirmation email once the verification is complete.</p>
  </div>
)}

       
          </div>
        </section>

        <section className="px-4 py-12 md:px-6">
          <div className="max-w-6xl mx-auto">
            {jobPosts.length === 0 ? (
              <p className="text-center text-gray-600">
                No job posts available.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobPosts.map((job) => (
                  <div
                    key={job?._id}
                    className="flex flex-col p-6 bg-white rounded-lg shadow-md"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold">{job.jobTitle}</h3>
                      <Link
                        to={`/company/${company?._id}/all-applications`}
                        state={{ jobPost: job }}
                        className="flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        <HiOutlineEye /> View Applications
                      </Link>
                    </div>

                    <div className="mb-4 space-y-2 text-gray-600">
                      <p className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-blue-600" />
                        <strong>Location:</strong> {job.location.city},{' '}
                        {job.location.state}, {job.location.country}
                      </p>
                      <p className="flex items-center gap-2">
                        <FaMoneyBillWave className="text-green-600" />
                        <strong>Salary:</strong> {job.salaryRange.currency}
                        {job.salaryRange.min} - {job.salaryRange.max}
                      </p>
                      <p className="flex items-center gap-2">
                        <FaBriefcase className="text-gray-600" />
                        <strong>Job Type:</strong> {job.jobType}
                      </p>
                      <p className="flex items-center gap-2">
                        <FaClock className="text-orange-600" />
                        <strong>Experience Level:</strong> {job.experienceLevel}
                      </p>
                      <p>
                        <strong>Application Deadline:</strong>{' '}
                        {new Date(job.applicationDeadline).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex justify-end mt-auto">
                      <button
                        onClick={() => {
                          setSelectedJobPost(job);
                          setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
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
      <JobDetailsModal
        jobPost={selectedJobPost}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedJobPost(null);
        }}
      />
    </div>
  );
};

export default CompanyJobPosts;
