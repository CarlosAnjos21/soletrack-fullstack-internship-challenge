import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import ProductionOrders from "../pages/ProductionOrders";
import ShoeModels from "../pages/ShoeModels";

import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 🔥 Ao entrar no site */}
      <Route path="/" element={<Navigate to="/register" replace />} />

      {/* 🔓 Rotas públicas */}
      <Route element={<PublicRoutes />}>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* 🔐 Rotas privadas */}
      <Route element={<PrivateRoutes />}>
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<ProductionOrders />} />
        <Route path="/models" element={<ShoeModels />} />
      </Route>

      {/* ❌ Qualquer rota inválida */}
      <Route path="*" element={<Navigate to="/register" replace />} />
    </Routes>
  );
};

export default AppRoutes;