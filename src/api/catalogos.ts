import { http } from "./http.ts"
import type {
  ApiEstadoEnfermedad,
  ApiInstitucion,
  ApiTipoCancer,
  ApiTipoTratamiento,
  Institucion,
  Opcion,
  Unidad,
} from "../types/catalogos"
import { getCache, setCache } from "../utils/cache"

// helpers
const sortAsc = (a: string, b: string) => a.localeCompare(b, "es", { sensitivity: "base" })
const unique = <T>(arr: T[]) => Array.from(new Set(arr))

const TTL = 10 * 60_000 // 10 min

// ===== Tipos de cáncer =====
const K_TIPOS_CANCER = "catalogo:tipos-cancer"
export async function fetchTiposCancer(): Promise<string[]> {
  const cached = getCache<string[]>(K_TIPOS_CANCER)
  if (cached) return cached
  const { data } = await http.get<ApiTipoCancer[]>("/api/v1/catalogos/tipos-cancer")
  const list = unique((data ?? []).map(i => i.tipo_cancer?.trim()).filter(Boolean) as string[]).sort(sortAsc)
  setCache(K_TIPOS_CANCER, list, TTL)
  return list
}

// ===== Estados de enfermedad =====
const K_ESTADOS = "catalogo:estados-enfermedad"
export async function fetchEstadosEnfermedad(): Promise<string[]> {
  const cached = getCache<string[]>(K_ESTADOS)
  if (cached) return cached
  const { data } = await http.get<ApiEstadoEnfermedad[]>("/api/v1/catalogos/estados-enfermedad")
  const list = unique((data ?? []).map(i => i.estado?.trim()).filter(Boolean) as string[]).sort(sortAsc)
  setCache(K_ESTADOS, list, TTL)
  return list
}

// ===== Tipos de tratamiento =====
const K_TIPOS_TRAT = "catalogo:tipos-tratamiento"
export async function fetchTiposTratamiento(): Promise<string[]> {
  const cached = getCache<string[]>(K_TIPOS_TRAT)
  if (cached) return cached
  const { data } = await http.get<ApiTipoTratamiento[]>("/api/v1/catalogos/tipos-tratamiento")
  const list = unique((data ?? []).map(i => i.tipo_tratamiento?.trim()).filter(Boolean) as string[]).sort(sortAsc)
  setCache(K_TIPOS_TRAT, list, TTL)
  return list
}
let UNIDADES_CACHE: Unidad[] | null = null
let UNIDADES_PENDING: Promise<Unidad[]> | null = null
// ===== Unidades =====
export async function fetchUnidades(): Promise<Unidad[]> {
  if (UNIDADES_CACHE) return UNIDADES_CACHE
  if (UNIDADES_PENDING) return UNIDADES_PENDING

  UNIDADES_PENDING = http.get<Array<{
    id_unidad: number
    nombre_unidad: string
    ciudad?: string
    nivel_complejidad?: string
  }>>("/api/v1/unidades")
    .then(({ data }) => {
      UNIDADES_CACHE = (data || []).map(u => ({
        id: u.id_unidad,
        nombre: u.nombre_unidad,
        ciudad: u.ciudad ?? "",
        nivel: u.nivel_complejidad ?? "",
      }))
      return UNIDADES_CACHE
    })
    .finally(() => { UNIDADES_PENDING = null })

  return UNIDADES_PENDING
}

export async function getUnidadesMap(): Promise<Map<number, string>> {
  const list = await fetchUnidades()
  return new Map(list.map(u => [u.id, u.nombre]))
}

// ===== Instituciones =====
const K_INSTITUCIONES = "catalogo:instituciones"
export async function fetchInstituciones(): Promise<Institucion[]> {
  const cached = getCache<Institucion[]>(K_INSTITUCIONES)
  if (cached) return cached
  const { data } = await http.get<ApiInstitucion[]>("/api/v1/instituciones")
  const list: Institucion[] = (data ?? []).map(i => ({
    id: i.id_institucion,
    nombre: i.nombre_institucion?.trim() || "",
    nivel: i.nivel_complejidad?.trim() || "",
    ciudad: i.ciudad?.trim() || "",
  })).filter(i => i.id != null && i.nombre)
    .sort((a, b) => sortAsc(a.nombre, b.nombre))
  setCache(K_INSTITUCIONES, list, TTL)
  return list
}

// ===== Ayudas para <Select> =====
export async function fetchUnidadesOptions(): Promise<Opcion[]> {
  const arr = await fetchUnidades()
  return arr.map(u => ({ value: u.id, label: u.nombre }))
}

export async function fetchInstitucionesOptions(): Promise<Opcion[]> {
  const arr = await fetchInstituciones()
  return arr.map(i => ({ value: i.id, label: `${i.nombre} — ${i.ciudad}` }))
}
