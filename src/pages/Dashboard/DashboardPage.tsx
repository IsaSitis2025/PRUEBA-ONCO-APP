import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react"

// === Componentes de UI (tu estructura actual) ===
import CancerTypesPie from "../../components/ui/dashboard/charts/CancerTypesPie"
import TreatmentCostBar from "../../components/ui/dashboard/charts/TreatmentCostBar"
import InventarioBar from "../../components/ui/dashboard/charts/InventarioBar"
import EdadCancerStacked from "../../components/ui/dashboard/charts/EdadCancerStacked"

// === Paleta y colores ===
import { BG } from "../../components/ui/dashboard/charts/charts"
import ChartCard from "../../components/ui/dashboard/charts/ChartCard.tsx";
import MiniMap from "../../components/ui/dashboard/charts/MiniMap.tsx";

// === Hooks y API ===
import {useDashboardSequential} from "../../hooks/dashboard/useDashboardSequential.ts";

export default function DashboardPage() {
  const {
    resumen, loadingResumen, errorResumen,
    cancerTipos, loadingTipos, errorTipos,
    costos, loadingCostos, errorCostos,
    inventario, loadingInventario, errorInventario,
    edadCancer, loadingEdad, errorEdad,
  } = useDashboardSequential({ delayMs: 250 })

  const summaryCards = resumen
    ? [
      { label: "Pacientes activos", value: resumen.pacientes_activos },
      { label: "Nuevos este mes", value: resumen.nuevos_mes },
      { label: "Tratamientos en curso", value: resumen.tratamientos_en_curso },
      { label: "Altas este mes", value: resumen.altas_mes },
    ]
    : []

  return (
    <Box bg="white" p={4}>
      {errorResumen && <Alert status="error" mb={4}><AlertIcon />{errorResumen}</Alert>}

      {/* KPIs */}
      <SimpleGrid columns={[1, 2, 4]} spacing={4} mb={6}>
        {loadingResumen && !resumen
          ? Array.from({ length: 4 }).map((_, i) => (
            <Stat key={i} p={4} bg={BG} border="1px solid" borderColor="gray.200" borderRadius="lg">
              <StatLabel color="gray.600">Cargando…</StatLabel>
              <StatNumber><Spinner size="sm" /></StatNumber>
            </Stat>
          ))
          : summaryCards.map((t) => (
            <Stat key={t.label} p={4} bg={BG} border="1px solid" borderColor="gray.200" borderRadius="lg">
              <StatLabel color="gray.600">{t.label}</StatLabel>
              <StatNumber>{t.value.toLocaleString("es-MX")}</StatNumber>
            </Stat>
          ))}
      </SimpleGrid>

      {/* Fila 1 */}
      <SimpleGrid columns={[1, 2]} spacing={4} mb={4}>
        <ChartCard title="Tipos de cáncer" status={loadingTipos ? "actualizando" : "actualizado"} bg={BG}>
          {errorTipos ? <Alert status="error"><AlertIcon />{errorTipos}</Alert>
            : loadingTipos || !cancerTipos ? <Box h="100%" display="flex" alignItems="center" justifyContent="center"><Spinner /></Box>
              : <CancerTypesPie data={cancerTipos} />}
        </ChartCard>

        <ChartCard title="Costo por tratamiento" status={loadingCostos ? "actualizando" : "actualizado"} bg={BG}>
          {errorCostos ? <Alert status="error"><AlertIcon />{errorCostos}</Alert>
            : loadingCostos || !costos ? <Box h="100%" display="flex" alignItems="center" justifyContent="center"><Spinner /></Box>
              : <TreatmentCostBar data={costos} currency="MXN" locale="es-MX" />}
        </ChartCard>
      </SimpleGrid>

      {/* Fila 2 */}
      <SimpleGrid columns={[1, 1, 3]} spacing={4}>
        <ChartCard title="Distribución geográfica" status="actualizado" bg={BG}>
          <MiniMap />
        </ChartCard>

        <ChartCard title="Inventario de medicamentos" status={loadingInventario ? "actualizando" : "actualizado"} bg={BG}>
          {errorInventario ? <Alert status="error"><AlertIcon />{errorInventario}</Alert>
            : loadingInventario || !inventario ? <Box h="100%" display="flex" alignItems="center" justifyContent="center"><Spinner /></Box>
              : <InventarioBar data={inventario} />}
        </ChartCard>

        <ChartCard title="Edad y relación con cáncer" status={loadingEdad ? "actualizando" : "actualizado"} bg={BG}>
          {errorEdad ? <Alert status="error"><AlertIcon />{errorEdad}</Alert>
            : loadingEdad || !edadCancer ? <Box h="100%" display="flex" alignItems="center" justifyContent="center"><Spinner /></Box>
              : <EdadCancerStacked data={edadCancer} />}
        </ChartCard>
      </SimpleGrid>
    </Box>
  )
}
