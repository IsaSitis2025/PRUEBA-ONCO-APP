export type ActividadApi = {
  id_actividad: number
  tipo_actividad: string
  fecha_actividad: string | null
  nombre_procedimiento: string | null
  id_unidad: number | null
  medico_responsable: string | null
  observaciones: string | null
  resultado_clinico: string | null
  archivo: string | null
}

export type Actividad = {
  id: number
  tipo: string
  fecha: string
  procedimiento: string
  id_unidad: number | null
  unidad_nombre: string // llenamos por lookup
  medico: string
  observaciones: string
  resultado: string
  archivo: string | null
}
