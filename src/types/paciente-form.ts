export type Sexo = "Femenino" | "Masculino" | ""
export type Seguro = "IMSS" | "ISSSTE" | "Privado" | "Otro" | ""

export type PacienteForm = {
  // personales
  nombres: string
  apellido_paterno: string
  apellido_materno: string
  sexo: Sexo
  fecha_nacimiento: string
  // seguridad social
  seguridad_social: Seguro
  seguridad_social_otro: string
  // fechas
  fecha_ingreso: string
  // contacto
  correo: string
  lada: string
  telefono_numero: string
  // ubicación
  direccion: string
  ciudad: string
  // institución (usar SIEMPRE el id del backend)
  id_institucion: number | null
  institucion_nombre: string
  nivel_complejidad: string
  institucion_ciudad: string
  // media
  foto_url: string
  // info médica
  peso?: string
  talla?: string
  presion_arterial?: string
  frecuencia_cardiaca?: string
  temperatura?: string
  tipo_sangre?: string
}

export const INITIAL_PACIENTE_FORM: PacienteForm = {
  nombres: "", apellido_paterno: "", apellido_materno: "",
  sexo: "", fecha_nacimiento: "",
  seguridad_social: "", seguridad_social_otro: "",
  fecha_ingreso: "",
  correo: "",
  lada: "+52", telefono_numero: "",
  direccion: "", ciudad: "",
  id_institucion: null, institucion_nombre: "", nivel_complejidad: "", institucion_ciudad: "",
  foto_url: "",
  peso: "", talla: "", presion_arterial: "", frecuencia_cardiaca: "",
  temperatura: "", tipo_sangre: ""
}
