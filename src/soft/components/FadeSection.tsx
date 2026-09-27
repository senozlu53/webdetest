import { useEffect, useRef, type ElementType, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../shared/cx'

type Props = HTMLAttributes<HTMLElement> & {
  as?: 'section' | 'div' | 'footer'
  children?: ReactNode
}

/**
 * Bölüm, ekranın altından girdiği an 500ms ease-in-out ile yükselerek belirir.
 * İçerik hiçbir zaman gizli beklemez: gözlemci çalışmazsa, sayfa açıldığında
 * zaten görünürse ya da hareket azaltma açıksa bölüm olduğu gibi görünür.
 */
export function FadeSection({ as = 'section', className, children, ...rest }: Props) {
  const Tag = as as ElementType
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (el.getBoundingClientRect().top < window.innerHeight) return

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.boundingClientRect.top > 0) {
          entry.target.classList.add('is-entering')
          observer.disconnect()
        }
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag ref={ref} className={cx('soft-fade', className)} {...rest}>
      {children}
    </Tag>
  )
}
