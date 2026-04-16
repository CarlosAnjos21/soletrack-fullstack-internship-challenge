import React, { useEffect, useState } from "react";
import { ProductionOrderService } from "../services/productionOrderService";
import { ShoeModelService } from "../services/shoeModelService";
import { ProductionOrder, OrderStatus } from "../types/productionOrder";
import { ShoeModel } from "../types/shoeModel";
import Table from "../components/Table";
import Button from "../components/Button";
import Modal from "../components/Modal";
import styles from "./ProductionOrders.module.css";

const STATUS_LABELS: Record<OrderStatus, string> = {
  PLANNED: "Planejada",
  IN_PROGRESS: "Em Produção",
  COMPLETED: "Concluída",
};

const ProductionOrders: React.FC = () => {
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [models, setModels] = useState<ShoeModel[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState<ProductionOrder | null>(
    null,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [qtyToAdd, setQtyToAdd] = useState(1);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [o, m] = await Promise.all([
        ProductionOrderService.findAll(),
        ShoeModelService.findAll(),
      ]);

      setOrders(o);
      setModels(m);
    } finally {
      setLoading(false);
    }
  };

  // --- ações ---
  const handleStart = async (id: string) => {
    const updated = await ProductionOrderService.updateStatus(
      id,
      "IN_PROGRESS",
    );
    refreshOrder(updated);
  };

  const handleAddPairs = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const updated = await ProductionOrderService.updateProduced(
      selectedOrder.id,
      qtyToAdd,
    );

    refreshOrder(updated);
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleReset = async (id: string) => {
    if (confirm("Zerar produção e voltar para planejamento?")) {
      const updated = await ProductionOrderService.resetProduction(id);
      refreshOrder(updated);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Excluir definitivamente?")) {
      await ProductionOrderService.delete(id);

      setOrders((prev) => prev.filter((o) => o.id !== id));
    }
  };

  const refreshOrder = (updated: ProductionOrder) => {
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  };

  const getModelName = (id: string) =>
    models.find((m) => m.id === id)?.name || "N/A";

  if (loading) return <p>Carregando...</p>;

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 15,
        }}
      >
        <h1>Ordens de Produção</h1>

        <Button
          size="sm"
          color="green"
          onClick={() => setIsCreateModalOpen(true)}
        >
          + Nova Ordem
        </Button>
      </div>

      {/* TABLE */}
      <Table
        data={orders}
        columns={[
          { header: "Modelo", render: (row) => getModelName(row.model_id) },
          { header: "Tam.", accessor: "size" },
          { header: "Planejado", accessor: "quantity_planned" },
          {
            header: "Produzido",
            render: (row) => {
              const restante = row.quantity_planned - row.quantity_produced;

              return (
                <div>
                  <strong>
                    {row.quantity_produced} / {row.quantity_planned}
                  </strong>
                  <div
                    style={{
                      fontSize: 11,
                      color: restante > 0 ? "orange" : "green",
                    }}
                  >
                    {restante > 0
                      ? `Faltam ${restante} pares`
                      : "Meta atingida!"}
                  </div>
                </div>
              );
            },
          },
          { header: "Status", render: (row) => STATUS_LABELS[row.status] },
          {
            header: "Ações",
            render: (row: ProductionOrder) => (
              <div style={{ display: "flex", gap: 5 }}>
                {row.status === "PLANNED" && (
                  <Button
                    size="sm"
                    color="green"
                    onClick={() => handleStart(row.id)}
                  >
                    Começar
                  </Button>
                )}

                {row.status !== "COMPLETED" && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedOrder(row);
                      setIsModalOpen(true);
                      setQtyToAdd(1);
                    }}
                  >
                    + Pares
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReset(row.id)}
                >
                  Reiniciar
                </Button>

                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(row.id)}
                >
                  Excluir
                </Button>
              </div>
            ),
          },
        ]}
      />

      {/* MODAL ADD PARES */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
        title="Adicionar Pares Feitos"
      >
        <form onSubmit={handleAddPairs}>
          <p>Quantos pares foram finalizados agora?</p>

          <input
            type="number"
            value={qtyToAdd}
            onChange={(e) => setQtyToAdd(Number(e.target.value))}
            min="1"
            max={
              selectedOrder
                ? selectedOrder.quantity_planned -
                  selectedOrder.quantity_produced
                : 999
            }
            style={{ width: "100%", padding: 8, marginBottom: 10 }}
          />

          <Button type="submit">Confirmar Produção</Button>
        </form>
      </Modal>

      {/* MODAL CREATE */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Nova Ordem de Produção"
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            const form = new FormData(e.currentTarget);

            const payload = {
              model_id: String(form.get("model_id")),
              size: Number(form.get("size")),
              quantity_planned: Number(form.get("quantity_planned")),
            };

            await ProductionOrderService.create(payload);
            await loadAll();

            setIsCreateModalOpen(false);
            (e.target as HTMLFormElement).reset(); // ✔ limpa form
          }}
        >
          <select
            name="model_id"
            required
            style={{ width: "100%", marginBottom: 10 }}
          >
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          <select
            name="size"
            required
            style={{ width: "100%", marginBottom: 10 }}
            defaultValue=""
          >
            <option value="" disabled>
              Selecione o tamanho
            </option>

            {Array.from({ length: 12 }, (_, i) => 33 + i).map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <input
            name="quantity_planned"
            type="number"
            placeholder="Quantidade planejada"
            required
            style={{ width: "100%", marginBottom: 10 }}
          />

          <Button type="submit">Criar Ordem</Button>
        </form>
      </Modal>
    </div>
  );
};

export default ProductionOrders;
