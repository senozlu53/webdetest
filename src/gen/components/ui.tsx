import type { ReactNode } from 'react'
import { cx } from '../../shared/cx'

export function SectionHead({ item, label, title, lede }: { item: string; label: string; title: string; lede?: ReactNode }) {
  return (
    <header className="mb-8 max-w-3xl">
      <p className="flex flex-wrap items-center gap-x-2 font-sans text-[13px] font-medium text-muted">
        <span className="rounded-full border border-accent-line bg-accent-soft px-2 py-0.5 whitespace-nowrap text-accent-ink tabular-nums">{item}</span>
        {label}
      </p>
      <h2 className="mt-3 font-sans text-[28px] leading-tight font-semibold md:text-[34px]">{title}</h2>
      {lede ? <p className="mt-3 font-serif text-[18px] leading-relaxed text-muted">{lede}</p> : null}
    </header>
  )
}

/** Düz kart: üretilen bloklar aynı düzlemde (Madde 7) */
export function Card({ title, meta, children, className, layout }: { title?: ReactNode; meta?: ReactNode; children: ReactNode; className?: string; layout?: string }) {
  return (
    <div data-layout={layout} className={cx('min-w-0 rounded-md border border-line bg-surface p-4 md:p-5', className)}>
      {title ? (
        <div className="mb-3 flex items-baseline justify-between gap-3 font-sans">
          <h3 className="text-[15px] font-semibold">{title}</h3>
          {meta ? <span className="text-[12px] text-muted">{meta}</span> : null}
        </div>
      ) : null}
      {children}
    </div>
  )
}

export function Segmented<T extends string>({ legend, name, value, options, onChange }: { legend: string; name: string; value: T; options: ReadonlyArray<{ id: T; label: string }>; onChange: (v: T) => void }) {
  return (
    <fieldset className="min-w-0 font-sans">
      <legend className="mb-1.5 text-[12px] font-medium text-muted">{legend}</legend>
      <div className="inline-flex flex-wrap gap-0.5 rounded-md border border-line bg-sunken p-0.5">
        {options.map((o) => (
          <label key={o.id} className="cursor-pointer rounded-[6px] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-1 has-[:focus-visible]:outline-accent">
            <input type="radio" className="sr-only" name={name} value={o.id} checked={value === o.id} onChange={() => onChange(o.id)} />
            <span className={cx('flex min-h-8 items-center rounded-[6px] px-3 text-[13px]', value === o.id ? 'bg-surface font-medium text-ink shadow-[0_0_0_1px_var(--line)]' : 'text-muted hover:text-ink')}>{o.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
