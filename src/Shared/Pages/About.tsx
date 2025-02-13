import React from 'react';
import Header from '../../User/Components/Header/Header';

const About: React.FC = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center p-6">
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-4xl w-full">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
            About HireSpace
          </h1>
          <p className="text-gray-600 text-lg leading-8 mb-6">
            At HireSpace, we connect job seekers with the best opportunities
            while empowering employers to discover top talent. Our mission is to
            simplify job searches and provide tools to help everyone achieve
            their career goals.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Our Vision
              </h2>
              <p className="text-gray-600 leading-7">
                We envision a world where every individual can find meaningful
                employment that aligns with their skills and aspirations.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Why Choose Us?
              </h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>
                  Personalized job recommendations tailored to your profile.
                </li>
                <li>Tools to create standout resumes and cover letters.</li>
                <li>
                  Secure and reliable platform trusted by thousands of users.
                </li>
                <li>Dedicated customer support to assist you at every step.</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 flex items-center justify-center">
            <button className=" bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
