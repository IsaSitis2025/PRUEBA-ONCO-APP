export const delay = (ms = 500) => new Promise(r => setTimeout(r, ms))

import pacientesSeed from "../mocks/data/pacientes.json"
import diagnosticosSeed from "../mocks/data/diagnosticos.json"
import tratamientosSeed from "../mocks/data/tratamientos.json"
import catalogosSeed from "../mocks/data/catalogos.json"

const DB = {
    summary: {
        cards: [
            { label: "Pacientes", value: 24 },
            { label: "Tratamientos activos", value: 8 },
            { label: "Adherencia promedio", value: "87%" },
            { label: "Costo total estimado", value: "$1.2M" }
        ],
        cancerTypes: [
            { name: "Mama", value: 8 },
            { name: "Gástrico", value: 5 },
            { name: "Colon", value: 6 },
            { name: "Pulmón", value: 5 }
        ],
        treatmentCosts: [
            { name: "Quimio", cost: 120000 },
            { name: "Radio", cost: 90000 },
            { name: "Inmuno", cost: 150000 }
        ]
    },
    pacientes: [...pacientesSeed],
    diagnosticos: [...diagnosticosSeed],
    tratamientos: [...tratamientosSeed],
    catalogos: catalogosSeed
}

const uid = (p: string) => `${p}_${Math.random().toString(36).slice(2,9)}`

// --- Dashboard ---
export async function apiGetSummary() {
    await delay(400)
    return DB.summary
}

// --- Catálogos ---
export async function apiGetCatalogos() {
    await delay(200)
    return DB.catalogos
}

// --- Pacientes ---
export async function apiGetPacienteById(id: string) {
    await delay(300)
    return DB.pacientes.find((p: any) => p.id === id) ?? null
}

export async function apiSavePaciente(p: any) {
    await delay(500)
    const saved = { ...p }
    if (!saved.id) saved.id = uid("pac") // << genera ID si no viene
    const i = DB.pacientes.findIndex((x: any) => x.id === saved.id)
    if (i >= 0) DB.pacientes[i] = saved
    else DB.pacientes.push(saved)
    return saved                 // << regresa el paciente con ID
}

// --- Diagnóstico ---
export async function apiGetDiagnosticoByPaciente(idPaciente: string) {
    await delay(350)
    return DB.diagnosticos.find((d: any) => d.id_paciente === idPaciente) ?? null
}

export async function apiSaveDiagnostico(d: any) {
    await delay(600)
    if (!d.id_diagnostico) d.id_diagnostico = uid("diag")
    const i = DB.diagnosticos.findIndex((x: any) => x.id_diagnostico === d.id_diagnostico)
    if (i >= 0) DB.diagnosticos[i] = d
    else DB.diagnosticos.push(d)
    return d
}

// --- Tratamiento ---
export async function apiGetTratamientoByDiagnostico(idDiagnostico: string) {
    await delay(350)
    return DB.tratamientos.find((t: any) => t.id_diagnostico === idDiagnostico) ?? null
}

export async function apiSaveTratamiento(t: any) {
    await delay(600)
    if (!t.id_tratamiento) t.id_tratamiento = uid("trat")
    // auto: costo_total si falta
    if (t.costo_unitario && t.duracion_dias && !t.costo_total) {
        t.costo_total = t.costo_unitario * Math.ceil(t.duracion_dias / 30)
    }
    const i = DB.tratamientos.findIndex((x: any) => x.id_tratamiento === t.id_tratamiento)
    if (i >= 0) DB.tratamientos[i] = t
    else DB.tratamientos.push(t)
    return t
}
