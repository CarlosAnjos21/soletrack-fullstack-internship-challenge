// src/routes/PrivateRoutes.tsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import MainLayout from "../components/MainLayout"; // 🔥 IMPORTANTE

const PrivateRoutes: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div style={{ padding: "2rem" }}>Carregando sistema...</div>; 
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 🔥 Aqui está a mudança: O MainLayout envolve o Outlet
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default PrivateRoutes;
