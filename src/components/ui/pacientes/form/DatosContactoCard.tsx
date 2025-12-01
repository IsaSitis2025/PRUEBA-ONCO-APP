import { Card, CardBody, Heading, Grid, FormControl, FormLabel, Input, HStack, Select } from "@chakra-ui/react"
import { useMemo } from "react"
import type {PacienteForm} from "../../../../types/paciente-form.ts";
import {inputProps} from "../../../../constants/ui.ts";

const LADAS = [
  { value: "+52", label: "+52 (MX)" },
  { value: "+1",  label: "+1 (US/CA)" },
  { value: "+57", label: "+57 (CO)" },
]

export default function DatosContactoCard({
                                            value, onChange,
                                          }: {
  value: PacienteForm
  onChange: (patch: Partial<PacienteForm>) => void
}) {
  const telefonoCompleto = useMemo(() => {
    const n = value.telefono_numero?.trim()
    return n ? `${value.lada} ${n}` : ""
  }, [value.lada, value.telefono_numero])

  return (
    <Card bg="#e2e8f0" boxShadow="lg" borderRadius="xl" mb={6}>
      <CardBody>
        <Heading size="sm" mb={4}>Datos de contacto</Heading>
        <Grid templateColumns={["1fr", "repeat(2, 1fr)"]} gap={4}>
          <FormControl>
            <FormLabel>Correo electrónico</FormLabel>
            <Input type="email" {...inputProps}
                   value={value.correo} onChange={e => onChange({ correo: e.target.value })}/>
          </FormControl>

          <FormControl>
            <FormLabel>Teléfono</FormLabel>
            <HStack>
              <Select w="44" {...inputProps}
                      value={value.lada} onChange={e => onChange({ lada: e.target.value })}>
                {LADAS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </Select>
              <Input {...inputProps} placeholder="Número" value={value.telefono_numero}
                     onChange={e => onChange({ telefono_numero: e.target.value.replace(/\D/g,"") })}/>
            </HStack>
            {telefonoCompleto && (
              <Input mt={2} isReadOnly {...inputProps} value={telefonoCompleto}/>
            )}
          </FormControl>
        </Grid>
      </CardBody>
    </Card>
  )
}
