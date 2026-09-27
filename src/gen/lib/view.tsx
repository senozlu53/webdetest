import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { useTheme, type Theme } from '../../shared/useTheme'

export type MotionPref = 'oto' | 'acik' | 'kapali'

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

type View = {
  theme: Theme
  toggleTheme: () => void
  motion: 'acik' | 'kapali'
  motionPref: MotionPref
  setMotionPref: (p: MotionPref) => void
  inspect: boolean
  setInspect: (b: boolean) => void
}
const Ctx = createContext<View | null>(null)

/** Tema, hareket ve Auto Layout denetçisi: <html data-theme | data-motion | data-inspect> */
export function ViewProvider({ children }: { children: ReactNode }) {
  const { theme, toggle } = useTheme('gen-theme')
  const reduce = useMedia('(prefers-reduced-motion: reduce)')
  const [motionPref, setPref] = useState<MotionPref>(() => {
    try {
      const v = localStorage.getItem('gen-motion')
      return v === 'acik' || v === 'kapali' ? v : 'oto'
    } catch {
      return 'oto'
    }
  })
  const motion = motionPref === 'oto' ? (reduce ? 'kapali' : 'acik') : motionPref
  const [inspect, setInspect] = useState(false)
  useEffect(() => {
    document.documentElement.dataset.motion = motion === 'kapali' ? 'off' : 'on'
  }, [motion])
  useEffect(() => {
    document.documentElement.dataset.inspect = inspect ? 'acik' : 'kapali'
  }, [inspect])
  const setMotionPref = useCallback((p: MotionPref) => {
    setPref(p)
    try {
      if (p === 'oto') localStorage.removeItem('gen-motion')
      else localStorage.setItem('gen-motion', p)
    } catch {
      /* depolama kapalı */
    }
  }, [])
  return <Ctx.Provider value={{ theme, toggleTheme: toggle, motion, motionPref, setMotionPref, inspect, setInspect }}>{children}</Ctx.Provider>
}

export function useView() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useView, ViewProvider içinde kullanılmalı')
  return v
}
