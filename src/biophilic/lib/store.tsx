import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { degiskenler, palet, type ModAd, type Palet } from './zaman'

export type HareketTercih = 'oto' | 'acik' | 'kapali'
export type Doku = 'yok' | 'su' | 'yaprak' | 'ahsap'
export type Kontrast = 'normal' | 'yuksek'
export type DogaTercih = 'oto' | 'tam' | 'hafif'
export type DogaSeviye = 'tam' | 'hafif'

/** Doku varken çözücünün hesaba kattığı en büyük doku alfası */
export const DOKU_ALFA = 0.07

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

const gercekSaat = () => {
  const n = new Date()
  return n.getHours() + n.getMinutes() / 60
}

interface Ctx {
  /** 'oto': gerçek saat; sayı: elle seçilen saat */
  saatTercih: 'oto' | number
  saat: number
  mod: ModAd
  saatAyarla: (s: 'oto' | number, hizli?: boolean) => void
  palet: Palet
  hareketTercih: HareketTercih
  setHareketTercih: (m: HareketTercih) => void
  hareket: boolean
  doku: Doku
  setDoku: (d: Doku) => void
  kontrast: Kontrast
  setKontrast: (k: Kontrast) => void
  hedef: number
  dogaTercih: DogaTercih
  setDogaTercih: (d: DogaTercih) => void
  dogaSeviye: DogaSeviye
  duyuru: string
  duyur: (t: string) => void
}

const C = createContext<Ctx | null>(null)

export function BiophilicProvider({ children }: { children: ReactNode }) {
  const d = document.documentElement
  const [saatTercih, setST] = useState<'oto' | number>(() => {
    const z = oku('bf-zaman')
    return z && z !== 'oto' && !Number.isNaN(+z) ? Math.max(0, Math.min(24, +z)) : 'oto'
  })
  const [simdi, setSimdi] = useState(gercekSaat)
  const [hareketTercih, setHT] = useState<HareketTercih>(() => sec('bf-hareket', ['oto', 'acik', 'kapali'], 'oto'))
  const [azalt, setAzalt] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [dar, setDar] = useState(() => window.matchMedia('(max-width: 767px)').matches)
  const [doku, setDokuS] = useState<Doku>(() => sec('bf-doku', ['yok', 'su', 'yaprak', 'ahsap'], 'su'))
  const [kontrast, setKontrastS] = useState<Kontrast>(() => sec('bf-kontrast', ['normal', 'yuksek'], 'normal'))
  const [dogaTercih, setDT] = useState<DogaTercih>(() => sec('bf-doga', ['oto', 'tam', 'hafif'], 'oto'))
  const [duyuru, setDuyuru] = useState('')
  const ilk = useRef(true)
  const gecisZamani = useRef(0)

  useEffect(() => {
    const m1 = window.matchMedia('(prefers-reduced-motion: reduce)')
    const m2 = window.matchMedia('(max-width: 767px)')
    const f1 = () => setAzalt(m1.matches)
    const f2 = () => setDar(m2.matches)
    m1.addEventListener('change', f1)
    m2.addEventListener('change', f2)
    // gerçek saat: yarım dakikada bir güncellenir; geçiş 1 sn'de yumuşar
    const t = window.setInterval(() => setSimdi(gercekSaat()), 30000)
    return () => {
      m1.removeEventListener('change', f1)
      m2.removeEventListener('change', f2)
      window.clearInterval(t)
    }
  }, [])

  const hareket = hareketTercih === 'acik' || (hareketTercih === 'oto' && !azalt)
  const kayitli = typeof navigator !== 'undefined' && (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true
  const dogaSeviye: DogaSeviye = dogaTercih === 'tam' ? 'tam' : dogaTercih === 'hafif' ? 'hafif' : dar || kayitli ? 'hafif' : 'tam'
  const saat = saatTercih === 'oto' ? simdi : saatTercih
  const hedef = kontrast === 'yuksek' ? 7 : 4.5
  const p = useMemo(() => palet(saat, { denge: true, hedef, doku: doku === 'yok' ? 0 : DOKU_ALFA }), [saat, hedef, doku])

  useLayoutEffect(() => {
    d.dataset.motion = hareket ? 'on' : 'off'
    d.dataset.doku = doku
    d.dataset.kontrast = kontrast
    d.dataset.doga = dogaTercih
    d.dataset.dogaSeviye = dogaSeviye
    d.dataset.zaman = p.mod
    d.dataset.cam = p.cam.acik ? 'acik' : 'koyu'
    for (const [k, v] of Object.entries(degiskenler(p))) d.style.setProperty(k, v)
    if (ilk.current) {
      // ilk boyamada geçiş yok: statik değerlerden hesaplanan değerlere sıçrama görünmez
      ilk.current = false
      d.dataset.gecis = 'anlik'
      requestAnimationFrame(() => requestAnimationFrame(() => delete d.dataset.gecis))
    }
  }, [d, hareket, doku, kontrast, dogaTercih, dogaSeviye, p])

  const saatAyarla = useCallback(
    (s: 'oto' | number, hizli = false) => {
      // kaydırıcıyla gezinirken geçiş kısalır (140 ms) ve sürükleme akıcı kalır; kısayol düğmeleri tam 1 sn'de geçer
      if (hizli) {
        d.dataset.gecis = 'hizli'
        window.clearTimeout(gecisZamani.current)
        gecisZamani.current = window.setTimeout(() => delete d.dataset.gecis, 260)
      }
      setST(s)
      yaz('bf-zaman', String(s))
    },
    [d],
  )
  const setHareketTercih = useCallback((m: HareketTercih) => {
    setHT(m)
    yaz('bf-hareket', m)
  }, [])
  const setDoku = useCallback((v: Doku) => {
    setDokuS(v)
    yaz('bf-doku', v)
  }, [])
  const setKontrast = useCallback((v: Kontrast) => {
    setKontrastS(v)
    yaz('bf-kontrast', v)
  }, [])
  const setDogaTercih = useCallback((v: DogaTercih) => {
    setDT(v)
    yaz('bf-doga', v)
  }, [])
  const duyur = useCallback((t: string) => {
    setDuyuru('')
    window.setTimeout(() => setDuyuru(t), 30)
  }, [])

  const value = useMemo(
    () => ({ saatTercih, saat, mod: p.mod, saatAyarla, palet: p, hareketTercih, setHareketTercih, hareket, doku, setDoku, kontrast, setKontrast, hedef, dogaTercih, setDogaTercih, dogaSeviye, duyuru, duyur }),
    [saatTercih, saat, p, saatAyarla, hareketTercih, setHareketTercih, hareket, doku, setDoku, kontrast, setKontrast, hedef, dogaTercih, setDogaTercih, dogaSeviye, duyuru, duyur],
  )
  return <C.Provider value={value}>{children}</C.Provider>
}

export function useBiophilic() {
  const v = useContext(C)
  if (!v) throw new Error('BiophilicProvider yok')
  return v
}

export function Duyuru() {
  const { duyuru } = useBiophilic()
  return (
    <p className="sr-only" aria-live="polite" data-live="">
      {duyuru}
    </p>
  )
}
