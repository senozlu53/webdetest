import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useTheme, type Theme } from '../../shared/useTheme'

export type MotionPref = 'oto' | 'acik' | 'kapali'
export type Tone = 'chrome' | 'candy' | 'icy' | 'grape'

function read(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}
function save(key: string, v: string) {
  try {
    localStorage.setItem(key, v)
  } catch {
    /* depolama kapalı: yalnız bu oturumda */
  }
}

/** Madde 16: hızlı açılıp kapanan pop-up pencere */
export interface Popup {
  id: number
  baslik: string
  metin: ReactNode
  ton: Tone
  x: number
  y: number
  kapaniyor?: boolean
  /** ms sonra kendiliğinden kapanır */
  omur?: number
  /** Kullanıcı açtı: odak pencereye geçsin */
  odak?: boolean
}

export interface Sepet {
  [urunBeden: string]: number
}

interface Ctx {
  theme: Theme
  mode: Theme | 'system'
  setMode: (m: Theme | 'system') => void
  motionPref: MotionPref
  setMotionPref: (m: MotionPref) => void
  motion: boolean
  sade: boolean
  setSade: (v: boolean) => void
  sepet: Sepet
  sepeteEkle: (anahtar: string) => void
  sepetAdet: (anahtar: string, n: number) => void
  popups: Popup[]
  ac: (p: Omit<Popup, 'id' | 'x' | 'y'> & { x?: number; y?: number }) => number
  kapat: (id: number) => void
  hepsiniKapat: () => void
  duyuru: string
  duyur: (t: string) => void
}

const C = createContext<Ctx | null>(null)
let seq = 0

export function Y2KProvider({ children }: { children: ReactNode }) {
  const { theme, mode, setMode } = useTheme('y2k-theme')
  const [motionPref, setMotionPrefState] = useState<MotionPref>(() => {
    const m = read('y2k-motion')
    return m === 'acik' || m === 'kapali' ? m : 'oto'
  })
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [sade, setSadeState] = useState(() => read('y2k-sade') === '1')
  const [sepet, setSepet] = useState<Sepet>({})
  const [popups, setPopups] = useState<Popup[]>([])
  const [duyuru, setDuyuru] = useState('')
  const zaman = useRef(new Map<number, number>())

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const f = () => setReduced(mq.matches)
    mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [])
  useEffect(() => {
    const t = zaman.current
    return () => t.forEach((x) => window.clearTimeout(x))
  }, [])

  const motion = motionPref === 'acik' || (motionPref === 'oto' && !reduced)
  useEffect(() => {
    const d = document.documentElement
    d.dataset.motion = motion ? 'on' : 'off'
    d.dataset.sade = sade ? '1' : '0'
  }, [motion, sade])

  const setMotionPref = useCallback((m: MotionPref) => {
    setMotionPrefState(m)
    save('y2k-motion', m)
  }, [])
  const setSade = useCallback((v: boolean) => {
    setSadeState(v)
    save('y2k-sade', v ? '1' : '0')
  }, [])
  const duyur = useCallback((t: string) => {
    setDuyuru('')
    window.setTimeout(() => setDuyuru(t), 30)
  }, [])

  const sil = useCallback((id: number) => {
    setPopups((l) => l.filter((p) => p.id !== id))
    zaman.current.delete(id)
  }, [])
  // Kapanış animasyonu 90ms; hareket kapalıyken hemen
  const kapat = useCallback(
    (id: number) => {
      const reducedNow = document.documentElement.dataset.motion === 'off'
      if (reducedNow) return sil(id)
      setPopups((l) => l.map((p) => (p.id === id ? { ...p, kapaniyor: true } : p)))
      window.setTimeout(() => sil(id), 90)
    },
    [sil],
  )
  const ac = useCallback<Ctx['ac']>(
    (p) => {
      const id = ++seq
      const w = window.innerWidth
      const h = window.innerHeight
      const x = p.x ?? Math.round(16 + Math.random() * Math.max(0, w - 360))
      const y = p.y ?? Math.round(90 + Math.random() * Math.max(0, h - 320))
      setPopups((l) => [...l.slice(-5), { ...p, id, x, y }])
      if (p.omur) zaman.current.set(id, window.setTimeout(() => kapat(id), p.omur))
      duyur(`${p.baslik} penceresi açıldı`)
      return id
    },
    [kapat, duyur],
  )
  const hepsiniKapat = useCallback(() => {
    setPopups([])
    zaman.current.forEach((x) => window.clearTimeout(x))
    zaman.current.clear()
  }, [])
  const sepeteEkle = useCallback((k: string) => setSepet((s) => ({ ...s, [k]: Math.min(9, (s[k] ?? 0) + 1) })), [])
  const sepetAdet = useCallback(
    (k: string, n: number) =>
      setSepet((s) => {
        const next = { ...s }
        if (n <= 0) delete next[k]
        else next[k] = Math.min(9, n)
        return next
      }),
    [],
  )

  const value = useMemo(
    () => ({ theme, mode, setMode, motionPref, setMotionPref, motion, sade, setSade, sepet, sepeteEkle, sepetAdet, popups, ac, kapat, hepsiniKapat, duyuru, duyur }),
    [theme, mode, setMode, motionPref, setMotionPref, motion, sade, setSade, sepet, sepeteEkle, sepetAdet, popups, ac, kapat, hepsiniKapat, duyuru, duyur],
  )
  return <C.Provider value={value}>{children}</C.Provider>
}

export function useY2K() {
  const v = useContext(C)
  if (!v) throw new Error('Y2KProvider yok')
  return v
}

/** Ekran okuyucu duyurusu: görünmez canlı bölge */
export function Duyuru() {
  const { duyuru } = useY2K()
  return (
    <p className="sr-only" aria-live="polite" data-live="">
      {duyuru}
    </p>
  )
}
