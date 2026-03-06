// src/components/MainLayout.tsx
import React from "react";
import Sidebar from "./Sidebar";
import styles from "./MainLayout.module.css";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;