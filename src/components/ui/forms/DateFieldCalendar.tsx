import {
    FormControl,
    FormLabel,
    HStack,
    Input,
    IconButton,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    useDisclosure,
} from "@chakra-ui/react";
import type {SystemStyleObject} from "@chakra-ui/styled-system";
import {CalendarIcon} from "@chakra-ui/icons";
import {DayPicker, type Matcher} from "react-day-picker";
import {format, parseISO, isValid, startOfDay, endOfDay} from "date-fns";
import {es} from "date-fns/locale";
import React, {useEffect, useMemo, useRef, useState} from "react";

type Props = {
    label: string;
    value: string;                    // "yyyy-MM-dd"
    onChange: (v: string) => void;
    minDate?: Date;
    maxDate?: Date;
    rightTag?: React.ReactNode;
    inputProps?: Partial<React.ComponentProps<typeof Input>>;
    reqSx?: SystemStyleObject;
    brand?: string;                   // color marca (default #20aedb)
};

export default function DateFieldCalendar({
                                              label,
                                              value,
                                              onChange,
                                              minDate,
                                              maxDate,
                                              rightTag,
                                              inputProps,
                                              reqSx,
                                              brand = "#20aedb",
                                          }: Props) {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const inputRef = useRef<HTMLInputElement>(null);
    const [popW, setPopW] = useState<number | undefined>(undefined);

    // medir ancho del input para el popover
    useEffect(() => {
        const measure = () => {
            if (inputRef.current) setPopW(inputRef.current.offsetWidth);
        };
        measure();
        if (isOpen) {
            // mide otra vez al abrir (por si el layout cambió)
            setTimeout(measure, 0);
        }
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, [isOpen]);

    const selected = useMemo(() => {
        if (!value) return undefined;
        const d = parseISO(value);
        return isValid(d) ? d : undefined;
    }, [value]);

    const display = selected ? format(selected, "dd/MM/yyyy", {locale: es}) : "";

    // límites por matchers (evita props deprecadas)
    const disabled: Matcher[] = [];
    if (minDate) disabled.push({before: startOfDay(minDate)});
    if (maxDate) disabled.push({after: endOfDay(maxDate)});

    return (
        <FormControl>
            {!!label && <FormLabel sx={reqSx}>{label}</FormLabel>}

            <Popover isOpen={isOpen} onClose={onClose} placement="bottom-start" closeOnBlur>
                <PopoverTrigger>
                    <HStack>
                        <Input
                            ref={inputRef}
                            readOnly
                            placeholder="dd/mm/aaaa"
                            value={display}
                            onClick={onOpen}
                            cursor="pointer"
                            {...inputProps}
                        />
                        <IconButton
                            aria-label="Abrir calendario"
                            icon={<CalendarIcon/>}
                            onClick={onOpen}
                            variant="outline"
                            borderColor={inputProps?.borderColor ?? brand}
                        />
                        {rightTag}
                    </HStack>
                </PopoverTrigger>

                <PopoverContent
                    w={popW ? `${popW}px` : "auto"}
                    p={2}
                    borderColor={inputProps?.borderColor ?? brand}
                    boxShadow="lg"
                    borderRadius={"15px"}
                >
                    <PopoverBody>
                        <DayPicker
                            locale={es}
                            mode="single"
                            selected={selected}
                            onSelect={(d) => {
                                if (!d) return;
                                const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
                                    d.getDate()
                                ).padStart(2, "0")}`;
                                onChange(iso);
                                onClose();
                            }}
                            disabled={disabled}
                            showOutsideDays
                            captionLayout="dropdown"

                            /* 1) Variables nativas de DayPicker (v9) */
                            style={{
                                /* color de marca para selección y navegación */
                                ["--rdp-accent-color" as never]: brand,           // ← #20aedb
                                ["--rdp-accent-color-dark" as never]: brand,
                                /* color del contorno (hoy/focus) */
                                ["--rdp-outline" as never]: `2px solid ${brand}`,
                                /* opcional: color texto por defecto dentro del calendario */
                                color: "inherit",
                            }}

                            /* 2) Estilos nativos por key (caption, flechas, encabezados) */
                            styles={{
                                caption: {justifyContent: "center"},
                                caption_label: {color: brand, fontWeight: 600}, // “octubre 2025”
                                nav_button: {color: brand},                     // flechas
                                head_cell: {color: brand},                      // lu, ma, mi…
                                dropdown: {color: brand, borderColor: brand},   // select mes/año
                                day: {borderRadius: 50},
                            }}

                            /* 3) Colores de estados */
                            modifiersStyles={{
                                selected: {backgroundColor: brand, color: "white"},
                                today: {outline: `2px solid ${brand}`, color: "inherit"},
                                disabled: {opacity: 0.35},
                            }}
                        />

                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </FormControl>
    );
}
