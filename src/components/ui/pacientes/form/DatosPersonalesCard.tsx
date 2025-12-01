import { Card, CardBody, Grid, Heading, FormControl, FormLabel, Input, Select, HStack, Tag } from "@chakra-ui/react"
import {  inputProps, reqSx as reqSxBase } from "../../../../constants/ui"
import type { PacienteForm, Sexo, Seguro } from "../../../../types/paciente-form"
import { differenceInYears, parseISO, isValid } from "date-fns"
import DateFieldCalendar from "../../forms/DateFieldCalendar.tsx";

export default function DatosPersonalesCard({
                                              value, onChange,
                                            }: {
  value: PacienteForm
  onChange: (patch: Partial<PacienteForm>) => void
}) {
  const edad = (() => {
    if (!value.fecha_nacimiento) return ""
    const d = parseISO(value.fecha_nacimiento)
    if (!isValid(d)) return ""
    return String(differenceInYears(new Date(), d))
  })()
  const reqSx = reqSxBase

  const onSeguro = (v: Seguro) => {
    onChange({ seguridad_social: v, seguridad_social_otro: v === "Otro" ? value.seguridad_social_otro : "" })
  }

  return (
    <Card bg="#e2e8f0" boxShadow="lg" borderRadius="xl" mb={6}>
      <CardBody>
        <Heading size="sm" mb={4}>Datos personales</Heading>
        <Grid templateColumns={["1fr", "repeat(2, 1fr)"]} gap={4}>
          <FormControl isRequired>
            <FormLabel sx={reqSx}>Nombres</FormLabel>
            <Input {...inputProps} value={value.nombres} onChange={e => onChange({ nombres: e.target.value })}/>
          </FormControl>

          <FormControl isRequired>
            <FormLabel sx={reqSx}>Apellido paterno</FormLabel>
            <Input {...inputProps} value={value.apellido_paterno} onChange={e => onChange({ apellido_paterno: e.target.value })}/>
          </FormControl>

          <FormControl>
            <FormLabel>Apellido materno</FormLabel>
            <Input {...inputProps} value={value.apellido_materno} onChange={e => onChange({ apellido_materno: e.target.value })}/>
          </FormControl>

          <FormControl isRequired>
            <FormLabel sx={reqSx}>Sexo</FormLabel>
            <Select placeholder="Selecciona" {...inputProps} value={value.sexo}
                    onChange={e => onChange({ sexo: e.target.value as Sexo })}>
              <option value="Femenino">Femenino</option>
              <option value="Masculino">Masculino</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel sx={reqSx}>Fecha de nacimiento</FormLabel>
            <HStack>
              <DateFieldCalendar
                label=""
                value={value.fecha_nacimiento}
                onChange={(v) => onChange({ fecha_nacimiento: v })}
                maxDate={new Date()} inputProps={inputProps} reqSx={reqSx}
                rightTag={edad ? <Tag colorScheme="blue">{edad} años</Tag> : undefined}
              />
            </HStack>
          </FormControl>

          <FormControl>
            <FormLabel>Tipo de seguridad social</FormLabel>
            <Select placeholder="Selecciona" {...inputProps} value={value.seguridad_social}
                    onChange={e => onSeguro(e.target.value as Seguro)}>
              <option>IMSS</option><option>ISSSTE</option><option>Privado</option><option>Otro</option>
            </Select>
          </FormControl>

          {value.seguridad_social === "Otro" && (
            <FormControl isRequired>
              <FormLabel sx={reqSx}>Especifica el tipo de seguro</FormLabel>
              <Input {...inputProps} value={value.seguridad_social_otro}
                     onChange={e => onChange({ seguridad_social_otro: e.target.value })}/>
            </FormControl>
          )}

          <FormControl>
            <FormLabel>Fecha de ingreso</FormLabel>
            <DateFieldCalendar
              label=""
              value={value.fecha_ingreso}
              onChange={(v) => onChange({ fecha_ingreso: v })}
              minDate={value.fecha_nacimiento ? parseISO(value.fecha_nacimiento) : new Date(1900,0,1)}
              maxDate={new Date()}
              inputProps={inputProps}
            />
          </FormControl>
        </Grid>
      </CardBody>
    </Card>
  )
}
