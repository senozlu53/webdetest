import { useCallback, useEffect, useState } from 'react'

export type MotionMode = 'live' | 'lite' | 'paused'
export type MotionPref = 'auto' | MotionMode

export const MOTION_KEY = 'ambient-motion'
const REDUCE = '(prefers-reduced-motion: reduce)'
const NARROW = '(max-width: 767px)'

type BatteryLike = EventTarget & { level: number; charging: boolean }
type NavExtras = Navigator & {
  getBattery?: () => Promise<BatteryLike>
  connection?: { saveData?: boolean }
}

export type Battery = { level: number; charging: boolean }
export type Signals = { reduce: boolean; saveData: boolean | null; battery: Battery | null; narrow: boolean }

function readPref(): MotionPref {
  try {
    const v = localStorage.getItem(MOTION_KEY)
    return v === 'live' || v === 'lite' || v === 'paused' ? v : 'auto'
  } catch {
    return 'auto'
  }
}

function useMedia(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const m = window.matchMedia(query)
    const sync = () => setMatches(m.matches)
    m.addEventListener('change', sync)
    return () => m.removeEventListener('change', sync)
  }, [query])
  return matches
}

/** Otomatik modda hangi sinyalin hangi hareket düzeyini seçtiği. İlk eşleşen kazanır. */
export function detectMotion(s: Signals): { mode: MotionMode; reason: string } {
  if (s.reduce) return { mode: 'paused', reason: 'Sistemde “hareketi azalt” açık' }
  if (s.saveData) return { mode: 'lite', reason: 'Veri tasarrufu açık' }
  if (s.battery && !s.battery.charging && s.battery.level <= 0.2)
    return { mode: 'lite', reason: `Pil %${Math.round(s.battery.level * 100)} ve şarjda değil` }
  if (s.narrow) return { mode: 'lite', reason: 'Dar ekran (mobil)' }
  return { mode: 'live', reason: 'Geniş ekran, kısıt yok' }
}

/**
 * Hareket düzeyi (Madde 16·17). Kullanıcı seçmediyse cihaz sinyallerinden türetilir;
 * sonuç `<html data-motion>` olarak yazılır ve CSS katmanları buna göre sadeleşir.
 */
export function useMotion() {
  const [pref, setPrefState] = useState<MotionPref>(readPref)
  const reduce = useMedia(REDUCE)
  const narrow = useMedia(NARROW)
  const [battery, setBattery] = useState<Battery | null>(null)
  const nav = navigator as NavExtras
  const saveData = nav.connection ? nav.connection.saveData === true : null

  // Pil durumu API'si yalnızca Chromium tabanlı tarayıcılarda var; yoksa sinyal yok sayılır
  useEffect(() => {
    let alive = true
    let target: BatteryLike | null = null
    const sync = () => target && alive && setBattery({ level: target.level, charging: target.charging })
    nav
      .getBattery?.()
      .then((b) => {
        target = b
        sync()
        b.addEventListener('levelchange', sync)
        b.addEventListener('chargingchange', sync)
      })
      .catch(() => {})
    return () => {
      alive = false
      target?.removeEventListener('levelchange', sync)
      target?.removeEventListener('chargingchange', sync)
    }
  }, [nav])

  const signals: Signals = { reduce, saveData, battery, narrow }
  const detected = detectMotion(signals)
  const mode: MotionMode = pref === 'auto' ? detected.mode : pref

  useEffect(() => {
    document.documentElement.dataset.motion = mode
  }, [mode])

  const setPref = useCallback((next: MotionPref) => {
    setPrefState(next)
    try {
      if (next === 'auto') localStorage.removeItem(MOTION_KEY)
      else localStorage.setItem(MOTION_KEY, next)
    } catch {
      /* depolama kapalı */
    }
  }, [])

  return { pref, setPref, mode, detected, signals }
}
