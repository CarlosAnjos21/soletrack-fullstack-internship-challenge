import styles from "./Dashboard.module.css";
import { useProductions } from "../../hooks/useProduction";
import { useDashboard } from "../../hooks/useDashboard";

export function Dashboard() {
  const { productions, loading, error } = useProductions();
  const { total, pending, inProgress, completed } =
    useDashboard(productions);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className={styles.container}>
      <h1>Dashboard</h1>

      <div className={styles.cards}>
        <Card title="Total" value={total} />
        <Card title="Pendentes" value={pending} />
        <Card title="Em Produção" value={inProgress} />
        <Card title="Concluídas" value={completed} />
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className={styles.card}>
      <h3>{title}</h3>
      <span>{value}</span>
    </div>
  );
}