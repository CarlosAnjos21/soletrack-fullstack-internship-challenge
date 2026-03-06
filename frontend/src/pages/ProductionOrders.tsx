// src/pages/ProductionOrders.tsx
import React, { useState, useEffect } from "react";
import { ProductionOrderService } from "../services/productionOrderService";
import { ProductionOrder } from "../types/productionOrder"; // Importe a interface aqui
import Table from "../components/Table";
import Button from "../components/Button";
import Modal from "../components/Modal";
import styles from "./ProductionOrders.module.css";

const ProductionOrders: React.FC = () => {
  // 🔍 Adicionamos a tipagem no useState
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await ProductionOrderService.findAll();
        setOrders(data);
      } catch (error) {
        console.error("Erro ao buscar ordens:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Ordens de Produção</h1>
        <Button onClick={() => setIsModalOpen(true)}>+ Nova Ordem</Button>
      </div>

      {loading ? (
        <p>Carregando ordens...</p>
      ) : (
        <Table 
          columns={[
            { header: "ID", accessor: "id" },
            { header: "Modelo", accessor: "model_id" },
            { header: "Tamanho", accessor: "size" },
            { 
              header: "Planejado", 
              accessor: "quantity_planned" // Ajustado para bater com sua interface
            },
            { 
              header: "Produzido", 
              accessor: "quantity_produced" 
            },
            { 
              header: "Status", 
              accessor: "status", 
              render: (row: ProductionOrder) => (
                <span className={`${styles.statusBadge} ${styles[row.status.toLowerCase()]}`}>
                  {row.status}
                </span>
              )
            },
          ]}
          data={orders}
        />
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Cadastrar Nova Ordem"
      >
        {/* Aqui você pode futuramente inserir o formulário */}
        <p>Formulário de cadastro em desenvolvimento...</p>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
             <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
        </div>
      </Modal>
    </div>
  );
};

export default ProductionOrders;