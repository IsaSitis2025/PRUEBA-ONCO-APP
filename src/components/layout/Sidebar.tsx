import {
    Box, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody,
    VStack, Text, useDisclosure, Image, Flex, Tooltip, Icon
} from "@chakra-ui/react"
import { NavLink, useLocation } from "react-router-dom"
import { FiHome, FiUser, FiActivity, FiUpload } from "react-icons/fi"
import LOGO from "../../assets/logo_circulo.png"
import React from "react"

const NAV_ITEMS = [
    { to: "/dashboard",   label: "Dashboard",        icon: FiHome },
    { to: "/paciente",    label: "Datos personales", icon: FiUser },
    { to: "/diagnostico", label: "Diagnóstico",      icon: FiActivity },
    { to: "/archivos",    label: "Subir archivos",   icon: FiUpload },
]

const COLOR_W     = "rgba(18, 151, 193, 0.95)"
const DRAWER_W    = "260px"
const RAIL_W      = "80px"
const SIDEBAR_BG  = "rgba(20, 170, 217,0.95)"
const BASE_TEXT   = "white"

// usa el mismo tamaño en ambos logos:
const LOGO_SIZE   = 56
const LOGO_RADIUS = "full"

// para alinear: desplazamos el header del Drawer
// de modo que el borde izquierdo del logo caiga donde estaba el del rail
const DRAWER_HEADER_PL = `calc((${RAIL_W} - ${LOGO_SIZE}px) / 2)`

export default function Sidebar() {
    const location = useLocation()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toggle = () => (isOpen ? onClose() : onOpen())

    return (
        <>
            {/* === RAIL COLAPSADO === */}
            <Box
                position="fixed"
                left={0}
                top={0}
                bottom={0}
                w={RAIL_W}
                bg={isOpen ? "transparent" : SIDEBAR_BG}
                transition="background-color .2s ease, box-shadow .2s ease"
                boxShadow={isOpen ? "none" : "md"}
                zIndex={20}
                display="flex"
                flexDirection="column"
                alignItems="center"
                pt={4}
                cursor="pointer"
                onClick={toggle}
            >
                {/* ocultamos el logo del rail cuando el drawer está abierto */}
                <Image
                    src={LOGO}
                    alt="OncoApp"
                    boxSize={`${LOGO_SIZE}px`}
                    borderRadius={LOGO_RADIUS}
                    bg="white"
                    p="6px"
                    mb={4}
                    opacity={isOpen ? 0 : 1}
                    transition="opacity .2s ease"
                />

                <VStack spacing={3} mt={2} w="full">
                    {NAV_ITEMS.map(({ to, label, icon: Ico }) => (
                        <Tooltip key={to} label={label} placement="right" hasArrow>
                            <Box
                                as={NavLink}
                                to={to}
                                state={to === "/archivos" ? { background: location } : undefined}
                                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                w="44px"
                                h="44px"
                                mx="auto"
                                display="grid"
                                placeItems="center"
                                borderRadius="15px"
                                color={BASE_TEXT}
                                border="1px solid"
                                borderColor={BASE_TEXT}
                                bg="transparent"
                                transition="all 0.2s ease"
                                textDecoration="none"
                                _hover={{
                                    color: COLOR_W,
                                    bg: "white",
                                    borderColor: "transparent",
                                }}
                                sx={{
                                    "&.active": {
                                        color: COLOR_W,
                                        bg: "white",
                                        borderColor: "transparent",
                                    },
                                }}
                                className={({ isActive }: { isActive: boolean }) =>
                                    isActive ? "active" : ""
                                }
                            >
                                <Ico size={20} />
                            </Box>
                        </Tooltip>
                    ))}
                </VStack>
            </Box>

            {/* === DRAWER EXPANDIDO === */}
            <Drawer
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                blockScrollOnMount={false}
                closeOnOverlayClick
            >
                <DrawerOverlay bg="rgba(0,0,0,0.2)" onClick={onClose} />
                <DrawerContent
                    w={DRAWER_W}
                    bg={SIDEBAR_BG}
                    color={BASE_TEXT}
                    pt={4}
                    zIndex={30}
                >
                    {/* padding-left calculado para que el logo coincida con el del rail */}
                    <DrawerHeader
                        borderBottomWidth="1px"
                        borderColor="whiteAlpha.300"
                        pl={DRAWER_HEADER_PL}
                    >
                        <Flex align="center" gap={3}>
                            <Image
                                src={LOGO}
                                alt="OncoApp"
                                boxSize={`${LOGO_SIZE}px`}
                                objectFit="contain"
                                bg="white"
                                borderRadius={LOGO_RADIUS}
                                p="6px"
                            />
                            <Text fontWeight="bold" fontSize="lg">OncoApp</Text>
                        </Flex>
                    </DrawerHeader>

                    <DrawerBody>
                        <VStack align="stretch" spacing={2} mt={4}>
                            {NAV_ITEMS.map(({ to, label, icon: Ico }) => (
                                <Box
                                    key={to}
                                    as={NavLink}
                                    to={to}
                                    state={to === "/archivos" ? { background: location } : undefined}
                                    onClick={onClose}
                                    display="flex"
                                    alignItems="center"
                                    gap="8px"
                                    px={3}
                                    py={2}
                                    borderRadius="8px"
                                    color={BASE_TEXT}
                                    textDecoration="none"
                                    bg="transparent"
                                    transition="all 0.2s ease"
                                    _hover={{
                                        color: COLOR_W,
                                        bg: "white",
                                    }}
                                    sx={{
                                        "&.active": {
                                            color: COLOR_W,
                                            bg: "white",
                                        },
                                    }}
                                    className={({ isActive }: { isActive: boolean }) =>
                                        isActive ? "active" : ""
                                    }
                                >
                                    <Icon as={Ico} boxSize={5} />
                                    <Text>{label}</Text>
                                </Box>
                            ))}
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}
