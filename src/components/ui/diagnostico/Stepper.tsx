import { Box, Button, HStack, Progress, Stack, Text } from "@chakra-ui/react"

export type Step = { label: string; content: React.ReactNode }

export default function Stepper({
                                  steps,
                                  index,
                                  onIndex,
                                  onFinish,
                                  nextLabel = "Siguiente",
                                  prevLabel = "Anterior",
                                  finishLabel = "Guardar",
                                  brand = "#20aedb",
                                  trackBg = "#e2e8f0",
                                  disableFinish = false,
                                  disableNext = false,
                                  finishing = false,
                                  /** Flag externa que nos pasa la página (p.ej. cuando el diagnóstico está en edición). */
                                  disabled = false,
                                  /**
                                   * Si quieres que "disabled" realmente BLOQUEE navegación, pon esto en true.
                                   * Por defecto NO bloquea (lockNavigation = false).
                                   */
                                  lockNavigation = false,
                                  canNext,
                                  canFinish,
                                }: {
  steps: Step[]
  index: number
  onIndex: (i: number) => void
  onFinish: () => void
  nextLabel?: string
  prevLabel?: string
  finishLabel?: string
  brand?: string
  trackBg?: string
  disableFinish?: boolean
  disableNext?: boolean
  finishing?: boolean
  disabled?: boolean
  lockNavigation?: boolean
  canNext?: boolean
  canFinish?: boolean
}) {
  const total = steps.length
  const isFirst = index === 0
  const isLast = index === total - 1
  const pct = total > 1 ? ((index + 1) / total) * 100 : 100

  const solidBtn = { bg: brand, color: "white", borderRadius: "15px", _hover: { bg: "#109ecb" }, _active: { bg: "#0e90bb" } } as const
  const outlineBtn = { variant: "outline" as const, borderColor: brand, color: brand, borderRadius: "15px", _hover: { bg: brand, color: "white" } }

  // Si lockNavigation es true, entonces sí deshabilitamos navegación cuando "disabled" sea true
  const navDisabled = lockNavigation && disabled

  return (
    <Stack spacing={4}>
      <Box>
        <HStack justify="space-between" mb={2}>
          <Text fontWeight="bold" color={brand}>{steps[index].label}</Text>
          <Text fontSize="sm" color="gray.500">{index + 1} / {total}</Text>
        </HStack>
        <Progress value={pct} borderRadius="12px" bg={trackBg} sx={{ "> div": { background: brand } }} h="10px" />
      </Box>

      <Box opacity={disabled ? 1 : 1 /* sin opacidad; solo informativo si quisieras */}>
        {steps[index].content}
      </Box>

      <HStack justify="space-between">
        <Button
          onClick={() => onIndex(index - 1)}
          isDisabled={navDisabled || isFirst}
          {...outlineBtn}
        >
          {prevLabel}
        </Button>

        {!isLast ? (
          <Button
            onClick={() => onIndex(index + 1)}
            isDisabled={navDisabled || disableNext || canNext}
            {...solidBtn}
          >
            {nextLabel}
          </Button>
        ) : (
          <Button
            onClick={onFinish}
            isDisabled={navDisabled || disableFinish || canFinish}
            isLoading={finishing}
            {...solidBtn}
          >
            {finishLabel}
          </Button>
        )}
      </HStack>
    </Stack>
  )
}
