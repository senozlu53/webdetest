import { gauss, rng } from './rand'

/** LLM eğitim paneli verisi: nöral-7b ön eğitimi (kurgu, tohumlu) */
export const TOTAL = 20_000
export const EVERY = 20
export const START = 14_600
export const WARMUP = 1_000
export const LR_MAX = 3e-4
export const LR_MIN = 3e-5
export const TOKENS_PER_STEP = 2_097_152
export const SPIKE = 14_000

export interface Pt {
  s: number
  train: number
  lr: number
  gn: number
}
export interface Val {
  s: number
  val: number
}

export function lrAt(s: number) {
  if (s < WARMUP) return (LR_MAX * s) / WARMUP
  const p = (s - WARMUP) / (TOTAL - WARMUP)
  return LR_MIN + (LR_MAX - LR_MIN) * 0.5 * (1 + Math.cos(Math.PI * p))
}

function base(s: number) {
  return 2.09 + 8.6 * Math.exp(-s / 900) + 0.95 * Math.exp(-s / 9000)
}
/** 14.000. adımda sıçrama, 280 adımda geri döner */
function spike(s: number) {
  if (s < SPIKE) return 0
  const d = s - SPIKE
  return d > 400 ? 0 : 1.12 * Math.exp(-d / 90)
}

const r = rng(15)
export const POINTS: Pt[] = []
for (let s = 0; s <= TOTAL; s += EVERY) {
  const noise = gauss(r) * (0.035 + 0.25 * Math.exp(-s / 1500))
  const sp = spike(s)
  POINTS.push({ s, train: base(s) + sp + noise, lr: lrAt(s), gn: sp > 0.05 ? 1 + sp * 33 : Math.max(0.3, 0.9 + gauss(r) * 0.12) })
}

const rv = rng(151)
export const VALS: Val[] = []
for (let s = 500; s <= TOTAL; s += 500) VALS.push({ s, val: base(s) + 0.07 + spike(s) * 0.6 + gauss(rv) * 0.015 })

export const CHECKPOINTS = VALS.filter((v) => v.s % 2000 === 0).map((v) => ({ s: v.s, val: v.val }))

export const EVENTS: { s: number; kind: 'bilgi' | 'uyari' | 'tamam'; text: string }[] = [
  { s: 0, kind: 'bilgi', text: 'Eğitim başladı: 8 GPU, 2 düğüm, adım başına 2,1 milyon token' },
  { s: WARMUP, kind: 'bilgi', text: 'Isınma bitti: öğrenme oranı zirvede (3,0e-4)' },
  { s: 7_000, kind: 'tamam', text: 'Doğrulama kaybı ilk kez 2,6’nın altına indi' },
  { s: SPIKE, kind: 'uyari', text: 'Kayıp sıçraması: 2,29’dan 3,41’e; gradyan normu 38' },
  { s: SPIKE + 280, kind: 'tamam', text: 'Kayıp toparlandı; gradyan kırpma devrede kaldı' },
]

/** 8 GPU, 2 düğüm: işlemci ağacı */
export interface Gpu {
  id: number
  dugum: 0 | 1
  kullanim: number
  sicaklik: number
  bellek: number
}
export function gpus(step: number): Gpu[] {
  const rg = rng(1000 + Math.floor(step / 100))
  return Array.from({ length: 8 }, (_, i) => {
    const hot = i === 5
    return {
      id: i,
      dugum: (i < 4 ? 0 : 1) as 0 | 1,
      kullanim: Math.min(0.99, 0.9 + rg() * 0.08),
      sicaklik: Math.round((hot ? 84 : 66) + rg() * 5),
      bellek: 71 + Math.round(rg() * 6),
    }
  })
}
export const HOT_C = 83
export const MEM_GB = 80
