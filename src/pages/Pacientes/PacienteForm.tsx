import { Box, Button, Grid, GridItem, Heading, Stack, useToast } from "@chakra-ui/react"
import { useState } from "react"
import LoaderModal from "../../components/ui/LoaderModal"
import { useActionToast } from "../../components/ui/actionToast"
import { useNavigate } from "react-router-dom"
import type { PacienteForm } from "../../types/paciente-form"
import { INITIAL_PACIENTE_FORM } from "../../types/paciente-form"
import { BRAND } from "../../constants/ui"
import FotoUploader from "../../components/ui/pacientes/form/FotoUploader.tsx";
import DatosPersonalesCard from "../../components/ui/pacientes/form/DatosPersonalesCard.tsx";
import DatosContactoCard from "../../components/ui/pacientes/form/DatosContactoCard.tsx";
import InfoMedicaCard from "../../components/ui/pacientes/form/InfoMedicaCard.tsx";
import UbicacionCard from "../../components/ui/pacientes/form/UbicacionCard.tsx";
import InstitucionCard from "../../components/ui/pacientes/form/InstitucionCard.tsx";

export default function PacienteFormSimple() {
  const toast = useToast()
  const navigate = useNavigate()
  const actionToast = useActionToast()
  const [loading, setLoading] = useState(false)
  const [locked, setLocked] = useState(false)
  const [form, setForm] = useState<PacienteForm>({...INITIAL_PACIENTE_FORM})

  const set = (patch: Partial<PacienteForm>) => setForm(prev => ({ ...prev, ...patch }))

  const validar = (): string | null => {
    if (!form.nombres?.trim() || !form.apellido_paterno?.trim() || !form.sexo || !form.fecha_nacimiento) {
      return "Faltan campos obligatorios (nombres, apellido paterno, sexo, fecha de nacimiento)."
    }
    if (form.seguridad_social === "Otro" && !form.seguridad_social_otro?.trim()) {
      return "Especifica el tipo de seguridad social."
    }
    return null
  }

  const onGuardar = async () => {
    const err = validar()
    if (err) {
      toast({ title: err, status: "warning", position: "bottom", duration: 3000, isClosable: true })
      return
    }

    setLoading(true)
    try {
      // TODO: POST real cuando exista endpoint
      await new Promise(res => setTimeout(res, 900))
      setForm({ ...INITIAL_PACIENTE_FORM })
      setLocked(true)
      setLoading(false)
      actionToast({
        title: "Paciente guardado correctamente",
        description: "¿Qué deseas hacer ahora?",
        primaryText: "Ir a diagnóstico",
        secondaryText: "Ir al dashboard",
        onPrimary: () => navigate("/diagnostico"),
        onSecondary: () => navigate("/dashboard"),
        brand: BRAND, accent: "#109ecb",
      })
    } catch {
      setLoading(false)
      toast({ title: "Error al guardar", status: "error", position: "bottom", duration: 4000, isClosable: true })
    }
  }

  return (
    <Box p="50px">
      {loading && <LoaderModal isOpen text="Guardando paciente…" />}

      <Heading size="xl" mb={4}>Datos del paciente</Heading>

      {/* Cabecera: Foto + parte arriba del form */}
      <Grid templateColumns={["1fr", "160px 1fr"]} gap={6} mb={6}>
        <GridItem>
          <FotoUploader value={form.foto_url} onChange={(v) => set({ foto_url: v })}/>
        </GridItem>
        <GridItem>
          <DatosPersonalesCard value={form} onChange={set}/>
        </GridItem>
      </Grid>

      <DatosContactoCard value={form} onChange={set}/>
      <InfoMedicaCard value={form} onChange={set}/>

      {/* Dos tarjetas: Ubicación + Institución */}
      <Grid templateColumns={["1fr", "repeat(2, 1fr)"]} gap={6} mb={6}>
        <UbicacionCard value={form} onChange={set}/>
        <InstitucionCard value={form} onChange={set}/>
      </Grid>

      <Stack direction="row" justifyContent="flex-end">
        <Button
          bg={BRAND} color="white"
          _hover={{ bg: "#109ecb" }} _active={{ bg: "#0e90bb" }}
          onClick={onGuardar} isLoading={loading} borderRadius="15px" px={6}
          disabled={locked}
        >
          Guardar
        </Button>
      </Stack>
    </Box>
  )
}
