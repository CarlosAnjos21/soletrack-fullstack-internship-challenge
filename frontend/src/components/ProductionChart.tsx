import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { ProductionOrder } from "../types/productionOrder";
import { ShoeModel } from "../types/shoeModel";

interface Props {
  orders: ProductionOrder[];
  models: ShoeModel[];
}

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f97316",
  "#a855f7",
  "#14b8a6",
  "#6366f1",
  "#f43f5e",
];

type ChartData = {
  model_id: string;
  name: string;
  produced: number;
  planned: number;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  const produced = payload.find((p: any) => p.dataKey === "produced");
  const planned = payload.find((p: any) => p.dataKey === "planned");

  return (
    <div
      style={{
        background: "var(--bg-card, #fff)",
        border: "1px solid var(--border, #e2e8f0)",
        borderRadius: 10,
        padding: "10px 16px",
        fontSize: 13,
        color: "var(--text-main, #1e293b)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      }}
    >
      <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>

      <p style={{ color: "#3b82f6" }}>
        Produzido: <strong>{produced?.value ?? 0}</strong>
      </p>

      <p style={{ color: "#94a3b8" }}>
        Planejado: <strong>{planned?.value ?? 0}</strong>
      </p>
    </div>
  );
};

const ProductionChart: React.FC<Props> = ({ orders, models }) => {
  const data: ChartData[] = useMemo(() => {
    const map = new Map<string, ChartData>();

    for (const o of orders) {
      const model = models.find((m) => m.id === o.model_id);

      const name =
        model?.name ?? `Modelo ${o.model_id?.slice?.(0, 6) ?? "N/A"}`;

      const existing = map.get(o.model_id);

      if (existing) {
        existing.produced += o.quantity_produced ?? 0;
        existing.planned += o.quantity_planned ?? 0;
      } else {
        map.set(o.model_id, {
          model_id: o.model_id,
          name,
          produced: o.quantity_produced ?? 0,
          planned: o.quantity_planned ?? 0,
        });
      }
    }

    return Array.from(map.values());
  }, [orders, models]);

  if (!data.length) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "3rem",
          color: "var(--text-light, #94a3b8)",
          fontSize: 14,
        }}
      >
        Nenhuma ordem para exibir
      </div>
    );
  }

  return (
    <div style={{ width: "100%", paddingTop: 8 }}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="var(--border, #f1f5f9)"
          />

          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--text-light, #64748b)", fontSize: 12 }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--text-light, #64748b)", fontSize: 12 }}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)" }} />

          {/* Planejado */}
          <Bar
            dataKey="planned"
            fill="#e2e8f0"
            radius={[4, 4, 0, 0]}
            barSize={32}
            name="Planejado"
          />

          {/* Produzido */}
          <Bar
            dataKey="produced"
            radius={[4, 4, 0, 0]}
            barSize={32}
            name="Produzido"
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* legenda */}
      <div
        style={{
          display: "flex",
          gap: 20,
          justifyContent: "center",
          marginTop: 12,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
          <span style={{ width: 12, height: 12, borderRadius: 2, background: "#e2e8f0" }} />
          Planejado
        </span>

        <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
          <span style={{ width: 12, height: 12, borderRadius: 2, background: "#3b82f6" }} />
          Produzido
        </span>
      </div>
    </div>
  );
};

export default ProductionChart;
