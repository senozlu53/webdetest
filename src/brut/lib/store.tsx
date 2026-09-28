import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useTheme, type Theme } from '../../shared/useTheme'

export type Zemin = 'kirli' | 'sari'
export type Kose = 'keskin' | 'yuvarlak'
export type MotionPref = 'oto' | 'acik' | 'kapali'
export type Politeness = 'polite' | 'assertive'
export type Tone = 'yellow' | 'green' | 'red' | 'blue'

function read<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  try {
    const v = localStorage.getItem(key) as T | null
    return v && allowed.includes(v) ? v : fallback
  } catch {
    return fallback
  }
}
function useSetting<T extends string>(key: string, allowed: readonly T[], fallback: T) {
  const [v, setV] = useState<T>(() => read(key, allowed, fallback))
  const set = useCallback(
    (n: T) => {
      setV(n)
      try {
        localStorage.setItem(key, n)
      } catch {
        /* depolama kapalı: yalnız bu oturumda */
      }
    },
    [key],
  )
  return [v, set] as const
}

interface Toast {
  id: number
  text: string
  tone: Tone
}

interface Ctx {
  theme: Theme
  mode: Theme | 'system'
  setMode: (m: Theme | 'system') => void
  zemin: Zemin
  setZemin: (z: Zemin) => void
  kose: Kose
  setKose: (k: Kose) => void
  motionPref: MotionPref
  setMotionPref: (m: MotionPref) => void
  motion: boolean
  /** WCAG 2.2.2: bütün kayan şeritleri tek düğmeyle durdur */
  marqueePaused: boolean
  setMarqueePaused: (v: boolean) => void
  cart: Record<string, number>
  cartCount: number
  cartBump: number
  addToCart: (id: string) => void
  setQty: (id: string, n: number) => void
  toasts: Toast[]
  toast: (text: string, tone?: Tone) => void
  announce: (text: string, p?: Politeness) => void
  last: { id: number; text: string; p: Politeness } | null
}

const C = createContext<Ctx | null>(null)
let seq = 0

export function BrutProvider({ children }: { children: ReactNode }) {
  const { theme, mode, setMode } = useTheme('brut-theme')
  const [zemin, setZemin] = useSetting<Zemin>('brut-zemin', ['kirli', 'sari'], 'kirli')
  const [kose, setKose] = useSetting<Kose>('brut-kose', ['keskin', 'yuvarlak'], 'keskin')
  const [motionPref, setMotionPref] = useSetting<MotionPref>('brut-motion', ['oto', 'acik', 'kapali'], 'oto')
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [marqueePaused, setMarqueePaused] = useState(false)
  const [cart, setCart] = useState<Record<string, number>>({})
  const [cartBump, setCartBump] = useState(0)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [last, setLast] = useState<Ctx['last']>(null)
  const timers = useRef<number[]>([])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const f = () => setReduced(mq.matches)
    mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [])
  const motion = motionPref === 'acik' || (motionPref === 'oto' && !reduced)

  useEffect(() => {
    const d = document.documentElement
    d.dataset.zemin = zemin
    d.dataset.kose = kose
    d.dataset.motion = motion ? 'on' : 'off'
  }, [zemin, kose, motion])
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])

  const announce = useCallback((text: string, p: Politeness = 'polite') => setLast({ id: ++seq, text, p }), [])
  const toast = useCallback(
    (text: string, tone: Tone = 'yellow') => {
      const id = ++seq
      setToasts((t) => [...t.slice(-2), { id, text, tone }])
      announce(text)
      timers.current.push(window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200))
    },
    [announce],
  )
  const addToCart = useCallback((id: string) => {
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }))
    setCartBump((b) => b + 1)
  }, [])
  const setQty = useCallback((id: string, n: number) => {
    setCart((c) => {
      const next = { ...c }
      if (n <= 0) delete next[id]
      else next[id] = n
      return next
    })
    setCartBump((b) => b + 1)
  }, [])
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0)

  const value = useMemo(
    () => ({ theme, mode, setMode, zemin, setZemin, kose, setKose, motionPref, setMotionPref, motion, marqueePaused, setMarqueePaused, cart, cartCount, cartBump, addToCart, setQty, toasts, toast, announce, last }),
    [theme, mode, setMode, zemin, setZemin, kose, setKose, motionPref, setMotionPref, motion, marqueePaused, cart, cartCount, cartBump, addToCart, setQty, toasts, toast, announce, last],
  )
  return <C.Provider value={value}>{children}</C.Provider>
}

export function useBrut() {
  const c = useContext(C)
  if (!c) throw new Error('BrutProvider eksik')
  return c
}

/** Madde 18: iki gizli canlı bölge; aynı metin art arda gelse de yeniden okunur */
export function LiveRegions() {
  const { last } = useBrut()
  const [polite, setPolite] = useState('')
  const [assertive, setAssertive] = useState('')
  useEffect(() => {
    if (!last) return
    const set = last.p === 'assertive' ? setAssertive : setPolite
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
