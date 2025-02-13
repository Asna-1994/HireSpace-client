import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../Shared/Pages/ProtectRoute';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import AdminLogin from '../Admin/Pages/Login/AdminLogin';
import AdminHome from '../Admin/Pages/Home/AdminHome';
import UserList from '../Admin/Pages/UsersList/UserList';
import CompanyList from '../Admin/Pages/CompanyList/CompanyList';
import AdminProfile from '../Admin/Pages/Profile/EditBasicDetails';
import ManagePlans from '../Admin/Pages/ManagePlans/ManagePlans';
import PremiumUserList from '../Admin/Pages/PremiumUsers/PremiumUsers';
import SpamList from '../Admin/Pages/Spam/SpamList';

const AdminRoutes = () => {
  const { company, user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  return (
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
  );
};

export default AdminRoutes;
