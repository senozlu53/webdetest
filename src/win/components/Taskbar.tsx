import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { cx } from '../../shared/cx'
import { useWin, type PencereId } from '../lib/store'
import type { IkonAd } from '../lib/pixel'
import { Pixel } from './Pixel'

export const UYGULAMALAR: { id: PencereId; ad: string; ikon: IkonAd }[] = [
  { id: 'bilgisayar', ad: 'Bilgisayarım', ikon: 'bilgisayar' },
  { id: 'belgeler', ad: 'Belgelerim', ikon: 'klasor' },
  { id: 'mayin', ad: 'Mayın Tarlası', ikon: 'mayin' },
  { id: 'not', ad: 'Not Defteri', ikon: 'not' },
  { id: 'cop', ad: 'Geri Dönüşüm Kutusu', ikon: 'cop' },
  { id: 'goruntu', ad: 'Görüntü Özellikleri', ikon: 'goruntu' },
]

export const BOLUMLER: [string, string][] = [
  ['hosgeldin', 'Hoş geldiniz'],
  ['ozellikler', 'Stil özellikleri (Madde 1–3)'],
  ['renk', 'Renk paleti (4)'],
  ['yazi', 'Tipografi (5)'],
  ['kabartma', 'Şekil ve kabartma (6–7)'],
  ['doku', 'Doku ve dither (8)'],
  ['ikonlar', 'Piksel ikonlar (9)'],
  ['kullanim', 'Kullanım alanları (10)'],
  ['bilesenler', 'Bileşenler (11 · 14)'],
  ['figma', 'Figma (12–13)'],
  ['css', 'CSS (15)'],
  ['hareket', 'Hareket (16)'],
  ['mobil', 'Mobil (17)'],
  ['erisim', 'Erişilebilirlik (18)'],
]

/**
 * Madde 11 · 14: <StartButton> ve Başlat menüsü. Menü klavyeyle gezilir (oklar, Home/End, Esc), öğeler anında açılır.
 */
export function StartButton({ onKapat }: { onKapat: () => void }) {
  const w = useWin()
  const [acik, setAcik] = useState(false)
  const btn = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const ogeler = () => [...(menu.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])]
  useEffect(() => {
    if (!acik) return
    ogeler()[0]?.focus()
    const dis = (e: PointerEvent) => {
      if (!menu.current?.contains(e.target as Node) && !btn.current?.contains(e.target as Node)) setAcik(false)
    }
    window.addEventListener('pointerdown', dis)
    return () => window.removeEventListener('pointerdown', dis)
  }, [acik])
  const kapatVeDon = () => {
    setAcik(false)
    btn.current?.focus()
  }
  const tus = (e: KeyboardEvent) => {
    const l = ogeler()
    const i = l.indexOf(document.activeElement as HTMLElement)
    const git = (k: number) => {
      e.preventDefault()
      l[(k + l.length) % l.length]?.focus()
    }
    if (e.key === 'ArrowDown') git(i + 1)
    else if (e.key === 'ArrowUp') git(i - 1)
    else if (e.key === 'Home') git(0)
    else if (e.key === 'End') git(l.length - 1)
    else if (e.key === 'Escape' || e.key === 'Tab') {
      e.preventDefault()
      kapatVeDon()
    }
  }
  const sec = (f: () => void) => () => {
    setAcik(false)
    f()
  }
  const oge = 'flex w-full items-center gap-2.5 px-2 py-1.5 text-left hover:bg-sel hover:text-sel-text focus:bg-sel focus:text-sel-text focus:outline-none'
  return (
    <div className="relative">
      <button
        ref={btn}
        type="button"
        className="btn min-w-0 px-1.5 font-bold"
        aria-haspopup="menu"
        aria-expanded={acik}
        aria-controls={acik ? 'baslat-menu' : undefined}
        data-basili={acik ? '1' : undefined}
        onClick={() => setAcik((a) => !a)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault()
            setAcik(true)
          }
        }}
      >
        <Pixel ad="bilgisayar" />
        Başlat
      </button>
      {acik ? (
        <div ref={menu} id="baslat-menu" role="menu" aria-label="Başlat menüsü" className="outset absolute bottom-[calc(100%+0.25rem)] left-0 z-[150] flex w-[17rem] max-w-[calc(100vw-1rem)]" onKeyDown={tus}>
          <div className="flex w-7 shrink-0 items-end justify-center bg-sh pb-2" aria-hidden="true">
            <span className="pix text-[1.125rem] leading-none font-bold whitespace-nowrap text-face [writing-mode:vertical-rl] rotate-180">
              Pencere <span className="text-hi">95</span>
            </span>
          </div>
          <div className="k95 max-h-[70vh] min-w-0 flex-1 overflow-y-auto py-0.5">
            {UYGULAMALAR.map((u) => (
              <button key={u.id} type="button" role="menuitem" tabIndex={-1} className={oge} onClick={sec(() => w.ac(u.id))}>
                <Pixel ad={u.ikon} boyut={1.5} />
                {u.ad}
              </button>
            ))}
            <div role="separator" className="mx-1 my-1 border-t border-t-sh border-b border-b-hi" />
            <p className="px-2 pt-1 pb-0.5 text-[0.75rem] text-muted" aria-hidden="true">
              Bölümlere git
            </p>
            {BOLUMLER.map(([id, ad]) => (
              <a key={id} href={`#${id}`} role="menuitem" tabIndex={-1} className={cx(oge, 'py-1 text-inherit no-underline visited:text-inherit')} style={{ color: 'inherit' }} onClick={() => setAcik(false)}>
                <Pixel ad="belge" />
                {ad}
              </a>
            ))}
            <div role="separator" className="mx-1 my-1 border-t border-t-sh border-b border-b-hi" />
            <button type="button" role="menuitem" tabIndex={-1} className={oge} onClick={sec(onKapat)}>
              <Pixel ad="bilgisayar" boyut={1.5} />
              Bilgisayarı kapat…
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function Saat() {
  const [t, setT] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setT(new Date()), 15_000)
    return () => window.clearInterval(id)
  }, [])
  const s = t.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  return (
    <time className="inset flex min-h-7 items-center gap-1.5 px-2 text-[0.8125rem]" dateTime={t.toISOString()} aria-label={`Saat ${s}`}>
      {s}
    </time>
  )
}

/** Madde 11: Windows görev çubuğuna benzeyen alt gezinme */
export function Taskbar({ onKapat }: { onKapat: () => void }) {
  const w = useWin()
  const aciklar = UYGULAMALAR.filter((u) => w.pencereler[u.id].acik)
  return (
    <nav aria-label="Görev çubuğu" className="fixed right-0 bottom-0 left-0 z-[120] flex h-[2.75rem] items-center gap-1 border-t-2 border-t-[var(--hi)] bg-face px-1 pb-[env(safe-area-inset-bottom,0px)]" data-gorev="">
      <StartButton onKapat={onKapat} />
      <span className="mx-0.5 h-7 border-r border-l border-r-hi border-l-sh" aria-hidden="true" />
      <ul className="flex min-w-0 flex-1 gap-1 overflow-x-auto" aria-label="Açık pencereler">
        {aciklar.map((u) => {
          const on = w.aktif === u.id && !w.pencereler[u.id].kucuk
          return (
            <li key={u.id} className="min-w-0">
              <button type="button" className="btn w-[10rem] max-w-[40vw] min-w-0 justify-start px-1.5 max-sm:w-auto" aria-pressed={on} onClick={() => (on ? w.kucult(u.id) : w.one(u.id))} aria-label={`${u.ad}${w.pencereler[u.id].kucuk ? ' (küçültülmüş)' : ''}`}>
                <Pixel ad={u.ikon} />
                <span className="truncate max-sm:sr-only">{u.ad}</span>
              </button>
            </li>
          )
        })}
      </ul>
      {w.mesgul ? <Pixel ad="kumsaati" title="Meşgul" /> : null}
      <Saat />
    </nav>
  )
}
