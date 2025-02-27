// import React from 'react';
// import { Route, Routes } from 'react-router-dom';
// import SignUp from '../User/Pages/SignUp/UserSignUp';
// import OtpVerification from '../User/Pages/OTPverification/OtpVerification';
// import Login from '../User/Pages/Login/Login';
// import ForgotPassword from '../User/Pages/ForgotPassword/ForgotPassword';
// import UserHome from '../User/Pages/UserHome/UserHome';
// import ProtectedRoute from '../Shared/Pages/ProtectRoute';
// import { useSelector } from 'react-redux';
// import { RootState } from '../redux/store';
// import AddEducation from '../User/Pages/Profile/AddEducation';
// import UploadResume from '../User/Pages/Profile/UploadResume';
// import EditBasicProfile from '../User/Pages/Profile/EditBasicDetails';
// import AddWorkExperience from '../User/Pages/Profile/AddWorkExperience';
// import AddSkills from '../User/Pages/Profile/AddSkills';
// import AddCertificates from '../User/Pages/Profile/AddCertificates';
// import ViewProfile from '../User/Pages/Profile/ViewProfile';
// import ViewAllPosts from '../User/Pages/JobPosts/ViewPosts';
// import ViewJobDetails from '../User/Pages/JobPosts/ViewJobDetails';
// import MyApplications from '../User/Pages/Applications/MyApplications';
// import ViewApplicationDetails from '../User/Pages/Applications/ViewApplicationDetails';
// import SavedJobPosts from '../User/Pages/JobPosts/AllSavedJobs';
// import Connections from '../User/Pages/Connections/UserConnections';
// import AllConnections from '../User/Pages/Connections/ViewAllConnections';
// import MessagesPage from '../User/Components/chat/MessagePage';
// import ChatComponent from '../User/Components/chat/ChatComponent';
// import PremiumPlans from '../User/Pages/Profile/TryPremium';
// import PaymentSuccess from '../User/Pages/Profile/PaymentSuccess';
// import PaymentFailure from '../User/Pages/Profile/PaymentFailure';
// import ChatLayout from '../User/Components/chat/ChatLayout';

// const UserRoutes: React.FC = () => {


//   return (
//     <Routes>
//       <Route path="signup" element={<SignUp />} />
//       <Route path="verify-otp" element={<OtpVerification />} />
//       <Route path="login" element={<Login />} />
//       <Route path="forgot-password" element={<ForgotPassword />} />
//       <Route path="edit-basic-details/:userId" element={<EditBasicProfile />} />
//       {/* <Route
//         element={<ProtectedRoute isAuthenticated={isAuthenticated} requiredEntity="user" allowedRoles={['jobSeeker']} redirectPath='/' />}
//       > */}
//       <Route path="home/:userId" element={<UserHome />} />
//       <Route path="add-education/:userId" element={<AddEducation />} />
//       <Route path="upload-resume/:userId" element={<UploadResume />} />

//       <Route
//         path="add-work-experience/:userId"
//         element={<AddWorkExperience />}
//       />
//       <Route path="add-skills/:userId" element={<AddSkills />} />
//       <Route path="add-certificates/:userId" element={<AddCertificates />} />
//       <Route path="view-profile/:userId" element={<ViewProfile />} />
//       <Route path="view-job-posts" element={<ViewAllPosts />} />
//       <Route path="job-posts/:jobPostId" element={<ViewJobDetails />} />
//       <Route path="all-job-applications/:userId" element={<MyApplications />} />
//       <Route
//         path="applications/:applicationId"
//         element={<ViewApplicationDetails />}
//       />
//       <Route path="saved-jobs/:userId" element={<SavedJobPosts />} />
//       <Route path="user-connections/:userId" element={<Connections />} />
//       <Route path="view-connections/:userId" element={<AllConnections />} />
//       {/* <Route path="messages/:userId" element={<MessagesPage />} />
//       <Route
//         path="messages/chats/:roomId/:receiverId"
//         element={<ChatComponent />}
//       /> */}
//         <Route path="messages" element={<ChatLayout />}>
//     <Route path="chats/:roomId/:receiverId" element={<ChatLayout />} />
//   </Route>
//       <Route path=":userId/try-premium" element={<PremiumPlans />} />
//       <Route path=":userId/activated-premium" element={<PaymentSuccess />} />
//       <Route path=":userId/payment-failed" element={<PaymentFailure />} />
//       {/* </Route> */}
//     </Routes>
//   );
// };

// export default UserRoutes;
import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import SignUp from '../User/Pages/SignUp/UserSignUp';
import OtpVerification from '../User/Pages/OTPverification/OtpVerification';
import Login from '../User/Pages/Login/Login';
import ForgotPassword from '../User/Pages/ForgotPassword/ForgotPassword';
import UserHome from '../User/Pages/UserHome/UserHome';
const AddEducation = lazy(() => import('../User/Pages/Profile/AddEducation'));
const UploadResume = lazy(() => import('../User/Pages/Profile/UploadResume'));
const EditBasicProfile = lazy(() => import('../User/Pages/Profile/EditBasicDetails'));
const AddWorkExperience = lazy(() => import('../User/Pages/Profile/AddWorkExperience'));
const AddSkills = lazy(() => import('../User/Pages/Profile/AddSkills'));
const AddCertificates = lazy(() => import('../User/Pages/Profile/AddCertificates'));
const ViewProfile = lazy(() => import('../User/Pages/Profile/ViewProfile'));
const ViewAllPosts = lazy(() => import('../User/Pages/JobPosts/ViewPosts'));
const ViewJobDetails = lazy(() => import('../User/Pages/JobPosts/ViewJobDetails'));
const MyApplications = lazy(() => import('../User/Pages/Applications/MyApplications'));
const ViewApplicationDetails = lazy(() => import('../User/Pages/Applications/ViewApplicationDetails'));
const SavedJobPosts = lazy(() => import('../User/Pages/JobPosts/AllSavedJobs'));
const Connections = lazy(() => import('../User/Pages/Connections/UserConnections'));
const AllConnections = lazy(() => import('../User/Pages/Connections/ViewAllConnections'));
const ChatLayout = lazy(() => import('../User/Components/chat/ChatLayout'));
const PremiumPlans = lazy(() => import('../User/Pages/Profile/TryPremium'));
const PaymentSuccess = lazy(() => import('../User/Pages/Profile/PaymentSuccess'));
const PaymentFailure = lazy(() => import('../User/Pages/Profile/PaymentFailure'));

const UserRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="signup" element={<SignUp />} />
        <Route path="verify-otp" element={<OtpVerification />} />
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="edit-basic-details/:userId" element={<EditBasicProfile />} />
        <Route path="home/:userId" element={<UserHome />} />
        <Route path="add-education/:userId" element={<AddEducation />} />
        <Route path="upload-resume/:userId" element={<UploadResume />} />
        <Route path="add-work-experience/:userId" element={<AddWorkExperience />} />
        <Route path="add-skills/:userId" element={<AddSkills />} />
        <Route path="add-certificates/:userId" element={<AddCertificates />} />
        <Route path="view-profile/:userId" element={<ViewProfile />} />
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
      </Routes>
    </Suspense>
  );
};

export default UserRoutes;
