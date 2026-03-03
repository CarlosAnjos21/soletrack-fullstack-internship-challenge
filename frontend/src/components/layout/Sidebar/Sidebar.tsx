import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.logo}>SoleTrack</h2>

      <nav className={styles.nav}>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/models">Modelos</NavLink>
        <NavLink to="/production">Produção</NavLink>
        <NavLink to="/reports">Relatórios</NavLink>
      </nav>
    </aside>
  );
}