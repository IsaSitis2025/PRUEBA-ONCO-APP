// src/components/ui/actionToast.tsx
import {Box, Button, HStack, Text, useToast, CloseButton} from "@chakra-ui/react";

type ActionToastOpts = {
    title?: string;
    description?: string;
    primaryText: string;
    secondaryText?: string;
    onPrimary: () => void;
    onSecondary?: () => void;
    // colores de tu app
    brand?: string;      // borde/botón principal (#20aedb)
    accent?: string;     // hover oscuro opcional
};

export function useActionToast() {
    const toast = useToast();

    return (opts: ActionToastOpts) => {
        const {
            title = "Operación realizada",
            description,
            primaryText,
            secondaryText,
            onPrimary,
            onSecondary,
            brand = "#20aedb",
            accent = "#109ecb",
        } = opts;

        const id = toast({
            position: "top",
            duration: null,          // permanece hasta que el usuario elija
            isClosable: false,
            containerStyle: {marginBottom: "16px"},
            render: () => (
                <Box
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    boxShadow="lg"
                    borderRadius="10px"
                    px={4}
                    py={3}
                    minW={["auto", "520px"]}
                >
                    <HStack align="start" spacing={4}>
                        <Box flex="1">
                            <Text fontWeight="semibold" color="gray.800">{title}</Text>
                            {description && (
                                <Text mt={1} color="gray.600" fontSize="sm">{description}</Text>
                            )}
                            <HStack mt={3} spacing={3}>
                                <Button
                                    size="sm"
                                    bg={brand}
                                    color="white"
                                    _hover={{bg: accent}}
                                    onClick={() => {
                                        toast.close(id);
                                        onPrimary();
                                    }}
                                    borderRadius="10px"
                                >
                                    {primaryText}
                                </Button>

                                {onSecondary && secondaryText && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        borderColor={brand}
                                        color={brand}
                                        _hover={{bg: brand, color: "white"}}
                                        onClick={() => {
                                            toast.close(id);
                                            onSecondary();
                                        }}
                                        borderRadius="10px"
                                    >
                                        {secondaryText}
                                    </Button>
                                )}
                            </HStack>
                        </Box>

                        <CloseButton mt={1} onClick={() => toast.close(id)}/>
                    </HStack>
                </Box>
            ),
        });

        return id;
    };
}
