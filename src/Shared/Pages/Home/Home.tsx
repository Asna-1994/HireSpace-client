
import Header from '../../../User/Components/Header/Header';
import Footer from '../../../User/Components/Footer/Footer';
import { Link, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

const Home = () => {
    const { company, isAuthenticated , user} = useSelector( (state: RootState) => state.auth);

  if (isAuthenticated && user?.userRole === 'admin') {
    return <Navigate to='/admin/home' replace />;
  }
if (
  isAuthenticated &&
  (user?.userRole === 'companyAdmin' || user?.userRole === 'companyMember')
) {
  return <Navigate to="/company/home" replace />;
}

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="py-16 text-white bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container px-6 mx-auto text-center">
          <h1 className="mb-4 text-5xl font-bold">
            Find Your Dream Job Today!
          </h1>
          <p className="mb-6 text-lg">
            Discover life-changing opportunities and take the first step toward
            success.
          </p>
          {!isAuthenticated &&     <div className="flex items-center justify-center gap-4">
            <Link
              to={'/user/login'}
              className="px-6 py-3 text-lg font-semibold text-blue-600 transition duration-300 bg-white rounded-lg shadow-lg hover:bg-gray-200"
            >
              For Users
            </Link>
            <Link
              to={'/company/login'}
              className="px-6 py-3 text-lg font-semibold text-white transition duration-300 bg-blue-800 rounded-lg shadow-lg hover:bg-gray-200"
            >
              For Companies
            </Link>
            <Link
              to={'/admin/login'}
              className="px-6 py-3 text-lg font-semibold text-blue-600 transition duration-300 bg-white rounded-lg shadow-lg hover:bg-gray-200"
            >
              For Admins
            </Link>
          </div> }
      
        </div>
      </section>

      {/* Info Box */}
      <section className="py-8 bg-blue-100">
        <div className="container px-6 mx-auto text-center">
          <div className="p-6 bg-white rounded-lg shadow-lg">
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
        <div className="container px-6 mx-auto">
          <h2 className="mb-10 text-3xl font-bold text-center text-gray-800">
            Why Choose Our Platform?
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Card 1 */}
            <div className="p-6 text-center bg-white rounded-lg shadow-md">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-white bg-blue-600 rounded-full">
                <i className="text-2xl fas fa-search"></i>
              </div>
              <h3 className="mb-4 text-xl font-semibold text-gray-800">
                Easy Job Search
              </h3>
              <p className="text-gray-600">
                Find jobs by skills, location, or industry in minutes.
              </p>
            </div>
            {/* Card 2 */}
            <div className="p-6 text-center bg-white rounded-lg shadow-md">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-white bg-purple-600 rounded-full">
                <i className="text-2xl fas fa-user-friends"></i>
              </div>
              <h3 className="mb-4 text-xl font-semibold text-gray-800">
                Personalized Recommendations
              </h3>
              <p className="text-gray-600">
                AI-powered recommendations tailored to your profile.
              </p>
            </div>
            {/* Card 3 */}
            <div className="p-6 text-center bg-white rounded-lg shadow-md">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-white bg-green-600 rounded-full">
                <i className="text-2xl fas fa-bell"></i>
              </div>
              <h3 className="mb-4 text-xl font-semibold text-gray-800">
                Instant Notifications
              </h3>
              <p className="text-gray-600">
                Get real-time alerts and never miss an opportunity.
              </p>
            </div>
            {/* Card 4 */}
            <div className="p-6 text-center bg-white rounded-lg shadow-md">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-white bg-blue-600 rounded-full">
                <i className="text-2xl fas fa-building"></i>
              </div>
              <h3 className="mb-4 text-xl font-semibold text-gray-800">
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
      <section className="py-16 text-center text-white bg-blue-600">
        <h2 className="mb-4 text-3xl font-bold">
          Ready to Start Your Journey?
        </h2>
        <p className="mb-6 text-lg">
          Join thousands of successful job seekers today and take the first step
          toward your dream career.
        </p>
        {!isAuthenticated &&        <Link
          to="/user/signup"
          className="px-8 py-3 text-lg font-semibold text-blue-600 transition duration-300 bg-white rounded-lg shadow-lg hover:bg-gray-200"
        >
          Sign Up Now
        </Link>}
 
      </section>

      <Footer />
    </>
  );
};

export default Home;
