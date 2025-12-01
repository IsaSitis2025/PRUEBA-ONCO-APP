// src/pages/UploadModal.tsx
import {
  Box, Button, HStack, VStack, Text, Select, Image,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody,
  useToast, Icon, Alert, AlertIcon
} from "@chakra-ui/react"
import React, { useCallback, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FiUploadCloud } from "react-icons/fi"
import DUMMY_PREVIEW from "../../assets/prueba.png"
import LoaderModal from "../../components/ui/LoaderModal"

// 🔹 catálogos (unidades desde API)
import { useUnidadesOptions } from "../../hooks/catalogos"

const cBrand = "#20aedb"
const inputProps = {
  bg: "#ffffff",
  borderColor: cBrand,
  borderRadius: "15px",
  color: cBrand,
  _placeholder: { color: cBrand },
  _focus: { boxShadow: `0 0 0 2px ${cBrand}` }
} as const

const MESES = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
const ANYOS = ["2025", "2024", "2023", "2022"]

export default function UploadModal({ isOpen }: { isOpen: boolean }) {
  const navigate = useNavigate()
  const toast = useToast()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [dragOver, setDragOver] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  // 🔹 selección controlada
  const [unidadId, setUnidadId] = useState("") // id_unidad (string para <Select>)
  const [mes, setMes] = useState("")
  const [anyo, setAnyo] = useState("")

  // 🔹 unidades desde API (options: [{value,label}])
  const {
    data: unidadesOpts,
    loading: loadingUnidades,
    error: errorUnidades,
  } = useUnidadesOptions()

  const close = () => navigate(-1)
  const pickFile = () => !uploading && inputRef.current?.click()

  const onFiles = useCallback((fl: FileList | null) => {
    if (!fl?.length || uploading) return
    setFile(fl[0])
  }, [uploading])

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
    onFiles(e.dataTransfer.files)
  }

  const canUpload = useMemo(
    () => !!file && !!unidadId && !!mes && !!anyo && !uploading,
    [file, unidadId, mes, anyo, uploading]
  )

  const fakeUpload = async () => {
    if (!canUpload) {
      toast({
        status: "warning",
        title: "Completa los campos",
        description: "Selecciona unidad, mes/año y un archivo.",
      })
      return
    }

    setUploading(true)
    try {
      await new Promise(res => setTimeout(res, 2500)) // simula subida
      toast({ status: "success", title: "Archivo cargado correctamente" })
      close()
    } finally {
      setUploading(false)
    }
  }

  // Dropzone reutilizable
  const Drop = ({ fill, children }: { fill?: boolean; children?: React.ReactNode }) => (
    <Box
      w="100%"
      h={fill ? "100%" : "auto"}
      flex={fill ? 1 : undefined}
      border="2px dashed"
      borderColor={dragOver ? cBrand : "gray.300"}
      borderRadius="15px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={6}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      onClick={pickFile}
      tabIndex={uploading ? -1 : 0}
      role="button"
      cursor={uploading ? "not-allowed" : "pointer"}
      bg={dragOver ? "gray.50" : "white"}
      transition="all 0.2s ease"
      minH={fill ? undefined : "190px"}
      _hover={uploading ? {} : { borderColor: cBrand, bg: "gray.50" }}
    >
      {children ?? (
        <VStack spacing={2}>
          <Icon as={FiUploadCloud} boxSize="28px" color={cBrand} />
          <Text fontWeight="semibold" textAlign="center">
            Arrastra y suelta el archivo aquí
          </Text>
          <Text fontSize="sm" color="gray.500">o haz clic para seleccionar</Text>
        </VStack>
      )}
      <input
        ref={inputRef}
        type="file"
        hidden
        accept="image/*,.pdf,.csv,.xlsx"
        onChange={(e) => onFiles(e.target.files)}
      />
    </Box>
  )

  return (
    <>
      <Modal isOpen={isOpen} onClose={close} isCentered>
        <ModalOverlay bg="rgba(0,0,0,0.82)" backdropFilter="blur(1px)" />
        <ModalContent
          maxW="800px"
          w="800px"
          h="500px"
          overflow="hidden"
          borderRadius="18px"
          boxShadow="2xl"
          bg="#e2e8f0"
        >
          <ModalHeader borderBottom="1px solid" borderColor="gray.200" color={cBrand} fontWeight="bold">
            Subir archivo
          </ModalHeader>
          <ModalCloseButton _focusVisible={{ boxShadow: `0 0 0 2px ${cBrand}` }} />
          <ModalBody pt={4} pb={4} h="calc(500px - 56px - 16px)">
            <VStack align="stretch" spacing={4} h="full">
              {/* Mensaje de error de unidades (si lo hay) */}
              {errorUnidades && (
                <Alert
                  status="error"
                  borderRadius="15px"
                  variant="subtle"
                  bg="rgba(229,62,62,0.12)"
                  border="1px solid rgba(229,62,62,0.3)"
                >
                  <AlertIcon />
                  {errorUnidades}
                </Alert>
              )}

              {/* Selects */}
              <HStack>
                {/* 🔹 Unidad de atención desde API */}
                <Select
                  placeholder={loadingUnidades ? "Cargando unidades…" : "Unidad de atención"}
                  value={unidadId}
                  onChange={(e) => setUnidadId(e.target.value)}
                  isDisabled={uploading || loadingUnidades}
                  {...inputProps}
                >
                  {(unidadesOpts ?? []).map(u => (
                    <option key={u.value} value={u.value}>{u.label}</option>
                  ))}
                </Select>

                <Select
                  placeholder="Mes"
                  value={mes}
                  onChange={(e) => setMes(e.target.value)}
                  isDisabled={uploading}
                  {...inputProps}
                >
                  {MESES.map(m => <option key={m}>{m}</option>)}
                </Select>

                <Select
                  placeholder="Año"
                  value={anyo}
                  onChange={(e) => setAnyo(e.target.value)}
                  isDisabled={uploading}
                  {...inputProps}
                >
                  {ANYOS.map(a => <option key={a}>{a}</option>)}
                </Select>
              </HStack>

              {/* Cuerpo */}
              <Box flex="1" minH={0}>
                {!file ? (
                  <Drop fill />
                ) : (
                  <HStack align="stretch" spacing={0} h="100%" minH={0}>
                    <Box flex="1" p={2} display="flex" minH={0}>
                      <Drop fill>
                        <VStack spacing={2} pointerEvents="none">
                          <Text fontWeight="semibold">Reemplazar archivo</Text>
                          <Text fontSize="sm" color="gray.500" textAlign="center" noOfLines={2} maxW="90%">
                            {file.name || "Arrastra otro archivo o haz clic"}
                          </Text>
                        </VStack>
                      </Drop>
                    </Box>
                    <Box w="1px" bg="gray.200" />
                    <Box
                      flex="1"
                      p={2}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      minH={0}
                      bg="white"
                    >
                      <Image
                        src={DUMMY_PREVIEW}
                        alt="archivo-preview"
                        maxH="100%"
                        maxW="100%"
                        objectFit="contain"
                        borderRadius="10px"
                      />
                    </Box>
                  </HStack>
                )}
              </Box>

              {/* Acciones */}
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.600" noOfLines={1} maxW="60%">
                  {file ? file.name : "Sin archivo seleccionado"}
                </Text>
                <HStack>
                  <Button onClick={close} variant="outline" borderRadius="12px">Cancelar</Button>
                  <Button
                    bg={cBrand}
                    color="white"
                    _hover={{ bg: "#109ecb" }}
                    _active={{ bg: "#0e90bb" }}
                    onClick={fakeUpload}
                    isDisabled={!canUpload}
                    borderRadius="12px"
                  >
                    Subir
                  </Button>
                </HStack>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Loader modal bonito mientras “sube” */}
      <LoaderModal isOpen={uploading} text="Subiendo archivo…" />
    </>
  )
}
