import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from 'react'

export type HareketTercih = 'oto' | 'acik' | 'kapali'
export type Tema = 'zindan' | 'parsomen'
export type Kontrast = 'normal' | 'yuksek'
export type Suslenme = 'oto' | 'tam' | 'sade' | 'yok'
export type Parcacik = 'acik' | 'kapali'

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

/** Madde 17: bu genişliğin altında süslemeler sadeleşir */
export const SADE_ESIGI = 640

interface Ctx {
  hareketTercih: HareketTercih
  setHareketTercih: (m: HareketTercih) => void
  hareket: boolean
  hareketRef: MutableRefObject<boolean>
  tema: Tema
  setTema: (t: Tema) => void
  kontrast: Kontrast
  setKontrast: (k: Kontrast) => void
  suslenme: Suslenme
  setSuslenme: (s: Suslenme) => void
  /** süslemeler şu an sade mi: dar ekran ya da kullanıcı tercihi */
  sade: boolean
  parcacik: Parcacik
  setParcacik: (p: Parcacik) => void
  /** yaldız parçacıkları şu an çalışabilir mi */
  yaldizAcik: boolean
  yaldizRef: MutableRefObject<boolean>
  duyuru: string
  duyur: (t: string) => void
}

const C = createContext<Ctx | null>(null)

export function FantasyProvider({ children }: { children: ReactNode }) {
  const d = document.documentElement
  const [hareketTercih, setHT] = useState<HareketTercih>(() => sec('fa-hareket', ['oto', 'acik', 'kapali'], 'oto'))
  const [azalt, setAzalt] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [dar, setDar] = useState(() => window.matchMedia(`(max-width: ${SADE_ESIGI - 1}px)`).matches)
  const [tema, setTemaS] = useState<Tema>(() => sec('fa-tema', ['zindan', 'parsomen'], 'zindan'))
  const [kontrast, setKontrastS] = useState<Kontrast>(() => sec('fa-kontrast', ['normal', 'yuksek'], 'normal'))
  const [suslenme, setSuslenmeS] = useState<Suslenme>(() => sec('fa-suslenme', ['oto', 'tam', 'sade', 'yok'], 'oto'))
  const [parcacik, setParcacikS] = useState<Parcacik>(() => sec('fa-parcacik', ['acik', 'kapali'], 'acik'))
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
  const sade = suslenme === 'sade' || suslenme === 'yok' || (suslenme === 'oto' && dar)
  const yaldizAcik = hareket && parcacik === 'acik'
  const hareketRef = useRef(hareket)
  const yaldizRef = useRef(yaldizAcik)
  useLayoutEffect(() => {
    hareketRef.current = hareket
    yaldizRef.current = yaldizAcik
    d.dataset.motion = hareket ? 'on' : 'off'
    d.dataset.tema = tema
    d.dataset.kontrast = kontrast
    d.dataset.suslenme = suslenme
    d.dataset.parcacik = parcacik
  }, [d, hareket, yaldizAcik, tema, kontrast, suslenme, parcacik])

  const setHareketTercih = useCallback((m: HareketTercih) => {
    setHT(m)
    yaz('fa-hareket', m)
  }, [])
  const setTema = useCallback((v: Tema) => {
    setTemaS(v)
    yaz('fa-tema', v)
  }, [])
  const setKontrast = useCallback((v: Kontrast) => {
    setKontrastS(v)
    yaz('fa-kontrast', v)
  }, [])
  const setSuslenme = useCallback((v: Suslenme) => {
    setSuslenmeS(v)
    yaz('fa-suslenme', v)
  }, [])
  const setParcacik = useCallback((v: Parcacik) => {
    setParcacikS(v)
    yaz('fa-parcacik', v)
  }, [])
  const duyur = useCallback((t: string) => {
    setDuyuru('')
    window.setTimeout(() => setDuyuru(t), 30)
  }, [])

  const value = useMemo(
    () => ({ hareketTercih, setHareketTercih, hareket, hareketRef, tema, setTema, kontrast, setKontrast, suslenme, setSuslenme, sade, parcacik, setParcacik, yaldizAcik, yaldizRef, duyuru, duyur }),
    [hareketTercih, setHareketTercih, hareket, tema, setTema, kontrast, setKontrast, suslenme, setSuslenme, sade, parcacik, setParcacik, yaldizAcik, duyuru, duyur],
  )
  return <C.Provider value={value}>{children}</C.Provider>
}

export function useFantasy() {
  const v = useContext(C)
  if (!v) throw new Error('FantasyProvider yok')
  return v
}

export function Duyuru() {
  const { duyuru } = useFantasy()
  return (
    <p className="sr-only" aria-live="polite" data-live="">
      {duyuru}
    </p>
  )
}
