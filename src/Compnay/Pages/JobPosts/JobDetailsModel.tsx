import React from 'react';
import { JobPost } from './AllJobPosts';
import './profile.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { toast } from 'react-toastify';
import axios from 'axios';
import axiosInstance from '../../../Utils/Instance/axiosInstance';

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
      const response = await axiosInstance.delete(
        `/company/job-post/${jobPost._id}`
      );
      if (response.data.success) {
        toast.success(response.data.message);
        onClose();
      } else {
        toast.error(response.data.message);
      }
    } catch (err: any) {
      toast.error(err.response.data.message);
      console.log(err);
    }
  };

  return (
    <div className="fixed  inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold mb-4">{jobPost.jobTitle}</h2>
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="bg-green-600 text-white px-3 py-1 rounded-lg "
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-800 text-white px-3 py-1 rounded-lg "
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
        <div className="flex justify-between items-center">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4"
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
