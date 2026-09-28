import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type HareketTercih = 'oto' | 'acik' | 'kapali'
export type Parlama = 'tam' | 'az'

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
  parlama: Parlama
  setParlama: (p: Parlama) => void
  vhs: boolean
  setVhs: (v: boolean) => void
  duyuru: string
  duyur: (t: string) => void
}

const C = createContext<Ctx | null>(null)

export function SynthProvider({ children }: { children: ReactNode }) {
  const d = document.documentElement
  const [hareketTercih, setHT] = useState<HareketTercih>(() => {
    const v = oku('syn-hareket')
    return v === 'acik' || v === 'kapali' ? v : 'oto'
  })
  const [azalt, setAzalt] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [parlama, setParlamaS] = useState<Parlama>(() => (oku('syn-parlama') === 'az' ? 'az' : 'tam'))
  const [vhs, setVhsS] = useState(() => oku('syn-vhs') !== '0')
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
    d.dataset.parlama = parlama
    d.dataset.vhs = vhs ? '1' : '0'
  }, [d, hareket, parlama, vhs])

  const setHareketTercih = useCallback((m: HareketTercih) => {
    setHT(m)
    yaz('syn-hareket', m)
  }, [])
  const setParlama = useCallback((p: Parlama) => {
    setParlamaS(p)
    yaz('syn-parlama', p)
  }, [])
  const setVhs = useCallback((v: boolean) => {
    setVhsS(v)
    yaz('syn-vhs', v ? '1' : '0')
  }, [])
  const duyur = useCallback((t: string) => {
    setDuyuru('')
    window.setTimeout(() => setDuyuru(t), 30)
  }, [])

  const value = useMemo(() => ({ hareketTercih, setHareketTercih, hareket, parlama, setParlama, vhs, setVhs, duyuru, duyur }), [hareketTercih, setHareketTercih, hareket, parlama, setParlama, vhs, setVhs, duyuru, duyur])
  return <C.Provider value={value}>{children}</C.Provider>
}

export function useSynth() {
  const v = useContext(C)
  if (!v) throw new Error('SynthProvider yok')
  return v
}

export function Duyuru() {
  const { duyuru } = useSynth()
  return (
    <p className="sr-only" aria-live="polite" data-live="">
      {duyuru}
    </p>
  )
}
