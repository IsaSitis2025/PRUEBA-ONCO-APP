import { Box } from "@chakra-ui/react"
import React from "react"
import MAPA_BG from "../../../../assets/mapa.png" // ajusta la ruta si tu asset vive en otro lugar

type MiniMapProps = {
  imageSrc?: string
  overlayOpacity?: number
  height?: number | string
  borderRadius?: string | number
  children?: React.ReactNode // por si quieres pines/overlays personalizados
}

/**
 * Componente de mapa estático con una ligera capa de overlay para que resalten pines.
 * Usa background-image; cualquier children se posiciona con absolute.
 */
export default function MiniMap({
                                  imageSrc = MAPA_BG,
                                  overlayOpacity = 0.1,
                                  height = 280,
                                  borderRadius = "lg",
                                  children,
                                }: MiniMapProps) {
  return (
    <Box
      position="relative"
      h={typeof height === "number" ? `${height}px` : height}
      border="1px solid"
      borderColor="gray.200"
      borderRadius={borderRadius}
      overflow="hidden"
      bg="white"
      backgroundImage={`url(${imageSrc})`}
      backgroundSize="cover"
      backgroundPosition="center"
      role="img"
      aria-label="Mapa de distribución geográfica"
    >
      {/* velo sutil */}
      <Box position="absolute" inset={0} bg={`rgba(255,255,255,${overlayOpacity})`} />
      {/* capa de pines/overlays */}
      <Box position="absolute" inset={0} pointerEvents="none">
        {children}
      </Box>
    </Box>
  )
}
