import { MoonIcon, SunIcon } from '@phosphor-icons/react'
import { useTheme } from '../shared/useTheme'
import { Hero } from './sections/Hero'
import { Showcase } from './sections/Showcase'
import { Traits } from './sections/Traits'
import { Shading } from './sections/Shading'
import { Palette } from './sections/Palette'
import { Masks } from './sections/Masks'
import { Components } from './sections/Components'
import { Motion } from './sections/Motion'
import { Access } from './sections/Access'

// Derlemeden ölçülen boyutlar (npx vite build · src/lowpoly/assets)
const SIZES = { three: '960 KB · gzip 256 KB', poster: '13 KB .webp' }

const NAV = [
  { href: '#ozellikler', label: 'Özellikler' },
  { href: '#golge', label: 'Gölge' },
  { href: '#renk', label: 'Renk' },
  { href: '#maske', label: 'Maske' },
  { href: '#bilesenler', label: 'Bileşenler' },
  { href: '#vitrin', label: 'Vitrin' },
  { href: '#hareket', label: 'Hareket' },
  { href: '#erisilebilirlik', label: 'Erişilebilirlik' },
] as const

export default function LowPolyApp() {
  const { theme, toggle } = useTheme('lowpoly-theme')
  const dark = theme === 'dark'
  return (
    <>
      <a
        href="#icerik"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-surface focus:px-4 focus:py-3 focus:font-semibold"
      >
        İçeriğe geç
      </a>
      <header className="glass fixed inset-x-0 top-0 z-40 border-x-0 border-t-0">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-8">
          <a href="#ust" className="flex items-center gap-2.5 text-ink no-underline">
            <svg viewBox="0 0 48 48" className="size-8" aria-hidden="true">
              <polygon points="18,8 30,8 24,18" fill="#e8d8b0" />
              <polygon points="10,18 18,8 24,18" fill="#7a9e9f" />
              <polygon points="24,18 30,8 38,18" fill="#e8d8b0" />
              <polygon points="10,18 24,18 24,42" fill="#7a9e9f" />
              <polygon points="24,18 38,18 24,42" fill="#314e52" />
            </svg>
            <span className="font-display text-[15px] font-bold tracking-wide">
              009 · <span lang="en">Low Poly</span>
            </span>
          </a>
          <nav aria-label="Bölümler" className="hidden lg:block">
            <ul className="flex gap-1">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="px-3 py-2 text-[14px] font-medium text-muted no-underline hover:text-ink">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <button
            type="button"
            onClick={toggle}
            aria-pressed={dark}
            aria-label="Koyu mod"
            className="grid size-11 cursor-pointer place-items-center border border-line text-ink hover:bg-line"
          >
            {dark ? <MoonIcon size={18} weight="fill" aria-hidden="true" /> : <SunIcon size={18} weight="fill" aria-hidden="true" />}
          </button>
        </div>
      </header>

      <main id="icerik">
        <Hero dark={dark} />
        <Traits />
        <Shading />
        <Palette />
        <Masks />
        <Components />
        <Showcase dark={dark} />
        <Motion sizes={SIZES} />
        <Access dark={dark} />
      </main>

      <footer className="border-t border-line px-4 py-10 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-[14px] md:flex-row md:items-center md:justify-between">
          <p className="text-muted">
            Stil 009 · <span lang="en">Low Poly</span>. Yazı: Space Grotesk ve Inter. 3B: three.js, React Three Fiber, GLB modeller (
            <span className="font-mono">scripts/lowpoly-glb.mjs</span>). Tokenlar: <span className="font-mono">tokens/lowpoly.tokens.json</span>.
          </p>
          <nav aria-label="Diğer stiller" className="flex shrink-0 flex-wrap gap-4 font-semibold">
            <a href="../../" className="text-accent underline underline-offset-4">
              Tüm stiller
            </a>
            <a href="../008/" className="text-accent underline underline-offset-4">
              Stil 008
            </a>
            <a href="#ust" className="text-accent underline underline-offset-4">
              Başa dön
            </a>
          </nav>
        </div>
      </footer>
    </>
  )
}
