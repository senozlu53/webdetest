import { useEffect, useState } from 'react'

/** `<html data-*>` özniteliğini tarayıcıda hatırlanan bir seçime bağlar. Varsayılan değer özniteliği siler. */
export function useStoredAttr<T extends string>(key: string, attr: string, fallback: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      return (localStorage.getItem(key) as T | null) ?? fallback
    } catch {
      return fallback
    }
  })
  useEffect(() => {
    if (value === fallback) delete document.documentElement.dataset[attr]
    else document.documentElement.dataset[attr] = value
    try {
      if (value === fallback) localStorage.removeItem(key)
      else localStorage.setItem(key, value)
    } catch {
      /* depolama kapalı */
    }
  }, [key, attr, value, fallback])
  return [value, setValue] as const
}
