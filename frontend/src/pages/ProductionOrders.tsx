import React, { useState, useEffect, useMemo } from "react";
import { ProductionOrderService } from "../services/productionOrderService";
import { ShoeModelService } from "../services/shoeModelService";
import { ProductionOrder } from "../types/productionOrder";
import { ShoeModel } from "../types/shoeModel";
import { ProductionEngine } from "../core/productionEngine";

import Table from "../components/Table";
import Button from "../components/Button";
import Modal from "../components/Modal";

import styles from "./ProductionOrders.module.css";

const SIZES = [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44];

const initialForm = {
  model_id: "",
  size: 38,
  quantity_planned: 1,
  start_date: new Date().toISOString().split("T")[0],
};

const ProductionOrders: React.FC = () => {
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [models, setModels] = useState<ShoeModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState(initialForm);

  // 📦 CARREGAR DADOS
  useEffect(() => {
    const load = async () => {
      try {
        const [ordersData, modelsData] = await Promise.all([
          ProductionOrderService.findAll(),
          ShoeModelService.findAll(),
        ]);

        setOrders(ordersData);
        setModels(modelsData);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // ⚙️ ENGINE (MÉTRICAS)
  const engine = useMemo(() => {
    return new ProductionEngine(orders, models);
  }, [orders, models]);

  const metrics = engine.getDashboard();

  // 🟢 MODAL
  const handleOpen = () => {
    setForm(initialForm);
    setError("");
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setError("");
  };

  // ➕ CRIAR ORDEM
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.model_id) {
      setError("Selecione um modelo.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const newOrder = await ProductionOrderService.create({
        ...form,
        status: "PLANNED",
        start_date: new Date(form.start_date).toISOString(),
      });

      setOrders((prev) => [newOrder, ...prev]);
      handleClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao criar ordem.");
    } finally {
      setSubmitting(false);
    }
  };

  // 🧠 MODEL NAME
  const getModelName = (model_id: string) => {
    const model = models.find((m) => m.id === model_id);
    return model ? `${model.name} (${model.category})` : model_id;
  };

  return (
    <div className={styles.container}>

      {/* HEADER */}
      <div className={styles.header}>
        <h1>Ordens de Produção</h1>
        <Button onClick={handleOpen}>+ Nova Ordem</Button>
      </div>

      {/* TABLE */}
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <Table
          data={orders}
          columns={[
            { header: "ID", accessor: "id" },
            {
              header: "Modelo",
              accessor: "model_id",
              render: (row: ProductionOrder) => getModelName(row.model_id),
            },
            { header: "Tamanho", accessor: "size" },
            { header: "Planejado", accessor: "quantity_planned" },
            { header: "Produzido", accessor: "quantity_produced" },
            { header: "Status", accessor: "status" },
          ]}
        />
      )}

      {/* MODAL */}
      <Modal isOpen={isModalOpen} onClose={handleClose} title="Nova Ordem">

        <form onSubmit={handleSubmit} className={styles.form}>

          {/* MODELO */}
          <select
            value={form.model_id}
            onChange={(e) =>
              setForm({ ...form, model_id: e.target.value })
            }
            required
          >
            <option value="">Selecione modelo</option>
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          {/* TAMANHO */}
          <select
            value={form.size}
            onChange={(e) =>
              setForm({ ...form, size: Number(e.target.value) })
            }
          >
            {SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* QUANTIDADE */}
          <input
            type="number"
            min={1}
            value={form.quantity_planned}
            onChange={(e) =>
              setForm({
                ...form,
                quantity_planned: Number(e.target.value),
              })
            }
          />

          {/* DATA */}
          <input
            type="date"
            value={form.start_date}
            onChange={(e) =>
              setForm({ ...form, start_date: e.target.value })
            }
          />

          {error && <p className={styles.error}>{error}</p>}

          <Button type="submit" disabled={submitting}>
            {submitting ? "Criando..." : "Criar"}
          </Button>

        </form>
      </Modal>

    </div>
  );
};

export default ProductionOrders;