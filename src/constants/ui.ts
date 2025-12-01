export const BG = "#e2e8f0"
export const BRAND = "#20aedb"

export const inputProps = {
  bg: "#ffffff",
  borderColor: BRAND,
  borderRadius: "15px",
  color: BRAND,
  _placeholder: { color: BRAND },
  _focus: { boxShadow: `0 0 0 2px ${BRAND}` },
} as const

export const reqSx = { ".chakra-form__required-indicator": { color: BRAND } }
