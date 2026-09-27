import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { MODELS } from './models'

export type Fx = 'tam' | 'sade'
export type Contrast = 'normal' | 'yuksek'
export type MotionPref = 'oto' | 'acik' | 'kapali'
export type Politeness = 'polite' | 'assertive'

function read<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  try {
    const v = localStorage.getItem(key) as T | null
    return v && allowed.includes(v) ? v : fallback
  } catch {
    return fallback
  }
}
function write(key: string, v: string) {
  try {
    localStorage.setItem(key, v)
  } catch {
    /* depolama kapalı: ayar yalnız bu oturumda geçerli */
  }
}

function useSetting<T extends string>(key: string, allowed: readonly T[], fallback: T) {
  const [v, setV] = useState<T>(() => read(key, allowed, fallback))
  const set = useCallback(
    (n: T) => {
      setV(n)
      write(key, n)
    },
    [key],
  )
  return [v, set] as const
}

function useReducedMotion() {
  const q = '(prefers-reduced-motion: reduce)'
  const [m, setM] = useState(() => window.matchMedia(q).matches)
  useEffect(() => {
    const mq = window.matchMedia(q)
    const f = () => setM(mq.matches)
    mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [])
  return m
}

interface Announcement {
  id: number
  text: string
  politeness: Politeness
}

interface Ctx {
  fx: Fx
  setFx: (v: Fx) => void
  contrast: Contrast
  setContrast: (v: Contrast) => void
  motionPref: MotionPref
  setMotionPref: (v: MotionPref) => void
  /** Çözülmüş hareket: kullanıcı seçimi ya da sistem tercihi */
  motion: boolean
  modelId: string
  setModelId: (v: string) => void
  announce: (text: string, politeness?: Politeness) => void
  last: Announcement | null
}

const C = createContext<Ctx | null>(null)
let seq = 0

export function NeuralProvider({ children }: { children: ReactNode }) {
  const [fx, setFx] = useSetting<Fx>('neural-fx', ['tam', 'sade'], 'tam')
  const [contrast, setContrast] = useSetting<Contrast>('neural-contrast', ['normal', 'yuksek'], 'normal')
  const [motionPref, setMotionPref] = useSetting<MotionPref>('neural-motion', ['oto', 'acik', 'kapali'], 'oto')
  const [modelId, setModelId] = useSetting<string>(
    'neural-model',
    MODELS.map((m) => m.id),
    'korteks-hizli',
  )
  const reduced = useReducedMotion()
  const motion = motionPref === 'acik' || (motionPref === 'oto' && !reduced)
  const [last, setLast] = useState<Announcement | null>(null)

  useEffect(() => {
    const d = document.documentElement
    d.dataset.fx = fx
    d.dataset.contrast = contrast
    d.dataset.motion = motion ? 'on' : 'off'
  }, [fx, contrast, motion])

  const announce = useCallback((text: string, politeness: Politeness = 'polite') => setLast({ id: ++seq, text, politeness }), [])

  const value = useMemo(
    () => ({ fx, setFx, contrast, setContrast, motionPref, setMotionPref, motion, modelId, setModelId, announce, last }),
    [fx, setFx, contrast, setContrast, motionPref, setMotionPref, motion, modelId, setModelId, announce, last],
  )
  return <C.Provider value={value}>{children}</C.Provider>
}

export function useNeural() {
  const c = useContext(C)
  if (!c) throw new Error('NeuralProvider eksik')
  return c
}

/** Madde 18: iki gizli canlı bölge; aynı metin art arda gelse de yeniden okunur */
export function LiveRegions() {
  const { last } = useNeural()
  const [polite, setPolite] = useState('')
  const [assertive, setAssertive] = useState('')
  useEffect(() => {
    if (!last) return
    const set = last.politeness === 'assertive' ? setAssertive : setPolite
    set('')
    const t = window.setTimeout(() => set(last.text), 60)
    return () => window.clearTimeout(t)
  }, [last])
  return (
    <>
      <div className="sr-only" aria-live="polite" aria-atomic="true" data-live="polite">
        {polite}
      </div>
      <div className="sr-only" aria-live="assertive" aria-atomic="true" data-live="assertive">
        {assertive}
      </div>
    </>
  )
}
