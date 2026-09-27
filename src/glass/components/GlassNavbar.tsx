import { useEffect, useState, type ReactNode } from 'react'
import { cx } from '../../shared/cx'

/**
 * Şeffaf gezinme çubuğu. Sayfa başındayken neredeyse görünmez; kaydırınca
 * cam yoğunlaşır ve altından geçen içeriği bulanıklaştırır.
 */
export function GlassNavbar({ children, className }: { children: ReactNode; className?: string }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <header className={cx('sticky top-[calc(env(safe-area-inset-top,0px)+12px)] z-40 px-3 md:px-6', className)}>
      <div
        data-blur="xl"
        data-tone={scrolled ? 'strong' : 'panel'}
        className={cx(
          'glass mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full py-2 pr-2 pl-5 transition-[background-color,box-shadow] duration-300 ease-glass',
          scrolled && 'shadow-glass-xl',
        )}
      >
        {children}
      </div>
    </header>
  )
}
