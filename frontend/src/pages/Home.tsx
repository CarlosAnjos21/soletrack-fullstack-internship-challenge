import React, { useEffect, useMemo, useState } from "react";
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

  // 📅 data de hoje (fixa por render)
  const todayString = useMemo(() => {
    return new Date().toDateString();
  }, []);

  // 📊 métricas centralizadas (melhor performance + leitura)
  const metrics = useMemo(() => {
    let producedToday = 0;
    let inProgress = 0;
    let completed = 0;
    let planned = 0;
    let totalProduced = 0;
    let totalPlannedQty = 0;

    for (const o of orders) {
      const isToday =
        new Date(o.created_at).toDateString() === todayString;

      if (isToday) {
        producedToday += o.quantity_produced || 0;
      }

      switch (o.status) {
        case "IN_PROGRESS":
          inProgress++;
          break;
        case "COMPLETED":
          completed++;
          break;
        case "PLANNED":
          planned++;
          break;
      }

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

  // 📅 label da data
  const dateLabel = useMemo(() => {
    const now = new Date();

    const formatted = now.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }, []);

  if (loading) {
    return (
      <div className={styles.loader}>
        Carregando indicadores...
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <header className={styles.header}>
        <h1 className={styles.title}>
          Painel de Controle de Produção
        </h1>
        <span className={styles.date}>{dateLabel}</span>
      </header>

      {/* PRINCIPAL */}
      <div className={styles.statsGrid}>
        <Card title="Produzido Hoje" value={metrics.producedToday} accentColor />
        <Card title="Em Produção" value={metrics.inProgress} accentColor />
        <Card title="Concluídas" value={metrics.completed} accentColor />
        <Card title="Planejadas" value={metrics.planned} accentColor />
      </div>

      {/* SECUNDÁRIO */}
      <div className={styles.statsGridSecondary}>
        <Card
          title="Total Produzido"
          value={metrics.totalProduced.toLocaleString()}
          accentColor
        />

        <Card
          title="Meta Total"
          value={metrics.totalPlannedQty.toLocaleString()}
          accentColor
        />

        <Card
          title="Total de Ordens"
          value={orders.length}
          accentColor
        />
      </div>

      {/* GRÁFICO */}
      <div className={styles.mainContent}>
        <Card className={styles.chartSection}>
          <h3 className={styles.chartTitle}>
            Eficiência por Modelo
          </h3>
          <ProductionChart orders={orders} />
        </Card>
      </div>
    </div>
  );
};

export default Home;