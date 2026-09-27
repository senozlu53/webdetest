import { MoonIcon, SunIcon } from '@phosphor-icons/react'
import { useTheme } from '../shared/useTheme'
import { useStoredAttr } from './hooks/useStoredAttr'
import { ClayDefs } from './components/ClayIcon'
import { ClayButton } from './components/ClayButton'
import { Hero } from './sections/Hero'
import { Traits } from './sections/Traits'
import { Volume } from './sections/Volume'
import { Palette } from './sections/Palette'
import { Components } from './sections/Components'
import { Application } from './sections/Application'
import { Motion } from './sections/Motion'
import { Access, type Neon } from './sections/Access'

const NAV = [
  { href: '#ozellikler', label: 'Özellikler' },
  { href: '#hacim', label: 'Hacim' },
  { href: '#renk', label: 'Renk' },
  { href: '#bilesenler', label: 'Bileşenler' },
  { href: '#uygulama', label: 'Uygulama' },
  { href: '#hareket', label: 'Hareket' },
  { href: '#erisilebilirlik', label: 'Erişilebilirlik' },
] as const

export default function ClayApp() {
  const { theme, mode, toggle, setMode } = useTheme('clay-theme')
  const [neon, setNeon] = useStoredAttr<Neon>('clay-neon', 'neon', 'pembe')
  const [contrast, setContrast] = useStoredAttr<'more' | 'default'>('clay-contrast', 'contrast', 'default')

  return (
    <>
      <ClayDefs />
      <a
        href="#icerik"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-max focus:bg-surface focus:px-5 focus:py-3 focus:font-bold"
      >
        İçeriğe geç
      </a>
      <header className="sticky top-[calc(env(safe-area-inset-top,0px)+14px)] z-40 px-4 md:px-8">
        <div className="clay clay-md tone-base mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-max py-2 pr-2 pl-3">
          <a href="#ust" className="flex items-center gap-2.5 text-ink no-underline">
            <span className="clay clay-sm tone-pink blob grid size-10 place-items-center font-display text-[15px] font-extrabold" aria-hidden="true">
              07
            </span>
            <span className="font-display text-xl font-extrabold" lang="en">
              Claymorphism
            </span>
          </a>
          <nav aria-label="Bölümler" className="hidden xl:block">
            <ul className="flex gap-0.5">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="rounded-max px-3 py-2 text-[15px] font-bold text-muted no-underline hover:text-ink">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <ClayButton
            round
            size="sm"
            tone={theme === 'dark' ? 'primary' : 'base'}
            aria-pressed={theme === 'dark'}
            aria-label="Koyu mod"
            onClick={toggle}
            icon={theme === 'dark' ? <MoonIcon size={20} weight="fill" aria-hidden="true" /> : <SunIcon size={20} weight="fill" aria-hidden="true" />}
          />
        </div>
      </header>

      <main id="icerik">
        <Hero />
        <Traits />
        <Volume themeKey={`${theme}-${neon}`} />
        <Palette dark={theme === 'dark'} />
        <Components />
        <Application />
        <Motion />
        <Access
          theme={theme}
          mode={mode}
          onMode={setMode}
          neon={neon}
          onNeon={setNeon}
          bordered={contrast === 'more'}
          onBordered={(v) => setContrast(v ? 'more' : 'default')}
        />
      </main>

      <footer className="px-4 pt-8 pb-16 md:px-8">
        <div className="clay-well clay-md mx-auto flex max-w-6xl flex-col gap-4 rounded-clay p-7 text-[15px] md:flex-row md:items-center md:justify-between">
          <p className="text-muted">
            Stil 007 · <span lang="en">Claymorphism</span>. Yazı: Baloo 2 ve Quicksand. İkonlar: Phosphor (dolu) + kil filtresi. Tokenlar:{' '}
            <span className="font-mono">tokens/clay.tokens.json</span>. Ders ve kumbara kurgusaldır.
          </p>
          <nav aria-label="Diğer stiller" className="flex shrink-0 flex-wrap gap-4 font-bold">
            <a href="../../" className="text-accent underline underline-offset-4">
              Tüm stiller
            </a>
            <a href="../006/" className="text-accent underline underline-offset-4">
              Stil 006
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
