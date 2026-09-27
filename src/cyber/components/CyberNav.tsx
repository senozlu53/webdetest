import { useEffect, useId, useState } from 'react'
import { ListIcon, MoonIcon, SunIcon, XIcon } from '@phosphor-icons/react'
import type { FxPref } from '../hooks/useFx'
import { cx } from '../../shared/cx'

const NAV = [
  { href: '#ozellikler', label: 'Özellikler' },
  { href: '#renk', label: 'Renk' },
  { href: '#bilesenler', label: 'Bileşenler' },
  { href: '#hud', label: 'HUD' },
  { href: '#hareket', label: 'Hareket' },
  { href: '#erisilebilirlik', label: 'Erişilebilirlik' },
] as const

const FX: ReadonlyArray<{ id: FxPref; label: string }> = [
  { id: 'oto', label: 'Oto' },
  { id: 'tam', label: 'Tam' },
  { id: 'sade', label: 'Sade' },
  { id: 'kapali', label: 'Kapalı' },
]

/** <CyberNav>: kesik köşeli üst çubuk. Dar ekranda menü düğmesiyle açılan panel. */
export function CyberNav({ dark, onTheme, fx, onFx }: { dark: boolean; onTheme: () => void; fx: FxPref; onFx: (f: FxPref) => void }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const fxControl = (name: string) => (
    <fieldset className="flex items-center gap-2">
      <legend className="sr-only">Efekt düzeyi</legend>
      <span className="font-display text-[12px] font-bold tracking-[0.18em] text-muted uppercase" aria-hidden="true">
        FX
      </span>
      <div className="flex border border-line">
        {FX.map((f) => (
          <label key={f.id} className="cursor-pointer has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-1 has-[:focus-visible]:outline-cyan">
            <input type="radio" name={name} value={f.id} checked={fx === f.id} onChange={() => onFx(f.id)} className="sr-only" />
            <span className={cx('flex min-h-9 items-center px-2.5 font-display text-[13px] font-bold tracking-[0.1em] uppercase', fx === f.id ? 'bg-cyan text-on-cyan' : 'text-muted hover:text-ink')}>
              {f.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/92 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-8">
        <a href="#ust" className="group flex items-center gap-2.5 text-ink no-underline">
          <svg viewBox="0 0 32 32" className="size-8 text-cyan glow-cyan" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M6 2h20l4 4v20l-4 4H6l-4-4V6z" />
            <path d="M10 22V10l6 7 6-7v12" />
          </svg>
          <span className="font-hud text-[15px] font-bold tracking-[0.12em]" lang="en">
            010·CYBER
          </span>
        </a>
        <nav aria-label="Bölümler" className="hidden xl:block">
          <ul className="flex gap-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="group px-2.5 py-2 font-display text-[14px] font-bold tracking-[0.14em] text-muted uppercase no-underline hover:text-cyan">
                  <span className="text-cyan opacity-0 group-hover:opacity-100" aria-hidden="true">
                    [
                  </span>
                  {n.label}
                  <span className="text-cyan opacity-0 group-hover:opacity-100" aria-hidden="true">
                    ]
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden md:block">{fxControl('fx-ust')}</div>
          <button
            type="button"
            onClick={onTheme}
            aria-pressed={!dark}
            aria-label="Gündüz varyantı"
            className="grid size-11 cursor-pointer place-items-center border border-line text-cyan hover:bg-surface-2"
          >
            {dark ? <MoonIcon size={18} weight="bold" aria-hidden="true" /> : <SunIcon size={18} weight="bold" aria-hidden="true" />}
          </button>
          <button
            type="button"
            className="grid size-11 cursor-pointer place-items-center border border-line text-cyan xl:hidden"
            aria-expanded={open}
            aria-controls={panelId}
            aria-label="Menü"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <XIcon size={18} weight="bold" aria-hidden="true" /> : <ListIcon size={18} weight="bold" aria-hidden="true" />}
          </button>
        </div>
      </div>
      <div id={panelId} hidden={!open} className="border-t border-line bg-bg xl:hidden">
        <nav aria-label="Bölümler (menü)" className="mx-auto max-w-6xl px-4 py-4">
          <ul className="grid gap-1 sm:grid-cols-3">
            {NAV.map((n) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center border-l-2 border-cyan px-3 font-display text-[15px] font-bold tracking-[0.14em] uppercase no-underline"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 md:hidden">{fxControl('fx-menu')}</div>
        </nav>
      </div>
    </header>
  )
}
