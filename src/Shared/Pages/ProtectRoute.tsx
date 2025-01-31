import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../../redux/store';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  requiredEntity?: 'user' | 'company';
  allowedRoles?: string[];
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredEntity,
  allowedRoles = [],
  redirectPath = '/',
}) => {
  const { user, company, isAuthenticated } = useSelector((state: RootState) => state.auth);


  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }


  if (requiredEntity) {
    if (
      (requiredEntity === 'user' && !user) || 
      (requiredEntity === 'company' && !company)
    ) {
      return <Navigate to="/no-access" replace />;
    }
  }


  if (requiredEntity === 'user' && allowedRoles.length > 0) {
    const userRole = user?.userRole || '';
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/no-access" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
