import React from "react";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Find Your Dream Job Today!
          </h1>
          <p className="text-lg mb-6">
            Discover life-changing opportunities and take the first step toward
            success.
          </p>
          <div className="flex gap-4 items-center justify-center">
            <Link
              to={"/user/login"}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg text-lg font-semibold shadow-lg hover:bg-gray-200 transition duration-300"
            >
              For Users
            </Link>
            <Link
              to={"/company/login"}
              className="bg-blue-800 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-lg hover:bg-gray-200 transition duration-300"
            >
              For Companies
            </Link>
            <Link
              to={"/admin/login"}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg text-lg font-semibold shadow-lg hover:bg-gray-200 transition duration-300"
            >
              For Admins
            </Link>
          </div>
        </div>
      </section>

      {/* Info Box */}
      <section className="bg-blue-100 py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-lg text-gray-700">
              <strong>Note:</strong> To register a company, first create a user
              account with the role <strong>Company Admin</strong>. Use the
              admin's email address when registering your company.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Our Platform */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
            Why Choose Our Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <div className="bg-blue-600 text-white w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <i className="fas fa-search text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Easy Job Search
              </h3>
              <p className="text-gray-600">
                Find jobs by skills, location, or industry in minutes.
              </p>
            </div>
            {/* Card 2 */}
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <div className="bg-purple-600 text-white w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <i className="fas fa-user-friends text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Personalized Recommendations
              </h3>
              <p className="text-gray-600">
                AI-powered recommendations tailored to your profile.
              </p>
            </div>
            {/* Card 3 */}
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <div className="bg-green-600 text-white w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <i className="fas fa-bell text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Instant Notifications
              </h3>
              <p className="text-gray-600">
                Get real-time alerts and never miss an opportunity.
              </p>
            </div>
            {/* Card 4 */}
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <div className="bg-blue-600 text-white w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <i className="fas fa-building text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Company-Friendly Tools
              </h3>
              <p className="text-gray-600">
                Simplify hiring with easy company registration and management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Start Your Journey?
        </h2>
        <p className="text-lg mb-6">
          Join thousands of successful job seekers today and take the first step
          toward your dream career.
        </p>
        <Link
          to="/user/signup"
          className="px-8 py-3 bg-white text-blue-600 rounded-lg text-lg font-semibold shadow-lg hover:bg-gray-200 transition duration-300"
        >
          Sign Up Now
        </Link>
      </section>

      <Footer />
    </>
  );
};

export default Home;
