import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useTheme, type Theme } from '../../shared/useTheme'
import { BADGES } from './data'

export type Kaos = 'sakin' | 'normal' | 'tam' | 'ozel'
export type MotionPref = 'oto' | 'acik' | 'kapali'
export type Politeness = 'polite' | 'assertive'

/** Madde 13: sabit token yok; tasarımcıya sınırsız yetki veren serbest değişkenler */
export interface Vars {
  donme: number
  binme: number
  doygunluk: number
  gren: number
  rozet: number
  font: number
  hiz: number
}
export const PRESETS: Record<Exclude<Kaos, 'ozel'>, Vars> = {
  sakin: { donme: 0, binme: 0, doygunluk: 90, gren: 0, rozet: 0, font: 2, hiz: 0.5 },
  normal: { donme: 12, binme: 50, doygunluk: 115, gren: 35, rozet: 5, font: 4, hiz: 1 },
  tam: { donme: 28, binme: 100, doygunluk: 150, gren: 70, rozet: 9, font: 4, hiz: 1.6 },
}
export const VAR_META: { k: keyof Vars; ad: string; min: number; max: number; step: number; unit: string }[] = [
  { k: 'donme', ad: 'Dönme aralığı', min: 0, max: 30, step: 1, unit: '°' },
  { k: 'binme', ad: 'Üst üste binme', min: 0, max: 100, step: 5, unit: '%' },
  { k: 'doygunluk', ad: 'Doygunluk', min: 60, max: 160, step: 5, unit: '%' },
  { k: 'gren', ad: 'Gren', min: 0, max: 100, step: 5, unit: '%' },
  { k: 'rozet', ad: 'Uçan rozet', min: 0, max: 9, step: 1, unit: '' },
  { k: 'font', ad: 'Font karışımı', min: 1, max: 4, step: 1, unit: ' aile' },
  { k: 'hiz', ad: 'Hareket hızı', min: 0.25, max: 2, step: 0.25, unit: '×' },
]

function readJSON<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key)
    return v ? { ...fallback, ...JSON.parse(v) } : fallback
  } catch {
    return fallback
  }
}
/** Rozet albümü: yalnız bilinen rozet kimlikleri */
function readAlbum(): string[] {
  try {
    const v: unknown = JSON.parse(localStorage.getItem('maxi-album') || '[]')
    return Array.isArray(v) ? v.filter((x): x is string => BADGES.some((b) => b.id === x)) : []
  } catch {
    return []
  }
}
function save(key: string, v: unknown) {
  try {
    localStorage.setItem(key, typeof v === 'string' ? v : JSON.stringify(v))
  } catch {
    /* depolama kapalı: yalnız bu oturumda */
  }
}

interface Toast {
  id: number
  text: string
  color: string
}
interface Ctx {
  theme: Theme
  mode: Theme | 'system'
  setMode: (m: Theme | 'system') => void
  kaos: Kaos
  setKaos: (k: Exclude<Kaos, 'ozel'>) => void
  vars: Vars
  setVar: (k: keyof Vars, v: number) => void
  motionPref: MotionPref
  setMotionPref: (m: MotionPref) => void
  /** Çözülmüş hareket: kullanıcı tercihi, sistem tercihi ve sakin mod */
  motion: boolean
  collected: string[]
  collect: (id: string) => void
  release: () => void
  tickets: Record<string, number>
  setTicket: (id: string, n: number) => void
  favs: string[]
  toggleFav: (id: string) => void
  toasts: Toast[]
  toast: (text: string, color?: string) => void
  announce: (text: string, p?: Politeness) => void
  last: { id: number; text: string; p: Politeness } | null
}

const C = createContext<Ctx | null>(null)
let seq = 0

export function MaxiProvider({ children }: { children: ReactNode }) {
  const { theme, mode, setMode } = useTheme('maxi-theme')
  const [kaos, setKaosState] = useState<Kaos>(() => {
    try {
      const k = localStorage.getItem('maxi-kaos') as Kaos | null
      return k === 'sakin' || k === 'normal' || k === 'tam' || k === 'ozel' ? k : 'normal'
    } catch {
      return 'normal'
    }
  })
  // Kayıtlı değişken yoksa kaos düzeyinin hazır ayarıyla başla
  const [vars, setVars] = useState<Vars>(() => readJSON('maxi-vars', PRESETS[kaos === 'ozel' ? 'normal' : kaos]))
  const [motionPref, setMotionPrefState] = useState<MotionPref>(() => {
    try {
      const m = localStorage.getItem('maxi-motion')
      return m === 'acik' || m === 'kapali' ? m : 'oto'
    } catch {
      return 'oto'
    }
  })
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [collected, setCollected] = useState<string[]>(readAlbum)
  const [tickets, setTickets] = useState<Record<string, number>>({})
  const [favs, setFavs] = useState<string[]>([])
  const [toasts, setToasts] = useState<Toast[]>([])
  const [last, setLast] = useState<Ctx['last']>(null)
  const timers = useRef<number[]>([])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const f = () => setReduced(mq.matches)
    mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [])
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])

  const motion = motionPref === 'acik' || (motionPref === 'oto' && !reduced)

  // Serbest değişkenler :root üzerindeki CSS değişkenlerine yazılır; bütün sayfa canlı değişir
  useEffect(() => {
    const d = document.documentElement
    d.style.setProperty('--rot-max', `${vars.donme}deg`)
    d.style.setProperty('--overlap', String(vars.binme / 100))
    d.style.setProperty('--sat', `${vars.doygunluk}%`)
    d.style.setProperty('--grain', String(vars.gren / 100))
    d.style.setProperty('--speed', String(vars.hiz))
    d.dataset.fontmix = String(vars.font)
    d.dataset.kaos = kaos
    d.dataset.motion = motion ? 'on' : 'off'
  }, [vars, kaos, motion])

  // Kalıcı ayarlar ve albüm; yazma güncelleyicinin dışında (StrictMode iki kez çağırır)
  useEffect(() => save('maxi-kaos', kaos), [kaos])
  useEffect(() => save('maxi-vars', vars), [vars])
  useEffect(() => save('maxi-album', collected), [collected])

  const setKaos = useCallback((k: Exclude<Kaos, 'ozel'>) => {
    setKaosState(k)
    setVars(PRESETS[k])
  }, [])
  const setVar = useCallback((k: keyof Vars, v: number) => {
    setVars((cur) => ({ ...cur, [k]: v }))
    setKaosState('ozel')
  }, [])
  const setMotionPref = useCallback((m: MotionPref) => {
    setMotionPrefState(m)
    save('maxi-motion', m)
  }, [])

  const announce = useCallback((text: string, p: Politeness = 'polite') => setLast({ id: ++seq, text, p }), [])
  const toast = useCallback(
    (text: string, color = 'var(--lime)') => {
      const id = ++seq
      setToasts((t) => [...t.slice(-2), { id, text, color }])
      announce(text)
      timers.current.push(window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3400))
    },
    [announce],
  )
  const collect = useCallback((id: string) => setCollected((c) => (c.includes(id) ? c : [...c, id])), [])
  const release = useCallback(() => setCollected([]), [])
  const setTicket = useCallback((id: string, n: number) => setTickets((t) => ({ ...t, [id]: Math.max(0, Math.min(10, n)) })), [])
  const toggleFav = useCallback((id: string) => setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id])), [])

  const value = useMemo(
    () => ({ theme, mode, setMode, kaos, setKaos, vars, setVar, motionPref, setMotionPref, motion, collected, collect, release, tickets, setTicket, favs, toggleFav, toasts, toast, announce, last }),
    [theme, mode, setMode, kaos, setKaos, vars, setVar, motionPref, setMotionPref, motion, collected, collect, release, tickets, setTicket, favs, toggleFav, toasts, toast, announce, last],
  )
  return <C.Provider value={value}>{children}</C.Provider>
}

export function useMaxi() {
  const c = useContext(C)
  if (!c) throw new Error('MaxiProvider eksik')
  return c
}

/** Madde 18: iki gizli canlı bölge */
export function LiveRegions() {
  const { last } = useMaxi()
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
