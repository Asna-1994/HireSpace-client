import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import CompanyHeader from '../../Components/Header/Header';
import Footer from '../../../User/Components/Footer/Footer';
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaIndustry,
  FaCrown,
  FaGlobe,
  FaCalendarAlt,
  FaCertificate,
} from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { getCompanyInitials } from '../../../Utils/helperFunctions/companyName';
import { getAllMembers, getCompanyProfile } from '../../../services/company/profileService';

export interface memberObject {
  _id: string;
  userName: string;
  role: string;
  email: string;
}

const CompanyProfile = () => {
  const { company } = useSelector(
    (state: RootState) => state.auth
  );

  const [members, setMembers] = useState<memberObject[]>([]);
  const [additionalDetails, setAdditionalDetails] = useState({
    mission: '',
    vision: '',
    founder: '',
    ceo: '',
    description: '',
    aboutUs: '',
    website: '',
    socialLinks: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
    },
  });

  const getMembers = async () => {
    try {
      const data = await getAllMembers(company?._id!)
      if (data.success) {
        setMembers(data.data.members);
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  console.log(company?.verificationDocument.url)

  const getCompanyProfileDetails = async () => {
    try {

      const data = await getCompanyProfile(company?._id!)
      if (data.success) {
        setAdditionalDetails(data.data.profile);
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffect(() => {
    getMembers();
    getCompanyProfileDetails();
  }, []);

  return (
    <div className="font-sans bg-gray-50">
      <CompanyHeader />
      <main>
        <section className="py-12 text-white bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="max-w-6xl mx-auto text-center">
            {company?.companyLogo?.url ? (
              <img
                src={company.companyLogo.url}
                alt="Company Logo"
                className="w-24 h-24 mx-auto mb-4 rounded-full shadow-lg"
              />
            ) : (
              <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 text-4xl font-bold bg-gray-500 rounded-full shadow-lg">
                {getCompanyInitials(company?.companyName as string)}
              </div>
            )}
            <h1 className="mb-2 text-5xl font-extrabold">
              {company?.companyName}
            </h1>
            <p className="flex items-center justify-center text-lg">
              <FaEnvelope className="mr-2" />
              {company?.email}
            </p>
            <p className="flex items-center justify-center mt-2 text-lg">
              <FaIndustry className="mr-2" />
              Trusted in{' '}
              <span className="ml-1 font-semibold">
                {company?.industry}
              </span>{' '}
              industry
            </p>
            <p className="flex items-center justify-center mt-2 text-lg">
              <FaMapMarkerAlt className="mr-2" />
              {company?.address}
            </p>
            <p className="flex items-center justify-center mt-2 text-lg">
              <FaCalendarAlt className="mr-2" />
              Established:{' '}
              {company?.establishedDate
                ? new Date(company.establishedDate).toLocaleDateString(
                    'en-US',
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }
                  )
                : 'Unknown'}
            </p>
          </div>
        </section>

        <section className="px-6 py-12">
          <div className="grid max-w-6xl grid-cols-1 gap-8 mx-auto md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Mission',
                content: additionalDetails.mission,
                icon: <FaGlobe />,
              },
              {
                title: 'Vision',
                content: additionalDetails.vision,
                icon: <FaCrown />,
              },
              { title: 'Phone', content: company?.phone, icon: <FaPhone /> },
              {
                title: 'CEO',
                content: additionalDetails.ceo,
                icon: <FaCrown />,
              },
              {
                title: 'Website',
                content: additionalDetails.website,
                icon: <FaGlobe />,
              },
              {
                title: 'Registration Number',
                content: company?.documentNumber,
                icon: <FaCertificate />,
              },
              {
                title: 'App Plan',
                content: company?.appPlan,
                icon: <FaGlobe />,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-6 transition bg-white rounded-lg shadow-lg hover:shadow-2xl"
              >
                <div className="flex items-center mb-2">
                  <div className="mr-3 text-3xl text-blue-600">{item.icon}</div>
                  <h2 className="text-2xl font-bold">{item.title}</h2>
                </div>
                <p className="text-gray-600">{item.content}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 py-12 bg-gray-100">
          <div className="grid max-w-6xl grid-cols-1 gap-8 mx-auto md:grid-cols-2">
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h2 className="mb-2 text-2xl font-bold">Uploaded Documents</h2>
              {/* <img src={company?.verificationDocument.url}></img> */}

              {company?.verificationDocument.url?.endsWith('.pdf') ? (
                <iframe
                  src={company.verificationDocument.url}
                  title="PDF Preview"
                  className="w-full h-64 border rounded-md"
                />
              ) : (
                <img
                  src={company?.verificationDocument.url}
                  alt="Uploaded Document"
                  className="object-cover rounded-md w-96"
                />
              )}
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h2 className="mb-2 text-2xl font-bold">Members</h2>
              <ul className="text-gray-600 list-disc list-inside">
                {members.map((member, index) => (
                  <li key={index} className="flex items-center">
                    {member.userName}{' '}
                    {member.role === 'companyAdmin' && (
                      <span className="px-2 py-1 ml-2 text-sm text-blue-600 bg-blue-100 rounded-full">
                        Admin
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="px-6 py-12 bg-gray-100">
          <div className="max-w-6xl mx-auto">
            <h2 className="mb-8 text-3xl font-semibold text-center">
              Connect with Us
            </h2>
            <div className="flex justify-center space-x-6">
              <a
                href={additionalDetails?.socialLinks?.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-4xl text-blue-600 transition hover:text-blue-700"
              >
                <FaFacebook />
              </a>
              <a
                href={additionalDetails?.socialLinks?.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-4xl text-blue-400 transition hover:text-blue-500"
              >
                <FaTwitter />
              </a>
              <a
                href={additionalDetails?.socialLinks?.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-4xl text-blue-800 transition hover:text-blue-900"
              >
                <FaLinkedin />
              </a>
              <a
                href={additionalDetails?.socialLinks?.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-4xl text-pink-600 transition hover:text-pink-700"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CompanyProfile;
