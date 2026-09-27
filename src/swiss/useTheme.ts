import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'swiss-theme'
const query = '(prefers-color-scheme: dark)'

function readStored(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

function currentTheme(): Theme {
  const attr = document.documentElement.dataset.theme
  if (attr === 'light' || attr === 'dark') return attr
  return window.matchMedia(query).matches ? 'dark' : 'light'
}

/**
 * Açık mod ve Invert modu. Kullanıcı seçmediyse sistem tercihi izlenir;
 * seçim `<html data-theme>` üzerine yazılır ve tarayıcıda hatırlanır.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = readStored()
    if (stored) document.documentElement.dataset.theme = stored
    return currentTheme()
  })

  useEffect(() => {
    const media = window.matchMedia(query)
    const sync = () => setTheme(currentTheme())
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  const toggle = useCallback(() => {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* depolama kapalıysa seçim yalnızca bu oturumda geçerli */
    }
    setTheme(next)
  }, [])

  return { theme, toggle }
}
