import React, { useEffect, useState } from "react";
import { ProductionOrder } from "../types/productionOrder";
import { ProductionOrderService } from "../services/productionOrderService";
import Card from "../components/Card";
import ProductionChart from "../components/ProductionChart";
import { Toast } from "../components/Toast";
import styles from "./Home.module.css"; // CSS Module

const Home: React.FC = () => {
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "success" as "success" | "error" });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await ProductionOrderService.findAll();
        setOrders(data);
      } catch {
        setToast({ message: "Erro ao buscar ordens", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const stats = {
    produced: orders.reduce((acc, o) => acc + o.quantity_produced, 0),
    planned: orders.reduce((acc, o) => acc + o.quantity_planned, 0),
    inProgress: orders.filter(o => o.status === "IN_PROGRESS").length,
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard de Produção</h1>

      {loading ? (
        <p style={{ color: "#8B949E" }}>Sincronizando dados da fábrica...</p>
      ) : (
        <>
          <div className={styles.cardsGrid}>
            <Card className={styles.statCard}>
              <h3>Total Produzido</h3>
              <p>{stats.produced}</p>
            </Card>
            <Card className={styles.statCard}>
              <h3>Total Planejado</h3>
              <p>{stats.planned}</p>
            </Card>
            <Card className={styles.statCard}>
              <h3>Ordens Ativas</h3>
              <p>{stats.inProgress}</p>
            </Card>
          </div>

          <Card className={styles.chartSection}>
            <h3>Produção por Modelo</h3>
            <ProductionChart orders={orders} />
          </Card>
        </>
      )}

      {toast.message && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default Home;