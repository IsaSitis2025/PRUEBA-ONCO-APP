import { Box, Flex } from "@chakra-ui/react"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"

export default function Layout() {
    return (
        <Flex h="100dvh" bg="white">
            <Sidebar />
            <Flex direction="column" flex="1" minW={0}>
                <Navbar />
                <Box as="main" pl="90px" pt="20px" overflow="auto">
                    <Outlet />
                </Box>
            </Flex>
        </Flex>
    )
}
