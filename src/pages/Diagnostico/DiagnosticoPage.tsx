// src/pages/Diagnostico/DiagnosticoPage.tsx
import {
  Box,
  Heading,
  Select,
  Divider,
  Alert,
  AlertIcon, Text,
} from "@chakra-ui/react"
import { useMemo, useState } from "react"
import Stepper, { type Step } from "../../components/ui/diagnostico/Stepper"
import PacienteMiniCard from "../../components/ui/diagnostico/PacienteMiniCard"
import DiagnosticoForm from "../../components/ui/diagnostico/DiagnosticoForm"
import LoaderModal from "../../components/ui/LoaderModal"
import InlineLoader from "../../components/ui/InlineLoader"
import { useActionToast } from "../../components/ui/actionToast"
import { useNavigate } from "react-router-dom"

import { BRAND, inputProps } from "../../constants/ui"
import { usePacientesOptions } from "../../hooks/diagnostico/usePacientesOptions"
import { usePacienteDiagnostico } from "../../hooks/diagnostico/usePacienteDiagnostico"
import { useTratamientos } from "../../hooks/diagnostico/useTratamientos"
import TratamientosTabs from "../../components/ui/diagnostico/TratamientosTabs"

export default function PacienteWizardPage() {
  const navigate = useNavigate()
  const actionToast = useActionToast()

  // 🔹 Pacientes desde API
  const { options, loading: loadingPac, error: errorPac } = usePacientesOptions()
  const [selId, setSelId] = useState<string>("none")

  const paciente = useMemo(() => {
    if (selId === "none") return null
    return options.find((o) => o.id === selId)?.data || null
  }, [selId, options])

  // 🔹 Diagnóstico del paciente
  const {
    data: diag,
    setData: setDiag,
    diagnosticoId,
    loading: loadingDiag,
    error: errorDiag,
  } = usePacienteDiagnostico(selId === "none" ? null : selId)

  // 🔹 Tratamientos por diagnóstico
  const diagId = diagnosticoId ?? null
  const { tratamientos, loading: loadingTrats, error: errorTrats } = useTratamientos(diagId)

  // 🔹 Flag lectura/edición (solo informativa para Stepper)
  const [disabled, setDisabled] = useState(true)
  const toggleDisabled = () => setDisabled((v) => !v)

  const [loading, setLoading] = useState(false)
  const [index, setIndex] = useState(0)

  // 🔹 Steps
  const steps: Step[] = [
    {
      label: "Diagnóstico",
      content: (
        <>
          {errorDiag && (
            <Alert
              status="error"
              variant="subtle"
              bg="rgba(229, 62, 62, 0.12)"              // rojo translúcido
              borderRadius="15px"
              backdropFilter="blur(6px)"                // efecto glass
              border="1px solid rgba(229,62,62,0.3)"    // borde rojo tenue
              py={4}
              mb={4}
            >
              <AlertIcon color="#e53e3e" />
              <Box flex="1">
                <Text color="#c53030" fontWeight="medium">
                  {errorDiag}
                </Text>
              </Box>
            </Alert>
          )}

          {loadingDiag && !diag ? (
            <InlineLoader text="Cargando diagnóstico…" minH="220px" />
          ) : !diag ? (
            <Alert
              status="info"
              variant="subtle"
              bg="rgba(32, 174, 219, 0.1)"      // azul translúcido
              borderRadius="15px"
              backdropFilter="blur(6px)"        // efecto glass
              border="1px solid rgba(32,174,219,0.3)" // sutil borde celeste
              py={4}
            >
              <AlertIcon color="#20aedb" />
              <Box flex="1">
                <Text color="#167a99" fontWeight="medium">
                  Sin diagnóstico registrado para este paciente.
                </Text>
              </Box>
            </Alert>
          ) : (
            <DiagnosticoForm
              value={diag}
              onChange={setDiag}
              disabled={disabled}
              onToggleDisabled={toggleDisabled}
            />
          )}
        </>
      ),
    },
    {
      label: "Tratamientos",
      content: (
        <>
          {errorTrats && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              {errorTrats}
            </Alert>
          )}

          {loadingTrats && (!tratamientos || tratamientos.length === 0) ? (
            <InlineLoader text="Cargando tratamientos…" minH="260px" />
          ) : !tratamientos || tratamientos.length === 0 ? (
            <Alert status="info">
              <AlertIcon />
              Sin tratamientos registrados para este diagnóstico.
            </Alert>
          ) : (
            <TratamientosTabs
              tratamientos={tratamientos ?? []}
              loading={loadingTrats}
              errorMsg={errorTrats}
            />
          )}
        </>
      ),
    },
  ]

  // 🔹 Acción final
  const onFinish = async () => {
    setLoading(true)
    try {
      // aquí iría tu POST/PUT real
      await new Promise((res) => setTimeout(res, 800))
    } finally {
      setLoading(false)
    }

    actionToast({
      title: "Tratamiento guardado",
      description: "¿Qué deseas hacer ahora?",
      primaryText: "Ver receta",
      secondaryText: "Ir al dashboard",
      onPrimary: () =>
        window.open("/receta-dummy", "_blank", "noopener,noreferrer"),
      onSecondary: () => navigate("/dashboard"),
      brand: BRAND,
      accent: "#109ecb",
    })
  }

  return (
    <Box p="50px">
      {loading && <LoaderModal isOpen text="Guardando…" />}

      <Heading size="xl" mb={9} >
        Paciente · Diagnóstico y Tratamiento
      </Heading>

      {/* 🔹 Selector de paciente */}
      {errorPac && (
        <Alert
          status="error"
          variant="subtle"
          bg="rgba(229, 62, 62, 0.12)"              // rojo translúcido
          borderRadius="15px"
          backdropFilter="blur(6px)"                // efecto glass
          border="1px solid rgba(229,62,62,0.3)"    // borde rojo tenue
          py={4}
          mb={4}
        >
          <AlertIcon color="#e53e3e" />
          <Box flex="1">
            <Text color="#c53030" fontWeight="medium">
              {errorDiag}
            </Text>
          </Box>
        </Alert>

      )}

      {loadingPac ? (
        <InlineLoader text="Cargando pacientes…" minH="140px" />
      ) : (
        <Select
          maxW="sm"
          mb={9}
          {...inputProps}
          value={selId}
          onChange={(e) => {
            setSelId(e.target.value)
            setDisabled(true) // al cambiar paciente, vuelve a lectura
          }}
          isDisabled={loading}
        >
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </Select>
      )}

      {/* 🔹 Contenido principal */}
      {paciente ? (
        <>
          <PacienteMiniCard data={paciente} />
          <Divider my={6} />
          <Stepper
            steps={steps}
            index={index}
            onIndex={setIndex}
            onFinish={onFinish}
            brand={BRAND}
            trackBg="#e2e8f0"
            finishing={loading}
            disabled={disabled}     // informativo
            lockNavigation={false}  // NO bloquea navegación
          />
        </>
      ) : (
        !loadingPac && (
          <Alert
            status="info"
            variant="subtle"
            bg="rgba(32, 174, 219, 0.1)"      // azul translúcido
            borderRadius="15px"
            backdropFilter="blur(6px)"        // efecto glass
            border="1px solid rgba(32,174,219,0.3)" // sutil borde celeste
            py={4}
          >
            <AlertIcon color="#20aedb" />
            <Box flex="1">
              <Text color="#167a99" fontWeight="medium">
                Selecciona un paciente para continuar.
              </Text>
            </Box>
          </Alert>
        )
      )}
    </Box>
  )
}
