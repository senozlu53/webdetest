import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useTheme, type Theme } from '../../shared/useTheme'
import type { IkonAd } from './pixel'

export type Olcek = '1' | '2' | '3'
export type Duvar = 'turkuaz' | 'dama' | 'tugla' | 'bulut'
export type Yazi = 'sistem' | 'piksel'
export type PencereId = 'bilgisayar' | 'belgeler' | 'mayin' | 'not' | 'cop' | 'goruntu'

export const OLCEK: Record<Olcek, { ad: string; yuzde: number }> = {
  '1': { ad: 'Küçük yazı', yuzde: 100 },
  '2': { ad: 'Büyük yazı', yuzde: 125 },
  '3': { ad: 'Çok büyük yazı', yuzde: 150 },
}

export interface PencereDurum {
  acik: boolean
  kucuk: boolean
  buyuk: boolean
  x: number
  y: number
  z: number
}

export interface DiyalogButon {
  ad: string
  deger: string
  varsayilan?: boolean
}
export interface Diyalog {
  id: number
  baslik: string
  ikon?: IkonAd
  mesaj: ReactNode
  butonlar: DiyalogButon[]
  coz: (deger: string) => void
}

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

const BASLANGIC: Record<PencereId, { x: number; y: number }> = {
  bilgisayar: { x: 150, y: 90 },
  belgeler: { x: 190, y: 120 },
  mayin: { x: 230, y: 80 },
  not: { x: 270, y: 140 },
  cop: { x: 210, y: 160 },
  goruntu: { x: 250, y: 70 },
}

interface Ctx {
  theme: Theme
  mode: Theme | 'system'
  setMode: (m: Theme | 'system') => void
  olcek: Olcek
  setOlcek: (o: Olcek) => void
  duvar: Duvar
  setDuvar: (d: Duvar) => void
  yazi: Yazi
  setYazi: (y: Yazi) => void
  /** Madde 16: kum saati. ms boyunca imleç kum saati olur; Promise bitince çözülür */
  bekle: (ms: number) => Promise<void>
  mesgul: boolean
  pencereler: Record<PencereId, PencereDurum>
  ac: (id: PencereId) => void
  kapat: (id: PencereId) => void
  kucult: (id: PencereId) => void
  buyut: (id: PencereId) => void
  one: (id: PencereId) => void
  tasi: (id: PencereId, x: number, y: number) => void
  aktif: PencereId | null
  sor: (d: Omit<Diyalog, 'id' | 'coz'>) => Promise<string>
  diyaloglar: Diyalog[]
  duyuru: string
  duyur: (t: string) => void
}

const C = createContext<Ctx | null>(null)
let seq = 0

export function WinProvider({ children }: { children: ReactNode }) {
  const { theme, mode, setMode } = useTheme('win-theme')
  const d = document.documentElement
  const [olcek, setOlcekS] = useState<Olcek>(() => {
    const v = oku('win-olcek')
    return v === '2' || v === '3' ? v : '1'
  })
  const [duvar, setDuvarS] = useState<Duvar>(() => {
    const v = oku('win-duvar')
    return v === 'dama' || v === 'tugla' || v === 'bulut' ? v : 'turkuaz'
  })
  const [yazi, setYaziS] = useState<Yazi>(() => (oku('win-yazi') === 'piksel' ? 'piksel' : 'sistem'))
  const [mesgul, setMesgul] = useState(false)
  const bekleyen = useRef(0)
  const [pencereler, setPencereler] = useState<Record<PencereId, PencereDurum>>(() => {
    const o = {} as Record<PencereId, PencereDurum>
    for (const k of Object.keys(BASLANGIC) as PencereId[]) o[k] = { acik: false, kucuk: false, buyuk: false, ...BASLANGIC[k], z: 0 }
    return o
  })
  const [aktif, setAktif] = useState<PencereId | null>(null)
  const zSay = useRef(1)
  const [diyaloglar, setDiyaloglar] = useState<Diyalog[]>([])
  const [duyuru, setDuyuru] = useState('')

  useEffect(() => {
    d.dataset.olcek = olcek
    d.dataset.duvar = duvar
    d.dataset.yazi = yazi
  }, [d, olcek, duvar, yazi])

  const setOlcek = useCallback((o: Olcek) => {
    setOlcekS(o)
    yaz('win-olcek', o)
  }, [])
  const setDuvar = useCallback((v: Duvar) => {
    setDuvarS(v)
    yaz('win-duvar', v)
  }, [])
  const setYazi = useCallback((v: Yazi) => {
    setYaziS(v)
    yaz('win-yazi', v)
  }, [])
  const duyur = useCallback((t: string) => {
    setDuyuru('')
    window.setTimeout(() => setDuyuru(t), 30)
  }, [])

  const bekle = useCallback(
    (ms: number) =>
      new Promise<void>((coz) => {
        bekleyen.current++
        d.dataset.bekle = '1'
        setMesgul(true)
        window.setTimeout(() => {
          bekleyen.current--
          if (!bekleyen.current) {
            delete d.dataset.bekle
            setMesgul(false)
          }
          coz()
        }, ms)
      }),
    [d],
  )

  const guncelle = useCallback((id: PencereId, f: (p: PencereDurum) => Partial<PencereDurum>) => setPencereler((s) => ({ ...s, [id]: { ...s[id], ...f(s[id]) } })), [])
  const one = useCallback(
    (id: PencereId) => {
      const z = ++zSay.current
      guncelle(id, () => ({ z, kucuk: false }))
      setAktif(id)
    },
    [guncelle],
  )
  // Klasik basamaklı yerleşim: her yeni pencere bir öncekinin 28px sağ altında açılır
  const basamak = useRef(0)
  const ac = useCallback(
    (id: PencereId) => {
      const z = ++zSay.current
      guncelle(id, (p) => {
        if (p.acik) return { kucuk: false, z }
        const k = basamak.current++ % 6
        const sol = Math.max(8, Math.min(window.innerWidth - 360, Math.round(window.innerWidth * 0.18))) + k * 28
        return { acik: true, kucuk: false, z, x: sol, y: 56 + k * 28 }
      })
      setAktif(id)
    },
    [guncelle],
  )
  const kapat = useCallback(
    (id: PencereId) => {
      guncelle(id, () => ({ acik: false, kucuk: false, buyuk: false }))
      setAktif((a) => (a === id ? null : a))
    },
    [guncelle],
  )
  const kucult = useCallback(
    (id: PencereId) => {
      guncelle(id, () => ({ kucuk: true }))
      setAktif((a) => (a === id ? null : a))
    },
    [guncelle],
  )
  const buyut = useCallback((id: PencereId) => guncelle(id, (p) => ({ buyuk: !p.buyuk })), [guncelle])
  const tasi = useCallback((id: PencereId, x: number, y: number) => guncelle(id, () => ({ x, y })), [guncelle])

  const sor = useCallback<Ctx['sor']>(
    (dy) =>
      new Promise((coz) => {
        const id = ++seq
        setDiyaloglar((l) => [
          ...l,
          {
            ...dy,
            id,
            coz: (v) => {
              setDiyaloglar((x) => x.filter((q) => q.id !== id))
              coz(v)
            },
          },
        ])
      }),
    [],
  )

  const value = useMemo(
    () => ({ theme, mode, setMode, olcek, setOlcek, duvar, setDuvar, yazi, setYazi, bekle, mesgul, pencereler, ac, kapat, kucult, buyut, one, tasi, aktif, sor, diyaloglar, duyuru, duyur }),
    [theme, mode, setMode, olcek, setOlcek, duvar, setDuvar, yazi, setYazi, bekle, mesgul, pencereler, ac, kapat, kucult, buyut, one, tasi, aktif, sor, diyaloglar, duyuru, duyur],
  )
  return <C.Provider value={value}>{children}</C.Provider>
}

export function useWin() {
  const v = useContext(C)
  if (!v) throw new Error('WinProvider yok')
  return v
}

export function Duyuru() {
  const { duyuru } = useWin()
  return (
    <p className="sr-only" aria-live="polite" data-live="">
      {duyuru}
    </p>
  )
}

/** Masaüstü mü, telefon mu: 768px altında pencereler tam ekran (Madde 17) */
export function useDar() {
  const q = '(max-width: 767px)'
  const [v, setV] = useState(() => window.matchMedia(q).matches)
  useEffect(() => {
    const m = window.matchMedia(q)
    const f = () => setV(m.matches)
    m.addEventListener('change', f)
    return () => m.removeEventListener('change', f)
  }, [])
  return v
}
