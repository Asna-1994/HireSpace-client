


import  { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../Shared/Pages/ProtectRoute';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import AdminLogin from '../Admin/Pages/Login/AdminLogin';
import AdminHome from '../Admin/Pages/Home/AdminHome';
import UserList from '../Admin/Pages/UsersList/UserList';
import CompanyList from '../Admin/Pages/CompanyList/CompanyList';
const AdminProfile = lazy(() => import('../Admin/Pages/Profile/EditBasicDetails'));
const ManagePlans = lazy(() => import('../Admin/Pages/ManagePlans/ManagePlans'));
const PremiumUserList = lazy(() => import('../Admin/Pages/PremiumUsers/PremiumUsers'));
const SpamList = lazy(() => import('../Admin/Pages/Spam/SpamList'));

const AdminRoutes = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="login" element={<AdminLogin />} />
        <Route
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              requiredEntity="user"
              allowedRoles={['admin']}
              // redirectPath='/login'
            />
          }
        >
          <Route path="home/:adminId" element={<AdminHome />} />
          <Route path="all-users" element={<UserList />} />
          <Route path="all-companies" element={<CompanyList />} />
          <Route path="edit-profile/:adminId" element={<AdminProfile />} />
          <Route path="manage-plans/:adminId" element={<ManagePlans />} />
          <Route path="all-premium-users" element={<PremiumUserList />} />
          <Route path="spam-reports" element={<SpamList />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;

