// src/data/dashboard.ts
import type {SummaryCard, Slice, NamedValue, StockItem, AgeGroupCancer} from "../../types/dashboard.ts";

export const summaryCards: SummaryCard[] = [
  { label: "Pacientes activos", value: 10842 },
  { label: "Nuevos este mes", value: 427 },
  { label: "Tratamientos en curso", value: 9916 },
  { label: "Altas este mes", value: 312 },
]

export const cancerTypes: Slice[] = [
  { name: "Mama", value: 3058 },
  { name: "Prostata", value: 3614 },     // <-- sin acentos, consistente con keys
  { name: "Pulmon", value: 741 },
  { name: "Colon", value: 2873 },
  { name: "Otros", value: 556 },
]

export const treatmentCosts: NamedValue[] = [
  { name: "Quimio", cost: 31738477 },
  { name: "Radio", cost: 42489059 },
  { name: "Inmuno", cost: 29805151 },
  { name: "Cirugia", cost: 20669780 },   // sin acento para consistencia
]

export const inventarioMedicamentos: StockItem[] = [
  { name: "Cisplatino", stock: 37208 },
  { name: "Paclitaxel", stock: 8378 },
  { name: "Pembrolizumab", stock: 29076 },
  { name: "Carboplatino", stock: 18234 },
  { name: "Bevacizumab", stock: 45093 },
]

// porcentajes por grupo de edad (valores crudos; el stack expand los normaliza)
export const edadCancerPct: AgeGroupCancer[] = [
  { grupo: "18-39", Mama: 28.3, Prostata: 26.42, Pulmon: 16.98, Colon: 28.3,  Otros: 0 },
  { grupo: "40-59", Mama: 34.09, Prostata: 11.36, Pulmon: 20.45, Colon: 34.09, Otros: 0 },
  { grupo: "60-79", Mama: 16.67, Prostata: 18.33, Pulmon: 31.67, Colon: 33.33, Otros: 0 },
  { grupo: "80+",   Mama: 31.34, Prostata: 26.87, Pulmon: 22.39, Colon: 19.4,  Otros: 0 },
]

