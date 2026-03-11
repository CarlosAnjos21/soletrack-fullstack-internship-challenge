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

  const today = new Date().toDateString();

  // Stats exigidas pelo desafio
  const totalProducedToday = orders
    .filter((o) => new Date(o.created_at).toDateString() === today)
    .reduce((acc, o) => acc + (o.quantity_produced || 0), 0);

  const totalInProgress = orders.filter((o) => o.status === "IN_PROGRESS").length;
  const totalCompleted  = orders.filter((o) => o.status === "COMPLETED").length;
  const totalPlanned    = orders.filter((o) => o.status === "PLANNED").length;

  // Stats extras úteis
  const totalProduced = orders.reduce((acc, o) => acc + (o.quantity_produced || 0), 0);
  const totalPlannedQty = orders.reduce((acc, o) => acc + (o.quantity_planned || 0), 0);

  const now = new Date();
  const dateLabel = now.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (loading) return <div className={styles.loader}>Carregando indicadores...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Painel de Controle de Produção</h1>
        <span className={styles.date}>
          {dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1)}
        </span>
      </header>

      {/* Linha 1 — stats principais do desafio */}
      <div className={styles.statsGrid}>
        <Card
          title="Produzido Hoje"
          value={totalProducedToday.toLocaleString()}
          accentColor
        />
        <Card
          title="Em Produção"
          value={totalInProgress}
          accentColor
        />
        <Card
          title="Concluídas"
          value={totalCompleted}
          accentColor
        />
        <Card
          title="Planejadas"
          value={totalPlanned}
          accentColor
        />
      </div>

      {/* Linha 2 — stats extras */}
      <div className={styles.statsGridSecondary}>
        <Card
          title="Total Produzido"
          value={totalProduced.toLocaleString()}
          accentColor
        />
        <Card
          title="Meta Total"
          value={totalPlannedQty.toLocaleString()}
          accentColor
        />
        <Card
          title="Total de Ordens"
          value={orders.length}
          accentColor
        />
      </div>

      {/* Gráfico */}
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