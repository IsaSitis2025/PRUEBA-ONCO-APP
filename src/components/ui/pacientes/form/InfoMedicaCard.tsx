import { Card, CardBody, Heading, Grid, FormControl, FormLabel, Input, Select, HStack, Button, Collapse, Divider } from "@chakra-ui/react"
import { inputProps, BRAND } from "../../../../constants/ui"
import { useState } from "react"
import type {PacienteForm} from "../../../../types/paciente-form.ts";

export default function InfoMedicaCard({
                                         value, onChange,
                                       }: {
  value: PacienteForm
  onChange: (patch: Partial<PacienteForm>) => void
}) {
  const [open, setOpen] = useState(true)

  return (
    <Card bg="#e2e8f0" boxShadow="lg" borderRadius="xl" mb={6}>
      <CardBody>
        <HStack justify="space-between" mb={2}>
          <Heading size="sm">Información médica</Heading>
          {!open && (
            <Button size="sm" variant="outline" borderColor={BRAND} color={BRAND}
                    _hover={{ bg: BRAND, color: "white" }} onClick={() => setOpen(true)}>
              Agregar info médica
            </Button>
          )}
        </HStack>

        <Collapse in={open} animateOpacity>
          <Divider my={3}/>
          <Grid templateColumns={["1fr", "repeat(2,1fr)"]} gap={4}>
            <FormControl><FormLabel>Peso</FormLabel>
              <Input {...inputProps} placeholder="Ej. 68 kg" value={value.peso}
                     onChange={e => onChange({ peso: e.target.value })}/>
            </FormControl>
            <FormControl><FormLabel>Talla</FormLabel>
              <Input {...inputProps} placeholder="Ej. 165 cm" value={value.talla}
                     onChange={e => onChange({ talla: e.target.value })}/>
            </FormControl>
            <FormControl><FormLabel>Presión arterial</FormLabel>
              <Input {...inputProps} placeholder="Ej. 118/76 mmHg" value={value.presion_arterial}
                     onChange={e => onChange({ presion_arterial: e.target.value })}/>
            </FormControl>
            <FormControl><FormLabel>Frecuencia cardíaca</FormLabel>
              <Input {...inputProps} placeholder="Ej. 72 lpm" value={value.frecuencia_cardiaca}
                     onChange={e => onChange({ frecuencia_cardiaca: e.target.value })}/>
            </FormControl>
            <FormControl><FormLabel>Temperatura</FormLabel>
              <Input {...inputProps} placeholder="Ej. 36.6 °C" value={value.temperatura}
                     onChange={e => onChange({ temperatura: e.target.value })}/>
            </FormControl>
            <FormControl><FormLabel>Tipo de sangre</FormLabel>
              <Select {...inputProps} placeholder="Selecciona" value={value.tipo_sangre}
                      onChange={e => onChange({ tipo_sangre: e.target.value })}>
                {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(ts => <option key={ts} value={ts}>{ts}</option>)}
              </Select>
            </FormControl>
          </Grid>
        </Collapse>
      </CardBody>
    </Card>
  )
}
