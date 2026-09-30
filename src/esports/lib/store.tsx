import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from 'react'

export type HareketTercih = 'oto' | 'acik' | 'kapali'
export type Vurgu = 'mavi' | 'lime' | 'turuncu'
export type Kontrast = 'normal' | 'yuksek'
export type Aci = 'oto' | 'tam' | 'duz'
export type Doku = 'acik' | 'kapali'

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

/** Madde 17: bu genişliğin altında açılar yumuşar, paneller dikey akar */
export const SADE_ESIGI = 640

interface Ctx {
  hareketTercih: HareketTercih
  setHareketTercih: (m: HareketTercih) => void
  hareket: boolean
  hareketRef: MutableRefObject<boolean>
  vurgu: Vurgu
  setVurgu: (v: Vurgu) => void
  kontrast: Kontrast
  setKontrast: (k: Kontrast) => void
  aci: Aci
  setAci: (a: Aci) => void
  /** açılar şu an yumuşak mı: dar ekran ya da kullanıcı tercihi (düz) */
  sade: boolean
  doku: Doku
  setDoku: (d: Doku) => void
  duyuru: string
  duyur: (t: string) => void
}

const C = createContext<Ctx | null>(null)

export function EsportsProvider({ children }: { children: ReactNode }) {
  const d = document.documentElement
  const [hareketTercih, setHT] = useState<HareketTercih>(() => sec('es-hareket', ['oto', 'acik', 'kapali'], 'oto'))
  const [azalt, setAzalt] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [dar, setDar] = useState(() => window.matchMedia(`(max-width: ${SADE_ESIGI - 1}px)`).matches)
  const [vurgu, setVurguS] = useState<Vurgu>(() => sec('es-vurgu', ['mavi', 'lime', 'turuncu'], 'mavi'))
  const [kontrast, setKontrastS] = useState<Kontrast>(() => sec('es-kontrast', ['normal', 'yuksek'], 'normal'))
  const [aci, setAciS] = useState<Aci>(() => sec('es-aci', ['oto', 'tam', 'duz'], 'oto'))
  const [doku, setDokuS] = useState<Doku>(() => sec('es-doku', ['acik', 'kapali'], 'acik'))
  const [duyuru, setDuyuru] = useState('')

  useEffect(() => {
    const m1 = window.matchMedia('(prefers-reduced-motion: reduce)')
    const m2 = window.matchMedia(`(max-width: ${SADE_ESIGI - 1}px)`)
    const f1 = () => setAzalt(m1.matches)
    const f2 = () => setDar(m2.matches)
    m1.addEventListener('change', f1)
    m2.addEventListener('change', f2)
    return () => {
      m1.removeEventListener('change', f1)
      m2.removeEventListener('change', f2)
    }
  }, [])
  const hareket = hareketTercih === 'acik' || (hareketTercih === 'oto' && !azalt)
  const sade = aci === 'duz' || (aci === 'oto' && dar)
  const hareketRef = useRef(hareket)
  useLayoutEffect(() => {
    hareketRef.current = hareket
    d.dataset.motion = hareket ? 'on' : 'off'
    d.dataset.vurgu = vurgu
    d.dataset.kontrast = kontrast
    d.dataset.aci = aci
    d.dataset.doku = doku
  }, [d, hareket, vurgu, kontrast, aci, doku])

  const setHareketTercih = useCallback((m: HareketTercih) => {
    setHT(m)
    yaz('es-hareket', m)
  }, [])
  const setVurgu = useCallback((v: Vurgu) => {
    setVurguS(v)
    yaz('es-vurgu', v)
  }, [])
  const setKontrast = useCallback((v: Kontrast) => {
    setKontrastS(v)
    yaz('es-kontrast', v)
  }, [])
  const setAci = useCallback((v: Aci) => {
    setAciS(v)
    yaz('es-aci', v)
  }, [])
  const setDoku = useCallback((v: Doku) => {
    setDokuS(v)
    yaz('es-doku', v)
  }, [])
  const duyur = useCallback((t: string) => {
    setDuyuru('')
    window.setTimeout(() => setDuyuru(t), 30)
  }, [])

  const value = useMemo(
    () => ({ hareketTercih, setHareketTercih, hareket, hareketRef, vurgu, setVurgu, kontrast, setKontrast, aci, setAci, sade, doku, setDoku, duyuru, duyur }),
    [hareketTercih, setHareketTercih, hareket, vurgu, setVurgu, kontrast, setKontrast, aci, setAci, sade, doku, setDoku, duyuru, duyur],
  )
  return <C.Provider value={value}>{children}</C.Provider>
}

export function useEsports() {
  const v = useContext(C)
  if (!v) throw new Error('EsportsProvider yok')
  return v
}

export function Duyuru() {
  const { duyuru } = useEsports()
  return (
    <p className="sr-only" aria-live="polite" data-live="">
      {duyuru}
    </p>
  )
}
