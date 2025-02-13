export interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  id: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  required?: boolean;
  className?: string;
}

import { useState, FormEvent, ChangeEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { JobPost } from './AllJobPosts';
import CompanyHeader from '../../Components/Header/Header';
import Footer from '../../../User/Components/Footer/Footer';
import axiosInstance from '../../../Utils/Instance/axiosInstance';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { toast } from 'react-toastify';

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  className = '',
  ...props
}) => (
  <div className="w-full">
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    {type === 'textarea' ? (
      <textarea
        id={id}
        name={name}
        rows={4}
        className={`mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm  ${className}`}
        value={value}
        onChange={onChange}
        required={required}
        {...props}
      />
    ) : (
      <input
        type={type}
        id={id}
        name={name}
        className={`mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${className}`}
        value={value}
        onChange={onChange}
        required={required}
        {...props}
      />
    )}
  </div>
);

interface LocationState {
  jobPost?: JobPost;
}

const CreateJobPostPage: React.FC = () => {
  const location = useLocation();
  const locationState = location.state as LocationState;
  const jobPost = locationState?.jobPost;

  const { company, user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const initialJobData: JobPost = {
    jobTitle: jobPost?.jobTitle ?? '',
    description: jobPost?.description ?? '',
    skillsRequired: jobPost?.skillsRequired ?? [],
    responsibilities: jobPost?.responsibilities ?? [],
    educationRequired: jobPost?.educationRequired ?? '',
    salaryRange: jobPost?.salaryRange ?? { min: '', max: '', currency: 'INR' },
    location: jobPost?.location ?? {
      city: '',
      state: '',
      country: '',
      remote: false,
    },
    jobType: jobPost?.jobType ?? 'Full-time',
    workMode: jobPost?.workMode ?? 'Remote',
    employmentStartDate: jobPost?.employmentStartDate
      ? new Date(jobPost.employmentStartDate)
      : new Date(),
    experienceLevel: jobPost?.experienceLevel ?? '',
    postedBy: jobPost?.postedBy ?? { userName: '', email: '', _id: '' },
    applicationDeadline: jobPost?.applicationDeadline
      ? new Date(jobPost.applicationDeadline)
      : new Date(),
    numberOfVacancies: jobPost?.numberOfVacancies ?? 1,
    benefits: jobPost?.benefits ?? [],
    status: jobPost?.status ?? 'Active',
  };

  const [jobData, setJobData] = useState<JobPost>(initialJobData);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (
      name === 'skillsRequired' ||
      name === 'responsibilities' ||
      name === 'benefits'
    ) {
      setJobData({
        ...jobData,
        [name]: value.split(','),
      });
    } else if (
      name === 'employmentStartDate' ||
      name === 'applicationDeadline'
    ) {
      setJobData({
        ...jobData,
        [name]: new Date(value),
      });
    } else {
      setJobData({
        ...jobData,
        [name]: value,
      });
    }
  };

  const handleLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setJobData({
      ...jobData,
      location: {
        ...jobData.location,
        [name.replace('location', '').toLowerCase()]: value,
      },
    });
  };

  const handleSalaryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setJobData({
      ...jobData,
      salaryRange: {
        ...jobData.salaryRange,
        [name.replace('salaryRange', '').toLowerCase()]: value,
      },
    });
  };

  const jobPostId = jobPost?._id;
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        `/company/job-post/${company?._id}/${user?._id}`,
        jobData,
        { params: { jobPostId: jobPost?._id } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        navigate(`/company/${company?._id}/view-job-posts`);
      } else {
        toast.error(response.data.message);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'An error occurred');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <CompanyHeader />

      <main className="flex-grow bg-gray-50">
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 sm:py-12 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4">
              {jobPost?._id ? 'Update Job Post' : 'Create a New Job Post'}
            </h1>
            <p className="text-base sm:text-lg opacity-90">
              Fill in the details below to create a job post and attract top
              talent.
            </p>
          </div>
        </section>

        <section className="py-8 sm:py-12 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-4 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <InputField
                  label="Job Title"
                  id="jobTitle"
                  name="jobTitle"
                  value={jobData.jobTitle}
                  onChange={handleChange}
                  required
                />

                <InputField
                  label="Job Description"
                  id="description"
                  name="description"
                  type="textarea"
                  value={jobData.description}
                  onChange={handleChange}
                  required
                />

                <InputField
                  label="Skills Required (comma separated)"
                  id="skillsRequired"
                  name="skillsRequired"
                  value={jobData.skillsRequired.join(',')}
                  onChange={handleChange}
                />

                <InputField
                  label="Responsibilities (comma separated)"
                  id="responsibilities"
                  name="responsibilities"
                  value={jobData.responsibilities.join(',')}
                  onChange={handleChange}
                />

                <InputField
                  label="Benefits (comma separated)"
                  id="benefits"
                  name="benefits"
                  value={jobData.benefits.join(',')}
                  onChange={handleChange}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Min Salary"
                    id="salaryRangeMin"
                    name="salaryRangeMin"
                    value={jobData.salaryRange.min}
                    onChange={(e: any) => {
                      setJobData({
                        ...jobData,
                        salaryRange: {
                          ...jobData.salaryRange,
                          min: e.target.value,
                        },
                      });
                    }}
                    required
                  />

                  <InputField
                    label="Max Salary"
                    id="salaryRangeMax"
                    name="salaryRangeMax"
                    value={jobData.salaryRange.max}
                    onChange={(e: any) => {
                      setJobData({
                        ...jobData,
                        salaryRange: {
                          ...jobData.salaryRange,
                          max: e.target.value,
                        },
                      });
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <InputField
                    label="City"
                    id="locationCity"
                    name="locationCity"
                    value={jobData.location.city}
                    onChange={(e: any) => {
                      setJobData({
                        ...jobData,
                        location: { ...jobData.location, city: e.target.value },
                      });
                    }}
                  />

                  <InputField
                    label="State"
                    id="locationState"
                    name="locationState"
                    value={jobData.location.state}
                    onChange={(e: any) => {
                      setJobData({
                        ...jobData,
                        location: {
                          ...jobData.location,
                          state: e.target.value,
                        },
                      });
                    }}
                  />

                  <InputField
                    label="Country"
                    id="locationCountry"
                    name="locationCountry"
                    value={jobData.location.country}
                    onChange={(e: any) => {
                      setJobData({
                        ...jobData,
                        location: {
                          ...jobData.location,
                          country: e.target.value,
                        },
                      });
                    }}
                  />
                </div>

                <InputField
                  label="Education Required"
                  id="educationRequired"
                  name="educationRequired"
                  value={jobData.educationRequired}
                  onChange={handleChange}
                  required
                />

                <div className="w-full">
                  <label
                    htmlFor="workMode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Work Mode
                  </label>
                  <select
                    id="workMode"
                    name="workMode"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={jobData.workMode}
                    onChange={handleChange}
                    required
                  >
                    <option value="Remote">Remote</option>
                    <option value="OnSite">OnSite</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <InputField
                  label="Experience Required"
                  id="experienceLevel"
                  name="experienceLevel"
                  value={jobData.experienceLevel}
                  onChange={handleChange}
                  required
                />

                <div className="w-full">
                  <label
                    htmlFor="jobType"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Job Type
                  </label>
                  <select
                    id="jobType"
                    name="jobType"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={jobData.jobType}
                    onChange={handleChange}
                    required
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Temporary">Temporary</option>
                  </select>
                </div>

                <InputField
                  label="Application Deadline"
                  id="applicationDeadline"
                  name="applicationDeadline"
                  type="date"
                  value={
                    jobData.applicationDeadline.toISOString().split('T')[0]
                  }
                  onChange={(e: any) => {
                    setJobData({
                      ...jobData,
                      applicationDeadline: new Date(e.target.value),
                    });
                  }}
                  required
                />

                <InputField
                  label="Employment Start Date"
                  id="employmentStartDate"
                  name="employmentStartDate"
                  type="date"
                  value={
                    jobData.employmentStartDate.toISOString().split('T')[0]
                  }
                  onChange={(e: any) => {
                    setJobData({
                      ...jobData,
                      employmentStartDate: new Date(e.target.value),
                    });
                  }}
                  required
                />

                <InputField
                  label="Number of Vacancies"
                  id="numberOfVacancies"
                  name="numberOfVacancies"
                  type="number"
                  value={jobData.numberOfVacancies}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {jobPostId ? 'Update Job Post' : 'Create Job Post'}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CreateJobPostPage;
