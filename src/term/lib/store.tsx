import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { SUNUCULAR, type Log, type Seviye, type Sunucu } from './data'
import { clock } from './ascii'

export type Tema = 'yesil' | 'kehribar' | 'beyaz' | 'solarized'
export type Yazi = 'jetbrains' | 'fira' | 'scp'
export type HareketPref = 'oto' | 'acik' | 'kapali'

export const TEMALAR: ReadonlyArray<{ id: Tema; ad: string }> = [
  { id: 'yesil', ad: 'yeşil' },
  { id: 'kehribar', ad: 'kehribar' },
  { id: 'beyaz', ad: 'beyaz' },
  { id: 'solarized', ad: 'solarized' },
]
export const YAZILAR_: ReadonlyArray<{ id: Yazi; ad: string }> = [
  { id: 'jetbrains', ad: 'JetBrains Mono' },
  { id: 'fira', ad: 'Fira Code' },
  { id: 'scp', ad: 'Source Code Pro' },
]

function read<T extends string>(key: string, allowed: readonly T[]): T | null {
  try {
    const v = localStorage.getItem(key)
    return v && (allowed as readonly string[]).includes(v) ? (v as T) : null
  } catch {
    return null
  }
}
function write(key: string, v: string | null) {
  try {
    if (v === null) localStorage.removeItem(key)
    else localStorage.setItem(key, v)
  } catch {
    /* depolama kapalı */
  }
}

/** <html data-*> özniteliğine yazılan, localStorage'da hatırlanan ayar */
function useSetting<T extends string>(key: string, attr: string, allowed: readonly T[], fallback: () => T) {
  const [v, setV] = useState<T>(() => read(key, allowed) ?? fallback())
  useEffect(() => {
    document.documentElement.setAttribute(attr, v)
  }, [attr, v])
  const set = useCallback(
    (n: T) => {
      setV(n)
      write(key, n)
    },
    [key],
  )
  return [v, set] as const
}

function useMedia(q: string) {
  const [m, setM] = useState(() => window.matchMedia(q).matches)
  useEffect(() => {
    const mq = window.matchMedia(q)
    const f = () => setM(mq.matches)
    mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [q])
  return m
}

type Store = {
  tema: Tema
  setTema: (t: Tema) => void
  yazi: Yazi
  setYazi: (y: Yazi) => void
  crt: boolean
  setCrt: (b: boolean) => void
  bag: boolean
  setBag: (b: boolean) => void
  izgara: boolean
  setIzgara: (b: boolean) => void
  hareket: 'acik' | 'kapali'
  hareketPref: HareketPref
  setHareketPref: (p: HareketPref) => void
  palet: boolean
  setPalet: (b: boolean) => void
  /** Komut paletinden kıyaslama isteği */
  kiyasSinyal: number
  kiyasla: () => void
  sunucular: Sunucu[]
  setSunucular: (f: (s: Sunucu[]) => Sunucu[]) => void
  /** start / stop / restart: sonuç iletisi döner */
  sunucuKomut: (komut: 'start' | 'stop' | 'restart', host: string) => string
  loglar: Log[]
  log: (seviye: Seviye, kaynak: string, mesaj: string) => void
  temizle: () => void
  duyuru: string
  soyle: (m: string) => void
}

const Ctx = createContext<Store | null>(null)

export function TermProvider({ children }: { children: ReactNode }) {
  const light = useMedia('(prefers-color-scheme: light)')
  const reduce = useMedia('(prefers-reduced-motion: reduce)')
  const [tema, setTema] = useSetting<Tema>('term-theme', 'data-theme', ['yesil', 'kehribar', 'beyaz', 'solarized'], () => (light ? 'solarized' : 'yesil'))
  const [yazi, setYazi] = useSetting<Yazi>('term-font', 'data-font', ['jetbrains', 'fira', 'scp'], () => 'jetbrains')
  const [crtS, setCrtS] = useSetting<'acik' | 'kapali'>('term-crt', 'data-crt', ['acik', 'kapali'], () => 'kapali')
  const [bagS, setBagS] = useSetting<'acik' | 'kapali'>('term-lig', 'data-lig', ['acik', 'kapali'], () => 'acik')
  const [izgaraS, setIzgaraS] = useSetting<'acik' | 'kapali'>('term-grid', 'data-grid', ['acik', 'kapali'], () => 'kapali')
  const [hareketPref, setHareketPrefS] = useState<HareketPref>(() => read('term-motion', ['acik', 'kapali']) ?? 'oto')
  const hareket = hareketPref === 'oto' ? (reduce ? 'kapali' : 'acik') : hareketPref
  useEffect(() => {
    document.documentElement.dataset.motion = hareket === 'kapali' ? 'off' : 'on'
  }, [hareket])
  const setHareketPref = useCallback((p: HareketPref) => {
    setHareketPrefS(p)
    write('term-motion', p === 'oto' ? null : p)
  }, [])

  const [palet, setPalet] = useState(false)
  const [kiyasSinyal, setKiyasSinyal] = useState(0)
  const [sunucular, setSunucularS] = useState(SUNUCULAR)
  const [loglar, setLoglar] = useState<Log[]>([])
  const [duyuru, setDuyuru] = useState('')
  const nextId = useRef(1)

  const log = useCallback((seviye: Seviye, kaynak: string, mesaj: string) => {
    setLoglar((l) => [...l, { id: nextId.current++, t: clock(), seviye, kaynak, mesaj }].slice(-200))
  }, [])
  const soyle = useCallback((m: string) => {
    setDuyuru('')
    window.setTimeout(() => setDuyuru(m), 30)
  }, [])
  const setSunucular = useCallback((f: (s: Sunucu[]) => Sunucu[]) => setSunucularS(f), [])
  const sunucuRef = useRef(sunucular)
  sunucuRef.current = sunucular

  const sunucuKomut = useCallback(
    (komut: 'start' | 'stop' | 'restart', host: string) => {
      const s = sunucuRef.current.find((x) => x.host === host)
      if (!s) return `[x] bilinmeyen sunucu: ${host}`
      if (komut === 'stop') {
        if (s.durum === 'kapali') return `[!] ${host} zaten kapalı`
        setSunucularS((l) => l.map((x) => (x.host === host ? { ...x, durum: 'kapali', cpu: 0, bellek: 0, calisma: 0 } : x)))
        log('uyari', host, 'systemctl stop: servis durduruldu')
        return `[-] ${host} durduruldu`
      }
      const up = { durum: 'ok' as const, cpu: 8, bellek: Math.round(s.bellekTop * 0.2 * 10) / 10, calisma: 1 }
      setSunucularS((l) => l.map((x) => (x.host === host ? { ...x, ...up } : x)))
      log('bilgi', host, komut === 'start' ? 'systemctl start: servis başladı' : 'systemctl restart: servis yeniden başladı')
      return komut === 'start' ? `[+] ${host} başlatıldı` : `[>] ${host} yeniden başlatıldı`
    },
    [log],
  )

  const value = useMemo<Store>(
    () => ({
      tema,
      setTema,
      yazi,
      setYazi,
      crt: crtS === 'acik',
      setCrt: (b) => setCrtS(b ? 'acik' : 'kapali'),
      bag: bagS === 'acik',
      setBag: (b) => setBagS(b ? 'acik' : 'kapali'),
      izgara: izgaraS === 'acik',
      setIzgara: (b) => setIzgaraS(b ? 'acik' : 'kapali'),
      hareket,
      hareketPref,
      setHareketPref,
      palet,
      setPalet,
      kiyasSinyal,
      kiyasla: () => setKiyasSinyal((n) => n + 1),
      sunucular,
      setSunucular,
      sunucuKomut,
      loglar,
      log,
      temizle: () => setLoglar([]),
      duyuru,
      soyle,
    }),
    [tema, setTema, yazi, setYazi, crtS, setCrtS, bagS, setBagS, izgaraS, setIzgaraS, hareket, hareketPref, setHareketPref, palet, kiyasSinyal, sunucular, setSunucular, sunucuKomut, loglar, log, duyuru, soyle],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useTerm() {
  const s = useContext(Ctx)
  if (!s) throw new Error('useTerm, TermProvider içinde kullanılmalı')
  return s
}

/** Hareket kapalı mı? Zamanlayıcılar için anlık okuma */
export const hareketKapali = () => document.documentElement.dataset.motion === 'off'
