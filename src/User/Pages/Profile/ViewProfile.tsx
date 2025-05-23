import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../../Components/Header/Header';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { Education } from './AddEducation';
import { Skills } from './AddSkills';
import { ExperienceObject } from './AddWorkExperience';
import { CertificateObject } from './AddCertificates';
import { ImageObject } from '../../../Utils/Interfaces/interface';
import { Link } from 'react-router-dom';
import { fetchProfile } from '../../../services/user/userProfileService';

const ViewProfile = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [profile, setProfile] = useState({
    resume: {} as ImageObject,
    certificates: [] as CertificateObject[],
    education: [] as Education[],
    workExperience: [] as ExperienceObject[],
    skills: {} as Skills,
  });

  useEffect(() => {
    fetchProfileDetails();
  }, [user]);

  const fetchProfileDetails = async () => {
    try {
      const data = await fetchProfile(user?._id as string)
      setProfile(data.data.profile);
      console.log(data.data.profile);
    } catch (error) {
      console.error('Error fetching profile details', error);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen p-6 bg-gradient-to-r from-blue-600 to-purple-600">
        <motion.div
          className="p-6 mb-6 bg-white rounded-lg shadow-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Header */}
          <div className="flex items-center space-x-6">
            <img
              src={user?.profilePhoto?.url || 'https://www.w3schools.com/howto/img_avatar.png'}
              alt="Profile"
              className="object-cover w-32 h-32 rounded-full"
            />
            <div>
              <h2 className="text-3xl font-semibold">{user?.userName}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-gray-600">{user?.phone}</p>
            </div>
          </div>

          {/* Resume and Contact Info */}
          <div className="mt-6">
            <Link
              to={profile.resume?.url}
              //   href={profile.resume?.url}
              download={`resume_${user?.userName}.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Download Resume
            </Link>
          </div>
        </motion.div>

        {/* Certificates */}
        <section className="p-6 mb-6 bg-white rounded-lg shadow-md">
          <h3 className="mb-4 text-2xl font-semibold">Certificates</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {profile.certificates.map((cert, index) => (
              <div
                key={index}
                className="p-4 text-white rounded-lg bg-gradient-to-r from-purple-400 to-blue-500"
              >
                <h4 className="text-lg font-semibold">
                  {cert.certificateTitle}
                </h4>
                <p className="text-sm">Issuer: {cert.issuer}</p>
                {cert.certificateUrl && (
                  <a
                    href={cert.certificateUrl}
                    className="text-blue-300 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Certificate
                  </a>
                )}
                <p className="text-sm">Issued: {cert.issuedDate}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="p-6 mb-6 bg-white rounded-lg shadow-md">
          <h3 className="mb-4 text-2xl font-semibold">Education</h3>
          <ul>
            {profile.education.map((edu, index) => (
              <li key={index} className="mb-4">
                <p className="font-semibold">
                  {edu.educationName} - {edu.schoolOrCollege}
                </p>
                <p className="font-semibold">
                  {edu.subject} - {edu.subject}
                </p>
                <p className="text-gray-600">
                  {edu.markOrGrade} - {edu.yearOfPassing}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Work Experience */}
        <section className="p-6 mb-6 bg-white rounded-lg shadow-md">
          <h3 className="mb-4 text-2xl font-semibold">Work Experience</h3>
          <ul>
            {profile.workExperience.map((exp, index) => (
              <li key={index} className="mb-4">
                <p className="font-semibold">
                  {exp.designation} - {exp.company}
                </p>
                <p className="text-gray-600">
                  {exp.dateFrom} - {exp.dateTo}
                </p>
                <p>{exp.skillsGained}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Skills */}
        <section className="py-16 bg-gray-50">
          <div className="container px-6 mx-auto">
            <h2 className="mb-10 text-3xl font-bold text-center text-gray-800">
              Skills
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Soft Skills */}
              <div className="p-6 text-center bg-white rounded-lg shadow-md">
                <h3 className="mb-4 text-xl font-semibold text-gray-800">
                  Soft Skills
                </h3>
                <ul className="text-gray-600">
                  {profile &&
                    profile.skills &&
                    profile?.skills.softSkills &&
                    profile?.skills.softSkills.map((skill, index) => (
                      <li key={index} className="mb-2">
                        {skill}
                      </li>
                    ))}
                </ul>
              </div>

              {/* Hard Skills */}
              <div className="p-6 text-center bg-white rounded-lg shadow-md">
                <h3 className="mb-4 text-xl font-semibold text-gray-800">
                  Hard Skills
                </h3>
                <ul className="text-gray-600">
                  {profile &&
                    profile.skills &&
                    profile?.skills.hardSkills &&
                    profile.skills.hardSkills.map((skill, index) => (
                      <li key={index} className="mb-2">
                        {skill}
                      </li>
                    ))}
                </ul>
              </div>

              {/* Technical Skills */}
              <div className="p-6 text-center bg-white rounded-lg shadow-md">
                <h3 className="mb-4 text-xl font-semibold text-gray-800">
                  Technical Skills
                </h3>
                <ul className="text-gray-600">
                  {profile &&
                    profile.skills &&
                    profile?.skills.technicalSkills &&
                    profile?.skills?.technicalSkills.map((skill, index) => (
                      <li key={index} className="mb-2">
                        {skill}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ViewProfile;
