import {
  Tabs, TabList, TabPanels, Tab, TabPanel,
  Card, CardBody, Heading, Grid, HStack, Button, Box, Divider,
  FormControl, FormLabel, Textarea, Alert, AlertIcon, Select, Text,
} from "@chakra-ui/react"
import { useEffect, useMemo, useState, useCallback } from "react"
import ActividadesCard from "./ActividadesCard"
import type { Tratamiento } from "../../../types/tratamiento"
import { useActividades } from "../../../hooks/diagnostico/useActividades"

// 🔹 catálogos desde API
import { useTiposTratamiento, useUnidadesOptions } from "../../../hooks/catalogos"

// 🔹 loader inline y calendario
import InlineLoader from "../InlineLoader"
import DateFieldCalendar from "../forms/DateFieldCalendar"

const BG = "#e2e8f0"
const BRAND = "#20aedb"
const inputProps = {
  bg: "#ffffff",
  borderColor: BRAND,
  borderRadius: "15px",
  color: BRAND,
  _placeholder: { color: BRAND },
  _focus: { boxShadow: `0 0 0 2px ${BRAND}` },
} as const

type Props = {
  tratamientos?: Tratamiento[] | null
  loading?: boolean
  errorMsg?: string | null
}

/**
 * Tabs de tratamientos:
 * - Catálogos para tipo de tratamiento y unidad de atención desde API
 * - Monta SOLO el tab activo (isLazy + unmount)
 * - Editar/Guardar por tab (UI local)
 * - Actividades solo del tratamiento activo
 * - Loader inline al cambiar de tab y bloqueo de tabs durante carga
 * - Fechas con DateFieldCalendar
 * - En modo vista, se muestran <Text> (no cajas Read)
 */
export default function TratamientosTabs({ tratamientos, loading, errorMsg }: Props) {
  const list = useMemo<Tratamiento[]>(() => (tratamientos ?? []), [tratamientos])

  const [tab, setTab] = useState(0)
  const [local, setLocal] = useState<Tratamiento[]>(list)

  // mapa de “deshabilitado” por id (true = lectura)
  const [disabledMap, setDisabledMap] = useState<Record<number, boolean>>({})

  // 🔹 cargar catálogos (una vez por montaje; los hooks cachean)
  const {
    data: tiposTrat,
    loading: loadingTT,
    error: errorTT,
  } = useTiposTratamiento()

  const {
    data: unidadesOpts, // [{ value: "16", label: "Médica Sur - Unidad 3" }, ...]
    loading: loadingUnidades,
    error: errorUnidades,
  } = useUnidadesOptions()

  // sincroniza cuando llegan / cambian los tratamientos
  useEffect(() => {
    setLocal(list)
    setTab(0)
    setDisabledMap(prev => {
      const next: Record<number, boolean> = { ...prev }
      // marca todos como lectura por defecto, conserva estados existentes
      list.forEach(t => {
        if (next[t.id_tratamiento] === undefined) next[t.id_tratamiento] = true
      })
      // limpia ids que ya no existan
      Object.keys(next).forEach(k => {
        const id = Number(k)
        if (!list.some(t => t.id_tratamiento === id)) delete next[id]
      })
      return next
    })
  }, [list])

  const activeTrat = useMemo(() => local?.[tab] ?? null, [local, tab])

  // Hook de actividades SOLO para el tratamiento activo
  const {
    items: acts,
    selectedId,
    setSelectedId,
    loading: loadingActs,
    error: errorActs
  } = useActividades(activeTrat?.id_tratamiento ?? null)

  // 🔒 bloquear tabs si se están cargando actividades
  const tabsLocked = !!loadingActs

  // handler que ignora cambios mientras hay carga
  const handleTabChange = useCallback(
    (nextIndex: number) => {
      if (tabsLocked) return // ignora cambios mientras cargan actividades
      setTab(nextIndex)
    },
    [tabsLocked]
  )

  const isDisabled = (id: number) => disabledMap[id] ?? true
  const toggleEdit = (id: number) =>
    setDisabledMap(m => ({ ...m, [id]: !isDisabled(id) }))

  const updateActive = (patch: Partial<Tratamiento>) => {
    setLocal(arr => arr.map((t, i) => (i === tab ? { ...t, ...patch } as Tratamiento : t)))
  }

  // estados de envoltura: cargando / error / vacío
  if (loading) {
    return <InlineLoader text="Cargando tratamientos…" minH="280px" />
  }
  if (errorMsg) {
    return (
      <Alert
        status="error"
        borderRadius="15px"
        variant="subtle"
        bg="rgba(229,62,62,0.12)"
        border="1px solid rgba(229,62,62,0.3)"
      >
        <AlertIcon/>{errorMsg}
      </Alert>
    )
  }
  if (!list.length) {
    return (
      <Alert
        status="info"
        borderRadius="15px"
        variant="subtle"
        bg="rgba(32,174,219,0.10)"
        border="1px solid rgba(32,174,219,0.25)"
      >
        <AlertIcon/>Este diagnóstico no tiene tratamientos.
      </Alert>
    )
  }

  return (
    <Tabs index={tab} onChange={handleTabChange} isLazy lazyBehavior="unmount">
      <TabList>
        {local.map((t) => (
          <Tab key={t.id_tratamiento} isDisabled={tabsLocked}>
            {t.tipo_tratamiento || "Tratamiento"}
          </Tab>
        ))}
      </TabList>

      <TabPanels>
        {local.map((t, i) => {
          const disabled = isDisabled(t.id_tratamiento)
          const editing = !disabled

          return (
            <TabPanel key={t.id_tratamiento}>
              {/* loader a nivel de panel cuando se cambia de tab y está cargando */}
              {i === tab && tabsLocked ? (
                <InlineLoader text="Cargando actividades…" minH="280px" />
              ) : (
                <>
                  <Card bg={BG} borderRadius="xl" boxShadow="lg">
                    <CardBody>
                      <HStack justify="space-between" mb={2}>
                        <Heading size="sm" color={BRAND}>
                          {t.tipo_tratamiento || "Tratamiento"}
                        </Heading>
                        <Button
                          onClick={() => toggleEdit(t.id_tratamiento)}
                          bg={BRAND}
                          color="white"
                          borderRadius="15px"
                          _hover={{ bg: "#109ecb" }}
                          _active={{ bg: "#0e90bb" }}
                          isDisabled={tabsLocked}
                        >
                          {editing ? "Guardar" : "Editar"}
                        </Button>
                      </HStack>

                      <Divider mb={4} />

                      {/* errores de catálogos (si los hay) */}
                      {(errorTT || errorUnidades) && (
                        <Alert
                          status="error"
                          mb={4}
                          variant="subtle"
                          borderRadius="15px"
                          bg="rgba(229,62,62,0.12)"
                          border="1px solid rgba(229,62,62,0.3)"
                        >
                          <AlertIcon />
                          <Box>
                            {errorTT && <Text color="#c53030">Error en tipos de tratamiento: {errorTT}</Text>}
                            {errorUnidades && <Text color="#c53030">Error en unidades: {errorUnidades}</Text>}
                          </Box>
                        </Alert>
                      )}

                      <Grid templateColumns={["1fr", "repeat(2,1fr)"]} gap={4}>
                        {/* Tipo de tratamiento (de API) */}
                        <FormControl>
                          <FormLabel>Tipo de tratamiento</FormLabel>
                          {editing ? (
                            <Select
                              {...inputProps}
                              placeholder={loadingTT ? "Cargando…" : "Selecciona"}
                              value={t.tipo_tratamiento || ""}
                              onChange={e => updateActive({ tipo_tratamiento: e.target.value })}
                              isDisabled={loadingTT || tabsLocked}
                            >
                              {(tiposTrat ?? []).map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </Select>
                          ) : (
                            <Text fontSize="sm" color="gray.800">{t.tipo_tratamiento || "—"}</Text>
                          )}
                        </FormControl>

                        {/* Unidad de atención (de API) */}
                        <FormControl>
                          <FormLabel>Unidad de atención</FormLabel>
                          {editing ? (
                            <Select
                              {...inputProps}
                              placeholder={loadingUnidades ? "Cargando…" : "Selecciona"}
                              value={String(t.unidad_atencion?.id_unidad ?? "")}
                              onChange={e => {
                                const v = e.target.value
                                const found = (unidadesOpts ?? []).find(u => u.value === v)
                                updateActive({
                                  unidad_atencion: found
                                    ? {
                                      id_unidad: Number(found.value),
                                      nombre_unidad: found.label,
                                    }
                                    : { id_unidad: 0, nombre_unidad: "" }
                                })
                              }}
                              isDisabled={loadingUnidades || tabsLocked}
                            >
                              {(unidadesOpts ?? []).map(u => (
                                <option key={u.value} value={u.value}>{u.label}</option>
                              ))}
                            </Select>
                          ) : (
                            <Text fontSize="sm" color="gray.800">
                              {t.unidad_atencion?.nombre_unidad || "—"}
                            </Text>
                          )}
                        </FormControl>

                        {/* Fecha de inicio (DateFieldCalendar) */}
                        <FormControl>
                          <FormLabel>Fecha de inicio</FormLabel>
                          {editing ? (
                            <DateFieldCalendar
                              label=""
                              value={t.fecha_inicio || ""}
                              onChange={(v) => updateActive({ fecha_inicio: v })}
                              inputProps={{ ...inputProps }}
                              brand={BRAND}
                            />
                          ) : (
                            <Text fontSize="sm" color="gray.800">
                              {t.fecha_inicio || "—"}
                            </Text>
                          )}
                        </FormControl>

                        {/* Fecha de fin (DateFieldCalendar) */}
                        <FormControl>
                          <FormLabel>Fecha de fin</FormLabel>
                          {editing ? (
                            <DateFieldCalendar
                              label=""
                              value={t.fecha_fin || ""}
                              onChange={(v) => updateActive({ fecha_fin: v })}
                              inputProps={{ ...inputProps }}
                              brand={BRAND}
                            />
                          ) : (
                            <Text fontSize="sm" color="gray.800">
                              {t.fecha_fin || "—"}
                            </Text>
                          )}
                        </FormControl>

                        <FormControl gridColumn={["auto", "1 / span 2"]}>
                          <FormLabel>Resultado clínico final</FormLabel>
                          {editing ? (
                            <Textarea
                              rows={3}
                              {...inputProps}
                              value={t.resultado_clinico_final || ""}
                              onChange={e => updateActive({ resultado_clinico_final: e.target.value })}
                              isDisabled={tabsLocked}
                            />
                          ) : (
                            <Text fontSize="sm" color="gray.800" whiteSpace="pre-wrap">
                              {t.resultado_clinico_final || "—"}
                            </Text>
                          )}
                        </FormControl>

                        <FormControl gridColumn={["auto", "1 / span 2"]}>
                          <FormLabel>Observaciones</FormLabel>
                          {editing ? (
                            <Textarea
                              rows={3}
                              {...inputProps}
                              value={t.observaciones || ""}
                              onChange={e => updateActive({ observaciones: e.target.value })}
                              isDisabled={tabsLocked}
                            />
                          ) : (
                            <Text fontSize="sm" color="gray.800" whiteSpace="pre-wrap">
                              {t.observaciones || "—"}
                            </Text>
                          )}
                        </FormControl>
                      </Grid>
                    </CardBody>
                  </Card>

                  {/* Actividades SOLO del tab activo */}
                  {i === tab && (
                    <Box mt={6}>
                      {errorActs ? (
                        <Alert
                          status="error"
                          borderRadius="15px"
                          variant="subtle"
                          bg="rgba(229,62,62,0.12)"
                          border="1px solid rgba(229,62,62,0.3)"
                        >
                          <AlertIcon />{errorActs}
                        </Alert>
                      ) : loadingActs && !acts ? (
                        <InlineLoader text="Cargando actividades…" minH="240px" />
                      ) : !acts || acts.length === 0 ? (
                        <Alert
                          status="info"
                          borderRadius="15px"
                          variant="subtle"
                          bg="rgba(32,174,219,0.10)"
                          border="1px solid rgba(32,174,219,0.25)"
                        >
                          <AlertIcon />Sin actividades registradas para este tratamiento.
                        </Alert>
                      ) : (
                        <ActividadesCard
                          actividades={acts}
                          selectedId={selectedId ?? acts[0].id}
                          onSelect={setSelectedId}
                        />
                      )}
                    </Box>
                  )}
                </>
              )}
            </TabPanel>
          )
        })}
      </TabPanels>
    </Tabs>
  )
}
