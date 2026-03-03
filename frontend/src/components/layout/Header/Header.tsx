import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <span>Bem-vindo 👟</span>
      <button className={styles.logoutButton}>Sair</button>
    </header>
  );
}