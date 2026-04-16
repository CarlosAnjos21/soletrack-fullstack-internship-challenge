import React, { useEffect, useState } from "react";
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
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [models, setModels] = useState<ShoeModel[]>([]);

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState(initialForm);

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
        console.error("Erro ao carregar dados", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const openModal = () => {
    setForm(initialForm);
    setError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError("");
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.model_id) {
      setError("Selecione um modelo");
      return;
    }

    setSubmitting(true);

    try {
      const newOrder = await ProductionOrderService.create({
        ...form,
        status: "PLANNED",
        start_date: new Date(form.start_date).toISOString(),
      });

      setOrders((prev) => [newOrder, ...prev]);
      closeModal();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao criar ordem");
    } finally {
      setSubmitting(false);
    }
  };

  const getModelName = (id: string) => {
    const model = models.find((m) => m.id === id);
    return model ? `${model.name} (${model.category})` : id;
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Ordens de Produção</h1>
        <Button onClick={openModal}>Nova Ordem</Button>
      </div>

      <Table
        data={orders}
        columns={[
          { header: "ID", accessor: "id" },
          {
            header: "Modelo",
            accessor: "model_id",
            render: (row) => getModelName(row.model_id),
          },
          { header: "Tamanho", accessor: "size" },
          { header: "Planejado", accessor: "quantity_planned" },
          { header: "Produzido", accessor: "quantity_produced" },
          { header: "Status", accessor: "status" },
        ]}
      />

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Nova Ordem">
        <form onSubmit={handleCreate} className={styles.form}>
          <select
            value={form.model_id}
            onChange={(e) =>
              setForm({ ...form, model_id: e.target.value })
            }
          >
            <option value="">Selecione modelo</option>
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

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

          <input
            type="number"
            value={form.quantity_planned}
            onChange={(e) =>
              setForm({
                ...form,
                quantity_planned: Number(e.target.value),
              })
            }
          />

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