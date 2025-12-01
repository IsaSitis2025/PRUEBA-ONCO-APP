import {http} from "../http.ts"
import type {PacienteApiItem, PacienteMini, PacienteOption, PacientesApiResponse, Sexo} from "../../types/paciente.ts";
import {synthesizeVitals} from "../../utils/vitals"
import type {DiagnosticoApiItem, TratamientoApiItem, TratamientoView} from "../../types/diagnostico.ts";


function mapTratamiento(t: TratamientoApiItem): TratamientoView {
  return {
    id_tratamiento: t.id_tratamiento,
    tipo_tratamiento: t.tipo_tratamiento || "",
    fecha_inicio: t.fecha_inicio || "",
    fecha_fin: t.fecha_fin || "",
    resultado_clinico_final: t.resultado_clinico_final || "",
    observaciones: t.observaciones || "",
    unidad_id: t.unidad_atencion?.id_unidad ?? null,
    unidad_nombre: t.unidad_atencion?.nombre_unidad ?? "",
  }
}
function normalizaSexo(sexo: "F" | "M"): Sexo {
  return sexo === "F" ? "Femenino" : "Masculino"
}

// arma el label "Nombre Apellido [#id]"
function makeLabel(p: PacienteApiItem) {
  const segundo = p.segundo_apellido ? ` ${p.segundo_apellido}` : ""
  return `${p.primer_nombre} ${p.primer_apellido}${segundo}`
}

function mapApiToMini(p: PacienteApiItem): PacienteMini {
  const vitals = synthesizeVitals(p.id_paciente) // determinístico

  return {
    foto_url: p.foto_url || "",
    nombres: p.primer_nombre || "",
    apellido_paterno: p.primer_apellido || "",
    apellido_materno: p.segundo_apellido || "",
    sexo: normalizaSexo(p.sexo),
    fecha_nacimiento: p.fecha_nacimiento || "",
    seguridad_social: p.tipo_seguridad_social || "",
    // campos "simulados"
    peso: vitals.peso,
    talla: vitals.talla,
    presion_arterial: vitals.presion_arterial,
    frecuencia_cardiaca: vitals.frecuencia_cardiaca,
    temperatura: vitals.temperatura,
    tipo_sangre: vitals.tipo_sangre,
  }
}

export async function fetchPacientesOptions(): Promise<PacienteOption[]> {
  const { data } = await http.get<PacientesApiResponse>("/api/v1/pacientes")
  // si la API paginara, aquí podrías aceptar params ?page= ?size=
  return data.items.map((p) => ({
    id: String(p.id_paciente),
    label: makeLabel(p),
    data: mapApiToMini(p),
  }))
}

/** GET /api/v1/pacientes/{id}/diagnosticos */
export async function fetchDiagnosticosByPaciente(pacienteId: string | number): Promise<DiagnosticoApiItem[]> {
  const { data } = await http.get<DiagnosticoApiItem[]>(`/api/v1/pacientes/${pacienteId}/diagnosticos`)
  return data
}

export async function fetchTratamientosByDiagnostico(
  diagnosticoId: string | number
): Promise<TratamientoView[]> {
  const { data } = await http.get<TratamientoApiItem[]>(
    `/api/v1/diagnosticos/${diagnosticoId}/tratamientos`
  )
  return (data || []).map(mapTratamiento)
}
