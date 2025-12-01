import { Box, Button, Image, Input, Stack } from "@chakra-ui/react"
import { useRef } from "react"
import { BRAND } from "../../../../constants/ui.ts"

export default function FotoUploader({
                                       value, onChange,
                                     }: {
  value: string
  onChange: (foto_url: string) => void
}) {
  const ref = useRef<HTMLInputElement>(null)
  const open = () => ref.current?.click()

  const onFile = (file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onChange(String(reader.result))
    reader.readAsDataURL(file)
  }

  return (
    <Stack align="start" spacing={3}>
      <Box
        w="160px" h="160px"
        borderRadius="md"
        border="1px dashed"
        borderColor={BRAND}
        bg="white"
        overflow="hidden"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {value ? (
          <Image src={value} alt="Foto del paciente" w="100%" h="100%" objectFit="cover" />
        ) : (
          <Box fontSize="sm" color={BRAND} textAlign="center" px={3}>Sin foto</Box>
        )}
      </Box>
      <Input ref={ref} display="none" type="file" accept="image/*" onChange={e => onFile(e.target.files?.[0])}/>
      <Button
        onClick={open} w="160px" size="sm" bg={BRAND} color="white" borderRadius="15px"
        _hover={{ bg: "#109ecb" }} _active={{ bg: "#0e90bb" }} shadow="sm"
      >
        {value ? "Cambiar foto" : "Cargar foto"}
      </Button>
    </Stack>
  )
}
