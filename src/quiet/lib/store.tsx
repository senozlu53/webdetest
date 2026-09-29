import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type HareketTercih = 'oto' | 'acik' | 'kapali'
export type TemaTercih = 'oto' | 'tas' | 'fildisi' | 'komur'
export type Tema = 'tas' | 'fildisi' | 'komur'
export type Doku = 'keten' | 'kagit' | 'tas' | 'duz'
export type Kontrast = 'normal' | 'yuksek'
export type Bosluk = 'genis' | 'siki'

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
  bosluk: Bosluk
  setBosluk: (b: Bosluk) => void
  duyuru: string
  duyur: (t: string) => void
}

const C = createContext<Ctx | null>(null)

export function QuietProvider({ children }: { children: ReactNode }) {
  const d = document.documentElement
  const [hareketTercih, setHT] = useState<HareketTercih>(() => sec('ql-hareket', ['oto', 'acik', 'kapali'], 'oto'))
  const [azalt, setAzalt] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [karanlik, setKaranlik] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const [temaTercih, setTT] = useState<TemaTercih>(() => sec('ql-tema', ['oto', 'tas', 'fildisi', 'komur'], 'tas'))
  const [doku, setDokuS] = useState<Doku>(() => sec('ql-doku', ['keten', 'kagit', 'tas', 'duz'], 'keten'))
  const [kontrast, setKontrastS] = useState<Kontrast>(() => sec('ql-kontrast', ['normal', 'yuksek'], 'normal'))
  const [bosluk, setBoslukS] = useState<Bosluk>(() => sec('ql-bosluk', ['genis', 'siki'], 'genis'))
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
  const tema: Tema = temaTercih === 'oto' ? (karanlik ? 'komur' : 'tas') : temaTercih
  useEffect(() => {
    d.dataset.motion = hareket ? 'on' : 'off'
    d.dataset.tema = tema
    d.dataset.doku = doku
    d.dataset.kontrast = kontrast
    d.dataset.bosluk = bosluk
  }, [d, hareket, tema, doku, kontrast, bosluk])

  const setHareketTercih = useCallback((m: HareketTercih) => {
    setHT(m)
    yaz('ql-hareket', m)
  }, [])
  const setTemaTercih = useCallback((t: TemaTercih) => {
    setTT(t)
    yaz('ql-tema', t)
  }, [])
  const setDoku = useCallback((v: Doku) => {
    setDokuS(v)
    yaz('ql-doku', v)
  }, [])
  const setKontrast = useCallback((v: Kontrast) => {
    setKontrastS(v)
    yaz('ql-kontrast', v)
  }, [])
  const setBosluk = useCallback((v: Bosluk) => {
    setBoslukS(v)
    yaz('ql-bosluk', v)
  }, [])
  const duyur = useCallback((t: string) => {
    setDuyuru('')
    window.setTimeout(() => setDuyuru(t), 30)
  }, [])

  const value = useMemo(
    () => ({ hareketTercih, setHareketTercih, hareket, temaTercih, setTemaTercih, tema, doku, setDoku, kontrast, setKontrast, bosluk, setBosluk, duyuru, duyur }),
    [hareketTercih, setHareketTercih, hareket, temaTercih, setTemaTercih, tema, doku, setDoku, kontrast, setKontrast, bosluk, setBosluk, duyuru, duyur],
  )
  return <C.Provider value={value}>{children}</C.Provider>
}

export function useQuiet() {
  const v = useContext(C)
  if (!v) throw new Error('QuietProvider yok')
  return v
}

export function Duyuru() {
  const { duyuru } = useQuiet()
  return (
    <p className="sr-only" aria-live="polite" data-live="">
      {duyuru}
    </p>
  )
}
