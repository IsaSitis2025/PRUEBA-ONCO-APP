import { useEffect, useMemo, useState } from "react"
import {fetchActividadesByTratamiento} from "../../api/diagnostico/actividades.ts";
import {getUnidadesMap} from "../../api/catalogos.ts";
import type {Actividad} from "../../types/actividad.ts";
import {getHttpErrorMessage} from "../../api/http.ts";

export function useActividades(tratamientoId: string | number | null) {
  const [items, setItems] = useState<Actividad[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  useEffect(() => {
    const ctrl = new AbortController()
    async function run() {
      if (!tratamientoId) { setItems(null); setSelectedId(null); setError(null); return }
      setLoading(true); setError(null)
      try {
        // 1) cache de unidades
        const unidadesMap = await getUnidadesMap()
        // 2) actividades (una sola llamada por tratamiento activo)
        const acts = await fetchActividadesByTratamiento(tratamientoId)
        if (ctrl.signal.aborted) return
        const merged = acts.map(a => ({ ...a, unidad_nombre: a.id_unidad ? (unidadesMap.get(a.id_unidad) || "") : "" }))
        setItems(merged)
        setSelectedId(merged[0]?.id ?? null)
      } catch (err) {
        if (!ctrl.signal.aborted) setError(getHttpErrorMessage(err))
      } finally {
        if (!ctrl.signal.aborted) setLoading(false)
      }
    }
    run()
    return () => ctrl.abort()
  }, [tratamientoId])

  const selected = useMemo(
    () => items?.find(a => a.id === selectedId) || null,
    [items, selectedId]
  )

  return { items, selectedId, setSelectedId, selected, loading, error }
}
