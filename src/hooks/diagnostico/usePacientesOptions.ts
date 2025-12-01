import { useEffect, useState } from "react"
import type {PacienteOption} from "../../types/paciente.ts";
import {fetchPacientesOptions} from "../../api/diagnostico/pacientes.ts";
import {getHttpErrorMessage} from "../../api/http.ts";


export function usePacientesOptions() {
  const [options, setOptions] = useState<PacienteOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancel = false
    setLoading(true)
    fetchPacientesOptions()
      .then((ops) => {
        if (!cancel) {
          // inserta la opción "Selecciona…"
          setOptions([{ id: "none", label: "Selecciona…", data: null as any } as any].concat(ops))
          setError(null)
        }
      })
      .catch((e) => !cancel && setError(getHttpErrorMessage(e)))
      .finally(() => !cancel && setLoading(false))
    return () => { cancel = true }
  }, [])

  return { options, loading, error }
}
