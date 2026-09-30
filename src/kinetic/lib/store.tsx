import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from 'react'

export type HareketTercih = 'oto' | 'acik' | 'kapali'
export type Siddet = 'tam' | 'hafif'
export type Tema = 'kara' | 'ak'
export type Vurgu = 'asit' | 'kirmizi'
export type Kontrast = 'normal' | 'yuksek'
export type HizAd = 'yavas' | 'normal' | 'hizli'

/** Animation/TextSpeed: Yavas · Normal · Hizli. Değer, maruz şeridi taban hızının çarpanıdır */
export const HIZ_CARPAN: Record<HizAd, number> = { yavas: 0.45, normal: 1, hizli: 2.4 }
/** Animation/TextSpeed* tokenlarının piksel/sn karşılığı */
export const HIZ_PX: Record<HizAd, number> = { yavas: 40, normal: 100, hizli: 240 }

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

/** Çalışan hareket kaydı: her hareketli bileşen görünürken kendini yazar (Madde 18 "hareket bütçesi") */
export const HAREKET_KAYDI = new Set<string>()

interface Ctx {
  hareketTercih: HareketTercih
  setHareketTercih: (m: HareketTercih) => void
  hareket: boolean
  hareketRef: MutableRefObject<boolean>
  durdur: () => void
  siddet: Siddet
  setSiddet: (s: Siddet) => void
  tam: boolean
  tema: Tema
  setTema: (t: Tema) => void
  vurgu: Vurgu
  setVurgu: (v: Vurgu) => void
  kontrast: Kontrast
  setKontrast: (k: Kontrast) => void
  hiz: HizAd
  setHiz: (h: HizAd) => void
  hizCarpan: number
  hizRef: MutableRefObject<number>
  duyuru: string
  duyur: (t: string) => void
}

const C = createContext<Ctx | null>(null)

export function KineticProvider({ children }: { children: ReactNode }) {
  const d = document.documentElement
  const [hareketTercih, setHT] = useState<HareketTercih>(() => sec('kt-hareket', ['oto', 'acik', 'kapali'], 'oto'))
  const [azalt, setAzalt] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [siddet, setSiddetS] = useState<Siddet>(() => sec('kt-siddet', ['tam', 'hafif'], 'tam'))
  const [tema, setTemaS] = useState<Tema>(() => sec('kt-tema', ['kara', 'ak'], 'kara'))
  const [vurgu, setVurguS] = useState<Vurgu>(() => sec('kt-vurgu', ['asit', 'kirmizi'], 'asit'))
  const [kontrast, setKontrastS] = useState<Kontrast>(() => sec('kt-kontrast', ['normal', 'yuksek'], 'normal'))
  const [hiz, setHizS] = useState<HizAd>(() => sec('kt-hiz', ['yavas', 'normal', 'hizli'], 'normal'))
  const [duyuru, setDuyuru] = useState('')

  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    const f = () => setAzalt(m.matches)
    m.addEventListener('change', f)
    return () => m.removeEventListener('change', f)
  }, [])
  const hareket = hareketTercih === 'acik' || (hareketTercih === 'oto' && !azalt)
  const hareketRef = useRef(hareket)
  const hizRef = useRef(HIZ_CARPAN[hiz])
  useLayoutEffect(() => {
    hareketRef.current = hareket
    hizRef.current = HIZ_CARPAN[hiz]
    d.dataset.motion = hareket ? 'on' : 'off'
    d.dataset.siddet = siddet
    d.dataset.tema = tema
    d.dataset.vurgu = vurgu
    d.dataset.kontrast = kontrast
    d.dataset.hiz = hiz
  }, [d, hareket, siddet, tema, vurgu, kontrast, hiz])

  const setHareketTercih = useCallback((m: HareketTercih) => {
    setHT(m)
    yaz('kt-hareket', m)
  }, [])
  const setSiddet = useCallback((v: Siddet) => {
    setSiddetS(v)
    yaz('kt-siddet', v)
  }, [])
  const setTema = useCallback((v: Tema) => {
    setTemaS(v)
    yaz('kt-tema', v)
  }, [])
  const setVurgu = useCallback((v: Vurgu) => {
    setVurguS(v)
    yaz('kt-vurgu', v)
  }, [])
  const setKontrast = useCallback((v: Kontrast) => {
    setKontrastS(v)
    yaz('kt-kontrast', v)
  }, [])
  const setHiz = useCallback((v: HizAd) => {
    setHizS(v)
    yaz('kt-hiz', v)
  }, [])
  const duyur = useCallback((t: string) => {
    setDuyuru('')
    window.setTimeout(() => setDuyuru(t), 30)
  }, [])
  const durdur = useCallback(() => {
    const yeni: HareketTercih = hareketRef.current ? 'kapali' : 'acik'
    setHT(yeni)
    yaz('kt-hareket', yeni)
    duyur(yeni === 'kapali' ? 'Hareket durduruldu' : 'Hareket başladı')
  }, [duyur])

  const value = useMemo(
    () => ({ hareketTercih, setHareketTercih, hareket, hareketRef, durdur, siddet, setSiddet, tam: siddet === 'tam', tema, setTema, vurgu, setVurgu, kontrast, setKontrast, hiz, setHiz, hizCarpan: HIZ_CARPAN[hiz], hizRef, duyuru, duyur }),
    [hareketTercih, setHareketTercih, hareket, durdur, siddet, setSiddet, tema, setTema, vurgu, setVurgu, kontrast, setKontrast, hiz, setHiz, duyuru, duyur],
  )
  return <C.Provider value={value}>{children}</C.Provider>
}

export function useKinetic() {
  const v = useContext(C)
  if (!v) throw new Error('KineticProvider yok')
  return v
}

export function Duyuru() {
  const { duyuru } = useKinetic()
  return (
    <p className="sr-only" aria-live="polite" data-live="">
      {duyuru}
    </p>
  )
}
