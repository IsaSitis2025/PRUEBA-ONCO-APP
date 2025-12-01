import { useEffect, useMemo, useState } from "react"
import type { ResumenResponse, Slice, treatmentCost, StockItem, AgeGroupCancer } from "../../types/dashboard"
import {
  fetchResumen,
  fetchCancerTipos,
  fetchCostosTratamiento,
  fetchInventario,
  fetchEdadCancer,
} from "../../api/dashboard/reportes.ts";

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

export function useDashboardSequential(opts?: { delayMs?: number }) {
  const delayMs = opts?.delayMs ?? 200

  // Resumen
  const [resumen, setResumen] = useState<ResumenResponse | null>(null)
  const [loadingResumen, setLoadingResumen] = useState(true)
  const [errorResumen, setErrorResumen] = useState<string | null>(null)

  // Tipos de cáncer
  const [cancerTipos, setCancerTipos] = useState<Slice[] | null>(null)
  const [loadingTipos, setLoadingTipos] = useState(true)
  const [errorTipos, setErrorTipos] = useState<string | null>(null)

  // Costos
  const [costos, setCostos] = useState<treatmentCost[] | null>(null)
  const [loadingCostos, setLoadingCostos] = useState(true)
  const [errorCostos, setErrorCostos] = useState<string | null>(null)

  // Inventario
  const [inventario, setInventario] = useState<StockItem[] | null>(null)
  const [loadingInventario, setLoadingInventario] = useState(true)
  const [errorInventario, setErrorInventario] = useState<string | null>(null)

  // Edad vs cáncer
  const [edadCancer, setEdadCancer] = useState<AgeGroupCancer[] | null>(null)
  const [loadingEdad, setLoadingEdad] = useState(true)
  const [errorEdad, setErrorEdad] = useState<string | null>(null)

  const loadingAll = useMemo(
    () => loadingResumen || loadingTipos || loadingCostos || loadingInventario || loadingEdad,
    [loadingResumen, loadingTipos, loadingCostos, loadingInventario, loadingEdad]
  )

  useEffect(() => {
    let cancel = false
    ;(async () => {
      try {
        setLoadingResumen(true)
        const r = await fetchResumen()
        if (cancel) return
        setResumen(r); setErrorResumen(null)
      } catch (e: any) {
        if (!cancel) setErrorResumen(e?.message || "Error cargando resumen")
      } finally { if (!cancel) setLoadingResumen(false) }

      if (!cancel && delayMs) await sleep(delayMs)

      try {
        setLoadingTipos(true)
        const t = await fetchCancerTipos()
        if (cancel) return
        setCancerTipos(t); setErrorTipos(null)
      } catch (e: any) {
        if (!cancel) setErrorTipos(e?.message || "Error cargando tipos de cáncer")
      } finally { if (!cancel) setLoadingTipos(false) }

      if (!cancel && delayMs) await sleep(delayMs)

      try {
        setLoadingCostos(true)
        const c = await fetchCostosTratamiento()
        if (cancel) return
        c.sort((a, b) => b.cost - a.cost)
        setCostos(c); setErrorCostos(null)
      } catch (e: any) {
        if (!cancel) setErrorCostos(e?.message || "Error cargando costos")
      } finally { if (!cancel) setLoadingCostos(false) }

      if (!cancel && delayMs) await sleep(delayMs)

      try {
        setLoadingInventario(true)
        const inv = await fetchInventario()
        if (cancel) return
        setInventario(inv); setErrorInventario(null)
      } catch (e: any) {
        if (!cancel) setErrorInventario(e?.message || "Error cargando inventario")
      } finally { if (!cancel) setLoadingInventario(false) }

      if (!cancel && delayMs) await sleep(delayMs)

      try {
        setLoadingEdad(true)
        const edad = await fetchEdadCancer()
        if (cancel) return
        setEdadCancer(edad); setErrorEdad(null)
      } catch (e: any) {
        if (!cancel) setErrorEdad(e?.message || "Error cargando edades")
      } finally { if (!cancel) setLoadingEdad(false) }
    })()

    return () => { cancel = true }
  }, [delayMs])

  return {
    // resumen
    resumen, loadingResumen, errorResumen,
    // tipos
    cancerTipos, loadingTipos, errorTipos,
    // costos
    costos, loadingCostos, errorCostos,
    // inventario
    inventario, loadingInventario, errorInventario,
    // edad
    edadCancer, loadingEdad, errorEdad,
    // global
    loadingAll,
  }
}
