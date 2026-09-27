import { MoonIcon, SunIcon } from '@phosphor-icons/react'
import { useTheme } from '../shared/useTheme'
import { useStoredAttr } from './hooks/useStoredAttr'
import { ProjectionContext } from './lib/projection'
import { TILT, type Projection } from './lib/iso'
import { IsoDefs } from './components/IsoScene'
import { Hero } from './sections/Hero'
import { Traits } from './sections/Traits'
import { Grid } from './sections/Grid'
import { Palette } from './sections/Palette'
import { Components } from './sections/Components'
import { Application } from './sections/Application'
import { Motion } from './sections/Motion'
import { Access } from './sections/Access'

const NAV = [
  { href: '#ozellikler', label: 'Özellikler' },
  { href: '#izgara', label: 'Izgara' },
  { href: '#renk', label: 'Renk' },
  { href: '#bilesenler', label: 'Bileşenler' },
  { href: '#uygulama', label: 'Uygulama' },
  { href: '#hareket', label: 'Hareket' },
  { href: '#erisilebilirlik', label: 'Erişilebilirlik' },
] as const

export default function IsoApp() {
  const { theme, toggle } = useTheme('iso-theme')
  const [projection, setProjection] = useStoredAttr<Projection>('iso-projection', 'projection', 'gercek')

  return (
    <ProjectionContext.Provider value={{ projection, tilt: TILT[projection], setProjection }}>
      <IsoDefs />
      <div aria-hidden="true" className="iso-grid pointer-events-none fixed inset-0 z-0" />
      <a
        href="#icerik"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-surface focus:px-4 focus:py-3 focus:font-semibold"
      >
        İçeriğe geç
      </a>
      <div className="relative z-10">
        <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-sm">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-8">
            <a href="#ust" className="flex items-center gap-2.5 text-ink no-underline">
              <svg viewBox="0 0 24 24" className="size-7" aria-hidden="true">
                <polygon points="12,2 22,7.5 12,13 2,7.5" fill="#60A5FA" />
                <polygon points="2,7.5 12,13 12,23 2,17.5" fill="#3B82F6" />
                <polygon points="12,13 22,7.5 22,17.5 12,23" fill="#1D4ED8" />
              </svg>
              <span className="font-mono text-[14px] font-semibold tracking-wide uppercase" lang="en">
                008 · Isometric
              </span>
            </a>
            <nav aria-label="Bölümler" className="hidden lg:block">
              <ul className="flex gap-1">
                {NAV.map((n) => (
                  <li key={n.href}>
                    <a href={n.href} className="rounded-md px-3 py-2 text-[14px] font-semibold text-muted no-underline hover:bg-line hover:text-ink">
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <button
              type="button"
              onClick={toggle}
              aria-pressed={theme === 'dark'}
              aria-label="Koyu mod"
              className="grid size-11 cursor-pointer place-items-center rounded-md border border-field bg-surface text-ink hover:bg-line"
            >
              {theme === 'dark' ? <MoonIcon size={18} weight="bold" aria-hidden="true" /> : <SunIcon size={18} weight="bold" aria-hidden="true" />}
            </button>
          </div>
        </header>

        <main id="icerik">
          <Hero />
          <Traits />
          <Grid />
          <Palette />
          <Components />
          <Application />
          <Motion />
          <Access />
        </main>

        <footer className="border-t border-line px-4 py-10 md:px-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 text-[14px] md:flex-row md:items-center md:justify-between">
            <p className="text-muted">
              Stil 008 · <span lang="en">Isometric 3D</span>. Yazı: Manrope ve IBM Plex Mono. İkonlar: izometrik SVG ve Phosphor. Tokenlar:{' '}
              <span className="font-mono">tokens/iso.tokens.json</span>. Panel verileri kurgusaldır.
            </p>
            <nav aria-label="Diğer stiller" className="flex shrink-0 flex-wrap gap-4 font-semibold">
              <a href="../../" className="text-accent underline underline-offset-4">
                Tüm stiller
              </a>
              <a href="../007/" className="text-accent underline underline-offset-4">
                Stil 007
              </a>
              <a href="#ust" className="text-accent underline underline-offset-4">
                Başa dön
              </a>
            </nav>
          </div>
        </footer>
      </div>
    </ProjectionContext.Provider>
  )
}
