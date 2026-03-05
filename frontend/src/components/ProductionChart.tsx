// src/components/ProductionChart.tsx
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ProductionOrder } from "../types/productionOrder";

interface Props {
  orders: ProductionOrder[];
}

const ProductionChart: React.FC<Props> = ({ orders }) => {
  // agrupar por modelo
  const data = orders.reduce((acc: { name: string; produced: number }[], o) => {
    const found = acc.find(item => item.name === o.model_id);
    if (found) found.produced += o.quantity_produced;
    else acc.push({ name: o.model_id, produced: o.quantity_produced });
    return acc;
  }, []);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="produced" fill="#4f46e5" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ProductionChart;