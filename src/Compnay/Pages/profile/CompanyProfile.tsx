import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import CompanyHeader from "../../Components/Header/Header";
import Footer from "../../../User/Components/Footer/Footer";
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
} from "react-icons/fa";
import { useEffect, useState } from "react";
import axiosInstance from "../../../Utils/Instance/axiosInstance";
import { getCompanyInitials } from "../../../Utils/helperFunctions/companyName";

export interface memberObject {
  _id: string;
  userName: string;
  role: string;
  email: string;
}

const CompanyProfile = () => {
  const { company, user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  const [members, setMembers] = useState<memberObject[]>([]);
  const [additionalDetails, setAdditionalDetails] = useState({
    mission: "",
    vision: "",
    founder: "",
    ceo: "",
    description: "",
    aboutUs: "",
    website: "",
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
    },
  });

  const getMembers = async () => {
    try {
      const response = await axiosInstance.get(
        `/company/${company?._id}/all-members`,
      );
      if (response.data.success) {
        setMembers(response.data.data.members);
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  const getCompanyProfileDetails = async () => {
    try {
      const response = await axiosInstance.get(
        `/company/company-profile-details/${company?._id}`,
      );
      console.log(response.data.data.profile);
      if (response.data.success) {
        setAdditionalDetails(response.data.data.profile);
        console.log(response.data.data.profile);
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
        <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-12">
          <div className="max-w-6xl mx-auto text-center">
            {company?.companyLogo?.url ? (
              <img
                src={company.companyLogo.url}
                alt="Company Logo"
                className="mx-auto mb-4 w-24 h-24 rounded-full shadow-lg"
              />
            ) : (
              <div className="mx-auto mb-4 w-24 h-24 rounded-full shadow-lg bg-gray-500 flex items-center justify-center text-4xl font-bold">
                {getCompanyInitials(company?.companyName as string)}
              </div>
            )}
            <h1 className="text-5xl font-extrabold mb-2">
              {company?.companyName}
            </h1>
            <p className="text-lg flex items-center justify-center">
              <FaEnvelope className="mr-2" />
              {company?.email}
            </p>
            <p className="mt-2 text-lg flex items-center justify-center">
              <FaIndustry className="mr-2" />
              Trusted in{" "}
              <span className="font-semibold ml-1">
                {company?.industry}
              </span>{" "}
              industry
            </p>
            <p className="mt-2 text-lg flex items-center justify-center">
              <FaMapMarkerAlt className="mr-2" />
              {company?.address}
            </p>
            <p className="mt-2 text-lg flex items-center justify-center">
              <FaCalendarAlt className="mr-2" />
              Established:{" "}
              {company?.establishedDate
                ? new Date(company.establishedDate).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )
                : "Unknown"}
            </p>
          </div>
        </section>

        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Mission",
                content: additionalDetails.mission,
                icon: <FaGlobe />,
              },
              {
                title: "Vision",
                content: additionalDetails.vision,
                icon: <FaCrown />,
              },
              { title: "Phone", content: company?.phone, icon: <FaPhone /> },
              {
                title: "CEO",
                content: additionalDetails.ceo,
                icon: <FaCrown />,
              },
              {
                title: "Website",
                content: additionalDetails.website,
                icon: <FaGlobe />,
              },
              {
                title: "Registration Number",
                content: company?.documentNumber,
                icon: <FaCertificate />,
              },
              {
                title: "App Plan",
                content: company?.appPlan,
                icon: <FaGlobe />,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white shadow-lg p-6 rounded-lg hover:shadow-2xl transition"
              >
                <div className="flex items-center mb-2">
                  <div className="text-3xl text-blue-600 mr-3">{item.icon}</div>
                  <h2 className="text-2xl font-bold">{item.title}</h2>
                </div>
                <p className="text-gray-600">{item.content}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12 px-6 bg-gray-100">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white shadow-lg p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-2">Uploaded Documents</h2>
              {/* <img src={company?.verificationDocument.url}></img> */}

              {company?.verificationDocument.url?.endsWith(".pdf") ? (
                <iframe
                  src={company.verificationDocument.url}
                  title="PDF Preview"
                  className="w-full h-64 border rounded-md"
                />
              ) : (
                <img
                  src={company?.verificationDocument.url}
                  alt="Uploaded Document"
                  className="w-96 object-cover rounded-md"
                />
              )}
            </div>
            <div className="bg-white shadow-lg p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-2">Members</h2>
              <ul className="list-disc list-inside text-gray-600">
                {members.map((member, index) => (
                  <li key={index} className="flex items-center">
                    {member.userName}{" "}
                    {member.role === "companyAdmin" && (
                      <span className="ml-2 text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        Admin
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-gray-100 py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-semibold text-center mb-8">
              Connect with Us
            </h2>
            <div className="flex justify-center space-x-6">
              <a
                href={additionalDetails.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-4xl hover:text-blue-700 transition"
              >
                <FaFacebook />
              </a>
              <a
                href={additionalDetails.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 text-4xl hover:text-blue-500 transition"
              >
                <FaTwitter />
              </a>
              <a
                href={additionalDetails.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-800 text-4xl hover:text-blue-900 transition"
              >
                <FaLinkedin />
              </a>
              <a
                href={additionalDetails.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 text-4xl hover:text-pink-700 transition"
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
