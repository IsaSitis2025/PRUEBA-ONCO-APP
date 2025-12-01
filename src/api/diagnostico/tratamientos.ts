import {http} from "../http.ts"
import {normalizeTratamientos, type TratamientoApi} from "../../types/tratamiento.ts";

export async function fetchTratamientosPorDiagnostico(idDiagnostico: number | string) {
  const { data } = await http.get<TratamientoApi[]>(`/api/v1/diagnosticos/${idDiagnostico}/tratamientos`)
  return normalizeTratamientos(data ?? [])
}
