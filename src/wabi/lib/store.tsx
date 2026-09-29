import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import { KUSUR_CARPAN, type Kusur } from './cizim'

export type HareketTercih = 'oto' | 'acik' | 'kapali'
export type TemaTercih = 'oto' | 'kil' | 'kul' | 'komur'
export type Tema = 'kil' | 'kul' | 'komur'
export type Doku = 'siva' | 'beton' | 'kil' | 'seramik' | 'duz'
export type Kontrast = 'normal' | 'yuksek'
export type Yon = 'sag' | 'sol'

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

interface Ctx {
  hareketTercih: HareketTercih
  setHareketTercih: (m: HareketTercih) => void
  hareket: boolean
  temaTercih: TemaTercih
  setTemaTercih: (t: TemaTercih) => void
  tema: Tema
  doku: Doku
  setDoku: (d: Doku) => void
  kontrast: Kontrast
  setKontrast: (k: Kontrast) => void
  /** yaslanma yönü: 'sol' sola yaslı (içerik solda, boşluk sağda), 'sag' sağa yaslı */
  yon: Yon
  setYon: (y: Yon) => void
  kusur: Kusur
  setKusur: (k: Kusur) => void
  /** kusur çarpanı: hatların ne kadar oynadığı */
  k: number
  duyuru: string
  duyur: (t: string) => void
}

const C = createContext<Ctx | null>(null)

export function WabiProvider({ children }: { children: ReactNode }) {
  const d = document.documentElement
  const [hareketTercih, setHT] = useState<HareketTercih>(() => sec('wb-hareket', ['oto', 'acik', 'kapali'], 'oto'))
  const [azalt, setAzalt] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [karanlik, setKaranlik] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const [temaTercih, setTT] = useState<TemaTercih>(() => sec('wb-tema', ['oto', 'kil', 'kul', 'komur'], 'oto'))
  const [doku, setDokuS] = useState<Doku>(() => sec('wb-doku', ['siva', 'beton', 'kil', 'seramik', 'duz'], 'siva'))
  const [kontrast, setKontrastS] = useState<Kontrast>(() => sec('wb-kontrast', ['normal', 'yuksek'], 'normal'))
  const [yon, setYonS] = useState<Yon>(() => sec('wb-yon', ['sol', 'sag'], 'sol'))
  const [kusur, setKusurS] = useState<Kusur>(() => sec('wb-kusur', ['yok', 'az', 'orta', 'cok'], 'orta'))
  const [duyuru, setDuyuru] = useState('')

  useEffect(() => {
    const m1 = window.matchMedia('(prefers-reduced-motion: reduce)')
    const m2 = window.matchMedia('(prefers-color-scheme: dark)')
    const f1 = () => setAzalt(m1.matches)
    const f2 = () => setKaranlik(m2.matches)
    m1.addEventListener('change', f1)
    m2.addEventListener('change', f2)
    return () => {
      m1.removeEventListener('change', f1)
      m2.removeEventListener('change', f2)
    }
  }, [])
  const hareket = hareketTercih === 'acik' || (hareketTercih === 'oto' && !azalt)
  const tema: Tema = temaTercih === 'oto' ? (karanlik ? 'komur' : 'kil') : temaTercih
  useLayoutEffect(() => {
    d.dataset.motion = hareket ? 'on' : 'off'
    d.dataset.tema = tema
    d.dataset.doku = doku
    d.dataset.kontrast = kontrast
    d.dataset.yon = yon
    d.dataset.kusur = kusur
  }, [d, hareket, tema, doku, kontrast, yon, kusur])

  const setHareketTercih = useCallback((m: HareketTercih) => {
    setHT(m)
    yaz('wb-hareket', m)
  }, [])
  const setTemaTercih = useCallback((t: TemaTercih) => {
    setTT(t)
    yaz('wb-tema', t)
  }, [])
  const setDoku = useCallback((v: Doku) => {
    setDokuS(v)
    yaz('wb-doku', v)
  }, [])
  const setKontrast = useCallback((v: Kontrast) => {
    setKontrastS(v)
    yaz('wb-kontrast', v)
  }, [])
  const setYon = useCallback((v: Yon) => {
    setYonS(v)
    yaz('wb-yon', v)
  }, [])
  const setKusur = useCallback((v: Kusur) => {
    setKusurS(v)
    yaz('wb-kusur', v)
  }, [])
  const duyur = useCallback((t: string) => {
    setDuyuru('')
    window.setTimeout(() => setDuyuru(t), 30)
  }, [])

  const value = useMemo(
    () => ({ hareketTercih, setHareketTercih, hareket, temaTercih, setTemaTercih, tema, doku, setDoku, kontrast, setKontrast, yon, setYon, kusur, setKusur, k: KUSUR_CARPAN[kusur], duyuru, duyur }),
    [hareketTercih, setHareketTercih, hareket, temaTercih, setTemaTercih, tema, doku, setDoku, kontrast, setKontrast, yon, setYon, kusur, setKusur, duyuru, duyur],
  )
  return <C.Provider value={value}>{children}</C.Provider>
}

export function useWabi() {
  const v = useContext(C)
  if (!v) throw new Error('WabiProvider yok')
  return v
}

export function Duyuru() {
  const { duyuru } = useWabi()
  return (
    <p className="sr-only" aria-live="polite" data-live="">
      {duyuru}
    </p>
  )
}
