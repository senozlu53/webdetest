import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type HareketTercih = 'oto' | 'acik' | 'kapali'
export type TemaTercih = 'oto' | 'gunduz' | 'parsomen' | 'gece'
export type Tema = 'gunduz' | 'parsomen' | 'gece'
export type Doku = 'sulu' | 'kanvas' | 'duz'
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
  /** su miktarı: bütün lekelerin saydamlık çarpanı (0,4…1,4) */
  su: number
  setSu: (n: number) => void
  duyuru: string
  duyur: (t: string) => void
}

const C = createContext<Ctx | null>(null)

export function WashProvider({ children }: { children: ReactNode }) {
  const d = document.documentElement
  const [hareketTercih, setHT] = useState<HareketTercih>(() => sec('wc-hareket', ['oto', 'acik', 'kapali'], 'oto'))
  const [azalt, setAzalt] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [karanlik, setKaranlik] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const [temaTercih, setTT] = useState<TemaTercih>(() => sec('wc-tema', ['oto', 'gunduz', 'parsomen', 'gece'], 'oto'))
  const [doku, setDokuS] = useState<Doku>(() => sec('wc-doku', ['sulu', 'kanvas', 'duz'], 'sulu'))
  const [kontrast, setKontrastS] = useState<Kontrast>(() => sec('wc-kontrast', ['normal', 'yuksek'], 'normal'))
  const [su, setSuS] = useState(() => {
    const v = +(oku('wc-su') ?? 1)
    return Number.isFinite(v) ? Math.max(0.4, Math.min(1.4, v)) : 1
  })
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
  const tema: Tema = temaTercih === 'oto' ? (karanlik ? 'gece' : 'gunduz') : temaTercih
  useEffect(() => {
    d.dataset.motion = hareket ? 'on' : 'off'
    d.dataset.tema = tema
    d.dataset.doku = doku
    d.dataset.kontrast = kontrast
    d.style.setProperty('--su', String(su))
  }, [d, hareket, tema, doku, kontrast, su])

  const setHareketTercih = useCallback((m: HareketTercih) => {
    setHT(m)
    yaz('wc-hareket', m)
  }, [])
  const setTemaTercih = useCallback((t: TemaTercih) => {
    setTT(t)
    yaz('wc-tema', t)
  }, [])
  const setDoku = useCallback((v: Doku) => {
    setDokuS(v)
    yaz('wc-doku', v)
  }, [])
  const setKontrast = useCallback((v: Kontrast) => {
    setKontrastS(v)
    yaz('wc-kontrast', v)
  }, [])
  const setSu = useCallback((n: number) => {
    setSuS(n)
    yaz('wc-su', String(n))
  }, [])
  const duyur = useCallback((t: string) => {
    setDuyuru('')
    window.setTimeout(() => setDuyuru(t), 30)
  }, [])

  const value = useMemo(
    () => ({ hareketTercih, setHareketTercih, hareket, temaTercih, setTemaTercih, tema, doku, setDoku, kontrast, setKontrast, su, setSu, duyuru, duyur }),
    [hareketTercih, setHareketTercih, hareket, temaTercih, setTemaTercih, tema, doku, setDoku, kontrast, setKontrast, su, setSu, duyuru, duyur],
  )
  return <C.Provider value={value}>{children}</C.Provider>
}

export function useWash() {
  const v = useContext(C)
  if (!v) throw new Error('WashProvider yok')
  return v
}

export function Duyuru() {
  const { duyuru } = useWash()
  return (
    <p className="sr-only" aria-live="polite" data-live="">
      {duyuru}
    </p>
  )
}
