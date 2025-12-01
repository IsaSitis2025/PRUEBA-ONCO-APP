import {Heading, HStack, Spinner} from "@chakra-ui/react";


export function TitleWithStatus({
                           text,
                           status, // "actualizado" | "actualizando"
                         }: { text: string; status: "actualizado" | "actualizando" }) {
  const suffix = status === "actualizando" ? "(actualizando)" : "(actualizado)"
  return (
    <HStack spacing={2} align="center" mb={3}>
  <Heading size="sm">{text} {suffix}</Heading>
  {status === "actualizando" && <Spinner size="xs" thickness="2px"/>}
  </HStack>
)
}
