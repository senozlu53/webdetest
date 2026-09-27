import { useEffect, useId, useState } from 'react'
import { useView } from '../lib/view'
import { IconLayers, IconMoon, IconSpark, IconSun } from './Icons'
import { cx } from '../../shared/cx'

const LINKS = [
  { href: '#asistan', label: 'Asistan' },
  { href: '#ozellikler', label: 'Özellikler' },
  { href: '#bilesenler', label: 'Bileşenler' },
  { href: '#figma', label: 'Auto Layout' },
  { href: '#hareket', label: 'Hareket' },
  { href: '#erisilebilirlik', label: 'Erişilebilirlik' },
]

export function Header() {
  const v = useView()
  const [open, setOpen] = useState(false)
  const panel = useId()
  useEffect(() => {
    if (!open) return
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open])
  const btn = 'grid size-9 place-items-center rounded-md border border-line text-muted transition-colors hover:border-line-strong hover:text-ink aria-pressed:border-accent-line aria-pressed:bg-accent-soft aria-pressed:text-accent-ink'
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 font-sans backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 md:px-6">
        <a href="#ust" className="flex items-center gap-2 text-[15px] font-semibold text-ink no-underline">
          <span className="grid size-7 place-items-center rounded-md bg-accent text-on-accent" aria-hidden="true">
            <IconSpark size={14} />
          </span>
          <span>
            gen<span className="text-muted">·013</span>
          </span>
        </a>
        <nav aria-label="Bölümler" className="hidden lg:block">
          <ul className="flex gap-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="rounded-md px-2.5 py-1.5 text-[14px] text-muted no-underline hover:bg-sunken hover:text-ink">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-1.5">
          <button type="button" className={btn} aria-pressed={v.inspect} onClick={() => v.setInspect(!v.inspect)} title="Auto Layout katmanlarını göster">
            <IconLayers size={16} />
            <span className="sr-only">Auto Layout katmanlarını göster</span>
          </button>
          <button type="button" className={cx(btn, 'hidden sm:grid')} aria-pressed={v.motion === 'kapali'} onClick={() => v.setMotionPref(v.motion === 'acik' ? 'kapali' : 'acik')} title="Hareketi durdur">
            <svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor" aria-hidden="true">
              {v.motion === 'acik' ? <path d="M4.5 3h2.2v10H4.5zM9.3 3h2.2v10H9.3z" /> : <path d="M5 3.2v9.6a.6.6 0 0 0 .9.5l7.6-4.8a.6.6 0 0 0 0-1L5.9 2.7a.6.6 0 0 0-.9.5z" />}
            </svg>
            <span className="sr-only">Hareketi durdur</span>
          </button>
          <button type="button" className={btn} aria-pressed={v.theme === 'dark'} onClick={v.toggleTheme} title="Koyu tema">
            {v.theme === 'dark' ? <IconMoon size={16} /> : <IconSun size={16} />}
            <span className="sr-only">Koyu tema</span>
          </button>
          <button type="button" className={cx(btn, 'lg:hidden')} aria-expanded={open} aria-controls={panel} onClick={() => setOpen((o) => !o)}>
            <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M4 4l8 8M12 4l-8 8" /> : <path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h7" />}
            </svg>
            <span className="sr-only">Menü</span>
          </button>
        </div>
      </div>
      <nav id={panel} hidden={!open} aria-label="Bölümler (menü)" className="border-t border-line lg:hidden">
        <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-1 px-4 py-3 sm:grid-cols-3">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)} className="flex min-h-10 items-center rounded-md px-3 text-[15px] text-ink no-underline hover:bg-sunken">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
