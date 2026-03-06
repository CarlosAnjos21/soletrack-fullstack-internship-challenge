import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import styles from "./Sidebar.module.css";

const Sidebar: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoSection}>
        <div className={styles.logoIcon}>F</div>
        <h2 className={styles.logoText}>
          Footwear<span>ERP</span>
        </h2>
      </div>

      <nav className={styles.nav}>
        <p className={styles.navLabel}>Principal</p>
        <NavLink
          to="/home"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          <span className={styles.icon}>📊</span> Dashboard
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          <span className={styles.icon}>📦</span> Ordens de Produção
        </NavLink>

        <NavLink
          to="/models"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          <span className={styles.icon}>👟</span> Modelos de Calçados
        </NavLink>

        <p className={styles.navLabel}>Configurações</p>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          <span className={styles.icon}>👤</span> Meu Perfil
        </NavLink>

        {user?.role === "ADMIN" && (
          <NavLink
            to="/register"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            <span className={styles.icon}>➕</span> Registrar Operador
          </NavLink>
        )}
      </nav>

      <div className={styles.footer}>
        <div className={styles.userInfo}>
          <p className={styles.userName}>{user?.name || "Usuário"}</p>
          <p className={styles.userRole}>{user?.role}</p>
        </div>
        <button
          onClick={handleLogout}
          className={styles.logoutBtn}
          title="Sair do sistema"
        >
          🚪 Sair
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
