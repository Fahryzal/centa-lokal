import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getAccessToken } from '@/api/authService';
import * as interfacesGlobal from '@/utils/interfaces/interfacesGlobal';
import { useAccess } from '@/contexts/AccessContext';
import { extractPaths } from '@/utils/menuPaths';
import NotFound from '../pages/NotFound';
import Loading from '../atoms/Loading/Loading';

const RoleBasedRoute: React.FC = () => {
  const { access, loading } = useAccess();
  const location = useLocation();

  const token = getAccessToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const decodeToken: interfacesGlobal.ResponseJwtType = jwtDecode(token);

  if (!decodeToken) {
    return <Navigate to="/login" replace />;
  }

  if (loading) return <Loading />;

  const allPaths = extractPaths(access);
  const currentPath = location.pathname;
  const resultExtractPaths = currentPath.split('/')[1];
  const isValidPath = allPaths.includes(`/${resultExtractPaths}`);

  if (!isValidPath && !loading) {
    return <NotFound />;
  }

  return <Outlet />;
};
export default RoleBasedRoute;
