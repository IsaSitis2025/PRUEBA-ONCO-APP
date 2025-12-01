// src/components/KpiGrid.tsx
import { SimpleGrid, Stat, StatLabel, StatNumber } from "@chakra-ui/react"
import type {SummaryCard} from "../../../../types/dashboard.ts";

export default function KpiGrid({ items, bg }: { items: SummaryCard[]; bg: string }) {
  return (
    <SimpleGrid columns={[1, 2, 4]} spacing={4} mb={6}>
      {items.map((t) => (
        <Stat key={t.label} p={4} bg={bg} border="1px solid" borderColor="gray.200" borderRadius="lg">
          <StatLabel color="gray.600">{t.label}</StatLabel>
          <StatNumber>{t.value}</StatNumber>
        </Stat>
      ))}
    </SimpleGrid>
  )
}
