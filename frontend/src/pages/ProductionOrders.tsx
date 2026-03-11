// src/pages/ProductionOrders.tsx
import React, { useState, useEffect } from "react";
import { ProductionOrderService } from "../services/productionOrderService";
import { ShoeModelService } from "../services/shoeModelService";
import { ProductionOrder } from "../types/productionOrder";
import { ShoeModel } from "../types/shoeModel";
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
  const [orders, setOrders]         = useState<ProductionOrder[]>([]);
  const [models, setModels]         = useState<ShoeModel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm]             = useState(initialForm);
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState("");

  // Carrega ordens e modelos
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

  const handleOpen = () => {
    setForm(initialForm);
    setError("");
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setError("");
  };

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

  // Resolve nome do modelo pelo id
  const getModelName = (model_id: string) => {
    const model = models.find((m) => m.id === model_id);
    return model ? `${model.name} (${model.category})` : model_id;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Ordens de Produção</h1>
        <Button onClick={handleOpen}>+ Nova Ordem</Button>
      </div>

      {loading ? (
        <p className={styles.loading}>Carregando ordens...</p>
      ) : (
        <Table
          columns={[
            { header: "ID Ordem",  accessor: "id" },
            {
              header: "Modelo",
              accessor: "model_id",
              render: (row: ProductionOrder) => getModelName(row.model_id),
            },
            { header: "Tamanho",  accessor: "size" },
            { header: "Planejado", accessor: "quantity_planned" },
            { header: "Produzido", accessor: "quantity_produced" },
            {
              header: "Status",
              accessor: "status",
              render: (row: ProductionOrder) => (
                <span
                  className={`${styles.statusBadge} ${
                    styles[row.status.toLowerCase()]
                  }`}
                >
                  {row.status}
                </span>
              ),
            },
          ]}
          data={orders}
        />
      )}

      {/* ── Modal de nova ordem ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title="Cadastrar Nova Ordem"
      >
        <form onSubmit={handleSubmit} className={styles.form}>

          {/* Modelo */}
          <div className={styles.field}>
            <label className={styles.label}>Modelo de Sapato</label>
            <select
              className={styles.select}
              value={form.model_id}
              onChange={(e) => setForm({ ...form, model_id: e.target.value })}
              required
            >
              <option value="">Selecione um modelo...</option>
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.id} — {m.name} ({m.category})
                </option>
              ))}
            </select>
          </div>

          {/* Tamanho */}
          <div className={styles.field}>
            <label className={styles.label}>Tamanho</label>
            <select
              className={styles.select}
              value={form.size}
              onChange={(e) =>
                setForm({ ...form, size: Number(e.target.value) })
              }
              required
            >
              {SIZES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Quantidade planejada */}
          <div className={styles.field}>
            <label className={styles.label}>Quantidade Planejada</label>
            <input
              className={styles.input}
              type="number"
              min={1}
              value={form.quantity_planned}
              onChange={(e) =>
                setForm({ ...form, quantity_planned: Number(e.target.value) })
              }
              required
            />
          </div>

          {/* Data de início */}
          <div className={styles.field}>
            <label className={styles.label}>Data de Início</label>
            <input
              className={styles.input}
              type="date"
              value={form.start_date}
              onChange={(e) =>
                setForm({ ...form, start_date: e.target.value })
              }
              required
            />
          </div>

          {error && <div className={styles.error}>⚠ {error}</div>}

          <div className={styles.actions}>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Criando..." : "Criar Ordem"}
            </Button>
            <Button variant="outline" type="button" onClick={handleClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductionOrders;