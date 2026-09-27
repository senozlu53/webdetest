import { useEffect, useId, useState } from 'react'
import { TEMALAR, useTerm } from '../lib/store'
import { BOLUMLER } from './CommandPalette'
import { Btn, Kbd, Radios } from './ui'

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

/** tmux benzeri durum çubuğu: oturum, pencereler (bölümler), saat ve komut paleti */
export function StatusBar() {
  const s = useTerm()
  const [open, setOpen] = useState(false)
  const [saat, setSaat] = useState(() => new Date())
  const panel = useId()
  useEffect(() => {
    const t = window.setInterval(() => setSaat(new Date()), 1000)
    return () => window.clearInterval(t)
  }, [])
  useEffect(() => {
    if (!open) return
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open])
  const hhmm = saat.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  return (
    <header className="sticky top-0 z-40 bg-bg">
      <div className="inv flex items-center gap-2 px-1 whitespace-pre">
        <a href="#ust" className="font-bold no-underline">
          [012]
        </a>
        <nav aria-label="Bölümler" className="hidden min-w-0 flex-1 xl:block">
          <ul className="flex gap-2 overflow-hidden">
            {BOLUMLER.map((b, i) => (
              <li key={b.id}>
                <a href={`#${b.id}`} className="no-underline hover:underline focus-visible:outline-sel-fg">
                  {i + 1}:{b.kisa}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <span className="flex-1 xl:hidden" />
        <button type="button" onClick={() => s.setPalet(true)} aria-keyshortcuts={isMac ? 'Meta+K' : 'Control+K'} className="cursor-pointer font-bold hover:underline focus-visible:outline-sel-fg">
          <span aria-hidden="true">[</span>
          {isMac ? '⌘' : 'Ctrl'}+K<span className="sr-only"> komut paleti</span>
          <span aria-hidden="true">]</span>
          <span className="hidden sm:inline"> palet</span>
        </button>
        <span className="hidden sm:inline" aria-hidden="true">
          {'| '}
          {s.tema} |
        </span>
        <time className="tabular-nums" dateTime={saat.toISOString()}>
          {hhmm}
        </time>
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls={panel} className="cursor-pointer font-bold hover:underline focus-visible:outline-sel-fg">
          {open ? '[x]' : '[=]'}
          <span className="sr-only">Ayarlar ve bölümler</span>
        </button>
      </div>
      <div id={panel} hidden={!open} className="border-b border-line">
        <div className="mx-auto grid max-w-[120ch] gap-x-4 gap-y-[1lh] px-2 py-[1lh] sm:grid-cols-2 sm:px-4 lg:grid-cols-4">
          <nav aria-label="Bölümler (menü)">
            <p className="text-dim"># bölümler</p>
            <ul>
              {BOLUMLER.map((b, i) => (
                <li key={b.id}>
                  <a href={`#${b.id}`} onClick={() => setOpen(false)} className="no-underline hover:bg-sel-bg hover:text-sel-fg">
                    <span aria-hidden="true">{i + 1}: </span>
                    {b.ad}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <Radios legend="# tema" name="tema-menu" value={s.tema} options={TEMALAR} onChange={s.setTema} />
          <Radios
            legend="# hareket"
            name="hareket-menu"
            value={s.hareketPref}
            options={[
              { id: 'oto', ad: 'otomatik' },
              { id: 'acik', ad: 'açık' },
              { id: 'kapali', ad: 'kapalı' },
            ]}
            onChange={s.setHareketPref}
          />
          <div>
            <p className="text-dim"># kısayol</p>
            <p>
              <Kbd keys={[isMac ? '⌘' : 'Ctrl', 'K']} /> komut paleti
            </p>
            <p className="mt-[1lh]">
              <Btn onClick={() => s.setCrt(!s.crt)} aria-pressed={s.crt}>
                crt {s.crt ? 'açık' : 'kapalı'}
              </Btn>
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
