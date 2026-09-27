import { LineIcon } from './components/LineIcon'
import { NAV } from './content'
import type { Theme } from '../shared/useTheme'

type Props = { theme: Theme; onToggleTheme: () => void }

/** Yüzen, hap formunda gezinme çubuğu. */
export function SoftHeader({ theme, onToggleTheme }: Props) {
  return (
    <header className="sticky top-[calc(env(safe-area-inset-top,0px)+16px)] z-40 mt-4">
      <div className="soft-frame">
        <div className="flex items-center justify-between gap-4 rounded-pill border border-line/70 bg-float py-2 pr-2 pl-6 shadow-soft backdrop-blur-md">
          <a href="#ust" className="flex items-baseline gap-2 text-ink no-underline">
            <span className="font-serif text-lead italic">002</span>
            <span className="text-small font-medium tracking-wide">Soft Minimalism</span>
          </a>
          <nav aria-label="Bölümler" className="hidden lg:block">
            <ul className="flex gap-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="rounded-pill px-4 py-2 text-small text-ink no-underline transition-colors duration-300 ease-soft hover:bg-sand"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <button
            type="button"
            onClick={onToggleTheme}
            aria-pressed={theme === 'dark'}
            className="inline-flex cursor-pointer items-center gap-2 rounded-pill bg-sand px-4 py-2 text-small font-medium transition-colors duration-400 ease-soft hover:bg-glow"
          >
            <LineIcon name={theme === 'dark' ? 'moon' : 'sun'} size={18} />
            Koyu mod
          </button>
        </div>
      </div>
    </header>
  )
}
