import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cx } from '../../shared/cx'
import { IconPause, IconPlay, IconSparkle } from './Icons'

/**
 * Madde 11 · 14: parlak kayan şerit. Hız px/sn olarak sabit (içerik uzunluğundan bağımsız).
 * Üstüne gelince ve odakta durur; kendi düğmesiyle de durur (WCAG 2.2.2). İkinci kopya ekran okuyucudan gizli.
 */
export function Marquee({ items, hiz = 60, ters, label, className }: { items: ReactNode[]; hiz?: number; ters?: boolean; label: string; className?: string }) {
  const track = useRef<HTMLDivElement>(null)
  const [sure, setSure] = useState(20)
  const [durdu, setDurdu] = useState(false)
  useEffect(() => {
    const el = track.current
    if (!el) return
    const olc = () => setSure(Math.max(4, el.scrollWidth / 2 / hiz))
    olc()
    const ro = new ResizeObserver(olc)
    ro.observe(el)
    return () => ro.disconnect()
  }, [hiz, items])
  const parca = (gizli: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={gizli || undefined}>
      {items.map((it, i) => (
        <li key={i} className="flex items-center gap-4 pr-4 font-logo text-[13px] tracking-[0.12em] whitespace-nowrap uppercase">
          <IconSparkle size={14} className="sparkle text-[#2e0854]" />
          {it}
        </li>
      ))}
    </ul>
  )
  return (
    <div className={cx('strip flex items-center overflow-hidden border-y border-[#2b3445]/50', className)} data-paused={durdu ? '1' : '0'} role="region" aria-label={label}>
      <div className="min-w-0 flex-1 overflow-hidden py-2.5">
        <div ref={track} className="track flex w-max" style={{ ['--dur' as string]: `${sure}s`, ['--yon' as string]: ters ? 'reverse' : 'normal' }}>
          {parca(false)}
          {parca(true)}
        </div>
      </div>
      <button type="button" onClick={() => setDurdu((d) => !d)} className="chrome mx-2 grid size-9 shrink-0 place-items-center rounded-full border border-[#2b3445]/55" aria-label={durdu ? `${label}: kaydır` : `${label}: durdur`} aria-pressed={durdu}>
        {durdu ? <IconPlay size={14} /> : <IconPause size={14} />}
      </button>
    </div>
  )
}
