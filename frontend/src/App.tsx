import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ShoeModels from "./pages/ShoeModels";
import ProductionOrders from "./pages/ProductionOrders";
import Profile from "./pages/Profile";

import PrivateRoutes from "./routes/PrivateRoutes";
import PublicRoutes from "./routes/PublicRoutes";

const App: React.FC = () => {
  return (
    <Routes>
      
      <Route path="/" element={<Navigate to="/home" replace />} />

      <Route element={<PublicRoutes />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<PrivateRoutes />}>
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/models" element={<ShoeModels />} />
        <Route path="/orders" element={<ProductionOrders />} />
      </Route>

      <Route path="*" element={<Navigate to="/register" replace />} />
    </Routes>
  );
};

export default App;