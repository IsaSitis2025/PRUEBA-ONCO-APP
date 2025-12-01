import {
    Card,
    CardBody,
    Grid,
    GridItem,
    Image,
    Box,
    FormControl,
    FormLabel,
    Grid as ChGrid,
    Button,
    Collapse,
    Divider,
    HStack,
    Spacer,
    Text,
    VisuallyHidden
} from "@chakra-ui/react"
import {useMemo, useState, useEffect} from "react"
import {Link as RouterLink} from "react-router-dom"
import type {Seguridad} from "../../../types/paciente.ts";

/* 🩺 Tipo de datos del paciente */
export type PacienteMini = {
    foto_url: string
    nombres: string
    apellido_paterno: string
    apellido_materno: string
    sexo: "Femenino" | "Masculino" | ""
    fecha_nacimiento: string // yyyy-mm-dd
    seguridad_social: Seguridad
    seguridad_social_otro?: string
    peso?: string
    talla?: string
    presion_arterial?: string
    frecuencia_cardiaca?: string
    temperatura?: string
    tipo_sangre?: string
}

/* 🎨 Colores del tema */
const BG = "#e2e8f0"
const cInput = "#20aedb"

/* 📸 Imagen genérica por defecto (SVG embebido, no expira) */
const FALLBACK_SVG =
    "data:image/svg+xml;utf8,\
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'>\
  <rect width='128' height='128' rx='16' fill='%23f7fafc'/>\
  <circle cx='64' cy='48' r='24' fill='%23a0aec0'/>\
  <path d='M20 108c0-22 18-36 44-36s44 14 44 36' fill='%23cbd5e0'/>\
  </svg>"

/* 🗓️ Formatea yyyy-mm-dd a dd/mm/yyyy */
function formatFecha(fecha?: string) {
    if (!fecha) return ""
    const [y, m, d] = fecha.split("-")
    if (!y || !m || !d) return ""
    const ok = /^\d{4}$/.test(y) && /^\d{2}$/.test(m) && /^\d{2}$/.test(d)
    return ok ? `${d}/${m}/${y}` : ""
}

/* 📋 Campo de solo lectura */
function FieldView({label, value}: { label: string; value?: string }) {
    const display = value?.toString().trim() ? value : "—"
    return (
        <FormControl>
            <FormLabel color={cInput} fontWeight="semibold" mb={1}>
                {label}
            </FormLabel>
            <Text
                as="div"
                px={3}
                py={2}
                fontSize="sm"
                color="gray.800"
                lineHeight="1.35"
                userSelect="text"
            >
                {display}
            </Text>
        </FormControl>
    )
}

/* 🧠 Tarjeta del paciente */
export default function PacienteMiniCard({
                                             data,
                                             historialHref = "/historial-clinico",
                                         }: {
    data: PacienteMini
    historialHref?: string
}) {
    const [showInfo, setShowInfo] = useState(false)

    // ✅ controla la foto y su fallback
    const [imgSrc, setImgSrc] = useState<string>(data.foto_url?.trim() || FALLBACK_SVG)
    useEffect(() => {
        setImgSrc(data.foto_url?.trim() || FALLBACK_SVG)
    }, [data.foto_url])

    const seguridad = useMemo(() => {
        return data.seguridad_social === "Otro"
            ? `Otro — ${data.seguridad_social_otro || ""}`.trim()
            : data.seguridad_social
    }, [data.seguridad_social, data.seguridad_social_otro])

    const fechaNice = useMemo(() => formatFecha(data.fecha_nacimiento), [data.fecha_nacimiento])
    const nombreCompleto = `${data.nombres || ""} ${data.apellido_paterno || ""} ${data.apellido_materno || ""}`.trim()

    return (
        <Card bg={BG} borderRadius="xl" boxShadow="lg">
            <CardBody>
                <Grid templateColumns={["1fr", "220px 1fr"]} gap={6} alignItems="start">
                    {/* 🖼️ Foto o imagen por defecto */}
                    <GridItem>
                        <Image
                            src={imgSrc}
                            alt={nombreCompleto ? `Foto de ${nombreCompleto}` : "Foto del paciente"}
                            boxSize="160px"
                            objectFit="cover"
                            borderRadius="md"
                            border="1px dashed"
                            borderColor={cInput}
                            bg="white"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            crossOrigin="anonymous"
                            onError={() => setImgSrc(FALLBACK_SVG)}
                        />

                        <Box mt={2} fontSize="sm" color="gray.600">
                            {data.foto_url?.trim() ? "" : "Imagen por defecto"}
                        </Box>
                    </GridItem>

                    {/* 🧾 Datos del paciente */}
                    <GridItem>
                        <ChGrid templateColumns={["1fr", "repeat(2,1fr)"]} gap={4}>
                            <FieldView label="Nombres" value={data.nombres}/>
                            <FieldView label="Apellido paterno" value={data.apellido_paterno}/>
                            <FieldView label="Apellido materno" value={data.apellido_materno}/>
                            <FieldView label="Sexo" value={data.sexo}/>
                            <FieldView label="Fecha de nacimiento" value={fechaNice}/>
                            <FieldView label="Tipo de seguridad social" value={seguridad}/>
                        </ChGrid>

                        {/* 🔘 Botones */}
                        <HStack mt={4}>
                            <Button
                                size="sm"
                                bg={cInput}
                                color="white"
                                _hover={{bg: "#109ecb"}}
                                _active={{bg: "#0e90bb"}}
                                borderRadius="15px"
                                onClick={() => setShowInfo((v) => !v)}
                                aria-expanded={showInfo}
                                aria-controls="panel-info-medica"
                            >
                                {showInfo ? "Ocultar info médica" : "Info médica"}
                            </Button>
                            <Spacer/>
                            <Button
                                size="sm"
                                as={RouterLink}
                                to={historialHref}
                                variant="outline"
                                borderColor={cInput}
                                color={cInput}
                                _hover={{bg: cInput, color: "white"}}
                                borderRadius="15px"
                            >
                                Historial clínico
                            </Button>
                        </HStack>

                        {/* 🩺 Info médica */}
                        <Collapse in={showInfo} animateOpacity>
                            <VisuallyHidden aria-live="polite">
                                {showInfo ? "Información médica visible" : "Información médica oculta"}
                            </VisuallyHidden>

                            <Divider my={4}/>
                            <ChGrid
                                id="panel-info-medica"
                                templateColumns={["1fr", "repeat(2,1fr)"]}
                                gap={4}
                            >
                                <FieldView label="Peso" value={data.peso}/>
                                <FieldView label="Talla" value={data.talla}/>
                                <FieldView label="Presión arterial" value={data.presion_arterial}/>
                                <FieldView
                                    label="Frecuencia cardíaca"
                                    value={data.frecuencia_cardiaca}
                                />
                                <FieldView label="Temperatura" value={data.temperatura}/>
                                <FieldView label="Tipo de sangre" value={data.tipo_sangre}/>
                            </ChGrid>
                        </Collapse>
                    </GridItem>
                </Grid>
            </CardBody>
        </Card>
    )
}
