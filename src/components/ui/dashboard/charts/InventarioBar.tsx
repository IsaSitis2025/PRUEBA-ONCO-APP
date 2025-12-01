import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import {CHART_COLORS} from "./charts.ts";
import type {inventarioProps} from "../../../../types/dashboard.ts";

export type StockItem = { name: string; stock: number }

/** Barra simple para inventario de medicamentos */
export default function InventarioBar({
                                        data,
                                        xKey = "name",
                                        yKey = "stock",
                                        barColor = CHART_COLORS[2],
                                      }: inventarioProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey as string} />
        <YAxis />
        <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E8F0" }} />
        <Legend />
        <Bar dataKey={yKey as string} fill={barColor} />
      </BarChart>
    </ResponsiveContainer>
  )
}
