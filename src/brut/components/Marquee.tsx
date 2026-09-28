import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { useBrut } from '../lib/store'
import { IconAsterisk, IconPause, IconPlay } from './Icons'
import { cx } from '../../shared/cx'

export type Speed = 'yavas' | 'normal' | 'hizli'
const PX: Record<Speed, number> = { yavas: 50, normal: 110, hizli: 220 }
const FILL = { yellow: 'fill-yellow', red: 'fill-red', blue: 'fill-blue', green: 'fill-green', pink: 'fill-pink', ink: 'fill-ink', surface: 'bg-surface text-ink' } as const

/**
 * <Marquee> (Madde 11 · 14 · 16): ekranda sürekli kayan devasa metin şeridi.
 * İçerik iki kopya yan yana durur ve linear olarak -%50 kayar; hız px/sn olarak sabittir, uzunluk değişse de değişmez.
 * Fareyle üstüne gelince ya da odakta durur; duraklat düğmesi ve sayfadaki "şeritleri durdur" ayarı var (WCAG 2.2.2).
 * Ekran okuyucu metni bir kez okur; kopyalar gizlidir.
 */
export function Marquee({ items, label, speed = 'normal', reverse, fill = 'yellow', size = 'l', tilt = 0, controls = true, className, lang }: { items: string[]; label: string; speed?: Speed; reverse?: boolean; fill?: keyof typeof FILL; size?: 'm' | 'l' | 'xl'; tilt?: number; controls?: boolean; className?: string; lang?: string }) {
  const { marqueePaused, motion } = useBrut()
  const [paused, setPaused] = useState(false)
  const track = useRef<HTMLDivElement>(null)
  const [dur, setDur] = useState(30)
  useLayoutEffect(() => {
    const el = track.current
    if (!el) return
    const ro = new ResizeObserver(() => setDur(el.scrollWidth / 2 / PX[speed]))
    ro.observe(el)
    return () => ro.disconnect()
  }, [speed])
  const stopped = paused || marqueePaused || !motion
  const text = size === 'xl' ? 'text-[clamp(40px,8vw,112px)]' : size === 'l' ? 'text-[clamp(28px,4.6vw,60px)]' : 'text-[clamp(18px,2.4vw,26px)]'
  const star = size === 'xl' ? 'size-[0.7em]' : 'size-[0.62em]'
  const copy = (k: number) => (
    <div key={k} className="flex shrink-0 items-center">
      {[0, 1, 2].flatMap((r) =>
        items.map((it, i) => (
          <span key={`${r}-${i}`} className="flex items-center">
            <span className="px-[0.35em] whitespace-nowrap">{it}</span>
            <IconAsterisk className={cx('shrink-0', star)} strokeWidth={3} />
          </span>
        )),
      )}
    </div>
  )
  return (
    <div
      role="region"
      aria-label={label}
      lang={lang}
      data-paused={stopped}
      className={cx('marquee relative overflow-hidden border-y-[3px] border-line py-[0.18em] font-display leading-none font-black uppercase', FILL[fill], text, className)}
      style={tilt ? { transform: `rotate(${tilt}deg)` } : undefined}
    >
      <p className="sr-only">{items.join(', ')}</p>
      <div ref={track} className="marquee-track" aria-hidden="true" style={{ '--mq-dur': `${dur.toFixed(2)}s`, '--mq-dir': reverse ? 'reverse' : 'normal' } as CSSProperties}>
        {copy(0)}
        {copy(1)}
      </div>
      {controls && motion ? (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label={paused ? `${label}: oynat` : `${label}: durdur`}
          className="absolute top-1/2 right-8 grid size-10 -translate-y-1/2 place-items-center rounded-brut border-[3px] border-line bg-surface text-ink brut-shadow-sm snap press"
        >
          {paused ? <IconPlay size={16} /> : <IconPause size={16} />}
        </button>
      ) : null}
    </div>
  )
}
