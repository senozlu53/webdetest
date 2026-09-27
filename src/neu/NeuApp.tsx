import { useEffect, useState } from 'react'
import { EyeIcon, MoonIcon, SunIcon } from '@phosphor-icons/react'
import { useTheme } from '../shared/useTheme'
import { NeumorphButton } from './components/NeumorphButton'
import { Hero } from './sections/Hero'
import { Surfaces } from './sections/Surfaces'
import { ShadowLab } from './sections/ShadowLab'
import { ColorType, type Base } from './sections/ColorType'
import { Components } from './sections/Components'
import { Application } from './sections/Application'
import { MotionAccess } from './sections/MotionAccess'

const NAV = [
  { href: '#ozellikler', label: 'Özellikler' },
  { href: '#golge', label: 'Gölge' },
  { href: '#bilesenler', label: 'Bileşenler' },
  { href: '#uygulama', label: 'Uygulama' },
  { href: '#erisilebilirlik', label: 'Erişilebilirlik' },
] as const

function useStoredAttr<T extends string>(key: string, attr: 'base' | 'a11y', fallback: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      return (localStorage.getItem(key) as T | null) ?? fallback
    } catch {
      return fallback
    }
  })
  useEffect(() => {
    if (value === fallback) delete document.documentElement.dataset[attr]
    else document.documentElement.dataset[attr] = value
    try {
      if (value === fallback) localStorage.removeItem(key)
      else localStorage.setItem(key, value)
    } catch {
      /* depolama kapalı */
    }
  }, [key, attr, value, fallback])
  return [value, setValue] as const
}

export default function NeuApp() {
  const { theme, toggle } = useTheme('neu-theme')
  const [base, setBase] = useStoredAttr<Base>('neu-base', 'base', 'gri')
  const [a11y, setA11y] = useStoredAttr<'on' | 'default'>('neu-a11y', 'a11y', 'default')
  const a11yOn = a11y === 'on'

  return (
    <>
      <a
        href="#icerik"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-surface focus:px-5 focus:py-3 focus:font-bold"
      >
        İçeriğe geç
      </a>
      <header className="sticky top-[calc(env(safe-area-inset-top,0px)+12px)] z-40 px-4 md:px-8">
        <div className="neu neu-raised mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full py-2 pr-2 pl-6">
          <a href="#ust" className="flex items-baseline gap-2 text-ink no-underline">
            <span className="font-black text-accent tabular-nums">005</span>
            <span className="font-extrabold" lang="en">
              Neumorphism
            </span>
          </a>
          <nav aria-label="Bölümler" className="hidden lg:block">
            <ul className="flex gap-1">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="rounded-full px-3.5 py-2 text-sm font-bold text-muted no-underline hover:text-ink">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-3">
            <NeumorphButton
              shape="circle"
              size="sm"
              pressed={a11yOn}
              onClick={() => setA11y(a11yOn ? 'default' : 'on')}
              aria-label="Erişilebilir mod"
              icon={<EyeIcon size={20} weight="bold" aria-hidden="true" />}
            />
            <NeumorphButton
              shape="circle"
              size="sm"
              pressed={theme === 'dark'}
              onClick={toggle}
              aria-label="Koyu mod"
              icon={theme === 'dark' ? <MoonIcon size={20} weight="fill" aria-hidden="true" /> : <SunIcon size={20} weight="bold" aria-hidden="true" />}
            />
          </div>
        </div>
      </header>

      <main id="icerik">
        <Hero />
        <Surfaces />
        <ShadowLab />
        <ColorType base={base} onBase={setBase} dark={theme === 'dark'} />
        <Components />
        <Application />
        <MotionAccess theme={theme} onToggleTheme={toggle} a11y={a11yOn} onA11y={(v) => setA11y(v ? 'on' : 'default')} />
      </main>

      <footer className="px-4 pt-8 pb-16 md:px-8">
        <div className="neu neu-inset mx-auto flex max-w-6xl flex-col gap-4 rounded-neu-lg p-6 text-sm md:flex-row md:items-center md:justify-between">
          <p className="text-muted">
            Stil 005 · <span lang="en">Neumorphism</span>. Yazı: Nunito. İkonlar: Phosphor. Tokenlar:{' '}
            <span className="font-mono">tokens/neu.tokens.json</span>. Çalar ve termostat kurgusaldır.
          </p>
          <nav aria-label="Diğer stiller" className="flex flex-wrap gap-4 font-bold">
            <a href="../../" className="text-accent underline underline-offset-4">
              Tüm stiller
            </a>
            <a href="../004/" className="text-accent underline underline-offset-4">
              Stil 004
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
