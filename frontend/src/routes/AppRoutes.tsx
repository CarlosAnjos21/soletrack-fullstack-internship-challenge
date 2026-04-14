import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import ProductionOrders from "../pages/ProductionOrders";
import ShoeModels from "../pages/ShoeModels";
import RegisterOperator from "../pages/RegisterOperator";

import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 🔓 Rotas Públicas (Sem Sidebar) */}
      <Route element={<PublicRoutes />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* 🔐 Rotas Privadas (Com Sidebar Automática) */}
      <Route element={<PrivateRoutes />}>
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<ProductionOrders />} />
        <Route path="/models" element={<ShoeModels />} />
        <Route path="/operators" element={<RegisterOperator />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
      </Route>

      {/* ❌ Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;