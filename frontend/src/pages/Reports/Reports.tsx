import styles from "./Reports.module.css";
import { useEffect, useState } from "react";
import { productionService } from "../../services/productionService";
import type { Production } from "../../types/production";

export function Reports() {
  const [productions, setProductions] = useState<Production[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const data = await productionService.getAll();
    setProductions(data);
  }

  const completed = productions.filter(p => p.status === "COMPLETED").length;

  return (
    <div className={styles.container}>
      <h1>Relatórios</h1>
      <p>Total de ordens concluídas: <strong>{completed}</strong></p>
    </div>
  );
}