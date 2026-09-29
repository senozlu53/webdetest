import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type HareketTercih = 'oto' | 'acik' | 'kapali'
export type TemaTercih = 'oto' | 'siyah' | 'lacivert' | 'zumrut' | 'fildisi'
export type Tema = 'siyah' | 'lacivert' | 'zumrut' | 'fildisi'
export type Doku = 'kadife' | 'mermer' | 'firca' | 'duz'
export type Kontrast = 'normal' | 'yuksek'
export type Iz = 'genis' | 'dar'

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
  iz: Iz
  setIz: (i: Iz) => void
  duyuru: string
  duyur: (t: string) => void
}

const C = createContext<Ctx | null>(null)

export function DecoProvider({ children }: { children: ReactNode }) {
  const d = document.documentElement
  const [hareketTercih, setHT] = useState<HareketTercih>(() => sec('dc-hareket', ['oto', 'acik', 'kapali'], 'oto'))
  const [azalt, setAzalt] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [aydinlik, setAydinlik] = useState(() => window.matchMedia('(prefers-color-scheme: light)').matches)
  const [temaTercih, setTT] = useState<TemaTercih>(() => sec('dc-tema', ['oto', 'siyah', 'lacivert', 'zumrut', 'fildisi'], 'siyah'))
  const [doku, setDokuS] = useState<Doku>(() => sec('dc-doku', ['kadife', 'mermer', 'firca', 'duz'], 'kadife'))
  const [kontrast, setKontrastS] = useState<Kontrast>(() => sec('dc-kontrast', ['normal', 'yuksek'], 'normal'))
  const [iz, setIzS] = useState<Iz>(() => sec('dc-iz', ['genis', 'dar'], 'genis'))
  const [duyuru, setDuyuru] = useState('')

  useEffect(() => {
    const m1 = window.matchMedia('(prefers-reduced-motion: reduce)')
    const m2 = window.matchMedia('(prefers-color-scheme: light)')
    const f1 = () => setAzalt(m1.matches)
    const f2 = () => setAydinlik(m2.matches)
    m1.addEventListener('change', f1)
    m2.addEventListener('change', f2)
    return () => {
      m1.removeEventListener('change', f1)
      m2.removeEventListener('change', f2)
    }
  }, [])
  const hareket = hareketTercih === 'acik' || (hareketTercih === 'oto' && !azalt)
  const tema: Tema = temaTercih === 'oto' ? (aydinlik ? 'fildisi' : 'siyah') : temaTercih
  useEffect(() => {
    d.dataset.motion = hareket ? 'on' : 'off'
    d.dataset.tema = tema
    d.dataset.doku = doku
    d.dataset.kontrast = kontrast
    d.dataset.iz = iz
  }, [d, hareket, tema, doku, kontrast, iz])

  const setHareketTercih = useCallback((m: HareketTercih) => {
    setHT(m)
    yaz('dc-hareket', m)
  }, [])
  const setTemaTercih = useCallback((t: TemaTercih) => {
    setTT(t)
    yaz('dc-tema', t)
  }, [])
  const setDoku = useCallback((v: Doku) => {
    setDokuS(v)
    yaz('dc-doku', v)
  }, [])
  const setKontrast = useCallback((v: Kontrast) => {
    setKontrastS(v)
    yaz('dc-kontrast', v)
  }, [])
  const setIz = useCallback((v: Iz) => {
    setIzS(v)
    yaz('dc-iz', v)
  }, [])
  const duyur = useCallback((t: string) => {
    setDuyuru('')
    window.setTimeout(() => setDuyuru(t), 30)
  }, [])

  const value = useMemo(
    () => ({ hareketTercih, setHareketTercih, hareket, temaTercih, setTemaTercih, tema, doku, setDoku, kontrast, setKontrast, iz, setIz, duyuru, duyur }),
    [hareketTercih, setHareketTercih, hareket, temaTercih, setTemaTercih, tema, doku, setDoku, kontrast, setKontrast, iz, setIz, duyuru, duyur],
  )
  return <C.Provider value={value}>{children}</C.Provider>
}

export function useDeco() {
  const v = useContext(C)
  if (!v) throw new Error('DecoProvider yok')
  return v
}

export function Duyuru() {
  const { duyuru } = useDeco()
  return (
    <p className="sr-only" aria-live="polite" data-live="">
      {duyuru}
    </p>
  )
}
