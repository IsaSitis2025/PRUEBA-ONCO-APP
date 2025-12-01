import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    VStack,
    Spinner,
    Text,
    Box,
} from "@chakra-ui/react"
import {keyframes} from "@emotion/react"

const glow = keyframes`
    0% {
        transform: scale(1);
        box-shadow: 0 0 0 #20aedb66;
    }
    50% {
        transform: scale(1.05);
        box-shadow: 0 0 25px #20aedb99;
    }
    100% {
        transform: scale(1);
        box-shadow: 0 0 0 #20aedb66;
    }
`

type LoaderModalProps = {
    isOpen: boolean
    text?: string
    /** Tamaño del círculo contenedor del spinner */
    sizePx?: number
    /** Opacidad del fondo */
    overlay?: string
}

export default function LoaderModal({
                                        isOpen,
                                        text = "Cargando…",
                                        sizePx = 160,                // grande, ~400px alto total con texto
                                        overlay = "whiteAlpha.700",  // overlay: blanco translúcido
                                    }: LoaderModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {
            }}
            isCentered
            closeOnOverlayClick={false}
            blockScrollOnMount
        >
            <ModalOverlay bg={overlay}/>

            {/* Contenido transparente para que sólo se vea el loader */}
            <ModalContent bg="transparent" boxShadow="none" maxW="unset">
                <ModalBody
                    minH="60vh"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    p={0}
                >
                    <VStack spacing={6}>
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
                        <Text color="#167a99" fontWeight="medium" fontSize="lg" textAlign="center">
                            {text}
                        </Text>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
