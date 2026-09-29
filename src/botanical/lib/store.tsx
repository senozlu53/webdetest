import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import { URUNLER } from './data'

export type HareketTercih = 'oto' | 'acik' | 'kapali'
export type TemaTercih = 'oto' | 'keten' | 'toprak' | 'orman'
export type Tema = 'keten' | 'toprak' | 'orman'
export type Doku = 'keten' | 'kraft' | 'toprak' | 'duz'
export type Kontrast = 'normal' | 'yuksek'
export type Ruzgar = 'sakin' | 'orta' | 'guclu'

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
  ruzgar: Ruzgar
  setRuzgar: (r: Ruzgar) => void
  /** ürün kimliği → adet */
  sepet: Record<string, number>
  adetAyarla: (id: string, n: number) => void
  sepetTemizle: () => void
  sepetAdet: number
  sepetToplam: number
  duyuru: string
  duyur: (t: string) => void
}

const C = createContext<Ctx | null>(null)

export function BotanicalProvider({ children }: { children: ReactNode }) {
  const d = document.documentElement
  const [hareketTercih, setHT] = useState<HareketTercih>(() => sec('bt-hareket', ['oto', 'acik', 'kapali'], 'oto'))
  const [azalt, setAzalt] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [karanlik, setKaranlik] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const [temaTercih, setTT] = useState<TemaTercih>(() => sec('bt-tema', ['oto', 'keten', 'toprak', 'orman'], 'keten'))
  const [doku, setDokuS] = useState<Doku>(() => sec('bt-doku', ['keten', 'kraft', 'toprak', 'duz'], 'keten'))
  const [kontrast, setKontrastS] = useState<Kontrast>(() => sec('bt-kontrast', ['normal', 'yuksek'], 'normal'))
  const [ruzgar, setRuzgarS] = useState<Ruzgar>(() => sec('bt-ruzgar', ['sakin', 'orta', 'guclu'], 'orta'))
  const [sepet, setSepet] = useState<Record<string, number>>({})
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
  const tema: Tema = temaTercih === 'oto' ? (karanlik ? 'orman' : 'keten') : temaTercih
  useLayoutEffect(() => {
    d.dataset.motion = hareket ? 'on' : 'off'
    d.dataset.tema = tema
    d.dataset.doku = doku
    d.dataset.kontrast = kontrast
    d.dataset.ruzgar = ruzgar
  }, [d, hareket, tema, doku, kontrast, ruzgar])

  const setHareketTercih = useCallback((m: HareketTercih) => {
    setHT(m)
    yaz('bt-hareket', m)
  }, [])
  const setTemaTercih = useCallback((t: TemaTercih) => {
    setTT(t)
    yaz('bt-tema', t)
  }, [])
  const setDoku = useCallback((v: Doku) => {
    setDokuS(v)
    yaz('bt-doku', v)
  }, [])
  const setKontrast = useCallback((v: Kontrast) => {
    setKontrastS(v)
    yaz('bt-kontrast', v)
  }, [])
  const setRuzgar = useCallback((v: Ruzgar) => {
    setRuzgarS(v)
    yaz('bt-ruzgar', v)
  }, [])
  const adetAyarla = useCallback((id: string, n: number) => {
    setSepet((s) => {
      const y = { ...s }
      if (n <= 0) delete y[id]
      else y[id] = Math.min(n, 20)
      return y
    })
  }, [])
  const sepetTemizle = useCallback(() => setSepet({}), [])
  const duyur = useCallback((t: string) => {
    setDuyuru('')
    window.setTimeout(() => setDuyuru(t), 30)
  }, [])

  const sepetAdet = Object.values(sepet).reduce((a, b) => a + b, 0)
  const sepetToplam = Object.entries(sepet).reduce((a, [id, n]) => a + (URUNLER.find((u) => u.id === id)?.fiyat ?? 0) * n, 0)
  const value = useMemo(
    () => ({ hareketTercih, setHareketTercih, hareket, temaTercih, setTemaTercih, tema, doku, setDoku, kontrast, setKontrast, ruzgar, setRuzgar, sepet, adetAyarla, sepetTemizle, sepetAdet, sepetToplam, duyuru, duyur }),
    [hareketTercih, setHareketTercih, hareket, temaTercih, setTemaTercih, tema, doku, setDoku, kontrast, setKontrast, ruzgar, setRuzgar, sepet, adetAyarla, sepetTemizle, sepetAdet, sepetToplam, duyuru, duyur],
  )
  return <C.Provider value={value}>{children}</C.Provider>
}

export function useBotanical() {
  const v = useContext(C)
  if (!v) throw new Error('BotanicalProvider yok')
  return v
}

export function Duyuru() {
  const { duyuru } = useBotanical()
  return (
    <p className="sr-only" aria-live="polite" data-live="">
      {duyuru}
    </p>
  )
}
