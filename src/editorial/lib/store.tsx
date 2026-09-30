import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from 'react'

export type HareketTercih = 'oto' | 'acik' | 'kapali'
export type Tema = 'krem' | 'beyaz' | 'gece'
export type Kontrast = 'normal' | 'yuksek'
export type Boyut = '100' | '112' | '125'
export type Aralik = 'normal' | 'genis'
export type Izgara = 'acik' | 'kapali'

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
  hareketRef: MutableRefObject<boolean>
  durdur: () => void
  tema: Tema
  setTema: (t: Tema) => void
  kontrast: Kontrast
  setKontrast: (k: Kontrast) => void
  boyut: Boyut
  setBoyut: (b: Boyut) => void
  aralik: Aralik
  setAralik: (a: Aralik) => void
  izgara: Izgara
  setIzgara: (i: Izgara) => void
  duyuru: string
  duyur: (t: string) => void
}

const C = createContext<Ctx | null>(null)

export function EditorialProvider({ children }: { children: ReactNode }) {
  const d = document.documentElement
  const [hareketTercih, setHT] = useState<HareketTercih>(() => sec('ed-hareket', ['oto', 'acik', 'kapali'], 'oto'))
  const [azalt, setAzalt] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [tema, setTemaS] = useState<Tema>(() => sec('ed-tema', ['krem', 'beyaz', 'gece'], 'krem'))
  const [kontrast, setKontrastS] = useState<Kontrast>(() => sec('ed-kontrast', ['normal', 'yuksek'], 'normal'))
  const [boyut, setBoyutS] = useState<Boyut>(() => sec('ed-boyut', ['100', '112', '125'], '100'))
  const [aralik, setAralikS] = useState<Aralik>(() => sec('ed-aralik', ['normal', 'genis'], 'normal'))
  const [izgara, setIzgaraS] = useState<Izgara>(() => sec('ed-izgara', ['acik', 'kapali'], 'kapali'))
  const [duyuru, setDuyuru] = useState('')

  useEffect(() => {
    const m1 = window.matchMedia('(prefers-reduced-motion: reduce)')
    const f1 = () => setAzalt(m1.matches)
    m1.addEventListener('change', f1)
    return () => m1.removeEventListener('change', f1)
  }, [])
  const hareket = hareketTercih === 'acik' || (hareketTercih === 'oto' && !azalt)
  const hareketRef = useRef(hareket)
  useLayoutEffect(() => {
    hareketRef.current = hareket
    d.dataset.motion = hareket ? 'on' : 'off'
    d.dataset.tema = tema
    d.dataset.kontrast = kontrast
    d.dataset.boyut = boyut
    d.dataset.aralik = aralik
    d.dataset.izgara = izgara
    d.style.colorScheme = tema === 'gece' ? 'dark' : 'light'
  }, [d, hareket, tema, kontrast, boyut, aralik, izgara])

  const setHareketTercih = useCallback((m: HareketTercih) => {
    setHT(m)
    yaz('ed-hareket', m)
  }, [])
  const setTema = useCallback((v: Tema) => {
    setTemaS(v)
    yaz('ed-tema', v)
  }, [])
  const setKontrast = useCallback((v: Kontrast) => {
    setKontrastS(v)
    yaz('ed-kontrast', v)
  }, [])
  const setBoyut = useCallback((v: Boyut) => {
    setBoyutS(v)
    yaz('ed-boyut', v)
  }, [])
  const setAralik = useCallback((v: Aralik) => {
    setAralikS(v)
    yaz('ed-aralik', v)
  }, [])
  const setIzgara = useCallback((v: Izgara) => {
    setIzgaraS(v)
    yaz('ed-izgara', v)
  }, [])
  const duyur = useCallback((t: string) => {
    setDuyuru('')
    window.setTimeout(() => setDuyuru(t), 30)
  }, [])
  const durdur = useCallback(() => {
    const yeni: HareketTercih = hareketRef.current ? 'kapali' : 'acik'
    setHT(yeni)
    yaz('ed-hareket', yeni)
    duyur(yeni === 'kapali' ? 'Geçiş hareketleri durduruldu' : 'Geçiş hareketleri başladı')
  }, [duyur])

  const value = useMemo(
    () => ({ hareketTercih, setHareketTercih, hareket, hareketRef, durdur, tema, setTema, kontrast, setKontrast, boyut, setBoyut, aralik, setAralik, izgara, setIzgara, duyuru, duyur }),
    [hareketTercih, setHareketTercih, hareket, durdur, tema, setTema, kontrast, setKontrast, boyut, setBoyut, aralik, setAralik, izgara, setIzgara, duyuru, duyur],
  )
  return <C.Provider value={value}>{children}</C.Provider>
}

export function useEditorial() {
  const v = useContext(C)
  if (!v) throw new Error('EditorialProvider yok')
  return v
}

export function Duyuru() {
  const { duyuru } = useEditorial()
  return (
    <p className="sr-only" aria-live="polite" data-live="">
      {duyuru}
    </p>
  )
}
