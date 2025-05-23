import React from 'react';
import { JobPost } from './AllJobPosts';
import './profile.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { toast } from 'react-toastify';
import { deleteJobPost } from '../../../services/company/applicationService';

interface JobDetailsModalProps {
  jobPost: JobPost | null;
  isOpen: boolean;
  onClose: () => void;
}

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  jobPost,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const { company, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  if (!isOpen || !jobPost) return null;

  const handleEdit = () => {
    navigate(`/company/${company?._id}/create-job-posts`, {
      state: { jobPost },
    });
  };

  const handleDelete = async () => {
    try {
      const data = await deleteJobPost(jobPost._id!)
      if (data.success) {
        toast.success(data.message);
        onClose();
      } else {
        toast.error(data.message);
      }
    } catch (err: any) {
    const errorMessage =
      err?.response?.data?.message ||
      err?.message ||
      'Something went wrong while deleting the job post.';
    toast.error(errorMessage);

    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl max-h-screen p-8 overflow-y-auto bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="mb-4 text-2xl font-bold">{jobPost.jobTitle}</h2>
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="px-3 py-1 text-white bg-green-600 rounded-lg "
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1 text-white bg-red-800 rounded-lg "
            >
              Delete
            </button>
          </div>
        </div>
        <p className="mb-4">{jobPost.description}</p>
        <div className="mb-4">
          <strong>Skills Required:</strong>
          <ul className="list-disc list-inside">
            {jobPost.skillsRequired.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <strong>Responsibilities:</strong>
          <ul className="list-disc list-inside">
            {jobPost.responsibilities.map((responsibility, index) => (
              <li key={index}>{responsibility}</li>
            ))}
          </ul>
        </div>
        <p>
          <strong>Location:</strong> {jobPost.location.city},{' '}
          {jobPost.location.state}, {jobPost.location.country}
        </p>
        <p>
          <strong>Remote:</strong> {jobPost.location.remote ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>Salary:</strong> {jobPost.salaryRange.currency}
          {jobPost.salaryRange.min} - {jobPost.salaryRange.max}
        </p>
        <p>
          <strong>Job Type:</strong> {jobPost.jobType}
        </p>
        <p>
          <strong>Experience Level:</strong> {jobPost.experienceLevel}
        </p>
        <p>
          <strong>Education Required:</strong> {jobPost.educationRequired}
        </p>
        <p>
          <strong>Application Deadline:</strong>{' '}
          {new Date(jobPost.applicationDeadline).toLocaleDateString()}
        </p>
        <p>
          <strong>Employment Start Date:</strong>{' '}
          {new Date(jobPost.employmentStartDate).toLocaleDateString()}
        </p>
        <p>
          <strong>Number of Vacancies:</strong> {jobPost.numberOfVacancies}
        </p>
        <div className="mb-4">
          <strong>Benefits:</strong>
          <ul className="list-disc list-inside">
            {jobPost.benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>
        <p>
          <strong>Status:</strong> {jobPost.status}
        </p>
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 mt-4 text-white bg-blue-600 rounded-lg"
          >
            Close
          </button>
          <div className="flex flex-col">
            <span>Posted By : {jobPost.postedBy.userName}</span>
            <span>{jobPost.postedBy.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;
