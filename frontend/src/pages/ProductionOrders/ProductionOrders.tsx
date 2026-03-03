import { useEffect, useState } from "react";
import styles from "./ProductionOrders.module.css";
import { productionService } from "../../services/productionService";
import type { Production } from "../../types/production";

export function ProductionOrders() {
  const [productions, setProductions] = useState<Production[]>([]);

  useEffect(() => {
    loadProductions();
  }, []);

  async function loadProductions() {
    const data = await productionService.getAll();
    setProductions(data);
  }

  return (
    <div className={styles.container}>
      <h1>Ordens de Produção</h1>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Modelo</th>
            <th>Quantidade</th>
            <th>Status</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {productions.map(prod => (
            <tr key={prod.id}>
              <td>{prod.model}</td>
              <td>{prod.quantity}</td>
              <td>{prod.status}</td>
              <td>{new Date(prod.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}