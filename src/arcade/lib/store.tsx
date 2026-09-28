import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useTheme, type Theme } from '../../shared/useTheme'
import { bip } from './ses'

export type HareketTercih = 'oto' | 'acik' | 'kapali'
export type OlcekTercih = 'oto' | '2' | '3' | '4'

export interface Skor {
  ad: string
  puan: number
  bolum: number
  yeni?: boolean
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

/**
 * Madde 17: tam sayı ölçek. Genişliğe göre k = 2, 3 ya da 4; kullanıcı sabitleyebilir.
 * --u = k CSS pikseli, ama cihaz piksel oranı kesirliyse (1,25 · 1,5) en yakın tam aygıt pikseline yuvarlanır:
 * 1,25 oranında 3 CSS px = 3,75 aygıt pikseli olurdu; 4 aygıt pikseli = 3,2 CSS px seçilir, her sanal piksel eşit kalır.
 */
export function olcekHesapla(tercih: OlcekTercih, w = window.innerWidth, dpr = window.devicePixelRatio || 1) {
  // Sabit ölçek de ekrana sığmalı: en az 110 sanal piksel genişlik kalsın (320px'te en çok 2x, 390px'te 3x)
  const tavan = Math.max(2, Math.floor(w / 110))
  const k = tercih === 'oto' ? (w < 768 ? 2 : w < 1440 ? 3 : 4) : Math.min(+tercih, tavan)
  const aygit = Math.max(1, Math.round(k * dpr))
  return { k, u: aygit / dpr, aygit, dpr, tavan }
}

export const VARSAYILAN_SKOR: Skor[] = [
  { ad: 'AYŞ', puan: 12000, bolum: 9 },
  { ad: 'KAN', puan: 9850, bolum: 8 },
  { ad: 'ZEY', puan: 8200, bolum: 7 },
  { ad: 'ÖMR', puan: 6400, bolum: 6 },
  { ad: 'İPE', puan: 5150, bolum: 5 },
  { ad: 'DOĞ', puan: 3900, bolum: 4 },
  { ad: 'SEL', puan: 2500, bolum: 3 },
  { ad: 'ÇAĞ', puan: 1200, bolum: 2 },
]

interface Ctx {
  theme: Theme
  setTheme: (t: Theme) => void
  hareketTercih: HareketTercih
  setHareketTercih: (m: HareketTercih) => void
  hareket: boolean
  crt: boolean
  setCrt: (v: boolean) => void
  olcekTercih: OlcekTercih
  setOlcekTercih: (o: OlcekTercih) => void
  olcek: ReturnType<typeof olcekHesapla>
  ses: boolean
  setSes: (v: boolean) => void
  kredi: number
  jetonAt: () => void
  krediHarca: () => boolean
  skorlar: Skor[]
  skorEkle: (s: Skor) => number
  birUp: number
  setBirUp: (n: number) => void
  duyuru: string
  duyur: (t: string) => void
}

const C = createContext<Ctx | null>(null)

export function ArcadeProvider({ children }: { children: ReactNode }) {
  const { theme, setMode } = useTheme('arc-theme')
  const d = document.documentElement
  const [hareketTercih, setHT] = useState<HareketTercih>(() => {
    const v = oku('arc-hareket')
    return v === 'acik' || v === 'kapali' ? v : 'oto'
  })
  const [azalt, setAzalt] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [crt, setCrtS] = useState(() => oku('arc-crt') !== '0')
  const [olcekTercih, setOT] = useState<OlcekTercih>(() => {
    const v = oku('arc-olcek')
    return v === '2' || v === '3' || v === '4' ? v : 'oto'
  })
  const [olcek, setOlcek] = useState(() => olcekHesapla(olcekTercih))
  const [ses, setSesS] = useState(() => oku('arc-ses') === '1')
  const [kredi, setKredi] = useState(0)
  const [skorlar, setSkorlar] = useState<Skor[]>(() => {
    try {
      const v = JSON.parse(oku('arc-skor') ?? 'null')
      if (Array.isArray(v) && v.every((s) => typeof s?.ad === 'string' && typeof s?.puan === 'number')) return v.slice(0, 10)
    } catch {
      /* bozuk kayıt: varsayılan tablo */
    }
    return VARSAYILAN_SKOR
  })
  const [birUp, setBirUp] = useState(0)
  const [duyuru, setDuyuru] = useState('')

  // Bu stil siyah zeminle doğar: tercih yoksa sistem açık olsa bile Salon (koyu)
  useEffect(() => {
    if (!d.dataset.theme) d.dataset.theme = 'dark'
  }, [d])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const f = () => setAzalt(mq.matches)
    mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [])
  const hareket = hareketTercih === 'acik' || (hareketTercih === 'oto' && !azalt)

  useEffect(() => {
    d.dataset.motion = hareket ? 'on' : 'off'
    d.dataset.crt = crt ? '1' : '0'
  }, [d, hareket, crt])

  // Ölçek: pencere boyu ya da cihaz piksel oranı (yakınlaştırma) değişince yeniden hesaplanır
  useEffect(() => {
    let mq: MediaQueryList | null = null
    const uygula = () => {
      const o = olcekHesapla(olcekTercih)
      d.dataset.k = String(o.k)
      d.style.setProperty('--u', `${o.u}px`)
      setOlcek((e) => (e.k === o.k && e.u === o.u && e.dpr === o.dpr ? e : o))
      mq?.removeEventListener('change', uygula)
      mq = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
      mq.addEventListener('change', uygula)
    }
    uygula()
    window.addEventListener('resize', uygula)
    return () => {
      window.removeEventListener('resize', uygula)
      mq?.removeEventListener('change', uygula)
    }
  }, [d, olcekTercih])

  const setTheme = useCallback((t: Theme) => setMode(t), [setMode])
  const setHareketTercih = useCallback((m: HareketTercih) => {
    setHT(m)
    yaz('arc-hareket', m)
  }, [])
  const setCrt = useCallback((v: boolean) => {
    setCrtS(v)
    yaz('arc-crt', v ? '1' : '0')
  }, [])
  const setOlcekTercih = useCallback((o: OlcekTercih) => {
    setOT(o)
    yaz('arc-olcek', o)
  }, [])
  const setSes = useCallback((v: boolean) => {
    setSesS(v)
    yaz('arc-ses', v ? '1' : '0')
  }, [])
  const duyur = useCallback((t: string) => {
    setDuyuru('')
    window.setTimeout(() => setDuyuru(t), 30)
  }, [])

  const jetonAt = useCallback(() => {
    setKredi((k) => Math.min(9, k + 1))
    if (ses) bip('jeton')
  }, [ses])
  const krediHarca = useCallback(() => {
    if (kredi <= 0) return false
    setKredi(kredi - 1)
    return true
  }, [kredi])

  useEffect(() => {
    yaz('arc-skor', JSON.stringify(skorlar.map(({ ad, puan, bolum }) => ({ ad, puan, bolum }))))
  }, [skorlar])
  /** Tabloya ekler, sırasını döndürür (1'den; tabloya giremezse 0) */
  const skorEkle = useCallback(
    (s: Skor) => {
      const l = [...skorlar.map((x) => ({ ...x, yeni: false })), { ...s, yeni: true }].sort((a, b) => b.puan - a.puan).slice(0, 10)
      setSkorlar(l)
      return l.findIndex((x) => x.yeni) + 1
    },
    [skorlar],
  )

  const value = useMemo(
    () => ({ theme, setTheme, hareketTercih, setHareketTercih, hareket, crt, setCrt, olcekTercih, setOlcekTercih, olcek, ses, setSes, kredi, jetonAt, krediHarca, skorlar, skorEkle, birUp, setBirUp, duyuru, duyur }),
    [theme, setTheme, hareketTercih, setHareketTercih, hareket, crt, setCrt, olcekTercih, setOlcekTercih, olcek, ses, setSes, kredi, jetonAt, krediHarca, skorlar, skorEkle, birUp, duyuru, duyur],
  )
  return <C.Provider value={value}>{children}</C.Provider>
}

export function useArcade() {
  const v = useContext(C)
  if (!v) throw new Error('ArcadeProvider yok')
  return v
}

export function Duyuru() {
  const { duyuru } = useArcade()
  return (
    <p className="sr-only" aria-live="polite" data-live="">
      {duyuru}
    </p>
  )
}
