import { Grid, GridItem, Card, CardBody, Heading, Select, Textarea, FormControl, FormLabel, Input } from "@chakra-ui/react"
import { CATALOGOS } from "../../../constants/catalogos"
import { inputProps, reqSx, BRAND, BG } from "../../../constants/ui"
import type { TratamientoFormData } from "../../../types/diagnostico"
import { parseISO, isValid } from "date-fns"
import DateFieldCalendar from "../forms/DateFieldCalendar.tsx";

export default function TratamientoForm({
                                          value,
                                          onChange,
                                          locked,
                                        }: {
  value: TratamientoFormData
  onChange: (next: TratamientoFormData) => void
  locked?: boolean
}) {
  const inicioDate = value.fecha_inicio && isValid(parseISO(value.fecha_inicio)) ? parseISO(value.fecha_inicio) : undefined
  const finDate = value.fecha_fin && isValid(parseISO(value.fecha_fin)) ? parseISO(value.fecha_fin) : undefined

  return (
    <Card bg={BG} boxShadow="lg" borderRadius="xl">
      <CardBody>
        <Heading size="sm" mb={4} color={BRAND}>Tratamiento</Heading>

        <Grid templateColumns={["1fr", "repeat(2,1fr)"]} gap={4}>
          <GridItem>
            <FormControl>
              <FormLabel color={BRAND}>Tipo de tratamiento</FormLabel>
              <Select
                placeholder="Selecciona"
                {...inputProps}
                value={value.tipo_tratamiento}
                onChange={e => onChange({ ...value, tipo_tratamiento: e.target.value })}
                isDisabled={locked}
              >
                {CATALOGOS.tratamientos.map(v => <option key={v}>{v}</option>)}
              </Select>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel color={BRAND}>Unidad de atención</FormLabel>
              <Select
                placeholder="Selecciona"
                {...inputProps}
                value={value.unidad_atencion}
                onChange={e => onChange({ ...value, unidad_atencion: e.target.value })}
                isDisabled={locked}
              >
                {CATALOGOS.unidades_atencion.map(v => <option key={v}>{v}</option>)}
              </Select>
            </FormControl>
          </GridItem>

          <GridItem>
            <DateFieldCalendar
              label="Fecha de inicio"
              value={value.fecha_inicio || ""}
              onChange={(v) => onChange({ ...value, fecha_inicio: v })}
              inputProps={{ ...inputProps, isDisabled: locked }}
              reqSx={{ ...reqSx, color: BRAND }}
              brand={BRAND}
              maxDate={finDate}
            />
          </GridItem>

          <GridItem>
            <DateFieldCalendar
              label="Fecha de fin"
              value={value.fecha_fin || ""}
              onChange={(v) => onChange({ ...value, fecha_fin: v })}
              inputProps={{ ...inputProps, isDisabled: locked }}
              reqSx={{ ...reqSx, color: BRAND }}
              brand={BRAND}
              minDate={inicioDate}
            />
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel color={BRAND}>Medicamento</FormLabel>
              <Select
                placeholder="Selecciona"
                {...inputProps}
                value={value.medicamento}
                onChange={e => onChange({ ...value, medicamento: e.target.value })}
                isDisabled={locked}
              >
                {CATALOGOS.medicamentos.map(v => <option key={v}>{v}</option>)}
              </Select>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel color={BRAND}>Dosis</FormLabel>
              <Input
                placeholder="Ej. 100 mg"
                {...inputProps}
                value={value.dosis || ""}
                onChange={e => onChange({ ...value, dosis: e.target.value })}
                isDisabled={locked}
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel color={BRAND}>Frecuencia</FormLabel>
              <Input
                placeholder="Ej. cada 21 días"
                {...inputProps}
                value={value.frecuencia || ""}
                onChange={e => onChange({ ...value, frecuencia: e.target.value })}
                isDisabled={locked}
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel color={BRAND}>Duración (días)</FormLabel>
              <Input
                type="number"
                placeholder="0"
                {...inputProps}
                value={value.duracion_dias ?? 0}
                onChange={e => onChange({ ...value, duracion_dias: Number(e.target.value || 0) })}
                isDisabled={locked}
              />
            </FormControl>
          </GridItem>

          <GridItem colSpan={2}>
            <FormControl>
              <FormLabel color={BRAND}>Observaciones</FormLabel>
              <Textarea
                placeholder="Opcional"
                {...inputProps}
                value={value.observaciones || ""}
                onChange={e => onChange({ ...value, observaciones: e.target.value })}
                isDisabled={locked}
              />
            </FormControl>
          </GridItem>

          <GridItem colSpan={2}>
            <FormControl>
              <FormLabel color={BRAND}>Resultado clínico</FormLabel>
              <Textarea
                placeholder="Describe el resultado clínico, hallazgos, respuesta al tratamiento..."
                rows={5}
                {...inputProps}
                value={value.resultado_clinico || ""}
                onChange={e => onChange({ ...value, resultado_clinico: e.target.value })}
                isDisabled={locked}
              />
            </FormControl>
          </GridItem>
        </Grid>
      </CardBody>
    </Card>
  )
}
