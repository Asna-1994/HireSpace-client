import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../Shared/Pages/ProtectRoute';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import CompanySignup from '../Compnay/Pages/CompanySignup/CompanySignup';
import OtpVerificationCompany from '../Compnay/Pages/OTP/OTPVerification';
import ForgotPasswordCompany from '../Compnay/Pages/ForgotPassword/ForgotPassword';
import CompanyHome from '../Compnay/Pages/Home/CompanyHome';
import CompanyLogin from '../Compnay/Pages/Login/CompanyLogin';
import CompanyProfilePage from '../Compnay/Pages/profile/CompanyProfile';
import EditProfile from '../Compnay/Pages/profile/EditProfile';
import UploadLogo from '../Compnay/Pages/profile/uploadLogo';
import UploadVerificationDocument from '../Compnay/Pages/profile/UploadVerificationDocument';
import AddMembers from '../Compnay/Pages/profile/AddMembres';
import CreateJobPost from '../Compnay/Pages/JobPosts/CreateJobPost';
import CompanyJobPosts from '../Compnay/Pages/JobPosts/AllJobPosts';
import ListApplications from '../Compnay/Pages/Applications/MyAppllications';
import ApplicationDetails from '../Compnay/Pages/Applications/ViewDetailedApplication';

const CompanyRoutes = () => {
  const { company, user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  return (
    <Routes>
      <Route path="signin" element={<CompanySignup />} />
      <Route path="login" element={<CompanyLogin />} />
      <Route path="otp-verification" element={<OtpVerificationCompany />} />
      <Route path="forgot-password" element={<ForgotPasswordCompany />} />
      <Route
        element={
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            requiredEntity="company"
            allowedRoles={['companyMember', 'companyAdmin']}
            redirectPath="/"
          />
        }
      >
        <Route path="home/:companyId" element={<CompanyHome />} />
        <Route path="profile/:companyId" element={<CompanyProfilePage />} />
        <Route path="edit-profile/:companyId" element={<EditProfile />} />
        <Route path="upload-logo/:companyId" element={<UploadLogo />} />
        <Route
          path="document-upload/:companyId"
          element={<UploadVerificationDocument />}
        />
        <Route path=":companyId/add-members" element={<AddMembers />} />
        <Route path=":companyId/create-job-posts" element={<CreateJobPost />} />
        <Route path=":companyId/view-job-posts" element={<CompanyJobPosts />} />
        <Route
          path=":companyId/all-applications"
          element={<ListApplications />}
        />
        <Route
          path="applications/:applicationId"
          element={<ApplicationDetails />}
        />
      </Route>
    </Routes>
  );
};

export default CompanyRoutes;
