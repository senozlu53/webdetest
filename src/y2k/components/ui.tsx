import { useId, type ReactNode } from 'react'
import { cx } from '../../shared/cx'
import { IconCheck } from './Icons'

/** Bölüm: Michroma üst yazı, Unbounded başlık */
export function Section({ id, kicker, title, lead, children, className }: { id: string; kicker: string; title: ReactNode; lead?: ReactNode; children: ReactNode; className?: string }) {
  const hid = useId()
  return (
    <section id={id} aria-labelledby={hid} className={cx('mx-auto w-full max-w-[1240px] scroll-mt-28 px-4 pt-20 pb-16 md:px-8 md:pt-28 md:pb-24', className)}>
      <p className="kicker text-muted">{kicker}</p>
      <h2 id={hid} className="display emboss mt-3 max-w-[20ch] text-[clamp(34px,5.6vw,72px)] text-ink">
        {title}
      </h2>
      {lead ? <p className="mt-5 max-w-[60ch] text-[18px] leading-snug text-muted max-sm:text-[16px]">{lead}</p> : null}
      <div className="mt-10 md:mt-12">{children}</div>
    </section>
  )
}

/** Kapsül radyo çipleri: seçili olan pembe şeker, onay işaretli */
export function Chips<T extends string>({ legend, name, value, options, onChange, hideLegend }: { legend: string; name: string; value: T; options: { id: T; ad: ReactNode }[]; onChange: (v: T) => void; hideLegend?: boolean }) {
  return (
    <fieldset className="min-w-0">
      <legend className={cx('kicker mb-2 text-muted', hideLegend && 'sr-only')}>{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value === o.id
          return (
            <label key={o.id} className={cx('inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-full border border-[#2b3445]/55 px-4 font-logo text-[11px] tracking-[0.06em] uppercase select-none has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-[var(--focus)]', on ? 'candy' : 'chrome')}>
              <input type="radio" className="sr-only" name={name} value={o.id} checked={on} onChange={() => onChange(o.id)} />
              {on ? <IconCheck size={14} /> : null}
              {o.ad}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export function Range({ label, value, min, max, step = 1, onChange, format, id: idProp }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; format?: (v: number) => string; id?: string }) {
  const auto = useId()
  const id = idProp ?? auto
  const shown = format ? format(value) : String(value)
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-[15px] font-semibold">
        <span>{label}</span>
        <span className="font-mono text-[13px]">{shown}</span>
      </label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} aria-valuetext={shown} className="mt-2 h-2 w-full cursor-pointer accent-[#ff66cc]" />
    </div>
  )
}

export function Switch({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  const id = useId()
  return (
    <div className="flex items-start gap-3">
      <button id={id} type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className={cx('relative mt-0.5 h-8 w-14 shrink-0 rounded-full border border-[#2b3445]/55', checked ? 'candy' : 'chrome')}>
        <span className={cx('icy absolute top-1/2 size-6 -translate-y-1/2 rounded-full border border-[#2b3445]/55', checked ? 'right-0.5' : 'left-0.5')} aria-hidden="true" />
      </button>
      <label htmlFor={id} className="cursor-pointer">
        <span className="block font-semibold">{label}</span>
        {hint ? <span className="block text-[14px] text-muted">{hint}</span> : null}
      </label>
    </div>
  )
}

/** Kod bloğu: yatay kayar, klavyeyle odaklanır */
export function Code({ children, label }: { children: string; label: string }) {
  return (
    <pre className="rim overflow-x-auto rounded-[22px] p-4 text-[12.5px] leading-relaxed" tabIndex={0} aria-label={label}>
      <code>{children}</code>
    </pre>
  )
}
