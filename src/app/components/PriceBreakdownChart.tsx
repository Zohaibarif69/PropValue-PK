import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PriceBreakdownChartProps {
  landCost: number;
  constructionValue: number;
}

const fmt = (value: number) => {
  if (value >= 10_000_000) return `₨${(value / 10_000_000).toFixed(1)}Cr`;
  if (value >= 100_000) return `₨${(value / 100_000).toFixed(1)}L`;
  return `₨${value.toLocaleString()}`;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const COLORS: Record<string, string> = {
    "Land Cost": "#6366f1",
    "Construction": "#10b981",
    "Total Value": "#f59e0b",
  };
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
      {payload.map((p: any) => (
        <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: COLORS[p.name] ?? p.fill, display: "inline-block" }} />
          <span style={{ color: "#6b7280", fontSize: 11, fontWeight: 500 }}>{p.name}:</span>
          <span style={{ color: "#111827", fontSize: 13, fontWeight: 700 }}>{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export function PriceBreakdownChart({ landCost, constructionValue }: PriceBreakdownChartProps) {
  const data = [
    {
      name: "Breakdown",
      "Land Cost": landCost,
      "Construction": constructionValue,
      "Total Value": landCost + constructionValue,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 4, left: 4, bottom: 0 }} barCategoryGap="20%">
        <CartesianGrid strokeDasharray="4 4" stroke="#f0f0f5" vertical={false} />
        <XAxis dataKey="name" hide />
        <YAxis
          tickFormatter={fmt}
          tick={{ fontSize: 11, fill: "#c4c4d0" }}
          axisLine={false}
          tickLine={false}
          width={68}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.04)" }} />
        <Bar dataKey="Land Cost"    fill="#6366f1" radius={[8, 8, 0, 0]} maxBarSize={72} />
        <Bar dataKey="Construction" fill="#10b981" radius={[8, 8, 0, 0]} maxBarSize={72} />
        <Bar dataKey="Total Value"  fill="#f59e0b" radius={[8, 8, 0, 0]} maxBarSize={72} />
      </BarChart>
    </ResponsiveContainer>
  );
}
