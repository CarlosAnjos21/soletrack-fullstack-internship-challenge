import React, { useEffect, useState } from "react";
import { ProductionOrder } from "../types/productionOrder";
import { ProductionOrderService } from "../services/productionOrderService";
import Table from "../components/Table";
import Button from "../components/Button";
import { Toast } from "../components/Toast";
import styles from "./ProductionOrders.module.css";

const ProductionOrders: React.FC = () => {
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await ProductionOrderService.findAll();
      setOrders(data);
    } catch (err: any) {
      setToastMessage(err?.message || "Erro ao buscar ordens");
      setToastType("error");
    } finally {
      setLoading(false);
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Deseja realmente deletar esta ordem?")) return;
    try {
      await ProductionOrderService.delete(id);
      setToastMessage("Ordem deletada com sucesso!");
      setToastType("success");
      fetchOrders();
    } catch (err: any) {
      setToastMessage(err?.message || "Erro ao deletar ordem");
      setToastType("error");
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  if (loading) return <p>Carregando ordens...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Ordens de Produção</h1>
      <Table
        columns={[
          { header: "Modelo", accessor: "model_id" },
          { header: "Tamanho", accessor: "size" },
          { header: "Planejado", accessor: "quantity_planned" },
          { header: "Produzido", accessor: "quantity_produced" },
          { header: "Status", accessor: "status" },
          { header: "Ações", accessor: "actions" },
        ]}
        data={orders.map(o => ({
          ...o,
          actions: <Button danger onClick={() => handleDelete(o.id)}>Deletar</Button>,
        }))}
      />
      {toastMessage && <Toast message={toastMessage} type={toastType} />}
    </div>
  );
};

export default ProductionOrders;