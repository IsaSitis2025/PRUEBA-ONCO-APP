import {http} from "../http.ts"
import type {Actividad, ActividadApi} from "../../types/actividad.ts";

/** quita comillas, corchetes sueltos y espacios raros de la API */
function clean(s: unknown): string {
  if (typeof s !== "string") return s == null ? "" : String(s)
  return s.replace(/^[\s"'[\]]+|[\s"'\]]+$/g, "").trim()
}

export async function fetchActividadesByTratamiento(tratamientoId: string | number): Promise<Actividad[]> {
  const { data } = await http.get<ActividadApi[]>(`/api/v1/tratamientos/${tratamientoId}/actividades`)
  return (data ?? []).map(a => ({
    id: a.id_actividad,
    tipo: clean(a.tipo_actividad),
    fecha: clean(a.fecha_actividad),
    procedimiento: clean(a.nombre_procedimiento),
    id_unidad: a.id_unidad ?? null,
    unidad_nombre: "", // se completa en el hook con catálogo de unidades
    medico: clean(a.medico_responsable),
    observaciones: clean(a.observaciones),
    resultado: clean(a.resultado_clinico),
    archivo: a.archivo || null,
  }))
}
