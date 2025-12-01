// src/components/ChartCard.tsx
import {Card, CardBody, Box} from "@chakra-ui/react"
import {TitleWithStatus} from "./TitleWithStatus.tsx";
import type {cardProps} from "../../../../types/dashboard.ts";

export default function ChartCard({title, status, height = 280, children, bg}: cardProps) {
  return (
    <Card bg={bg} border="1px solid" borderColor="gray.200">
      <CardBody>
        <TitleWithStatus text={title} status={status}/>
        <Box h={typeof height === "number" ? `${height}px` : height}>
          {children}
        </Box>
      </CardBody>
    </Card>
  )
}
