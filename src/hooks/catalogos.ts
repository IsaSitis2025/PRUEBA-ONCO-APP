import { useEffect, useState } from "react"
import {
  fetchEstadosEnfermedad,
  fetchInstituciones,
  fetchInstitucionesOptions,
  fetchTiposCancer,
  fetchTiposTratamiento,
  fetchUnidades,
  fetchUnidadesOptions,
} from "../api/catalogos"
import type { Institucion, Opcion, Unidad } from "../types/catalogos"
import { getHttpErrorMessage } from "../api/http"

// ====== Genérico ======
function useLoader<T>(fn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancel = false
    setLoading(true)
    fn()
      .then((res) => { if (!cancel) { setData(res); setError(null) } })
      .catch((e) => !cancel && setError(getHttpErrorMessage(e)))
      .finally(() => !cancel && setLoading(false))
    return () => { cancel = true }
  }, []) // una vez por montaje (cache en API evita repeticiones)

  return { data, loading, error }
}

// ===== Tipos de Cáncer =====
export function useTiposCancer() {
  return useLoader<string[]>(fetchTiposCancer)
}

// ===== Estados de enfermedad =====
export function useEstadosEnfermedad() {
  return useLoader<string[]>(fetchEstadosEnfermedad)
}

// ===== Tipos de tratamiento =====
export function useTiposTratamiento() {
  return useLoader<string[]>(fetchTiposTratamiento)
}

// ===== Unidades (objetos) =====
export function useUnidades() {
  return useLoader<Unidad[]>(fetchUnidades)
}

// ===== Unidades para <Select> =====
export function useUnidadesOptions() {
  return useLoader<Opcion[]>(fetchUnidadesOptions)
}

// ===== Instituciones (objetos) =====
export function useInstituciones() {
  return useLoader<Institucion[]>(fetchInstituciones)
}

// ===== Instituciones para <Select> =====
export function useInstitucionesOptions() {
  return useLoader<Opcion[]>(fetchInstitucionesOptions)
}
