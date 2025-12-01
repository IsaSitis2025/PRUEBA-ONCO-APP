import { useEffect, useState } from "react"
import {getHttpErrorMessage} from "../../api/http.ts";
import type {Tratamiento} from "../../types/tratamiento.ts";
import {fetchTratamientosPorDiagnostico} from "../../api/diagnostico/tratamientos.ts";

export function useTratamientos(idDiagnostico: number | string | null) {
  const [tratamientos, setTratamientos] = useState<Tratamiento[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const ctrl = new AbortController()
    async function run() {
      if (!idDiagnostico) { setTratamientos(null); setError(null); return }
      setLoading(true); setError(null)
      try {
        const list = await fetchTratamientosPorDiagnostico(idDiagnostico)
        if (ctrl.signal.aborted) return
        setTratamientos(list)
      } catch (err) {
        if (!ctrl.signal.aborted) setError(getHttpErrorMessage(err))
      } finally {
        if (!ctrl.signal.aborted) setLoading(false)
      }
    }
    run()
    return () => ctrl.abort()
  }, [idDiagnostico])

  return { tratamientos, loading, error }
}
