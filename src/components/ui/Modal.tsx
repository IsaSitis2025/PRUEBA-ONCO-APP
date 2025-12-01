import {
    Modal as CModal, ModalOverlay, ModalContent, ModalHeader,
    ModalBody, ModalFooter, ModalCloseButton, Button
} from "@chakra-ui/react"
import type {ReactNode} from "react"

type Props = {
    open: boolean
    title?: string
    onClose: () => void
    children: ReactNode
    confirmText?: string
    onConfirm?: () => void
    isConfirmLoading?: boolean
}

export default function Modal({
                                  open, title, onClose, children, confirmText = "Aceptar", onConfirm, isConfirmLoading
                              }: Props) {
    return (
        <CModal isOpen={open} onClose={onClose} isCentered>
            <ModalOverlay/>
            <ModalContent>
                {title && <ModalHeader>{title}</ModalHeader>}
                <ModalCloseButton/>
                <ModalBody>{children}</ModalBody>
                <ModalFooter gap={2}>
                    <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                    {onConfirm && <Button colorScheme="blue" onClick={onConfirm}
                                          isLoading={isConfirmLoading}>{confirmText}</Button>}
                </ModalFooter>
            </ModalContent>
        </CModal>
    )
}
