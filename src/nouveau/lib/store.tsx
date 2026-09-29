import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { SusSeviye } from './bitki'

export type HareketTercih = 'oto' | 'acik' | 'kapali'
export type TemaTercih = 'oto' | 'parsomen' | 'zeytin' | 'gece'
export type Tema = 'parsomen' | 'zeytin' | 'gece'
export type Doku = 'parsomen' | 'cicek' | 'duvar' | 'duz'
export type Kontrast = 'normal' | 'yuksek'
export type SusTercih = 'oto' | SusSeviye

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
  susTercih: SusTercih
  setSusTercih: (s: SusTercih) => void
  /** Madde 17: ekrana göre çözülmüş süs seviyesi (masaüstü tam, mobil sade) */
  sus: SusSeviye
  mobil: boolean
  duyuru: string
  duyur: (t: string) => void
}

const C = createContext<Ctx | null>(null)

export function NouveauProvider({ children }: { children: ReactNode }) {
  const d = document.documentElement
  const [hareketTercih, setHT] = useState<HareketTercih>(() => sec('an-hareket', ['oto', 'acik', 'kapali'], 'oto'))
  const [azalt, setAzalt] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [karanlik, setKaranlik] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const [mobil, setMobil] = useState(() => window.matchMedia('(max-width: 767px)').matches)
  const [temaTercih, setTT] = useState<TemaTercih>(() => sec('an-tema', ['oto', 'parsomen', 'zeytin', 'gece'], 'parsomen'))
  const [doku, setDokuS] = useState<Doku>(() => sec('an-doku', ['parsomen', 'cicek', 'duvar', 'duz'], 'parsomen'))
  const [kontrast, setKontrastS] = useState<Kontrast>(() => sec('an-kontrast', ['normal', 'yuksek'], 'normal'))
  const [susTercih, setSusS] = useState<SusTercih>(() => sec('an-sus', ['oto', 'tam', 'sade', 'yalin'], 'oto'))
  const [duyuru, setDuyuru] = useState('')

  useEffect(() => {
    const m1 = window.matchMedia('(prefers-reduced-motion: reduce)')
    const m2 = window.matchMedia('(prefers-color-scheme: dark)')
    const m3 = window.matchMedia('(max-width: 767px)')
    const f1 = () => setAzalt(m1.matches)
    const f2 = () => setKaranlik(m2.matches)
    const f3 = () => setMobil(m3.matches)
    m1.addEventListener('change', f1)
    m2.addEventListener('change', f2)
    m3.addEventListener('change', f3)
    return () => {
      m1.removeEventListener('change', f1)
      m2.removeEventListener('change', f2)
      m3.removeEventListener('change', f3)
    }
  }, [])
  const hareket = hareketTercih === 'acik' || (hareketTercih === 'oto' && !azalt)
  const tema: Tema = temaTercih === 'oto' ? (karanlik ? 'gece' : 'parsomen') : temaTercih
  const sus: SusSeviye = susTercih === 'oto' ? (mobil ? 'sade' : 'tam') : susTercih
  useEffect(() => {
    d.dataset.motion = hareket ? 'on' : 'off'
    d.dataset.tema = tema
    d.dataset.doku = doku
    d.dataset.kontrast = kontrast
    d.dataset.sus = susTercih
    d.dataset.susSeviye = sus
  }, [d, hareket, tema, doku, kontrast, susTercih, sus])

  const setHareketTercih = useCallback((m: HareketTercih) => {
    setHT(m)
    yaz('an-hareket', m)
  }, [])
  const setTemaTercih = useCallback((t: TemaTercih) => {
    setTT(t)
    yaz('an-tema', t)
  }, [])
  const setDoku = useCallback((v: Doku) => {
    setDokuS(v)
    yaz('an-doku', v)
  }, [])
  const setKontrast = useCallback((v: Kontrast) => {
    setKontrastS(v)
    yaz('an-kontrast', v)
  }, [])
  const setSusTercih = useCallback((v: SusTercih) => {
    setSusS(v)
    yaz('an-sus', v)
  }, [])
  const duyur = useCallback((t: string) => {
    setDuyuru('')
    window.setTimeout(() => setDuyuru(t), 30)
  }, [])

  const value = useMemo(
    () => ({
      hareketTercih,
      setHareketTercih,
      hareket,
      temaTercih,
      setTemaTercih,
      tema,
      doku,
      setDoku,
      kontrast,
      setKontrast,
      susTercih,
      setSusTercih,
      sus,
      mobil,
      duyuru,
      duyur,
    }),
    [hareketTercih, setHareketTercih, hareket, temaTercih, setTemaTercih, tema, doku, setDoku, kontrast, setKontrast, susTercih, setSusTercih, sus, mobil, duyuru, duyur],
  )
  return <C.Provider value={value}>{children}</C.Provider>
}

export function useNouveau() {
  const v = useContext(C)
  if (!v) throw new Error('NouveauProvider yok')
  return v
}

export function Duyuru() {
  const { duyuru } = useNouveau()
  return (
    <p className="sr-only" aria-live="polite" data-live="">
      {duyuru}
    </p>
  )
}
