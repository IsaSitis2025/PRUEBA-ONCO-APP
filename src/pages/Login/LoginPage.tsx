import {
    Box, Button, Card, CardBody, Heading, Input, Stack,
    FormControl, FormErrorMessage, Image, Text, InputGroup,
    InputRightElement, IconButton, HStack, Tooltip, Divider
} from "@chakra-ui/react"
import {ViewIcon, ViewOffIcon} from "@chakra-ui/icons"
import {LuInfo} from "react-icons/lu"
import {useNavigate} from "react-router-dom"
import React, {useEffect, useState} from "react"
import LOGO from "../../assets/logo.png"
import FONDO from "../../assets/fondo_login.webp"

const AUTH_KEY = "session_user"
const VALID_USER = "admin"
const VALID_PASS = "admin"

const COLOR = {
    brand700: "#14aad8",
    brand900: "#1297c1",
    brand500: "#1E88E5",
    accent: "#B5CE22",
}

const PANEL_LEFT_PX = 120

export default function LoginPage() {
    const nav = useNavigate()
    const [user, setUser] = useState("")
    const [pass, setPass] = useState("")
    const [error, setError] = useState("")
    const [showPass, setShowPass] = useState(false)

    useEffect(() => {
        if (localStorage.getItem(AUTH_KEY)) nav("/dashboard", {replace: true})
    }, [nav])

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (user === VALID_USER && pass === VALID_PASS) {
            localStorage.setItem(AUTH_KEY, VALID_USER)
            nav("/dashboard", {replace: true})
        } else setError("Usuario o contraseña incorrectos")
    }

    return (
        <Box minH="100dvh" position="relative" overflow="hidden">
            {/* === FONDO === */}
            <Box
                position="absolute" inset={0}
                bgImage={`url(${FONDO})`}
                bgSize="cover"
                bgPosition="center"
                bgRepeat="no-repeat"
                bgColor="#0b2536"
            />

            {/* === CONTENIDO CENTRADO === */}
            <Box
                position="relative"
                display="flex"
                alignItems="center"
                justifyContent="center"
                minH="100vh"
                zIndex={1}
            >
                {/* === PANEL BLANCO TRANSLÚCIDO (opacidad ajustada) === */}
                <Box
                    display="flex"
                    width="1500px"
                    height="600px"
                    alignItems="center"
                    justifyContent="center"
                    px={[4, 8, 12]}
                    borderRadius="xl"
                    boxShadow="2xl"
                    bg="rgba(255,255,255,0.73)"    // <--- subimos opacidad aquí
                    backdropFilter="blur(6px)"
                    _dark={{bg: "rgba(255,255,255,0.95)"}}
                >
                    <Box w={["100%", `calc(100% - ${PANEL_LEFT_PX}px)`]}>
                        <Box
                            display="grid"
                            gridTemplateColumns={["1fr", "1fr 420px"]}
                            gap={[8, 12]}
                            alignItems="center"
                        >
                            {/* TEXTOS */}
                            <Box color="white">
                                <HStack spacing={3} mb={[4, 6]}>
                                    <Image
                                        src={LOGO}
                                        alt="SITIS"
                                        boxSize={["72px", "92px"]}
                                        objectFit="contain"
                                        bg={COLOR.brand900}
                                        borderRadius="full"
                                        p="6px"
                                    />
                                    <Text fontWeight="semibold" fontSize={["md", "xl"]} color={COLOR.brand900}>
                                        Sistemas Confiables · Atención Humana
                                    </Text>
                                </HStack>

                                <Heading
                                    fontSize={["3xl", "5xl"]}
                                    mb={[2, 3]}
                                    color={COLOR.brand700}
                                    lineHeight="1.05"
                                >
                                    Plataforma Oncológica
                                </Heading>

                                <Text fontSize={["md", "lg"]} maxW="680px" color={COLOR.brand900} opacity={0.95}>
                                    Centraliza pacientes, diagnósticos y tratamientos. Subida de archivos y panel con
                                    indicadores clave.
                                </Text>
                            </Box>

                            {/* LOGIN CARD (también un poco menos transparente) */}
                            <Card bg="rgba(255,255,255,0.95)">
                                <CardBody p={[6, 8]}>
                                    <Heading size="lg" textAlign="center" color={COLOR.brand700} mb={6}>
                                        Login
                                    </Heading>

                                    <form onSubmit={onSubmit}>
                                        <Stack spacing={4}>
                                            <FormControl isInvalid={!!error}>
                                                <Input
                                                    placeholder="Usuario"
                                                    value={user}
                                                    onChange={e => {
                                                        setUser(e.target.value);
                                                        setError("")
                                                    }}
                                                    bg="white"
                                                    color={COLOR.brand900}
                                                    _placeholder={{color: COLOR.brand700}}
                                                    borderColor={COLOR.brand700}
                                                    _hover={{borderColor: COLOR.brand700}}
                                                    _focus={{boxShadow: `0 0 0 2px ${COLOR.brand700}`}}
                                                    autoFocus
                                                />
                                            </FormControl>

                                            <FormControl isInvalid={!!error}>
                                                <InputGroup>
                                                    <Input
                                                        placeholder="Contraseña"
                                                        type={showPass ? "text" : "password"}
                                                        value={pass}
                                                        color={COLOR.brand900}
                                                        onChange={e => {
                                                            setPass(e.target.value);
                                                            setError("")
                                                        }}
                                                        bg="white"
                                                        _placeholder={{color: COLOR.brand700}}
                                                        borderColor={COLOR.brand700}
                                                        _hover={{borderColor: COLOR.brand700}}
                                                        _focus={{boxShadow: `0 0 0 2px ${COLOR.brand700}`}}
                                                    />
                                                    <InputRightElement>
                                                        <IconButton
                                                            aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                                                            size="sm"
                                                            variant="ghost"
                                                            color={COLOR.brand700}
                                                            icon={showPass ? <ViewOffIcon/> : <ViewIcon/>}
                                                            onClick={() => setShowPass(s => !s)}
                                                        />
                                                    </InputRightElement>
                                                </InputGroup>
                                                <FormErrorMessage>{error}</FormErrorMessage>
                                            </FormControl>

                                            <HStack spacing={2} justify="space-between">
                                                <HStack spacing={1}>
                                                    <Text fontSize="sm" color={COLOR.brand700}>¿Recordar
                                                        credenciales?</Text>
                                                    <Tooltip
                                                        hasArrow placement="right"
                                                        bg="white" borderRadius="10px"
                                                        color={COLOR.brand900}
                                                        label={
                                                            <Box>
                                                                <Text>Usuario: <b>admin</b></Text>
                                                                <Text>Contraseña: <b>admin</b></Text>
                                                            </Box>
                                                        }
                                                    >
                                                        <IconButton aria-label="Info" icon={<LuInfo/>} size="xs"
                                                                    variant="ghost" color={COLOR.brand700}/>
                                                    </Tooltip>
                                                </HStack>
                                                <Box/>
                                            </HStack>

                                            <Button
                                                type="submit"
                                                bg={COLOR.brand700}
                                                color="white"
                                                _hover={{filter: "brightness(0.95)"}}
                                                size="lg"
                                                borderRadius="md"
                                            >
                                                Entrar
                                            </Button>

                                            <Divider/>
                                            <Text fontSize="sm" textAlign="center" color={COLOR.brand700}>
                                                ¿Nuevo en la plataforma?{" "}
                                                <Box as="span" color={COLOR.brand900} fontWeight="semibold"
                                                     cursor="pointer">
                                                    Contáctanos
                                                </Box>
                                            </Text>
                                        </Stack>
                                    </form>
                                </CardBody>
                            </Card>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
