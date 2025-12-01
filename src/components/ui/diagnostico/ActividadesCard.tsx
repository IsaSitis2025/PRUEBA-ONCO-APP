import {
  Box, Card, CardBody, Grid, GridItem, Heading, HStack, Text, Badge, Button,
  FormControl, FormLabel, Input, Textarea, Image, VStack, Divider,
  Alert, AlertIcon, Select,
} from "@chakra-ui/react"
import { BRAND, inputProps } from "../../../constants/ui"
import type { Actividad } from "../../../types/actividad"
import { useEffect, useMemo, useState } from "react"

// 🔹 catálogos (unidades para Select)
import { useUnidadesOptions } from "../../../hooks/catalogos"
import Cancer_A from "../../../assets/cancer/cancer_a.avif"
import Cancer_B from "../../../assets/cancer/cancer_b.webp"
import Cancer_C from "../../../assets/cancer/cancer_c.webp"
import Cancer_D from "../../../assets/cancer/cancer_d.webp"
import Cancer_E from "../../../assets/cancer/cancer_e.webp"
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons"

const DUMMIES = [Cancer_A, Cancer_B, Cancer_C, Cancer_D, Cancer_E] as const;

// 🔹 date picker de la app
import DateFieldCalendar from "../forms/DateFieldCalendar"

type Props = {
  actividades: Actividad[]
  selectedId: number | null
  onSelect: (id: number) => void
}

// logica para randominzar imagenes
function isLikelyImageUrl(src?: string | null) {
  if (!src) return false;
  const s = src.trim();
  // Acepta http(s), data-uri, blobs y rutas locales de assets (webpack/vite)
  if (!/^(https?:\/\/|data:image\/|blob:|\/|\.{1,2}\/)/i.test(s)) return false;
  // Si trae extensión conocida, mejor
  if (/\.(png|jpe?g|webp|gif|avif|svg)(\?.*)?$/i.test(s)) return true;
  // También puede ser data-uri o blob sin extensión
  if (/^(data:image\/|blob:)/i.test(s)) return true;
  // Último recurso: aceptamos rutas sin extensión (assets bundlers)
  return true;
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function takeN<T>(arr: T[], n: number): T[] {
  return arr.slice(0, Math.max(0, Math.min(n, arr.length)));
}
/** Ítem de selección tipo “card” (sin RadioCard, compatible Chakra v2) */
function ActivityCardItem({
                            selected,
                            onClick,
                            title,
                            subtitle,
                          }: {
  selected: boolean
  onClick: () => void
  title: string
  subtitle?: string
}) {
  return (
    <Box
      as="button"
      type="button"
      onClick={onClick}
      textAlign="left"
      w="100%"
      px={3}
      py={3}
      border="1px solid"
      borderColor={selected ? BRAND : "gray.200"}
      borderRadius="md"
      bg={selected ? "white" : "gray.50"}
      _hover={{ borderColor: BRAND, bg: "white" }}
      _active={{ transform: "scale(0.99)" }}
      transition="all 120ms ease"
    >
      <HStack justify="space-between" align="center">
        <Box>
          <Text fontWeight="semibold" color="gray.800">
            {title}
          </Text>
          {subtitle && (
            <Badge fontSize="sm" color="gray.600">
              {subtitle}
            </Badge>
          )}
        </Box>
      </HStack>
    </Box>
  )
}

export default function ActividadesCard({ actividades, selectedId, onSelect }: Props) {
  const [editMap, setEditMap] = useState<Record<number, boolean>>({})
  const [local, setLocal] = useState<Actividad[]>(actividades)
  // ⬇️ si la imagen “llega mal” y falla al cargar, forzamos dummy
  const [imgErrorMap, setImgErrorMap] = useState<Record<number, boolean>>({})

  const [carIndex, setCarIndex] = useState(0);


  const next = () => setCarIndex(i => (i + 1) % carouselPack.length)
  const prev = () => setCarIndex(i => (i - 1 + carouselPack.length) % carouselPack.length)
  // sincroniza cuando cambian las actividades desde el padre
  useEffect(() => {
    setLocal(actividades ?? [])
  }, [actividades])

  const selected = useMemo(
    () => local.find(a => a.id === selectedId) || null,
    [local, selectedId]
  )

  const isEditing = selected ? editMap[selected.id] : false
  const toggleEdit = () =>
    selected && setEditMap(m => ({ ...m, [selected.id]: !m[selected.id] }))

  const update = (patch: Partial<Actividad>) => {
    if (!selected) return
    setLocal(list => list.map(a => (a.id === selected.id ? { ...a, ...patch } : a)))
  }
  // ⬇️ baraja las 5 dummy SOLO cuando cambia la actividad seleccionada
  const shuffledDummies = useMemo(() => shuffle([...DUMMIES]), [selected?.id])

  // ⬇️ decide si usar dummy: no hay src válido o ya falló al cargar
  const shouldShowDummy = useMemo(() => {
    if (!selected) return true
    const badByError = imgErrorMap[selected.id]
    const badByFormat = !isLikelyImageUrl(selected.archivo)
    return badByError || badByFormat
  }, [imgErrorMap, selected])

  // 🔹 catálogo de unidades para Select
  const {
    data: unidadesOpts, // [{ value: "16", label: "Médica Sur - Unidad 3" }, ...]
    loading: loadingUnidades,
    error: errorUnidades,
  } = useUnidadesOptions()

  // resetea índice cuando cambia actividad

  useEffect(() => { setCarIndex(0) }, [selected?.id])

// 2 o 3 según la regla que prefieras:
  const packSize = useMemo(() => {
    if (!selected) return 2;
    return selected.id % 2 === 0 ? 2 : 3; // par→2, impar→3
  }, [selected?.id])

  const carouselPack = useMemo(
    () => takeN(shuffledDummies, packSize),
    [shuffledDummies, packSize]
  )

  return (
    <Card bg="#e2e8f0" borderRadius="xl" boxShadow="lg">
      <CardBody>
        <Heading size="sm" mb={4}>
          Actividades
        </Heading>

        {!!errorUnidades && (
          <Alert status="error" mb={4} variant="subtle" borderRadius="15px" bg="rgba(229,62,62,0.12)" border="1px solid rgba(229,62,62,0.3)">
            <AlertIcon />
            {errorUnidades}
          </Alert>
        )}

        {!local.length ? (
          <Alert status="info" borderRadius="15px" variant="subtle" bg="rgba(32,174,219,0.10)" border="1px solid rgba(32,174,219,0.25)">
            <AlertIcon />
            No hay actividades registradas para este tratamiento.
          </Alert>
        ) : (
          <Grid templateColumns={["1fr", "260px 1fr"]} gap={4}>
            {/* Lista vertical de actividades */}
            <GridItem>
              <VStack align="stretch" spacing={3}>
                {local.map(a => (
                  <ActivityCardItem
                    key={a.id}
                    selected={a.id === selectedId}
                    onClick={() => onSelect(a.id)}
                    title={a.tipo || "Actividad"}
                    subtitle={a.fecha || "—"}
                  />
                ))}
              </VStack>
            </GridItem>

            {/* Panel de detalle */}
            <GridItem>
              {!selected ? (
                <Alert status="info" borderRadius="15px" variant="subtle" bg="rgba(32,174,219,0.10)" border="1px solid rgba(32,174,219,0.25)">
                  <AlertIcon />
                  Selecciona una actividad para ver el detalle.
                </Alert>
              ) : (
                <Box
                  bg="white"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="lg"
                  p={4}
                >
                  <HStack justify="space-between" mb={2}>
                    <Heading size="sm" color={BRAND}>
                      {selected.tipo || "Actividad"}
                    </Heading>
                    <Button
                      onClick={toggleEdit}
                      bg={BRAND}
                      color="white"
                      borderRadius="15px"
                      _hover={{ bg: "#109ecb" }}
                      _active={{ bg: "#0e90bb" }}
                    >
                      {isEditing ? "Guardar" : "Editar"}
                    </Button>
                  </HStack>

                  <Divider mb={4} />

                  <Grid templateColumns={["1fr", "1fr 1fr"]} gap={4}>
                    {/* Unidad de atención (Select desde API) */}
                    <FormControl>
                      <FormLabel>Unidad de atención</FormLabel>
                      {isEditing ? (
                        <Select
                          {...inputProps}
                          placeholder={loadingUnidades ? "Cargando…" : "Selecciona"}
                          value={String(selected.id_unidad ?? "")}
                          onChange={e => {
                            const v = e.target.value
                            const found = (unidadesOpts ?? []).find(u => u.value === v)
                            update({
                              id_unidad: found ? Number(found.value) : undefined,
                              unidad_nombre: found?.label || "",
                            })
                          }}
                          isDisabled={loadingUnidades}
                        >
                          {(unidadesOpts ?? []).map(u => (
                            <option key={u.value} value={u.value}>{u.label}</option>
                          ))}
                        </Select>
                      ) : (
                        <Read value={selected.unidad_nombre} />
                      )}
                    </FormControl>

                    {/* Médico responsable */}
                    <FormControl>
                      <FormLabel>Médico responsable</FormLabel>
                      {isEditing ? (
                        <Input
                          {...inputProps}
                          value={selected.medico || ""}
                          onChange={e => update({ medico: e.target.value })}
                        />
                      ) : (
                        <Read value={selected.medico} />
                      )}
                    </FormControl>

                    {/* Fecha (DateFieldCalendar propio) */}
                    <FormControl>
                      <FormLabel>Fecha</FormLabel>
                      {isEditing ? (
                        <DateFieldCalendar
                          label=""
                          value={selected.fecha || ""}
                          onChange={(v) => update({ fecha: v })}
                          inputProps={{ ...inputProps }}
                          reqSx={{ color: BRAND }}
                          brand={BRAND}
                        />
                      ) : (
                        <Read value={selected.fecha} />
                      )}
                    </FormControl>

                    {/* Procedimiento */}
                    <FormControl>
                      <FormLabel>Procedimiento</FormLabel>
                      {isEditing ? (
                        <Input
                          {...inputProps}
                          value={selected.procedimiento || ""}
                          onChange={e => update({ procedimiento: e.target.value })}
                        />
                      ) : (
                        <Read value={selected.procedimiento} />
                      )}
                    </FormControl>

                    {/* Observaciones */}
                    <FormControl gridColumn={["auto", "1 / span 2"]}>
                      <FormLabel>Observaciones</FormLabel>
                      {isEditing ? (
                        <Textarea
                          rows={4}
                          {...inputProps}
                          value={selected.observaciones || ""}
                          onChange={e => update({ observaciones: e.target.value })}
                        />
                      ) : (
                        <Read value={selected.observaciones} multiline />
                      )}
                    </FormControl>

                    {/* Resultado clínico */}
                    <FormControl gridColumn={["auto", "1 / span 2"]}>
                      <FormLabel>Resultado clínico</FormLabel>
                      {isEditing ? (
                        <Textarea
                          rows={4}
                          {...inputProps}
                          value={selected.resultado || ""}
                          onChange={e => update({ resultado: e.target.value })}
                        />
                      ) : (
                        <Read value={selected.resultado} multiline />
                      )}
                    </FormControl>

                    {/* Imagen / evidencia */}
                    <Box gridColumn={["auto", "1 / span 2"]} mt={2}>
                      <FormLabel>Imagen / archivo</FormLabel>

                      {!selected ? null : shouldShowDummy ? (
                        // Carrusel dummy (2 o 3 imágenes)
                        <Box position="relative">
                          <Image
                            src={carouselPack[carIndex]}
                            alt={`Imagen dummy ${carIndex + 1} de ${carouselPack.length}`}
                            maxH="520px"
                            w="100%"
                            objectFit="cover"
                            borderRadius="md"
                            border="1px solid"
                            borderColor="gray.200"
                          />

                          <HStack position="absolute" top="50%" left={2} transform="translateY(-50%)">
                            <Button size="sm" onClick={prev} borderRadius="full" bg="white" _hover={{ bg: "gray.100" }}>
                              <ChevronLeftIcon />
                            </Button>
                          </HStack>
                          <HStack position="absolute" top="50%" right={2} transform="translateY(-50%)">
                            <Button size="sm" onClick={next} borderRadius="full" bg="white" _hover={{ bg: "gray.100" }}>
                              <ChevronRightIcon />
                            </Button>
                          </HStack>

                          <HStack justify="center" mt={2} spacing={1}>
                            {carouselPack.map((_, i) => (
                              <Box
                                key={i}
                                w="8px"
                                h="8px"
                                borderRadius="full"
                                bg={i === carIndex ? BRAND : "gray.300"}
                              />
                            ))}
                          </HStack>
                        </Box>
                      ) : (
                        // Imagen real con fallback a dummy por onError
                        <Image
                          src={selected.archivo as string}
                          alt="Evidencia de la actividad"
                          maxH="220px"
                          objectFit="cover"
                          borderRadius="md"
                          border="1px solid"
                          borderColor="gray.200"
                          onError={() => {
                            if (!selected) return
                            setImgErrorMap(m => ({ ...m, [selected.id]: true }))
                          }}
                        />
                      )}
                    </Box>

                  </Grid>
                </Box>
              )}
            </GridItem>
          </Grid>
        )}
      </CardBody>
    </Card>
  )
}

function Read({ value, multiline }: { value?: string; multiline?: boolean }) {
  const display = value?.toString().trim() || "—"
  return (
    <Box px={3} py={2} bg="white" border="1px solid" borderColor="gray.200" borderRadius="15px">
      <Text whiteSpace={multiline ? "pre-wrap" : "normal"} fontSize="sm" color="gray.800">
        {display}
      </Text>
    </Box>
  )
}
