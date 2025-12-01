import { Flex, Box, Button, Spacer } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"

export default function Navbar() {
    const nav = useNavigate()
    const user = localStorage.getItem("session_user")

    const logout = () => {
        localStorage.removeItem("session_user")
        nav("/", { replace: true })
    }

    return (
        <Flex
            as="header"
            h="86px"
            align="center"
            px={6}
            borderBottom="1px solid"
            borderColor="whiteAlpha.400"
            bg="#14AAD9"               // color de fondo del navbar
            boxShadow="md"
            color="white"              // texto por defecto blanco
        >
            <Spacer />

            {user && (
                <>
                    <Box fontWeight="medium" mr={4}>
                        {user}
                    </Box>

                    <Button
                        size="sm"
                        bg="white"
                        color="#14AAD9"
                        fontWeight="semibold"
                        _hover={{
                            bg: "whiteAlpha.800",
                            color: "#0f87ac",
                        }}
                        _active={{
                            bg: "whiteAlpha.900",
                            color: "#0d7393",
                        }}
                        onClick={logout}
                    >
                        Salir
                    </Button>
                </>
            )}
        </Flex>
    )
}
