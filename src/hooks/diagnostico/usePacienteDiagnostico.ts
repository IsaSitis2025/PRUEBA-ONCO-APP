import { useEffect, useState } from "react"
import type { DiagnosticoApiItem, DiagnosticoFormData, EstadoRegistro } from "../../types/diagnostico"
import { getHttpErrorMessage } from "../../api/http"
import {fetchDiagnosticosByPaciente} from "../../api/diagnostico/pacientes.ts";

// mapea API -> forma que consume el form
function mapApiToForm(item: DiagnosticoApiItem): DiagnosticoFormData {
  const estado_registro = (item.estado?.trim() || "Activo") as EstadoRegistro
  return {
    tipo_cancer: item.tipo_cancer || "",
    estado_enfermedad: item.estadio_enfermedad || "",
    fecha_diagnostico: item.fecha_diagnostico || "",
    medico_responsable: item.medico_responsable || "",
    observaciones: item.observaciones || "",
    estado_registro,
  }
}

export function usePacienteDiagnostico(pacienteId: string | null) {
  const [data, setData] = useState<DiagnosticoFormData | null>(null)
  const [raw, setRaw] = useState<DiagnosticoApiItem[] | null>(null)
  const [diagnosticoId, setDiagnosticoId] = useState<number | null>(null) // 👈 NUEVO
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancel = false
    if (!pacienteId || pacienteId === "none") {
      setData(null); setRaw(null); setDiagnosticoId(null); setError(null)
      return
    }
    setLoading(true)
    fetchDiagnosticosByPaciente(pacienteId)
      .then((arr) => {
        if (cancel) return
        setRaw(arr)
        const first = arr?.[0]
        setDiagnosticoId(first?.id_diagnostico ?? null) // 👈 set id
        setData(first ? mapApiToForm(first) : null)
        setError(null)
      })
      .catch((e) => !cancel && setError(getHttpErrorMessage(e)))
      .finally(() => !cancel && setLoading(false))
    return () => { cancel = true }
  }, [pacienteId])

  return { data, setData, raw, diagnosticoId, loading, error }
}
