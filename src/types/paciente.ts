export type Sexo = "Femenino" | "Masculino" | ""
// el backend trae valores no estandarizados (IMSS, ISSSTE, Particular, INSABI, Seguro Popular, etc.)
export type Seguridad = string

export type PacienteMini = {
  foto_url: string
  nombres: string
  apellido_paterno: string
  apellido_materno: string
  sexo: Sexo
  fecha_nacimiento: string // yyyy-mm-dd
  seguridad_social: Seguridad
  seguridad_social_otro?: string
  peso?: string
  talla?: string
  presion_arterial?: string
  frecuencia_cardiaca?: string
  temperatura?: string
  tipo_sangre?: string
}

export type PacienteOption = {
  id: string
  label: string
  data: PacienteMini
}

// === tipos de respuesta del endpoint ===
export type PacienteApiItem = {
  id_paciente: number
  primer_nombre: string
  primer_apellido: string
  segundo_apellido: string | null
  sexo: "F" | "M"
  fecha_nacimiento: string
  tipo_seguridad_social: string
  correo_electronico: string
  celular: string
  municipio: string
  foto_url: string | null
}

export type PacientesApiResponse = {
  items: PacienteApiItem[]
  page: number
  size: number
  total: number
}
