import { useEffect, useId, useState } from 'react'
import { cx } from '../../shared/cx'
import { HoloIcon } from './Icons'
import { Segmented } from './ui'
import { useHolo } from '../lib/store'
import type { LayersPref } from '../hooks/useView'

const LINKS = [
  { href: '#ozellikler', label: 'Özellikler' },
  { href: '#hat', label: 'Çıkarım' },
  { href: '#dizin', label: 'Dizin' },
  { href: '#ag', label: 'Ağ' },
  { href: '#goruntuleyici', label: '3B' },
  { href: '#erisilebilirlik', label: 'Erişilebilirlik' },
]

export const LAYER_OPTIONS: ReadonlyArray<{ id: LayersPref; label: string }> = [
  { id: 'oto', label: 'Oto' },
  { id: 'tam', label: 'Tam' },
  { id: 'tekil', label: 'Tekil' },
]

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

/** <CommandCenter>'ı açan tuş kısayolu Ctrl/⌘ + K ya da "/" */
export function HoloNav() {
  const s = useHolo()
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const dark = s.theme === 'dark'

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const iconBtn = 'thin-glow grid size-11 place-items-center rounded-full bg-[rgb(var(--surface-rgb)/0.5)] text-cyan-text transition-colors hover:border-cyan-text'

  return (
    <header className="sticky top-0 z-40 border-b border-line-soft bg-[rgb(var(--bg-rgb)/0.72)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 md:px-8">
        <a href="#ust" className="flex items-center gap-2.5 text-ink no-underline">
          <svg viewBox="0 0 32 32" className="glow-icon size-8 text-cyan-text" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
            <ellipse cx="16" cy="16" rx="13" ry="5" />
            <ellipse cx="16" cy="16" rx="13" ry="5" transform="rotate(60 16 16)" opacity=".6" />
            <ellipse cx="16" cy="16" rx="13" ry="5" transform="rotate(-60 16 16)" opacity=".35" />
            <circle cx="16" cy="16" r="2.4" fill="currentColor" />
          </svg>
          <span className="font-display text-[15px] tracking-[0.12em]">
            HOLO<span className="text-cyan-text">·</span>011
          </span>
        </a>

        <nav aria-label="Bölümler" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="rounded-full px-3 py-2 font-tech text-[14px] font-semibold tracking-[0.06em] text-muted no-underline transition-colors hover:bg-[var(--tint)] hover:text-ink">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => s.setCommandOpen(true)}
            aria-keyshortcuts={isMac ? 'Meta+K /' : 'Control+K /'}
            className="thin-glow hidden min-h-11 items-center gap-3 rounded-full bg-[rgb(var(--surface-rgb)/0.5)] pr-2 pl-4 font-tech text-[14px] font-semibold text-muted transition-colors hover:border-cyan-text hover:text-ink sm:flex"
          >
            <HoloIcon name="arama" size={16} className="text-cyan-text" />
            Komut merkezi
            <span className="flex gap-1" aria-hidden="true">
              <kbd className="kbd">{isMac ? '⌘' : 'Ctrl'}</kbd>
              <kbd className="kbd">K</kbd>
            </span>
          </button>
          <button type="button" onClick={() => s.setCommandOpen(true)} aria-label="Komut merkezi" className={cx(iconBtn, 'sm:hidden')}>
            <HoloIcon name="arama" size={18} />
          </button>
          <button
            type="button"
            onClick={() => s.setMotionPref(s.motion === 'acik' ? 'kapali' : 'acik')}
            aria-pressed={s.motion === 'kapali'}
            aria-label="Hareketi durdur"
            title={s.motion === 'acik' ? 'Hareketi durdur' : 'Hareket durdu'}
            className={cx(iconBtn, 'hidden md:grid')}
          >
            <HoloIcon name={s.motion === 'acik' ? 'duraklat' : 'oynat'} size={18} />
          </button>
          <button type="button" onClick={s.toggleTheme} aria-pressed={!dark} aria-label="Laboratuvar teması (açık)" className={iconBtn}>
            <HoloIcon name={dark ? 'ay' : 'gunes'} size={18} />
          </button>
          <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls={panelId} aria-label="Menü" className={cx(iconBtn, 'xl:hidden')}>
            <HoloIcon name={open ? 'kapat' : 'menu'} size={18} />
          </button>
        </div>
      </div>

      <div id={panelId} hidden={!open} className="border-t border-line-soft xl:hidden">
        <nav aria-label="Bölümler (menü)" className="mx-auto max-w-6xl px-4 py-4 md:px-8">
          <ul className="grid grid-cols-2 gap-1 sm:grid-cols-3">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="flex min-h-11 items-center rounded-xl px-3 font-tech text-[15px] font-semibold text-ink no-underline hover:bg-[var(--tint)]">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap items-end gap-4">
            <Segmented legend="Katman" name="katman-menu" value={s.layersPref} options={LAYER_OPTIONS} onChange={s.setLayersPref} size="sm" />
            <button
              type="button"
              onClick={() => s.setMotionPref(s.motion === 'acik' ? 'kapali' : 'acik')}
              aria-pressed={s.motion === 'kapali'}
              className="thin-glow flex min-h-11 items-center gap-2 rounded-full px-4 font-tech text-[14px] font-semibold text-ink md:hidden"
            >
              <HoloIcon name={s.motion === 'acik' ? 'duraklat' : 'oynat'} size={16} className="text-cyan-text" />
              Hareketi durdur
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}
