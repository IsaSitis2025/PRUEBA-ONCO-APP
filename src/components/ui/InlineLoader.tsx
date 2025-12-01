// src/components/ui/InlineLoader.tsx
import { Box, Spinner, Text, VStack } from "@chakra-ui/react"
import { keyframes } from "@emotion/react"

const glow = keyframes`
  0% { transform: scale(1);   box-shadow: 0 0 0 #20aedb66; }
  50% { transform: scale(1.05); box-shadow: 0 0 25px #20aedb99; }
  100% { transform: scale(1);  box-shadow: 0 0 0 #20aedb66; }
`

type InlineLoaderProps = {
  /** Texto debajo del spinner */
  text?: string
  /** Diámetro del círculo contenedor */
  sizePx?: number
  /** Altura mínima del contenedor donde se centra el loader */
  minH?: number | string
}

export default function InlineLoader({
                                       text = "Cargando datos…",
                                       sizePx = 140,
                                       minH = "200px",
                                     }: InlineLoaderProps) {
  return (
    <Box
      minH={minH}
      display="flex"
      alignItems="center"
      justifyContent="center"
      w="100%"
    >
      <VStack spacing={5}>
        <Box
          w={`${sizePx}px`}
          h={`${sizePx}px`}
          borderRadius="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
          animation={`${glow} 2s ease-in-out infinite`}
        >
          <Spinner
            thickness="8px"
            speed="0.75s"
            emptyColor="#e2e8f0"
            color="#20aedb"
            boxSize={`${Math.round(sizePx * 0.7)}px`}
          />
        </Box>
        <Text color="#167a99" fontWeight="medium" fontSize="md" textAlign="center">
          {text}
        </Text>
      </VStack>
    </Box>
  )
}
