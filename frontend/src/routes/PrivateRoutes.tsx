import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PrivateRoutes: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null; // ou um spinner
  }

  if (!user) {
    if (!user) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
  }

  return <Outlet />;
};

export default PrivateRoutes;
