import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type HareketTercih = 'oto' | 'acik' | 'kapali'
export type Doku = 'karton' | 'suluboya' | 'duz'
export type Kontrast = 'normal' | 'yuksek'
export type DerinlikTercih = 'oto' | '1' | '2' | '3' | '4' | '5'

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

/** Madde 17: yatay alan sınırlı ekranda katman sayısı azalır (flattening) */
export const otoDerinlik = (w: number) => (w < 640 ? 3 : w < 1024 ? 4 : 5)
export const ISIK_VARSAYILAN = 63

interface Ctx {
  hareketTercih: HareketTercih
  setHareketTercih: (m: HareketTercih) => void
  hareket: boolean
  doku: Doku
  setDoku: (d: Doku) => void
  kontrast: Kontrast
  setKontrast: (k: Kontrast) => void
  derinlikTercih: DerinlikTercih
  setDerinlikTercih: (d: DerinlikTercih) => void
  /** etkin katman sayısı (1…5): 1 gökyüzü, 2 + ön plan, 3 + dağlar, 4 + tepeler, 5 + bulutlar */
  derinlik: number
  /** gölgenin düştüğü yön (derece, 0 = sağ, 90 = aşağı) */
  isik: number
  setIsik: (a: number) => void
  genislik: number
  duyuru: string
  duyur: (t: string) => void
}

const C = createContext<Ctx | null>(null)

export function PaperProvider({ children }: { children: ReactNode }) {
  const d = document.documentElement
  const [hareketTercih, setHT] = useState<HareketTercih>(() => sec('pap-hareket', ['oto', 'acik', 'kapali'], 'oto'))
  const [azalt, setAzalt] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [doku, setDokuS] = useState<Doku>(() => sec('pap-doku', ['karton', 'suluboya', 'duz'], 'karton'))
  const [kontrast, setKontrastS] = useState<Kontrast>(() => sec('pap-kontrast', ['normal', 'yuksek'], 'normal'))
  const [derinlikTercih, setDT] = useState<DerinlikTercih>(() => sec('pap-derinlik', ['oto', '1', '2', '3', '4', '5'], 'oto'))
  const [isik, setIsikS] = useState(() => {
    const v = +(oku('pap-isik') ?? ISIK_VARSAYILAN)
    return Number.isFinite(v) ? Math.max(0, Math.min(359, v)) : ISIK_VARSAYILAN
  })
  const [genislik, setGenislik] = useState(() => window.innerWidth)
  const [duyuru, setDuyuru] = useState('')

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const f = () => setAzalt(mq.matches)
    mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [])
  useEffect(() => {
    let t = 0
    const f = () => {
      window.clearTimeout(t)
      t = window.setTimeout(() => setGenislik(window.innerWidth), 80)
    }
    window.addEventListener('resize', f)
    return () => {
      window.removeEventListener('resize', f)
      window.clearTimeout(t)
    }
  }, [])
  const hareket = hareketTercih === 'acik' || (hareketTercih === 'oto' && !azalt)
  const derinlik = derinlikTercih === 'oto' ? otoDerinlik(genislik) : +derinlikTercih
  useEffect(() => {
    d.dataset.motion = hareket ? 'on' : 'off'
    d.dataset.doku = doku
    d.dataset.kontrast = kontrast
    d.dataset.derinlik = String(derinlik)
    const a = (isik * Math.PI) / 180
    d.style.setProperty('--ux', Math.cos(a).toFixed(3))
    d.style.setProperty('--uy', Math.sin(a).toFixed(3))
  }, [d, hareket, doku, kontrast, derinlik, isik])

  const setHareketTercih = useCallback((m: HareketTercih) => {
    setHT(m)
    yaz('pap-hareket', m)
  }, [])
  const setDoku = useCallback((v: Doku) => {
    setDokuS(v)
    yaz('pap-doku', v)
  }, [])
  const setKontrast = useCallback((v: Kontrast) => {
    setKontrastS(v)
    yaz('pap-kontrast', v)
  }, [])
  const setDerinlikTercih = useCallback((v: DerinlikTercih) => {
    setDT(v)
    yaz('pap-derinlik', v)
  }, [])
  const setIsik = useCallback((a: number) => {
    setIsikS(a)
    yaz('pap-isik', String(a))
  }, [])
  const duyur = useCallback((t: string) => {
    setDuyuru('')
    window.setTimeout(() => setDuyuru(t), 30)
  }, [])

  const value = useMemo(
    () => ({ hareketTercih, setHareketTercih, hareket, doku, setDoku, kontrast, setKontrast, derinlikTercih, setDerinlikTercih, derinlik, isik, setIsik, genislik, duyuru, duyur }),
    [hareketTercih, setHareketTercih, hareket, doku, setDoku, kontrast, setKontrast, derinlikTercih, setDerinlikTercih, derinlik, isik, setIsik, genislik, duyuru, duyur],
  )
  return <C.Provider value={value}>{children}</C.Provider>
}

export function usePaper() {
  const v = useContext(C)
  if (!v) throw new Error('PaperProvider yok')
  return v
}

export function Duyuru() {
  const { duyuru } = usePaper()
  return (
    <p className="sr-only" aria-live="polite" data-live="">
      {duyuru}
    </p>
  )
}
