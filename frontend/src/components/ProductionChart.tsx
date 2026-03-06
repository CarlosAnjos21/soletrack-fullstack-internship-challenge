import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ProductionOrder } from "../types/productionOrder";

interface Props {
  orders: ProductionOrder[];
}

const ProductionChart: React.FC<Props> = ({ orders }) => {
  const data = orders.reduce((acc: any[], o) => {
    const found = acc.find((item) => item.name === o.model_id);
    if (found) found.produced += o.quantity_produced;
    else acc.push({ name: o.model_id, produced: o.quantity_produced });
    return acc;
  }, []);

  return (
    <div style={{ width: "100%", height: 300, paddingTop: "20px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f1f5f9"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: "#f8fafc" }}
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
            }}
          />
          <Bar
            dataKey="produced"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductionChart;
