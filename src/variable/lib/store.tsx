import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from 'react'

export type HareketTercih = 'oto' | 'acik' | 'kapali'
export type Esneklik = 'oto' | 'kilitli'
export type Palet = 'ham' | 'ters' | 'kobalt' | 'beton'
export type Kontrast = 'normal' | 'yuksek'
export type Glitch = 'acik' | 'kapali'

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

/** Çalışan hareket kaydı (Madde 18 "hareket bütçesi") */
export const HAREKET_KAYDI = new Set<string>()

/** Madde 17: bu genişliğin altında eksenler kilitlenir */
export const KILIT_ESIGI = 640

interface Ctx {
  hareketTercih: HareketTercih
  setHareketTercih: (m: HareketTercih) => void
  hareket: boolean
  hareketRef: MutableRefObject<boolean>
  durdur: () => void
  esneklik: Esneklik
  setEsneklik: (e: Esneklik) => void
  /** eksenler şu an kilitli mi: dar ekran ya da kullanıcı kilidi */
  kilitli: boolean
  kilitliRef: MutableRefObject<boolean>
  dar: boolean
  palet: Palet
  setPalet: (p: Palet) => void
  kontrast: Kontrast
  setKontrast: (k: Kontrast) => void
  glitch: Glitch
  setGlitch: (g: Glitch) => void
  duyuru: string
  duyur: (t: string) => void
}

const C = createContext<Ctx | null>(null)

export function VariableProvider({ children }: { children: ReactNode }) {
  const d = document.documentElement
  const [hareketTercih, setHT] = useState<HareketTercih>(() => sec('vk-hareket', ['oto', 'acik', 'kapali'], 'oto'))
  const [azalt, setAzalt] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [dar, setDar] = useState(() => window.matchMedia(`(max-width: ${KILIT_ESIGI - 1}px)`).matches)
  const [esneklik, setEsneklikS] = useState<Esneklik>(() => sec('vk-esneklik', ['oto', 'kilitli'], 'oto'))
  const [palet, setPaletS] = useState<Palet>(() => sec('vk-palet', ['ham', 'ters', 'kobalt', 'beton'], 'ham'))
  const [kontrast, setKontrastS] = useState<Kontrast>(() => sec('vk-kontrast', ['normal', 'yuksek'], 'normal'))
  const [glitch, setGlitchS] = useState<Glitch>(() => sec('vk-glitch', ['acik', 'kapali'], 'acik'))
  const [duyuru, setDuyuru] = useState('')

  useEffect(() => {
    const m1 = window.matchMedia('(prefers-reduced-motion: reduce)')
    const m2 = window.matchMedia(`(max-width: ${KILIT_ESIGI - 1}px)`)
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
  const kilitli = esneklik === 'kilitli' || dar
  const hareketRef = useRef(hareket)
  const kilitliRef = useRef(kilitli)
  useLayoutEffect(() => {
    hareketRef.current = hareket
    kilitliRef.current = kilitli
    d.dataset.motion = hareket ? 'on' : 'off'
    d.dataset.esneklik = esneklik
    d.dataset.palet = palet
    d.dataset.kontrast = kontrast
    d.dataset.glitch = glitch
  }, [d, hareket, kilitli, esneklik, palet, kontrast, glitch])

  const setHareketTercih = useCallback((m: HareketTercih) => {
    setHT(m)
    yaz('vk-hareket', m)
  }, [])
  const setEsneklik = useCallback((v: Esneklik) => {
    setEsneklikS(v)
    yaz('vk-esneklik', v)
  }, [])
  const setPalet = useCallback((v: Palet) => {
    setPaletS(v)
    yaz('vk-palet', v)
  }, [])
  const setKontrast = useCallback((v: Kontrast) => {
    setKontrastS(v)
    yaz('vk-kontrast', v)
  }, [])
  const setGlitch = useCallback((v: Glitch) => {
    setGlitchS(v)
    yaz('vk-glitch', v)
  }, [])
  const duyur = useCallback((t: string) => {
    setDuyuru('')
    window.setTimeout(() => setDuyuru(t), 30)
  }, [])
  const durdur = useCallback(() => {
    const yeni: HareketTercih = hareketRef.current ? 'kapali' : 'acik'
    setHT(yeni)
    yaz('vk-hareket', yeni)
    duyur(yeni === 'kapali' ? 'Hareket durduruldu' : 'Hareket başladı')
  }, [duyur])

  const value = useMemo(
    () => ({ hareketTercih, setHareketTercih, hareket, hareketRef, durdur, esneklik, setEsneklik, kilitli, kilitliRef, dar, palet, setPalet, kontrast, setKontrast, glitch, setGlitch, duyuru, duyur }),
    [hareketTercih, setHareketTercih, hareket, durdur, esneklik, setEsneklik, kilitli, dar, palet, setPalet, kontrast, setKontrast, glitch, setGlitch, duyuru, duyur],
  )
  return <C.Provider value={value}>{children}</C.Provider>
}

export function useVariable() {
  const v = useContext(C)
  if (!v) throw new Error('VariableProvider yok')
  return v
}

export function Duyuru() {
  const { duyuru } = useVariable()
  return (
    <p className="sr-only" aria-live="polite" data-live="">
      {duyuru}
    </p>
  )
}
