import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type HareketTercih = 'oto' | 'acik' | 'kapali'
export type Cvd = 'yok' | 'protan' | 'deutan' | 'tritan' | 'akromat'

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
  yuksek: boolean
  setYuksek: (v: boolean) => void
  desen: boolean
  setDesen: (v: boolean) => void
  cvd: Cvd
  setCvd: (c: Cvd) => void
  /** Madde 14: rastgele dönüş açılarının tohumu. Karıştır yeni tohum verir; aynı tohum hep aynı düzeni üretir */
  tohum: number
  karistir: () => void
  duyuru: string
  duyur: (t: string) => void
}

const C = createContext<Ctx | null>(null)

export function MemphisProvider({ children }: { children: ReactNode }) {
  const d = document.documentElement
  const [hareketTercih, setHT] = useState<HareketTercih>(() => {
    const v = oku('mem-hareket')
    return v === 'acik' || v === 'kapali' ? v : 'oto'
  })
  const [azalt, setAzalt] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [yuksek, setYuksekS] = useState(() => oku('mem-kontrast') === 'yuksek')
  const [desen, setDesenS] = useState(() => oku('mem-desen') === '1')
  const [cvd, setCvdS] = useState<Cvd>(() => {
    const v = oku('mem-cvd')
    return v === 'protan' || v === 'deutan' || v === 'tritan' || v === 'akromat' ? v : 'yok'
  })
  const [tohum, setTohum] = useState(() => {
    const v = Number(oku('mem-tohum'))
    return Number.isFinite(v) && v > 0 ? v : 1982
  })
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
    d.dataset.kontrast = yuksek ? 'yuksek' : 'standart'
    d.dataset.desen = desen ? '1' : '0'
    d.dataset.cvd = cvd
  }, [d, hareket, yuksek, desen, cvd])

  const setHareketTercih = useCallback((m: HareketTercih) => {
    setHT(m)
    yaz('mem-hareket', m)
  }, [])
  const setYuksek = useCallback((v: boolean) => {
    setYuksekS(v)
    yaz('mem-kontrast', v ? 'yuksek' : 'standart')
  }, [])
  const setDesen = useCallback((v: boolean) => {
    setDesenS(v)
    yaz('mem-desen', v ? '1' : '0')
  }, [])
  const setCvd = useCallback((c: Cvd) => {
    setCvdS(c)
    yaz('mem-cvd', c)
  }, [])
  const duyur = useCallback((t: string) => {
    setDuyuru('')
    window.setTimeout(() => setDuyuru(t), 30)
  }, [])
  const karistir = useCallback(() => {
    const yeni = 1 + Math.floor(Math.random() * 99999)
    setTohum(yeni)
    yaz('mem-tohum', String(yeni))
  }, [])

  const value = useMemo(
    () => ({ hareketTercih, setHareketTercih, hareket, yuksek, setYuksek, desen, setDesen, cvd, setCvd, tohum, karistir, duyuru, duyur }),
    [hareketTercih, setHareketTercih, hareket, yuksek, setYuksek, desen, setDesen, cvd, setCvd, tohum, karistir, duyuru, duyur],
  )
  return <C.Provider value={value}>{children}</C.Provider>
}

export function useMemphis() {
  const v = useContext(C)
  if (!v) throw new Error('MemphisProvider yok')
  return v
}

export function Duyuru() {
  const { duyuru } = useMemphis()
  return (
    <p className="sr-only" aria-live="polite" data-live="">
      {duyuru}
    </p>
  )
}
