import { Card, CardBody, Heading, Grid, FormControl, FormLabel, Select, Input, Alert, AlertIcon } from "@chakra-ui/react"
import {useInstituciones} from "../../../../hooks/catalogos.ts";
import type {PacienteForm} from "../../../../types/paciente-form.ts";
import {inputProps} from "../../../../constants/ui.ts";

/**
 * Usa id_institucion del backend.
 * Al seleccionar, auto-completa institucion_nombre, nivel_complejidad y institucion_ciudad.
 */
export default function InstitucionCard({
                                          value, onChange,
                                        }: {
  value: PacienteForm
  onChange: (patch: Partial<PacienteForm>) => void
}) {
  const { data: instituciones, loading, error } = useInstituciones()

  const onSelect = (idStr: string) => {
    if (!idStr) {
      onChange({ id_institucion: null, institucion_nombre: "", nivel_complejidad: "", institucion_ciudad: "" })
      return
    }
    const id = Number(idStr)
    const it = instituciones?.find(i => i.id === id)
    onChange({
      id_institucion: id,
      institucion_nombre: it?.nombre || "",
      nivel_complejidad: it?.nivel || "",
      institucion_ciudad: it?.ciudad || "",
    })
  }

  return (
    <Card bg="#e2e8f0" boxShadow="lg" borderRadius="xl">
      <CardBody>
        <Heading size="sm" mb={4}>Institución</Heading>

        {error && <Alert status="error" mb={4}><AlertIcon/>{error}</Alert>}

        <Grid templateColumns={["1fr"]} gap={4}>
          <FormControl>
            <FormLabel>Nombre institución</FormLabel>
            <Select
              placeholder={loading ? "Cargando…" : "Selecciona"}
              {...inputProps}
              value={value.id_institucion ?? ""}
              onChange={e => onSelect(e.target.value)}
              isDisabled={loading}
            >
              {(instituciones ?? []).map(i => (
                <option key={i.id} value={i.id}>{i.nombre} — {i.ciudad}</option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Nivel de complejidad</FormLabel>
            <Input readOnly {...inputProps} value={value.nivel_complejidad}/>
          </FormControl>

          <FormControl>
            <FormLabel>Ciudad institución</FormLabel>
            <Input readOnly {...inputProps} value={value.institucion_ciudad}/>
          </FormControl>
        </Grid>
      </CardBody>
    </Card>
  )
}
