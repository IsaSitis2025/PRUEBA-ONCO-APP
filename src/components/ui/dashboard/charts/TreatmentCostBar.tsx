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
import type {treatmentDataProps} from "../../../../types/dashboard.ts";




/** Barra de costos por tratamiento con formato de moneda compacta */
export default function TreatmentCostBar({
                                           data,
                                           xKey = "name",
                                           yKey = "cost",
                                           barColor = CHART_COLORS[1],
                                           currency = "MXN",
                                           locale = "es-MX",
                                         }: treatmentDataProps) {
  const fmt = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  })

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey as string} />
        <YAxis tickFormatter={(v) => fmt.format(Number(v))} />
        <Tooltip
          formatter={(value: any) => fmt.format(Number(value))}
          contentStyle={{ background: "#fff", border: "1px solid #E2E8F0" }}
        />
        <Legend />
        <Bar dataKey={yKey as string} fill={barColor} />
      </BarChart>
    </ResponsiveContainer>
  )
}
