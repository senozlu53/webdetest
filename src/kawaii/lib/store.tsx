import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type HareketTercih = 'oto' | 'acik' | 'kapali'
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

interface Ctx {
  hareketTercih: HareketTercih
  setHareketTercih: (m: HareketTercih) => void
  hareket: boolean
  kontrast: Kontrast
  setKontrast: (k: Kontrast) => void
  maskot: boolean
  setMaskot: (v: boolean) => void
  duyuru: string
  duyur: (t: string) => void
}

const C = createContext<Ctx | null>(null)

export function KawaiiProvider({ children }: { children: ReactNode }) {
  const d = document.documentElement
  const [hareketTercih, setHT] = useState<HareketTercih>(() => {
    const v = oku('kaw-hareket')
    return v === 'acik' || v === 'kapali' ? v : 'oto'
  })
  const [azalt, setAzalt] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [kontrast, setKontrastS] = useState<Kontrast>(() => (oku('kaw-kontrast') === 'yuksek' ? 'yuksek' : 'normal'))
  const [maskot, setMaskotS] = useState(() => oku('kaw-maskot') !== '0')
  const [duyuru, setDuyuru] = useState('')

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const f = () => setAzalt(mq.matches)
    mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [])
  const hareket = hareketTercih === 'acik' || (hareketTercih === 'oto' && !azalt)
  useEffect(() => {
    d.dataset.motion = hareket ? 'on' : 'off'
    d.dataset.kontrast = kontrast
  }, [d, hareket, kontrast])

  const setHareketTercih = useCallback((m: HareketTercih) => {
    setHT(m)
    yaz('kaw-hareket', m)
  }, [])
  const setKontrast = useCallback((k: Kontrast) => {
    setKontrastS(k)
    yaz('kaw-kontrast', k)
  }, [])
  const setMaskot = useCallback((v: boolean) => {
    setMaskotS(v)
    yaz('kaw-maskot', v ? '1' : '0')
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
      kontrast,
      setKontrast,
      maskot,
      setMaskot,
      duyuru,
      duyur,
    }),
    [hareketTercih, setHareketTercih, hareket, kontrast, setKontrast, maskot, setMaskot, duyuru, duyur],
  )
  return <C.Provider value={value}>{children}</C.Provider>
}

export function useKawaii() {
  const v = useContext(C)
  if (!v) throw new Error('KawaiiProvider yok')
  return v
}

export function Duyuru() {
  const { duyuru } = useKawaii()
  return (
    <p className="sr-only" aria-live="polite" data-live="">
      {duyuru}
    </p>
  )
}
