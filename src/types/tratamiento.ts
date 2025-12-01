// Unidad de atención tal como llega desde la API
export type UnidadAtencionApi = {
  id_unidad: number
  nombre_unidad: string
}

// Unidad de atención normalizada para UI
export type UnidadAtencion = {
  id_unidad: number
  nombre_unidad: string
}

// ----------------- TRATAMIENTOS -----------------

// Shape que devuelve /api/v1/diagnosticos/{id}/tratamientos
export type TratamientoApi = {
  id_tratamiento: number
  tipo_tratamiento: string
  fecha_inicio: string | null
  fecha_fin: string | null
  resultado_clinico_final: string | null
  observaciones: string | null
  unidad_atencion: UnidadAtencionApi | null
}

// Shape normalizado para UI (sin nulls en strings)
export type Tratamiento = {
  id_tratamiento: number
  tipo_tratamiento: string
  fecha_inicio: string
  fecha_fin: string
  resultado_clinico_final: string
  observaciones: string
  unidad_atencion?: UnidadAtencion // opcional si no viene
}

// Utilidad para limpiar strings con comillas/corchetes sueltos
const clean = (s: unknown): string => {
  if (typeof s !== "string") return s == null ? "" : String(s)
  return s.replace(/^[\s"'[\]]+|[\s"'\]]+$/g, "").trim()
}

/** Normaliza un tratamiento de API → UI */
export function normalizeTratamiento(api: TratamientoApi): Tratamiento {
  return {
    id_tratamiento: api.id_tratamiento,
    tipo_tratamiento: clean(api.tipo_tratamiento),
    fecha_inicio: clean(api.fecha_inicio),
    fecha_fin: clean(api.fecha_fin),
    resultado_clinico_final: clean(api.resultado_clinico_final),
    observaciones: clean(api.observaciones),
    ...(api.unidad_atencion
      ? {
        unidad_atencion: {
          id_unidad: api.unidad_atencion.id_unidad,
          nombre_unidad: clean(api.unidad_atencion.nombre_unidad),
        } as UnidadAtencion,
      }
      : {}),
  }
}

/** Normaliza una lista completa de tratamientos */
export function normalizeTratamientos(list: TratamientoApi[]): Tratamiento[] {
  return (list ?? []).map(normalizeTratamiento)
}

