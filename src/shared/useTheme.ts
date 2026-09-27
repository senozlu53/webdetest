import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const query = '(prefers-color-scheme: dark)'

function readStored(key: string): Theme | null {
  try {
    const value = localStorage.getItem(key)
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
 * Açık / koyu mod. Kullanıcı seçmediyse sistem tercihi izlenir; seçim
 * `<html data-theme>` üzerine yazılır ve tarayıcıda `storageKey` altında hatırlanır.
 * Her stil kendi anahtarını kullanır, çünkü her stilin koyu modu farklıdır.
 */
export function useTheme(storageKey: string) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = readStored(storageKey)
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
      localStorage.setItem(storageKey, next)
    } catch {
      /* depolama kapalıysa seçim yalnızca bu oturumda geçerli */
    }
    setTheme(next)
  }, [storageKey])

  return { theme, toggle }
}
