import React, { useEffect, useMemo, useState } from "react";
import { ProductionOrderService } from "../services/productionOrderService";
import { ShoeModelService } from "../services/shoeModelService";
import { ProductionOrder } from "../types/productionOrder";
import { ShoeModel } from "../types/shoeModel";
import Card from "../components/Card";
import ProductionChart from "../components/ProductionChart";
import styles from "./Home.module.css";

const Home: React.FC = () => {
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [models, setModels] = useState<ShoeModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ordersData, modelsData] = await Promise.all([
          ProductionOrderService.findAll(),
          ShoeModelService.findAll(),
        ]);

        setOrders(ordersData);
        setModels(modelsData);
      } catch (err) {
        console.error("Erro ao carregar dashboard", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // hoje normalizado
  const todayString = useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);

  const metrics = useMemo(() => {
    let producedToday = 0;
    let inProgress = 0;
    let completed = 0;
    let planned = 0;
    let totalProduced = 0;
    let totalPlannedQty = 0;

    for (const o of orders) {
      // segurança: start_date pode ser null
      const orderDate = o.start_date
        ? new Date(o.start_date).toISOString().split("T")[0]
        : null;

      if (orderDate === todayString) {
        producedToday += o.quantity_produced || 0;
      }

      if (o.status === "IN_PROGRESS") inProgress++;
      if (o.status === "COMPLETED") completed++;
      if (o.status === "PLANNED") planned++;

      totalProduced += o.quantity_produced || 0;
      totalPlannedQty += o.quantity_planned || 0;
    }

    return {
      producedToday,
      inProgress,
      completed,
      planned,
      totalProduced,
      totalPlannedQty,
    };
  }, [orders, todayString]);

  const progressPct = useMemo(() => {
    if (!metrics.totalPlannedQty) return 0;
    return Math.round(
      (metrics.totalProduced / metrics.totalPlannedQty) * 100
    );
  }, [metrics]);

  const dateLabel = useMemo(() => {
    const formatted = new Date().toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }, []);

  if (loading) {
    return <div className={styles.loader}>Carregando indicadores...</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Painel de Controle de Produção</h1>
        <span className={styles.date}>{dateLabel}</span>
      </header>

      {/* CARDS PRINCIPAIS */}
      <div className={styles.statsGrid}>
        <Card title="Produzido Hoje" value={metrics.producedToday} accentColor />
        <Card title="Em Produção" value={metrics.inProgress} accentColor />
        <Card title="Concluídas" value={metrics.completed} accentColor />
        <Card title="Planejadas" value={metrics.planned} accentColor />
      </div>

      {/* CARDS SECUNDÁRIOS */}
      <div className={styles.statsGridSecondary}>
        <Card
          title="Total Produzido"
          value={metrics.totalProduced.toLocaleString("pt-BR")}
          accentColor
        />

        <Card
          title="Meta Total"
          value={metrics.totalPlannedQty.toLocaleString("pt-BR")}
          accentColor
        />

        <Card
          title="Total de Ordens"
          value={orders.length}
          accentColor
        />
      </div>

      {/* PROGRESSO */}
      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>Progresso geral</span>
          <span className={styles.progressPct}>{progressPct}%</span>
        </div>

        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* GRÁFICO */}
      <div className={styles.mainContent}>
        <Card className={styles.chartSection}>
          <h3 className={styles.chartTitle}>Eficiência por Modelo</h3>
          <ProductionChart orders={orders} models={models} />
        </Card>
      </div>
    </div>
  );
};

export default Home;