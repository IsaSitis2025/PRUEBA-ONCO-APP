// src/api/http.ts
import axios from "axios"

// ✅ lee del .env en build-time (Vite)
const RAW_BASE = import.meta.env.VITE_API_BASE_URL as string | undefined

// Normaliza: quita trailing slashes
const BASE = (RAW_BASE || "").replace(/\/+$/, "")

// Crea instancia
export const http = axios.create({
  baseURL: BASE || undefined,       // si no hay env → undefined (axios usa relativa)
  headers: { Accept: "application/json" },
  withCredentials: false,
})

// --- Interceptor: normaliza URL y loggea ---
http.interceptors.request.use((config) => {
  // Si la url ya es absoluta (http/https), no tocamos nada
  const isAbsolute = /^https?:\/\//i.test(config.url || "")

  if (!isAbsolute) {
    // Asegura que empiece con "/"
    const u = (config.url || "").startsWith("/")
      ? (config.url as string)
      : `/${config.url}`

    // Si hay baseURL, quita trailing "/" ya los removimos arriba,
    // y evita doble slash al concatenar
    const base = (config.baseURL || BASE || "").replace(/\/+$/, "")
    config.url = `${u}` // axios ya antepone baseURL; aquí sólo saneamos el path
    config.baseURL = base || undefined
  }

  const finalURL = `${config.baseURL || ""}${config.url || ""}`
  console.log("[HTTP] baseURL:", config.baseURL, "url:", config.url, "→", finalURL)

  return config
})

// --- Interceptor de respuesta (errores legibles + log) ---
http.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("[HTTP] error:", err?.message, err)
    return Promise.reject(err)
  }
)

// Helper de error legible para UI
export function getHttpErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status
    const msg =
      (err.response?.data as any)?.message ||
      err.message ||
      "Error de red"
    return status ? `${status} - ${msg}` : msg
  }
  return "Error desconocido"
}
