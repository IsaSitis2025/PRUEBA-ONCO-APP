import {
  Grid, GridItem, Card, CardBody, Heading,
  Select, Textarea, FormControl, FormLabel, Text, HStack, Button
} from "@chakra-ui/react"
import { inputProps, reqSx, BRAND, BG } from "../../../constants/ui"
import type { DiagnosticoFormData } from "../../../types/diagnostico"
import DateFieldCalendar from "../forms/DateFieldCalendar"
import { useTiposCancer, useEstadosEnfermedad } from "../../../hooks/catalogos"

export default function DiagnosticoForm({
                                          value,
                                          onChange,
                                          disabled,        // ← control total lectura/edición
                                          onToggleDisabled // ← el botón Editar/Guardar alterna esta flag
                                        }: {
  value: DiagnosticoFormData
  onChange: (next: DiagnosticoFormData) => void
  disabled: boolean
  onToggleDisabled: () => void
}) {
  // disabled = true → lectura; false → edición
  const isEditing = !disabled

  // catálogos desde API
  const { data: tiposCancer, loading: loadingTC } = useTiposCancer()
  const { data: estados, loading: loadingEE } = useEstadosEnfermedad()

  return (
    <Card bg={BG} boxShadow="lg" borderRadius="xl">
      <CardBody>
        <HStack justify="space-between" mb={4}>
          <Heading size="sm" color={BRAND}>Diagnóstico</Heading>
          <Button
            onClick={onToggleDisabled}
            bg={BRAND}
            color="white"
            borderRadius="15px"
            _hover={{ bg: "#109ecb" }}
            _active={{ bg: "#0e90bb" }}
          >
            {isEditing ? "Guardar" : "Editar"}
          </Button>
        </HStack>

        <Grid templateColumns={["1fr", "repeat(2,1fr)"]} gap={4}>
          <GridItem>
            <FormControl>
              <FormLabel sx={reqSx} color={BRAND}>Tipo de cáncer</FormLabel>
              {isEditing ? (
                <Select
                  placeholder={loadingTC ? "Cargando…" : "Selecciona"}
                  {...inputProps}
                  value={value.tipo_cancer}
                  onChange={e => onChange({ ...value, tipo_cancer: e.target.value })}
                  isDisabled={loadingTC}
                >
                  {(tiposCancer ?? []).map(tc => <option key={tc} value={tc}>{tc}</option>)}
                </Select>
              ) : (
                <Text fontSize="sm" color="gray.800">{value.tipo_cancer || "—"}</Text>
              )}
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel color={BRAND}>Estado de enfermedad</FormLabel>
              {isEditing ? (
                <Select
                  placeholder={loadingEE ? "Cargando…" : "Selecciona"}
                  {...inputProps}
                  value={value.estado_enfermedad}
                  onChange={e => onChange({ ...value, estado_enfermedad: e.target.value })}
                  isDisabled={loadingEE}
                >
                  {(estados ?? []).map(s => <option key={s} value={s}>{s}</option>)}
                </Select>
              ) : (
                <Text fontSize="sm" color="gray.800">{value.estado_enfermedad || "—"}</Text>
              )}
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel color={BRAND}>Fecha de diagnóstico</FormLabel>
              {isEditing ? (
                <DateFieldCalendar
                  label=""
                  value={value.fecha_diagnostico || ""}
                  onChange={(v) => onChange({ ...value, fecha_diagnostico: v })}
                  inputProps={{ ...inputProps }}
                  reqSx={{ ...reqSx, color: BRAND }}
                  brand={BRAND}
                />
              ) : (
                <Text fontSize="sm" color="gray.800">{value.fecha_diagnostico || "—"}</Text>
              )}
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel color={BRAND}>Médico responsable</FormLabel>
              {isEditing ? (
                <Textarea
                  rows={1}
                  placeholder="Nombre del médico"
                  {...inputProps}
                  value={value.medico_responsable || ""}
                  onChange={e => onChange({ ...value, medico_responsable: e.target.value })}
                />
              ) : (
                <Text fontSize="sm" color="gray.800">{value.medico_responsable || "—"}</Text>
              )}
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel color={BRAND}>Estado</FormLabel>
              {isEditing ? (
                <Select
                  {...inputProps}
                  value={value.estado_registro}
                  onChange={e => onChange({ ...value, estado_registro: e.target.value as any })}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </Select>
              ) : (
                <Text fontSize="sm" color="gray.800">{value.estado_registro || "—"}</Text>
              )}
            </FormControl>
          </GridItem>

          <GridItem colSpan={2}>
            <FormControl>
              <FormLabel color={BRAND}>Observaciones</FormLabel>
              {isEditing ? (
                <Textarea
                  placeholder="Opcional"
                  {...inputProps}
                  value={value.observaciones || ""}
                  onChange={e => onChange({ ...value, observaciones: e.target.value })}
                />
              ) : (
                <Text fontSize="sm" color="gray.800" whiteSpace="pre-wrap">
                  {value.observaciones || "—"}
                </Text>
              )}
            </FormControl>
          </GridItem>
        </Grid>
      </CardBody>
    </Card>
  )
}
