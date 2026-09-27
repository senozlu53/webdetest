import { MoonIcon, PauseIcon, PlayIcon, SunIcon } from '@phosphor-icons/react'
import { useTheme } from '../shared/useTheme'
import { useMotion } from './hooks/useMotion'
import { AmbientBackground } from './components/AmbientBackground'
import { LiquidDefs } from './components/Liquid'
import { Hero } from './sections/Hero'
import { Principles } from './sections/Principles'
import { Mesh } from './sections/Mesh'
import { TypeIcons } from './sections/TypeIcons'
import { Components } from './sections/Components'
import { Application } from './sections/Application'
import { Motion } from './sections/Motion'
import { Readability } from './sections/Readability'

const NAV = [
  { href: '#ozellikler', label: 'Özellikler' },
  { href: '#mesh', label: 'Mesh' },
  { href: '#bilesenler', label: 'Bileşenler' },
  { href: '#uygulama', label: 'Uygulama' },
  { href: '#hareket', label: 'Hareket' },
  { href: '#okunurluk', label: 'Okunurluk' },
] as const

const iconButton =
  'grid size-11 cursor-pointer place-items-center rounded-full border border-line text-ink transition-colors duration-500 hover:bg-scrim aria-pressed:border-transparent aria-pressed:bg-scrim'

export default function AmbientApp() {
  const { theme, toggle } = useTheme('ambient-theme')
  const motion = useMotion()
  const paused = motion.mode === 'paused'

  // WCAG 2.2.2: sürekli hareket eden içerik tek dokunuşla durdurulabilmeli
  const togglePause = () => motion.setPref(paused ? (motion.detected.mode === 'paused' ? 'live' : 'auto') : 'paused')

  return (
    <>
      <LiquidDefs />
      <AmbientBackground />
      <a
        href="#icerik"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-canvas focus:px-5 focus:py-3"
      >
        İçeriğe geç
      </a>

      {/* Koruyucu katmanlar mobilde kenardan taşar; clip yapışkan başlığı bozmaz */}
      <div className="relative z-10 overflow-x-clip">
        <header className="sticky top-[calc(env(safe-area-inset-top,0px)+12px)] z-40 px-4 md:px-8">
          <div className="glow-card mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full bg-canvas/95 py-1.5 pr-1.5 pl-6">
            <a href="#ust" className="flex items-baseline gap-2 text-ink no-underline">
              <span className="font-mono text-sm text-accent">006</span>
              <span className="font-normal" lang="en">
                Ambient UI
              </span>
            </a>
            <nav aria-label="Bölümler" className="hidden lg:block">
              <ul className="flex gap-1">
                {NAV.map((n) => (
                  <li key={n.href}>
                    <a href={n.href} className="rounded-full px-3.5 py-2 text-sm text-muted no-underline transition-colors duration-500 hover:text-ink">
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex items-center gap-2">
              <button type="button" className={iconButton} aria-pressed={paused} onClick={togglePause} aria-label="Hareketi durdur">
                {paused ? <PlayIcon size={18} weight="light" aria-hidden="true" /> : <PauseIcon size={18} weight="light" aria-hidden="true" />}
              </button>
              <button type="button" className={iconButton} aria-pressed={theme === 'dark'} onClick={toggle} aria-label="Koyu mod">
                {theme === 'dark' ? <MoonIcon size={18} weight="light" aria-hidden="true" /> : <SunIcon size={18} weight="light" aria-hidden="true" />}
              </button>
            </div>
          </div>
        </header>

        <main id="icerik">
          <Hero />
          <Principles />
          <Mesh dark={theme === 'dark'} />
          <TypeIcons />
          <Components />
          <Application />
          <Motion pref={motion.pref} onPref={motion.setPref} mode={motion.mode} detected={motion.detected} signals={motion.signals} />
          <Readability dark={theme === 'dark'} />
        </main>

        <footer className="px-4 pt-8 pb-16 md:px-8">
          <div className="glow-card mx-auto flex max-w-6xl flex-col gap-4 rounded-[28px] p-6 text-sm md:flex-row md:items-center md:justify-between">
            <p className="text-muted">
              Stil 006 · <span lang="en">Ambient UI</span>. Yazı: Sora. İkonlar: Phosphor. Tokenlar: <span className="font-mono">tokens/ambient.tokens.json</span>.
              Sohbet ve üretici kurgusaldır; model çağrılmaz.
            </p>
            <nav aria-label="Diğer stiller" className="flex shrink-0 flex-wrap gap-4">
              <a href="../../" className="text-accent underline underline-offset-4">
                Tüm stiller
              </a>
              <a href="../005/" className="text-accent underline underline-offset-4">
                Stil 005
              </a>
              <a href="#ust" className="text-accent underline underline-offset-4">
                Başa dön
              </a>
            </nav>
          </div>
        </footer>
      </div>
    </>
  )
}
