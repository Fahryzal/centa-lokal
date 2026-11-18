import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { isTokenValid } from "@/utils/helper";
import { getAccessToken } from "@/api/authService";

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const token = getAccessToken();

  if (token && isTokenValid(token)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
