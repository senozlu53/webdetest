/**
 * Madde 16: sönümlü yay. x(t) = 1 − e^(−ζω₀t)(cos ω_d t + ζω₀/ω_d · sin ω_d t)
 * Eğri örneklenip CSS linear() easing'ine çevrilir: tarayıcı yayı JavaScript'siz, compositor'da oynatır.
 */
export function yay(sertlik: number, sonum: number, kutle = 1) {
  const w0 = Math.sqrt(sertlik / kutle)
  const z = Math.min(0.99, sonum / (2 * Math.sqrt(sertlik * kutle)))
  const wd = w0 * Math.sqrt(1 - z * z)
  const x = (t: number) => 1 - Math.exp(-z * w0 * t) * (Math.cos(wd * t) + ((z * w0) / wd) * Math.sin(wd * t))
  let T = 0
  for (; T < 5; T += 0.01) {
    let dur = true
    for (let s = 0; s < 30; s++) if (Math.abs(1 - x(T + s * 0.01)) > 0.003) dur = false
    if (dur) break
  }
  const n = 40
  const noktalar = Array.from({ length: n + 1 }, (_, i) => (i === 0 ? 0 : i === n ? 1 : Math.round(x((T * i) / n) * 1000) / 1000))
  const tepe = Math.max(...noktalar)
  return { css: `linear(${noktalar.join(', ')})`, sure: Math.round(T * 1000), noktalar, asim: Math.round((tepe - 1) * 100), sonumOrani: z }
}
