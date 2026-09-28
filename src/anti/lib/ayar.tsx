import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { useTheme, type Theme } from '../../shared/useTheme'
import { yaz } from './depo'

type Mod = Theme | 'system'

interface Ayar {
  /** Bozuk CSS açık mı (kapalıyken sayfa saf HTML akışıdır) */
  css: boolean
  setCss: (v: boolean) => void
  /** Kayan yazı, yanıp sönme, ekran yırtığı */
  hareket: boolean
  setHareket: (v: boolean) => void
  mode: Mod
  setMode: (m: Mod) => void
  /** Ekran okuyucu duyurusu */
  duyuru: string
  duyur: (t: string) => void
}

const C = createContext<Ayar | null>(null)

/** Bütün stil dosyalarını (bozuk CSS, renk düzeni, varsa kabuğun sıfırlaması) birlikte açar ya da kapatır */
export function stilleriUygula(acik: boolean) {
  for (const s of Array.from(document.styleSheets)) s.disabled = !acik
  document.documentElement.dataset.css = acik ? 'acik' : 'kapali'
}

export function AyarProvider({ children }: { children: ReactNode }) {
  const d = document.documentElement
  const { mode, setMode } = useTheme('anti-theme')
  const [css, setCssState] = useState(() => d.dataset.css !== 'kapali')
  const [hareket, setHareketState] = useState(() => d.dataset.hareket !== 'kapali')
  const [duyuru, setDuyuru] = useState('')

  const setCss = useCallback((v: boolean) => {
    stilleriUygula(v)
    yaz('anti-css', v ? null : 'kapali')
    setCssState(v)
  }, [])
  const setHareket = useCallback(
    (v: boolean) => {
      d.dataset.hareket = v ? 'acik' : 'kapali'
      yaz('anti-hareket', v ? 'acik' : 'kapali')
      setHareketState(v)
    },
    [d],
  )
  // Aynı metin art arda duyurulsun diye önce boşaltılır
  const duyur = useCallback((t: string) => {
    setDuyuru('')
    window.setTimeout(() => setDuyuru(t), 30)
  }, [])

  const value = useMemo(() => ({ css, setCss, hareket, setHareket, mode, setMode, duyuru, duyur }), [css, setCss, hareket, setHareket, mode, setMode, duyuru, duyur])
  return <C.Provider value={value}>{children}</C.Provider>
}

export function useAyar() {
  const v = useContext(C)
  if (!v) throw new Error('AyarProvider yok')
  return v
}
