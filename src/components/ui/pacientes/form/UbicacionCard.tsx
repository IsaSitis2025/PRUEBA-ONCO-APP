import { Card, CardBody, Heading, Grid, FormControl, FormLabel, Input, Textarea } from "@chakra-ui/react"
import type {PacienteForm} from "../../../../types/paciente-form.ts";
import {inputProps} from "../../../../constants/ui.ts";

export default function UbicacionCard({
                                        value, onChange,
                                      }: {
  value: PacienteForm
  onChange: (patch: Partial<PacienteForm>) => void
}) {
  return (
    <Card bg="#e2e8f0" boxShadow="lg" borderRadius="xl">
      <CardBody>
        <Heading size="sm" mb={4}>Ubicación</Heading>
        <Grid templateColumns={["1fr"]} gap={4}>
          <FormControl><FormLabel>Dirección</FormLabel>
            <Textarea {...inputProps} value={value.direccion}
                      onChange={e => onChange({ direccion: e.target.value })}/>
          </FormControl>
          <FormControl><FormLabel>Ciudad</FormLabel>
            <Input {...inputProps} value={value.ciudad}
                   onChange={e => onChange({ ciudad: e.target.value })}/>
          </FormControl>
        </Grid>
      </CardBody>
    </Card>
  )
}
