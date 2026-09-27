import { useEffect, useState, type ReactNode } from 'react'
import { cx } from '../../shared/cx'

/** <CyberHUD>: köşe parantezli, cetvelli gösterge çerçevesi; üstte başlık, kod ve canlı saat */
export function CyberHUD({ title, code, children, className }: { title: string; code?: string; children: ReactNode; className?: string }) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])
  const clock = now.toLocaleTimeString('tr-TR', { hour12: false })
  return (
    <section className={cx('hud min-w-0 p-5 md:p-7', className)} aria-label={title}>
      <header className="mb-4 flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-3">
        <h3 className="font-display text-lg font-bold tracking-[0.18em] text-cyan uppercase">{title}</h3>
        <span className="flex items-baseline gap-3 font-hud text-[12px] text-muted">
          {code ? <span lang="en">{code}</span> : null}
          <time aria-hidden="true">{clock}</time>
        </span>
      </header>
      {children}
    </section>
  )
}
