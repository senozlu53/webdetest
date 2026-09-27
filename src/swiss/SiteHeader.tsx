import { GeoIcon } from './components/GeoIcon'
import { NAV } from './content'
import { cx } from './cx'
import type { Theme } from './useTheme'

type Props = {
  overlay: boolean
  onToggleOverlay: () => void
  theme: Theme
  onToggleTheme: () => void
}

const toggleClass =
  'inline-flex items-center gap-xs border-2 border-ink px-xs py-[6px] swiss-label cursor-pointer rounded-none aria-pressed:bg-ink aria-pressed:text-paper hover:bg-accent hover:text-on-accent hover:border-accent'

export function SiteHeader({ overlay, onToggleOverlay, theme, onToggleTheme }: Props) {
  return (
    <header className="sticky top-[env(safe-area-inset-top,0px)] z-40 border-b-2 border-ink bg-paper">
      <div className="swiss-frame flex items-center justify-between gap-s py-xs">
        <a href="#ust" className="flex items-baseline gap-xs text-ink no-underline">
          <span className="font-black tabular-nums">001</span>
          <span className="font-bold">Swiss Style</span>
        </a>
        <nav aria-label="Bölümler" className="hidden lg:block">
          <ul className="flex list-none gap-m p-0">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="swiss-link no-underline hover:underline">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex gap-xs">
          <button type="button" className={toggleClass} aria-pressed={overlay} onClick={onToggleOverlay}>
            <GeoIcon name="grid" size={14} />
            Grid
          </button>
          <button
            type="button"
            className={cx(toggleClass)}
            aria-pressed={theme === 'dark'}
            onClick={onToggleTheme}
          >
            <GeoIcon name="square" size={14} />
            Invert
          </button>
        </div>
      </div>
    </header>
  )
}
