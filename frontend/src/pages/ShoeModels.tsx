import React, { useEffect, useState } from "react";
import { ShoeModel } from "../types/shoeModel";
import { ShoeModelService } from "../services/shoeModelService";
import Table from "../components/Table";
import Button from "../components/Button";
import Input from "../components/Input";
import { Toast } from "../components/Toast";
import styles from "./ShoeModels.module.css";

const ShoeModels: React.FC = () => {
  const [models, setModels] = useState<ShoeModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newCost, setNewCost] = useState<string>("0");
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const fetchModels = async () => {
    setLoading(true);
    try {
      const data = await ShoeModelService.findAll();
      setModels(data);
    } catch (err: any) {
      setToastMessage(err?.message || "Erro ao buscar modelos");
      setToastType("error");
    } finally {
      setLoading(false);
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  useEffect(() => { fetchModels(); }, []);

  const handleCreate = async () => {
    try {
      await ShoeModelService.create({ name: newName, category: newCategory, base_cost: Number(newCost) });
      setNewName(""); setNewCategory(""); setNewCost("0");
      setToastMessage("Modelo criado com sucesso!");
      setToastType("success");
      fetchModels();
    } catch (err: any) {
      setToastMessage(err?.message || "Erro ao criar modelo");
      setToastType("error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Deseja realmente deletar este modelo?")) return;
    try {
      await ShoeModelService.delete(id);
      setToastMessage("Modelo deletado com sucesso!");
      setToastType("success");
      fetchModels();
    } catch (err: any) {
      setToastMessage(err?.message || "Erro ao deletar modelo");
      setToastType("error");
    }
  };

  if (loading) return <p>Carregando modelos...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Modelos de Sapato</h1>
      <div className={styles.formRow}>
        <Input placeholder="Nome" value={newName} onChange={setNewName} />
        <Input placeholder="Categoria" value={newCategory} onChange={setNewCategory} />
        <Input type="number" placeholder="Custo Base" value={newCost} onChange={setNewCost} />
        <Button onClick={handleCreate}>Adicionar Modelo</Button>
      </div>
      <Table
        columns={[
          { header: "Nome", accessor: "name" },
          { header: "Categoria", accessor: "category" },
          { header: "Custo Base", accessor: "base_cost" },
          { header: "Ações", accessor: "actions" },
        ]}
        data={models.map(m => ({
          ...m,
          actions: <Button danger onClick={() => handleDelete(m.id)}>Deletar</Button>,
        }))}
      />
      {toastMessage && <Toast message={toastMessage} type={toastType} />}
    </div>
  );
};

export default ShoeModels;