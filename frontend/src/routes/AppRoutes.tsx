import { Routes, Route } from "react-router-dom";

import { Login } from "../pages/Login/Login";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import { Models } from "../pages/Models/Models";
import { ProductionOrders } from "../pages/ProductionOrders/ProductionOrders";
import { Reports } from "../pages/Reports/Reports";

import { AdminLayout } from "../components/layout/AdminLayout/AdminLayout";

export function AppRoutes() {
  return (
    <Routes>
      {/* Login fora do layout */}
      <Route path="/" element={<Login />} />

      {/* Rotas protegidas dentro do layout */}
      <Route element={<AdminLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/models" element={<Models />} />
        <Route path="/production-orders" element={<ProductionOrders />} />
        <Route path="/reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}