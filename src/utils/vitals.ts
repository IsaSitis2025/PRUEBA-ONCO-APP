// PRNG determinístico simple (xorshift32) a partir de una semilla numérica
function rng(seed: number) {
  let x = seed || 123456789
  return () => {
    x ^= x << 13; x ^= x >>> 17; x ^= x << 5
    // 0..1
    return ((x >>> 0) % 10000) / 10000
  }
}

export function synthesizeVitals(seed: number) {
  const r = rng(seed)

  // peso kg ~ 50..95
  const peso = 50 + Math.round(r() * 45)
  // talla cm ~ 150..190
  const talla = 150 + Math.round(r() * 40)
  // presión (sistólica/diastólica) ~ 100-140 / 60-90
  const sist = 100 + Math.round(r() * 40)
  const diast = 60 + Math.round(r() * 30)
  // FC ~ 60..100 lpm
  const fc = 60 + Math.round(r() * 40)
  // temperatura ~ 36.2..37.8
  const temp = (36.2 + r() * 1.6).toFixed(1)
  // tipo de sangre (lista)
  const tipos = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]
  const tipo = tipos[Math.floor(r() * tipos.length)]

  return {
    peso: `${peso} kg`,
    talla: `${talla} cm`,
    presion_arterial: `${sist}/${diast} mmHg`,
    frecuencia_cardiaca: `${fc} lpm`,
    temperatura: `${temp} °C`,
    tipo_sangre: tipo,
  }
}
