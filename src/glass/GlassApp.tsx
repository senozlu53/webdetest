import { useEffect, useState } from 'react'
import { MoonStarsIcon, SunIcon } from '@phosphor-icons/react'
import { useTheme } from '../shared/useTheme'
import { AuroraBackground } from './components/AuroraBackground'
import { GlassNavbar } from './components/GlassNavbar'
import { GlassCard } from './components/GlassCard'
import { NAV } from './content'
import { Hero } from './sections/Hero'
import { Principles } from './sections/Principles'
import { Lab } from './sections/Lab'
import { ColorType } from './sections/ColorType'
import { DepthIcons } from './sections/DepthIcons'
import { Components } from './sections/Components'
import { Application } from './sections/Application'
import { Access } from './sections/Access'

const TRANSPARENCY_KEY = 'glass-transparency'

function useReducedTransparency() {
  const [reduced, setReduced] = useState(() => document.documentElement.dataset.transparency === 'reduced')
  useEffect(() => {
    if (reduced) document.documentElement.dataset.transparency = 'reduced'
    else delete document.documentElement.dataset.transparency
    try {
      if (reduced) localStorage.setItem(TRANSPARENCY_KEY, 'reduced')
      else localStorage.removeItem(TRANSPARENCY_KEY)
    } catch {
      /* depolama kapalı */
    }
  }, [reduced])
  return [reduced, () => setReduced((v) => !v)] as const
}

export default function GlassApp() {
  const { theme, toggle } = useTheme('glass-theme')
  const [reduced, toggleReduced] = useReducedTransparency()

  return (
    <>
      <AuroraBackground />
      <div className="relative z-10">
        <a
          href="#icerik"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-glass-strong focus:px-5 focus:py-3"
        >
          İçeriğe geç
        </a>
        <GlassNavbar>
          <a href="#ust" className="flex items-baseline gap-2 text-ink no-underline">
            <span className="font-mono text-sm font-semibold">004</span>
            <span className="font-semibold" lang="en">
              Glassmorphism
            </span>
          </a>
          <nav aria-label="Bölümler" className="hidden lg:block">
            <ul className="flex gap-1">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="rounded-full px-3.5 py-2 text-sm text-ink no-underline transition-colors duration-300 hover:bg-glass-subtle">
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
            data-blur="sm"
            data-tone="subtle"
            className="glass inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-medium"
          >
            {theme === 'dark' ? <MoonStarsIcon size={18} weight="light" aria-hidden="true" /> : <SunIcon size={18} weight="light" aria-hidden="true" />}
            {theme === 'dark' ? 'Koyu' : 'Holografik'}
          </button>
        </GlassNavbar>

        <main id="icerik">
          <Hero />
          <Principles />
          <Lab />
          <ColorType />
          <DepthIcons />
          <Components />
          <Application />
          <Access theme={theme} onToggleTheme={toggle} reduced={reduced} onToggleReduced={toggleReduced} />
        </main>

        <footer className="px-4 pt-8 pb-16 md:px-8">
          <GlassCard blur="md" className="mx-auto flex max-w-6xl flex-col gap-4 p-6 text-sm md:flex-row md:items-center md:justify-between">
            <p className="text-ink-muted">
              Stil 004 · <span lang="en">Glassmorphism</span>. Yazı: Geist. İkonlar: Phosphor. Tokenlar:{' '}
              <span className="font-mono">tokens/glass.tokens.json</span>. Tüm tutarlar kurgusaldır.
            </p>
            <nav aria-label="Diğer stiller" className="flex flex-wrap gap-4">
              <a href="../../" className="text-accent underline underline-offset-4">
                Tüm stiller
              </a>
              <a href="../003/" className="text-accent underline underline-offset-4">
                Stil 003
              </a>
              <a href="#ust" className="text-accent underline underline-offset-4">
                Başa dön
              </a>
            </nav>
          </GlassCard>
        </footer>
      </div>
    </>
  )
}
