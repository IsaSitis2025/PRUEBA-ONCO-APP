import {http} from "../http.ts";
import type {AgeGroupCancer,StockItem, ResumenResponse, Slice, treatmentCost} from "../../types/dashboard.ts";


// Sanitiza un número que viene como string (ej. "5,120" o "5 120")
function toNumberSafe(v: unknown): number {
  if (typeof v === "number") return v
  if (typeof v === "string") {
    const cleaned = v.replace(/[^\d.-]/g, "") // quita comas, espacios, $ etc.
    const n = Number(cleaned)
    return Number.isFinite(n) ? n : 0
  }
  return 0
}


// 1) Resumen
export async function fetchResumen(): Promise<ResumenResponse> {
  const { data } = await http.get<ResumenResponse>("/api/v1/reportes/resumen")
  return data
}

// 2) Tipos de cáncer (Pie)
export async function fetchCancerTipos(): Promise<Slice[]> {
  const { data } = await http.get<Slice[]>("/api/v1/reportes/cancer-tipos")
  // data ya viene { name, value }
  return data.map(d => ({ name: d.name, value: toNumberSafe(d.value) }))
}

// 3) Costos por tratamiento (Bar)
export async function fetchCostosTratamiento(): Promise<treatmentCost[]> {
  const { data } = await http.get<Array<{ name: string; cost: string | number }>>(
    "/api/v1/reportes/costos-tratamiento"
  )
  return data.map(item => ({ name: item.name, cost: toNumberSafe(item.cost) }))
}

// 4) Inventario (Bar)
export async function fetchInventario(): Promise<StockItem[]> {
  const { data } = await http.get<Array<{ name: string; stock: string | number }>>(
    "/api/v1/reportes/inventario"
  )
  return data.map(it => ({ name: it.name, stock: toNumberSafe(it.stock) }))
}

// 5) Edad y relación con cáncer (Stacked)
const EDAD_ENDPOINT = "/api/v1/reportes/edad-por-cancer"

export async function fetchEdadCancer(): Promise<AgeGroupCancer[]> {
  const { data } = await http.get<Array<{
    grupo: string
    Mama: string | number
    Prostata: string | number
    Pulmon: string | number
    Colon: string | number
    total?: string | number
    Otros?: string | number
  }>>(EDAD_ENDPOINT)

  return data.map(row => {
    const Mama = toNumberSafe(row.Mama)
    const Prostata = toNumberSafe(row.Prostata)
    const Pulmon = toNumberSafe(row.Pulmon)
    const Colon = toNumberSafe(row.Colon)
    // Si el backend no manda "Otros", lo calculamos como el faltante hasta 100
    const total = toNumberSafe(row.total) || (Mama + Prostata + Pulmon + Colon)
    let Otros = toNumberSafe((row as any).Otros)
    if (!Otros && total > 0) {
      const faltante = 100 - (Mama + Prostata + Pulmon + Colon)
      Otros = Math.max(0, Number.isFinite(faltante) ? faltante : 0)
    }
    return {
      grupo: row.grupo,
      Mama, Prostata, Pulmon, Colon, Otros,
      total
    }
  })
}
