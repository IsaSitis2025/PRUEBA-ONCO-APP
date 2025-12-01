// ===== Tipos crudos de API =====
export type ApiTipoCancer = { tipo_cancer: string }
export type ApiEstadoEnfermedad = { estado: string }
export type ApiTipoTratamiento = { tipo_tratamiento: string }

export type ApiUnidad = {
  id_unidad: number
  nombre_unidad: string
}

export type ApiInstitucion = {
  id_institucion: number
  nombre_institucion: string
  nivel_complejidad: string
  ciudad: string
}

// ===== Modelos para UI =====
export type Opcion = { value: string | number; label: string }

export type Unidad = {
  id: number
  nombre: string
}

export type Institucion = {
  id: number
  nombre: string
  nivel: string
  ciudad: string
}
