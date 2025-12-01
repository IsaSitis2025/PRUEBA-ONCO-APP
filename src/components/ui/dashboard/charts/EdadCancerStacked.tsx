// src/components/charts/EdadCancerStacked.tsx
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import {CHART_COLORS} from "./charts.ts";
import type {AgeGroupCancer} from "../../../../types/dashboard.ts";


export default function EdadCancerStacked({ data }: { data: AgeGroupCancer[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} stackOffset="expand">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="grupo" />
        <YAxis tickFormatter={(v) => `${Math.round(v * 100)}%`} /> {/* ok porque expand normaliza */}
        <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E8F0" }} />
        <Legend />
        <Bar dataKey="Mama"     stackId="a" fill={CHART_COLORS[0]} />
        <Bar dataKey="Prostata" stackId="a" fill={CHART_COLORS[1]} />
        <Bar dataKey="Pulmon"   stackId="a" fill={CHART_COLORS[2]} />
        <Bar dataKey="Colon"    stackId="a" fill={CHART_COLORS[3]} />
        <Bar dataKey="Otros"    stackId="a" fill={CHART_COLORS[4]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
