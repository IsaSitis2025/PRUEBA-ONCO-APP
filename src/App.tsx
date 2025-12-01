// App.tsx
import { ChakraProvider, Box } from "@chakra-ui/react"
import {
    BrowserRouter, Routes, Route, Navigate, Outlet, useLocation
} from "react-router-dom"
import LoginPage from "./pages/Login/LoginPage"
import DashboardPage from "./pages/Dashboard/DashboardPage"
import PacienteForm from "./pages/Pacientes/PacienteForm"
import DiagnosticoPage from "./pages/Diagnostico/DiagnosticoPage"
import Layout from "./components/layout/Layout"
import UploadModal from "./components/ui/UploadModal"

const AUTH_KEY = "session_user"

function Protected() {
    const isLogged = !!localStorage.getItem(AUTH_KEY)
    return isLogged ? <Outlet /> : <Navigate to="/" replace />
}

// para que si ya estás logueado y vas a "/", te mande al dashboard
function PublicOnly() {
    const isLogged = !!localStorage.getItem(AUTH_KEY)
    return isLogged ? <Navigate to="/dashboard" replace /> : <Outlet />
}

function AppRoutes() {
    const location = useLocation()
    const state = location.state as { background?: Location } | undefined

    return (
        <>
            <Routes location={state?.background || location}>
                {/* Login (pública pero si ya hay sesión va al dash) */}
                <Route element={<PublicOnly />}>
                    <Route path="/" element={<LoginPage />} />
                </Route>

                {/* Rutas protegidas */}
                <Route element={<Protected />}>
                    <Route element={<Layout />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/paciente" element={<PacienteForm />} />
                        <Route path="/diagnostico" element={<DiagnosticoPage />} />
                        {/* fondo del modal */}
                        <Route path="/archivos" element={<DashboardPage />} />
                    </Route>
                </Route>

                <Route path="*" element={<Box p={6}>404</Box>} />
            </Routes>

            {/* Modal superpuesto con background */}
            {state?.background && (
                <Routes>
                    <Route element={<Protected />}>
                        <Route element={<Layout />}>
                            <Route path="/archivos" element={<UploadModal isOpen />} />
                        </Route>
                    </Route>
                </Routes>
            )}
        </>
    )
}

export default function App() {
    return (
        <ChakraProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </ChakraProvider>
    )
}
