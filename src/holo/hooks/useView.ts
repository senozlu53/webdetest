import { useCallback, useEffect, useState } from 'react'

export type Layers = 'tam' | 'tekil'
export type LayersPref = 'oto' | Layers
export type Motion = 'acik' | 'kapali'
export type MotionPref = 'oto' | Motion

export function useMedia(q: string) {
  const [m, setM] = useState(() => window.matchMedia(q).matches)
  useEffect(() => {
    const mq = window.matchMedia(q)
    const f = () => setM(mq.matches)
    mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [q])
  return m
}

function useStoredPref<T extends string>(key: string, allowed: readonly T[]) {
  const [pref, setState] = useState<T | 'oto'>(() => {
    try {
      const v = localStorage.getItem(key)
      return v && (allowed as readonly string[]).includes(v) ? (v as T) : 'oto'
    } catch {
      return 'oto'
    }
  })
  const setPref = useCallback(
    (p: T | 'oto') => {
      setState(p)
      try {
        if (p === 'oto') localStorage.removeItem(key)
        else localStorage.setItem(key, p)
      } catch {
        /* depolama kapalı */
      }
    },
    [key],
  )
  return [pref, setPref] as const
}

/**
 * Madde 16 · 17: görünüm ayarları.
 * Katman: otomatikte 768px altı "tekil" (paneller opak, iç içe cam düzleşir), üstü "tam".
 * Hareket: otomatikte hareketi azalt tercihi "kapalı", aksi hâlde "açık".
 * Sonuç <html data-layers> ve <html data-motion> olarak yazılır.
 */
export function useView() {
  const narrow = useMedia('(max-width: 767px)')
  const reduce = useMedia('(prefers-reduced-motion: reduce)')
  const [layersPref, setLayersPref] = useStoredPref<Layers>('holo-layers', ['tam', 'tekil'])
  const [motionPref, setMotionPref] = useStoredPref<Motion>('holo-motion', ['acik', 'kapali'])
  const layers: Layers = layersPref === 'oto' ? (narrow ? 'tekil' : 'tam') : layersPref
  const motion: Motion = motionPref === 'oto' ? (reduce ? 'kapali' : 'acik') : motionPref

  useEffect(() => {
    document.documentElement.dataset.layers = layers
  }, [layers])
  useEffect(() => {
    document.documentElement.dataset.motion = motion === 'kapali' ? 'off' : 'on'
  }, [motion])

  return {
    layers,
    layersPref,
    setLayersPref,
    layersReason: narrow ? 'Dar ekran' : 'Geniş ekran',
    motion,
    motionPref,
    setMotionPref,
    motionReason: reduce ? 'Hareketi azalt açık' : 'Sistem tercihi: hareket serbest',
  }
}

/** Hareket kapalı mı? Kanvas döngüleri ve akış zamanlayıcıları için */
export function motionOff() {
  return document.documentElement.dataset.motion === 'off'
}
