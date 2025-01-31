import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../../redux/store";
import CompanyHeader from "../../Components/Header/Header";
import NotAuthenticated from "../../../Shared/Pages/NotAuthenticated";
import Footer from "../../../User/Components/Footer/Footer";

const CompanyHome = () => {
  const { company, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const isVerified = company?.isVerified;

  if (!isAuthenticated) {
    return <NotAuthenticated />;
  }

  return (
    <div>
      <CompanyHeader />
      <main className="bg-gray-50 min-h-screen">

      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">
              Welcome, {company?.companyName}!
            </h1>
            {isVerified ? (
              <p className="text-lg mb-6">
                Your account is verified! Start posting jobs and managing candidates today.
              </p>
            ) : company?.verificationDocument.url ? (
              <p className="text-lg mb-6">
                Your documents are under review. Once approved, you can start posting jobs.
              </p>
            ) : (
              <p className="text-lg mb-6">
                Complete your registration by uploading the necessary documents.
              </p>
            )}
          </div>
        </section>

        {/* Actionable Cards Section */}
        <section className="py-12 px-6">
  <div className="max-w-6xl mx-auto">

    {/* Cards Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Profile Card */}
      <div className="bg-white shadow-md p-6 rounded-lg text-center">
        <h3 className="text-xl font-bold mb-4">Complete Your Profile</h3>
        <p className="text-gray-600 mb-6">
          Add details about your company to attract top talent.
        </p>
      </div>

      {/* Documents Upload Card */}
      <div className="bg-white shadow-md p-6 rounded-lg text-center">
        <h3 className="text-xl font-bold mb-4">Verification Status</h3>

        {company?.verificationDocument.url && isVerified ? (
          <p className="text-green-600 font-medium">
            Your company is verified. You can start posting jobs and hiring.
          </p>
        ) : company?.verificationDocument.url ? (
          <p className="text-yellow-600 font-medium">
            Documents uploaded. Awaiting admin verification.
          </p>
        ) : (
          <>
            <p className="text-gray-600 mb-6">
              Upload the necessary documents for verification.
            </p>
            <Link
              to={`/company/document-upload/${company?._id}`}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Upload Documents
            </Link>
          </>
        )}
      </div>
    </div>
  </div>
</section>

      

        <section className="bg-gray-100 py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-semibold text-center mb-8">
              Why Use Our Platform?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Streamlined Job Postings",
                  description:
                    "Effortlessly post jobs and reach qualified candidates.",
                  icon: "fas fa-briefcase",
                },
                {
                  title: "Candidate Management",
                  description:
                    "Track applications and manage interviews in one place.",
                  icon: "fas fa-user-check",
                },
                {
                  title: "Insights & Analytics",
                  description:
                    "Get data-driven insights on job performance and trends.",
                  icon: "fas fa-chart-line",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white shadow-md p-6 rounded-lg text-center"
                >
                  <div className="text-blue-600 text-4xl mb-4">
                    <i className={feature.icon}></i>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
    <Footer/>
    </div>
  );
};

export default CompanyHome;


