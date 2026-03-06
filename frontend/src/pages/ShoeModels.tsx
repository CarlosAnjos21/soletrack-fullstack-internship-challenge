// src/pages/ShoeModels.tsx
import React, { useState, useEffect } from "react";
import { ShoeModelService } from "../services/shoeModelService";
import { ShoeModel } from "../types/shoeModel";
import Table from "../components/Table";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";
import styles from "./ShoeModels.module.css";

const ShoeModels: React.FC = () => {
  const [models, setModels] = useState<ShoeModel[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para o formulário
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    base_cost: 0
  });

  const fetchModels = async () => {
    setLoading(true);
    try {
      const data = await ShoeModelService.findAll();
      setModels(data);
    } catch (err) {
      console.error("Erro ao buscar modelos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchModels(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category) return;

    try {
      await ShoeModelService.create(formData);
      setFormData({ name: "", category: "", base_cost: 0 }); // Limpa o form
      fetchModels(); // Atualiza a tabela
    } catch (err) {
      alert("Erro ao salvar modelo. Verifique se você é ADMIN.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Modelos de Calçados</h1>

      <Card className={styles.formCard} accentColor>
        <form onSubmit={handleSave} className={styles.row}>
          <Input 
            label="Nome" 
            value={formData.name} 
            onChange={(v) => setFormData({...formData, name: v})} 
            required 
          />
          <Input 
            label="Categoria" 
            value={formData.category} 
            onChange={(v) => setFormData({...formData, category: v})} 
            required 
          />
          <Input 
            label="Custo Base (R$)" 
            type="number"
            value={formData.base_cost} 
            onChange={(v) => setFormData({...formData, base_cost: Number(v)})} 
            required 
          />
          <Button type="submit" className={styles.btn}>Salvar Modelo</Button>
        </form>
      </Card>

      <Table 
        columns={[
          { header: "Nome", accessor: "name" },
          { header: "Categoria", accessor: "category" },
          { 
            header: "Custo Base", 
            accessor: "base_cost",
            render: (row) => `R$ ${row.base_cost.toFixed(2)}`
          },
          {
            header: "Ações",
            accessor: "id",
            render: (row) => (
              <Button variant="danger" size="sm" onClick={() => {}}>Excluir</Button>
            )
          }
        ]} 
        data={models} 
      />
    </div>
  );
};

export default ShoeModels;