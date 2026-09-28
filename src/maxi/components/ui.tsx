import { forwardRef, useId, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { useMaxi } from '../lib/store'
import { useMagnetic } from '../hooks/useMagnetic'
import { IconCheck } from './Icons'
import { cx } from '../../shared/cx'

/** Bölüm: kalın renk bloğu; başlık karışık fontlu ReactNode alır */
export function Section({ id, kicker, title, lead, children, className, tone = 'bg-bg text-ink' }: { id: string; kicker: ReactNode; title: ReactNode; lead?: ReactNode; children: ReactNode; className?: string; tone?: string }) {
  const hid = useId()
  return (
    <section id={id} aria-labelledby={hid} className={cx('relative overflow-x-clip scroll-mt-24', tone, className)}>
      <div className="mx-auto w-full max-w-[1320px] px-4 pt-20 pb-24 md:px-8 md:pt-28 md:pb-32">
        <p className="kicker">{kicker}</p>
        <h2 id={hid} className="mt-3 max-w-[18ch] text-[clamp(40px,7vw,104px)] leading-[0.9] font-black tracking-[-0.02em] break-words">
          {title}
        </h2>
        {lead ? <p className="mt-5 max-w-[60ch] text-[19px] leading-snug font-medium max-sm:text-[17px]">{lead}</p> : null}
        <div className="mt-10 md:mt-14">{children}</div>
      </div>
    </section>
  )
}

/** Radyo çipleri; seçili olan dolu ve onay işaretli */
export function Chips<T extends string>({ legend, name, value, options, onChange, hideLegend, on = 'bg-lime text-[#111014]' }: { legend: string; name: string; value: T; options: { id: T; ad: ReactNode }[]; onChange: (v: T) => void; hideLegend?: boolean; on?: string }) {
  return (
    <fieldset className="min-w-0">
      <legend className={cx('kicker mb-2', hideLegend && 'sr-only')}>{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const sel = value === o.id
          return (
            <label key={o.id} className={cx('inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-full border-[3px] border-line px-3.5 text-[15px] font-bold select-none has-[:focus-visible]:outline-4 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#c8ff00]', sel ? on : 'bg-paper text-ink hover:-rotate-2')}>
              <input type="radio" className="sr-only" name={name} value={o.id} checked={sel} onChange={() => onChange(o.id)} />
              {sel ? <IconCheck size={16} /> : null}
              {o.ad}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export function Range({ label, value, min, max, step, unit, onChange, format }: { label: string; value: number; min: number; max: number; step: number; unit?: string; onChange: (v: number) => void; format?: (v: number) => string }) {
  const id = useId()
  const shown = format ? format(value) : `${value}${unit ?? ''}`
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 font-bold">
        <span>{label}</span>
        <span className="font-code text-[13px]">{shown}</span>
      </label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} aria-valuetext={shown} className="mt-2 h-2 w-full cursor-pointer accent-[var(--pink)]" />
    </div>
  )
}

/** Şişkin buton: kalın çerçeve, ofset gölge, manyetik */
export const BigButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { bg?: string; fg?: string; magnetic?: boolean; cursor?: string }>(function BigButton({ bg = 'var(--lime)', fg = '#111014', magnetic = true, cursor, className, style, children, ...rest }, fref) {
  const mref = useMagnetic<HTMLButtonElement>(magnetic ? 0.3 : 0)
  return (
    <button
      ref={(el) => {
        ;(mref as { current: HTMLButtonElement | null }).current = el
        if (typeof fref === 'function') fref(el)
        else if (fref) fref.current = el
      }}
      data-cursor={cursor}
      className={cx('inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full border-[3px] border-[#111014] px-7 font-sans text-[18px] font-black uppercase shadow-[5px_6px_0_#111014] transition-[box-shadow,translate] duration-100 [font-stretch:125%] active:shadow-[1px_2px_0_#111014] disabled:opacity-50', className)}
      style={{ background: bg, color: fg, ...style }}
      {...rest}
    >
      {children}
    </button>
  )
})

/** Bildirimler: sol altta çıkartma gibi patlar (görsel; ekran okuyucuya canlı bölgeden) */
export function Toasts() {
  const { toasts } = useMaxi()
  return (
    <div className="pointer-events-none fixed bottom-5 left-5 z-[85] flex flex-col items-start gap-3" aria-hidden="true">
      {toasts.map((t, i) => (
        <p key={t.id} className="pop-in sticker max-w-[min(360px,calc(100vw-40px))] rounded-[22px] px-5 py-3 font-sans text-[17px] font-black text-[#111014] uppercase [font-stretch:115%]" style={{ background: t.color, rotate: `${i % 2 ? 3 : -3}deg` }}>
          {t.text}
        </p>
      ))}
    </div>
  )
}
