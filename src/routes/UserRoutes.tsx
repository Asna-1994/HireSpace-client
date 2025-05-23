
import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import SignUp from '../User/Pages/SignUp/UserSignUp';
import OtpVerification from '../User/Pages/OTPverification/OtpVerification';
import Login from '../User/Pages/Login/Login';
import ForgotPassword from '../User/Pages/ForgotPassword/ForgotPassword';
import UserHome from '../User/Pages/UserHome/UserHome';
import AddEducation from '../User/Pages/Profile/AddEducation';
import UploadResume from '../User/Pages/Profile/UploadResume';
import EditBasicProfile from '../User/Pages/Profile/EditBasicDetails';
import AddWorkExperience from '../User/Pages/Profile/AddWorkExperience';
import AddSkills from '../User/Pages/Profile/AddSkills';
import AddCertificates from '../User/Pages/Profile/AddCertificates';
import ViewProfile from '../User/Pages/Profile/ViewProfile';
import ViewAllPosts from '../User/Pages/JobPosts/ViewPosts';
import ViewJobDetails from '../User/Pages/JobPosts/ViewJobDetails';
import MyApplications from '../User/Pages/Applications/MyApplications';
import ChatLayout from '../User/Components/chat/ChatLayout';
import ProtectedRoute from '../Shared/Pages/ProtectRoute';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import PublicRoute from '../Shared/Pages/RestrictLogin';
const ViewApplicationDetails = lazy(() => import('../User/Pages/Applications/ViewApplicationDetails'));
const SavedJobPosts = lazy(() => import('../User/Pages/JobPosts/AllSavedJobs'));
const Connections = lazy(() => import('../User/Pages/Connections/UserConnections'));
const AllConnections = lazy(() => import('../User/Pages/Connections/ViewAllConnections'));
// const ChatLayout = lazy(() => import('../User/Components/chat/ChatLayout'));
const PremiumPlans = lazy(() => import('../User/Pages/Profile/TryPremium'));
const PaymentSuccess = lazy(() => import('../User/Pages/Profile/PaymentSuccess'));
const PaymentFailure = lazy(() => import('../User/Pages/Profile/PaymentFailure'));

const UserRoutes: React.FC = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
               <Route element={<PublicRoute redirectPath="/user/home" />}>
        <Route path="signup" element={<SignUp />} />
        <Route path="verify-otp" element={<OtpVerification />} />
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />

        </Route>


                        <Route
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              requiredEntity="user"
              allowedRoles={['jobSeeker']}
              // redirectPath='/login'
            />
          }
        >
    
        <Route path="home" element={<UserHome />} />
        <Route path="add-education/:userId" element={<AddEducation />} />
        <Route path="upload-resume/:userId" element={<UploadResume />} />
        <Route path="add-work-experience/:userId" element={<AddWorkExperience />} />
        <Route path="add-skills/:userId" element={<AddSkills />} />
        <Route path="add-certificates/:userId" element={<AddCertificates />} />
    
        <Route path="view-job-posts" element={<ViewAllPosts />} />
        <Route path="job-posts/:jobPostId" element={<ViewJobDetails />} />
        <Route path="all-job-applications/:userId" element={<MyApplications />} />
        <Route path="applications/:applicationId" element={<ViewApplicationDetails />} />
        <Route path="saved-jobs/:userId" element={<SavedJobPosts />} />
        <Route path="user-connections/:userId" element={<Connections />} />
        <Route path="view-connections/:userId" element={<AllConnections />} />
        <Route path="messages" element={<ChatLayout />}>
          <Route path="chats/:roomId/:receiverId" element={<ChatLayout />} />
        </Route>
        <Route path=":userId/try-premium" element={<PremiumPlans />} />
        <Route path=":userId/activated-premium" element={<PaymentSuccess />} />
        <Route path=":userId/payment-failed" element={<PaymentFailure />} />
        </Route>
    <Route path="view-profile/:userId" element={<ViewProfile />} />
        <Route path="edit-basic-details/:userId" element={<EditBasicProfile />} />
      </Routes>
    </Suspense>
  );
};

export default UserRoutes;
