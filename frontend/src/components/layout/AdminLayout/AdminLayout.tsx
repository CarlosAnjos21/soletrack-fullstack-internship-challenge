import { Outlet, Link } from "react-router-dom";
import styles from "./AdminLayout.module.css";

export function AdminLayout() {
  return (
    <div className={styles.container}>
      <aside style={{ width: 220, padding: 20, background: "#f5f5f5" }}>
        <p>Menu</p>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/models">Models</Link></li>
          <li><Link to="/production-orders">Production</Link></li>
          <li><Link to="/reports">Reports</Link></li>
        </ul>
      </aside>

      <div className={styles.contentArea}>
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}