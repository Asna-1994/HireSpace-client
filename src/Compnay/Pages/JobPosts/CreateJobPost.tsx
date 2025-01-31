import { useState } from "react";
import {  useLocation, useNavigate } from "react-router-dom";
import { JobPost } from "./AllJobPosts";
import CompanyHeader from "../../Components/Header/Header";
import Footer from "../../../User/Components/Footer/Footer";
import axiosInstance from "../../../Utils/Instance/axiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { toast } from "react-toastify";

const CreateJobPostPage = () => {
    const location = useLocation();
    const jobPost = location.state?.jobPost; 
    const { company,user, isAuthenticated } = useSelector((state: RootState) => state.auth);
const navigate = useNavigate()
  const [jobData, setJobData] = useState<JobPost>({
    jobTitle: jobPost ? jobPost.jobTitle : "",
    description: jobPost ? jobPost.description : "",
    skillsRequired: jobPost ? jobPost.skillsRequired : [],
    responsibilities: jobPost ? jobPost.responsibilities : [],
    educationRequired: jobPost ? jobPost.educationRequired : "",
    salaryRange: jobPost
      ? jobPost.salaryRange
      : { min: "", max: "", currency: "INR" },
    location: jobPost
      ? jobPost.location
      : { city: "", state: "", country: "", remote: false },
    jobType: jobPost ? jobPost.jobType : "Full-time",
    workMode: jobPost ? jobPost.workMode : "Remote",
    employmentStartDate: jobPost ? new Date(jobPost.employmentStartDate) : new Date(),
    experienceLevel: jobPost ? jobPost.experienceLevel : "",
    postedBy: jobPost ? jobPost.postedBy : { userName: "", email: "", _id: "" },
    applicationDeadline: jobPost ? new Date(jobPost.applicationDeadline) : new Date(),
    numberOfVacancies: jobPost ? jobPost.numberOfVacancies : 1,
    benefits: jobPost ? jobPost.benefits : [],
    status: jobPost ? jobPost.status : "Active",
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (name === "skillsRequired" || name === "responsibilities" || name === "benefits") {
      setJobData({
        ...jobData,
        [name]: value.split(","),
      });
    } else if (name === "employmentStartDate" || name === "applicationDeadline") {
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

  const jobPostId = jobPost?._id;
  const handleSubmit =async  (e: React.FormEvent) => {
    e.preventDefault();
try{
    const response = await axiosInstance.post(`/company/job-post/${company?._id}/${user?._id}`,jobData ,
     {
        params : {jobPostId}
     }
    )
if(response.data.success){
    toast.success(response.data.message)
navigate(`/company/${company?._id}/view-job-posts`)
}else{
    toast.error(response.data.message)
}
}catch(err :any){
    toast.error(err.response.data.message)
    console.log(err)
}
  };

  return (
    <div>
      <CompanyHeader />
      <main className="bg-gray-50 min-h-screen">
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-4"> {jobPostId ? "Update Job Post " : "Create a New Job Post"} </h1>
            <p className="text-lg mb-6">
              Fill in the details below to create a job post and attract top talent.
            </p>
          </div>
        </section>

        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto bg-white shadow-md p-6 rounded-lg">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
                    Job Title
                  </label>
                  <input
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={jobData.jobTitle}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Job Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={jobData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="skillsRequired" className="block text-sm font-medium text-gray-700">
                    Skills Required (comma separated)
                  </label>
                  <input
                    type="text"
                    id="skillsRequired"
                    name="skillsRequired"
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={jobData.skillsRequired.join(",")}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700">
                    Responsibilities (comma separated)
                  </label>
                  <input
                    type="text"
                    id="responsibilities"
                    name="responsibilities"
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={jobData.responsibilities.join(",")}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700">
                    Benefits (comma separated)
                  </label>
                  <input
                    type="text"
                    id="benefits"
                    name="benefits"
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={jobData.benefits.join(",")}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="salaryRangeMin" className="block text-sm font-medium text-gray-700">
                    Min Salary
                  </label>
                  <input
                    type="text"
                    id="salaryRangeMin"
                    name="salaryRangeMin"
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={jobData.salaryRange.min}
                    onChange={(e) => {
                      setJobData({
                        ...jobData,
                        salaryRange: { ...jobData.salaryRange, min: e.target.value }
                      });
                    }}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="salaryRangeMax" className="block text-sm font-medium text-gray-700">
                    Max Salary
                  </label>
                  <input
                    type="text"
                    id="salaryRangeMax"
                    name="salaryRangeMax"
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={jobData.salaryRange.max}
                    onChange={(e) => {
                      setJobData({
                        ...jobData,
                        salaryRange: { ...jobData.salaryRange, max: e.target.value }
                      });
                    }}
                   
                  />
                </div>

                <div>
                  <label htmlFor="locationCity" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    id="locationCity"
                    name="locationCity"
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={jobData.location.city}
                    onChange={(e) => {
                      setJobData({
                        ...jobData,
                        location: { ...jobData.location, city: e.target.value }
                      });
                    }}
                   
                  />
                </div>

                <div>
                  <label htmlFor="locationState" className="block text-sm font-medium text-gray-700">
                    State
                  </label>
                  <input
                    type="text"
                    id="locationState"
                    name="locationState"
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={jobData.location.state}
                    onChange={(e) => {
                      setJobData({
                        ...jobData,
                        location: { ...jobData.location, state: e.target.value }
                      });
                    }}
                   
                  />
                </div>

                <div>
                  <label htmlFor="locationCountry" className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <input
                    type="text"
                    id="locationCountry"
                    name="locationCountry"
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={jobData.location.country}
                    onChange={(e) => {
                      setJobData({
                        ...jobData,
                        location: { ...jobData.location, country: e.target.value }
                      });
                    }}
                   
                  />
                </div>


                <div>
  <label htmlFor="educationRequired" className="block text-sm font-medium text-gray-700">
    Education Required
  </label>
  <input
    type="text"
    id="educationRequired"
    name="educationRequired"
    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    value={jobData.educationRequired}
    onChange={handleChange}
    required
  />
</div>
<div>
  <label htmlFor="workMode" className="block text-sm font-medium text-gray-700">
    Job Type
  </label>
  <select
    id="workMode"
    name="workMode"
    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    value={jobData.workMode}
    onChange={handleChange}
    required
  >
    <option value="remote">Remote</option>
    <option value="onsite">OnSite</option>
    <option value="Hybrid">Hybrid</option>
 
  </select>
</div>


<div>
  <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700">
    Experience Required
  </label>
  <input
    type="text"
    id="experienceLevel"
    name="experienceLevel"
    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    value={jobData.experienceLevel}
    onChange={handleChange}
    required
  />
</div>

            

                <div>
  <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">
    Job Type
  </label>
  <select
    id="jobType"
    name="jobType"
    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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

       

                <div>
                  <label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-700">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    id="applicationDeadline"
                    name="applicationDeadline"
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={jobData.applicationDeadline.toISOString().split("T")[0]}
                    onChange={(e) => {
                      setJobData({
                        ...jobData,
                        applicationDeadline: new Date(e.target.value)
                      });
                    }}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="employmentStartDate" className="block text-sm font-medium text-gray-700">
                    Employment Start Date
                  </label>
                  <input
                    type="date"
                    id="employmentStartDate"
                    name="employmentStartDate"
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={jobData.employmentStartDate.toISOString().split("T")[0]}
                    onChange={(e) => {
                      setJobData({
                        ...jobData,
                        employmentStartDate: new Date(e.target.value)
                      });
                    }}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="numberOfVacancies" className="block text-sm font-medium text-gray-700">
                    Number of Vacancies
                  </label>
                  <input
                    type="number"
                    id="numberOfVacancies"
                    name="numberOfVacancies"
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={jobData.numberOfVacancies}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-span-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
                  >
             {jobPostId ? "Update" : "Create"}       
                  </button>
                </div>
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
