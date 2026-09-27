import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { MODELS, type Model, type ModelStatus } from './data'
import type { Layers, LayersPref, Motion, MotionPref } from '../hooks/useView'
import type { Theme } from '../../shared/useTheme'

type View = {
  theme: Theme
  toggleTheme: () => void
  layers: Layers
  layersPref: LayersPref
  setLayersPref: (p: LayersPref) => void
  motion: Motion
  motionPref: MotionPref
  setMotionPref: (p: MotionPref) => void
}

type Store = View & {
  models: Model[]
  activeId: string
  setActive: (id: string) => void
  setStatus: (ids: string[], status: ModelStatus) => void
  /** Komut merkezinden ya da düğmeden çıkarım isteği: sayaç arttıkça hat çalışır */
  runSignal: number
  requestRun: () => void
  transfer: boolean
  setTransfer: (on: boolean) => void
  commandOpen: boolean
  setCommandOpen: (open: boolean) => void
  /** Ekran okuyucuya kısa durum duyurusu */
  announce: string
  say: (msg: string) => void
}

const Ctx = createContext<Store | null>(null)

export function HoloProvider({ view, children }: { view: View; children: ReactNode }) {
  const [models, setModels] = useState(MODELS)
  const [activeId, setActiveId] = useState('atlas-14b')
  const [runSignal, setRunSignal] = useState(0)
  const [transfer, setTransfer] = useState(true)
  const [commandOpen, setCommandOpen] = useState(false)
  const [announce, setAnnounce] = useState('')

  const setStatus = useCallback((ids: string[], status: ModelStatus) => {
    setModels((ms) => ms.map((m) => (ids.includes(m.id) ? { ...m, status, lastUsed: status === 'yuklu' ? 'şimdi' : m.lastUsed } : m)))
  }, [])
  const say = useCallback((msg: string) => {
    // Aynı metin art arda gelirse de duyurulsun diye önce boşaltılır
    setAnnounce('')
    window.setTimeout(() => setAnnounce(msg), 30)
  }, [])
  const setActive = useCallback(
    (id: string) => {
      setActiveId(id)
      setModels((ms) => ms.map((m) => (m.id === id && m.status === 'diskte' ? { ...m, status: 'yuklu', lastUsed: 'şimdi' } : m)))
    },
    [],
  )

  const value = useMemo<Store>(
    () => ({
      ...view,
      models,
      activeId,
      setActive,
      setStatus,
      runSignal,
      requestRun: () => setRunSignal((n) => n + 1),
      transfer,
      setTransfer,
      commandOpen,
      setCommandOpen,
      announce,
      say,
    }),
    [view, models, activeId, setActive, setStatus, runSignal, transfer, commandOpen, announce, say],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useHolo() {
  const s = useContext(Ctx)
  if (!s) throw new Error('useHolo, HoloProvider içinde kullanılmalı')
  return s
}
