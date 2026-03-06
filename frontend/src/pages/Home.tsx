// src/pages/Home.tsx
import React, { useEffect, useState } from "react";
import { ProductionOrderService } from "../services/productionOrderService";
import { ProductionOrder } from "../types/productionOrder"; 
import Card from "../components/Card";
import ProductionChart from "../components/ProductionChart";
import styles from "./Home.module.css";

const Home: React.FC = () => {
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await ProductionOrderService.findAll();
        setOrders(data);
      } catch (err) {
        console.error("Erro ao carregar dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const totalPlanned = orders.reduce((acc, curr) => acc + (curr.quantity_planned || 0), 0);
  const totalProduced = orders.reduce((acc, curr) => acc + (curr.quantity_produced || 0), 0);
  
  const plannedOrdersCount = orders.filter(o => o.status === "PLANNED").length;

  if (loading) return <div className={styles.loader}>Carregando indicadores...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Painel de Produção</h1>
      </header>

      <div className={styles.statsGrid}>
        <Card 
          title="Meta de Produção" 
          value={totalPlanned.toLocaleString()} 
          accentColor 
        />
        <Card 
          title="Total Produzido" 
          value={totalProduced.toLocaleString()} 
          accentColor 
        />
        <Card 
          title="Ordens Planejadas" 
          value={plannedOrdersCount} 
          accentColor 
        />
      </div>

      <div className={styles.mainContent}>
        <Card className={styles.chartSection}>
          <h3 className={styles.chartTitle}>Eficiência por Modelo</h3>
          <ProductionChart orders={orders} />
        </Card>
      </div>
    </div>
  );
};

export default Home;