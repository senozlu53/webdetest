import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type HareketTercih = 'oto' | 'acik' | 'kapali'
export type Titreme = 'etkilesim' | 'surekli'
export type Kusur = 'az' | 'orta' | 'cok'
export type Kagit = 'ekskiz' | 'geri' | 'yok'
export type Baslik = 'el' | 'okunur'
export type Kontrast = 'normal' | 'yuksek'

function oku(k: string) {
  try {
    return localStorage.getItem(k)
  } catch {
    return null
  }
}
function yaz(k: string, v: string) {
  try {
    localStorage.setItem(k, v)
  } catch {
    /* depolama kapalı: yalnız bu oturumda */
  }
}
const sec = <T extends string>(k: string, izin: T[], vars: T): T => {
  const v = oku(k) as T | null
  return v && izin.includes(v) ? v : vars
}

/** Madde 6: çizgi kusuru çarpanı */
export const KUSUR_CARPAN: Record<Kusur, number> = { az: 0.55, orta: 1, cok: 1.7 }

interface Ctx {
  hareketTercih: HareketTercih
  setHareketTercih: (m: HareketTercih) => void
  hareket: boolean
  titreme: Titreme
  setTitreme: (t: Titreme) => void
  kusur: Kusur
  setKusur: (k: Kusur) => void
  kagit: Kagit
  setKagit: (k: Kagit) => void
  baslik: Baslik
  setBaslik: (b: Baslik) => void
  kontrast: Kontrast
  setKontrast: (k: Kontrast) => void
  /** Madde 17: çizgi kalınlığı çarpanı (ekran küçülünce oran korunur) */
  olcek: number
  duyuru: string
  duyur: (t: string) => void
}

const C = createContext<Ctx | null>(null)
const olcekHesapla = () => Math.round(Math.max(0.62, Math.min(1, window.innerWidth / 1100)) * 100) / 100

export function SketchProvider({ children }: { children: ReactNode }) {
  const d = document.documentElement
  const [hareketTercih, setHT] = useState<HareketTercih>(() => sec('skc-hareket', ['oto', 'acik', 'kapali'], 'oto'))
  const [azalt, setAzalt] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [titreme, setTitremeS] = useState<Titreme>(() => sec('skc-titreme', ['etkilesim', 'surekli'], 'etkilesim'))
  const [kusur, setKusurS] = useState<Kusur>(() => sec('skc-kusur', ['az', 'orta', 'cok'], 'orta'))
  const [kagit, setKagitS] = useState<Kagit>(() => sec('skc-kagit', ['ekskiz', 'geri', 'yok'], 'ekskiz'))
  const [baslik, setBaslikS] = useState<Baslik>(() => sec('skc-baslik', ['el', 'okunur'], 'el'))
  const [kontrast, setKontrastS] = useState<Kontrast>(() => sec('skc-kontrast', ['normal', 'yuksek'], 'normal'))
  const [olcek, setOlcek] = useState(olcekHesapla)
  const [duyuru, setDuyuru] = useState('')

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const f = () => setAzalt(mq.matches)
    mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [])
  useEffect(() => {
    const f = () => setOlcek(olcekHesapla())
    window.addEventListener('resize', f)
    return () => window.removeEventListener('resize', f)
  }, [])
  const hareket = hareketTercih === 'acik' || (hareketTercih === 'oto' && !azalt)
  useEffect(() => {
    d.dataset.motion = hareket ? 'on' : 'off'
    d.dataset.titreme = titreme
    d.dataset.kagit = kagit
    d.dataset.baslik = baslik
    d.dataset.kontrast = kontrast
    d.style.setProperty('--k', String(olcek * (kontrast === 'yuksek' ? 1.35 : 1)))
  }, [d, hareket, titreme, kagit, baslik, kontrast, olcek])

  const kalici =
    <T extends string>(anahtar: string, set: (v: T) => void) =>
    (v: T) => {
      set(v)
      yaz(anahtar, v)
    }
  const setHareketTercih = useCallback(kalici<HareketTercih>('skc-hareket', setHT), [])
  const setTitreme = useCallback(kalici<Titreme>('skc-titreme', setTitremeS), [])
  const setKusur = useCallback(kalici<Kusur>('skc-kusur', setKusurS), [])
  const setKagit = useCallback(kalici<Kagit>('skc-kagit', setKagitS), [])
  const setBaslik = useCallback(kalici<Baslik>('skc-baslik', setBaslikS), [])
  const setKontrast = useCallback(kalici<Kontrast>('skc-kontrast', setKontrastS), [])
  const duyur = useCallback((t: string) => {
    setDuyuru('')
    window.setTimeout(() => setDuyuru(t), 30)
  }, [])

  const value = useMemo(
    () => ({ hareketTercih, setHareketTercih, hareket, titreme, setTitreme, kusur, setKusur, kagit, setKagit, baslik, setBaslik, kontrast, setKontrast, olcek: olcek * (kontrast === 'yuksek' ? 1.35 : 1), duyuru, duyur }),
    [hareketTercih, setHareketTercih, hareket, titreme, setTitreme, kusur, setKusur, kagit, setKagit, baslik, setBaslik, kontrast, setKontrast, olcek, duyuru, duyur],
  )
  return <C.Provider value={value}>{children}</C.Provider>
}

export function useSketch() {
  const v = useContext(C)
  if (!v) throw new Error('SketchProvider yok')
  return v
}

export function Duyuru() {
  const { duyuru } = useSketch()
  return (
    <p className="sr-only" aria-live="polite" data-live="">
      {duyuru}
    </p>
  )
}
