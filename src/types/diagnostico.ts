export type EstadoRegistro = "Activo" | "Inactivo"

export type DiagnosticoFormData = {
  tipo_cancer: string
  estado_enfermedad: string
  fecha_diagnostico: string // ISO yyyy-mm-dd
  medico_responsable: string
  observaciones: string
  estado_registro: EstadoRegistro
}
/** Lo que devuelve tu API en /pacientes/{id}/diagnosticos */
export type DiagnosticoApiItem = {
  id_diagnostico: number
  tipo_cancer: string
  estadio_enfermedad: string | null
  fecha_diagnostico: string | null
  observaciones: string | null
  medico_responsable: string | null
  estado: string | null
}

export type TratamientoFormData = {
  tipo_tratamiento: string
  unidad_atencion: string
  fecha_inicio: string // ISO
  fecha_fin: string    // ISO
  medicamento: string
  dosis: string
  frecuencia: string
  duracion_dias: number
  observaciones: string
  costo_unitario: number
  costo_total: number
  resultado_clinico: string
}
export type TratamientoApiItem = {
  id_tratamiento: number
  tipo_tratamiento: string
  fecha_inicio: string | null
  fecha_fin: string | null
  resultado_clinico_final: string | null
  observaciones: string | null
  unidad_atencion: {
    id_unidad: number
    nombre_unidad: string
  } | null
}

/** Para editar/mostrar en el UI (normalizado) */
export type TratamientoView = {
  id_tratamiento: number
  tipo_tratamiento: string
  fecha_inicio: string
  fecha_fin: string
  resultado_clinico_final: string
  observaciones: string
  unidad_id: number | null
  unidad_nombre: string
}
