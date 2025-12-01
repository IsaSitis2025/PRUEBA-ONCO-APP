// src/components/charts/CancerTypesPie.tsx
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts"
import type {Slice} from "../../../../types/dashboard.ts";
import {CHART_COLORS} from "./charts.ts";


export default function CancerTypesPie({ data }: { data: Slice[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={90} label>
          {data.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
        </Pie>
        <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E8F0" }} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
