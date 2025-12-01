// src/types/dashboard.ts
import React from "react";

export type SummaryCard = { label: string; value: number }

export type Slice = { name: string; value: number }           // Pie
export type NamedValue = { name: string; cost: number }       // Bar (costos)
export type StockItem = { name: string; stock: number }       // Bar (inventario)

export type AgeGroupCancer = {
  grupo: string;
  Mama: number;
  Prostata: number;
  Pulmon: number;
  Colon: number;
  Otros: number;           // <- asegúrate de incluirlo si lo graficas
}

// Charts types

export type cardProps = {
  title: string;
  status: "actualizado" | "actualizando";
  height?: string | number;
  children: React.ReactNode;
  bg?: string;
}

export type inventarioProps = {
  data: StockItem[]
  xKey?: keyof StockItem
  yKey?: keyof StockItem
  barColor?: string
}

export type treatmentDataProps = {
  data: treatmentCost[]
  xKey?: keyof treatmentCost
  yKey?: keyof treatmentCost
  barColor?: string
  currency?: string // e.g. "MXN", "USD"
  locale?: string   // e.g. "es-MX"
}

export type treatmentCost = {
  name: string;
  cost: number
}


// types api

export type ResumenResponse = {
  pacientes_activos: number
  nuevos_mes: number
  tratamientos_en_curso: number
  altas_mes: number
}
