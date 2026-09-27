import { useId, type ReactNode } from 'react'
import { cx } from '../../shared/cx'

export function Section({ id, eyebrow, title, lead, children, className }: { id: string; eyebrow: string; title: string; lead?: ReactNode; children: ReactNode; className?: string }) {
  const hid = useId()
  return (
    <section id={id} aria-labelledby={hid} className={cx('mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-16 md:px-8 md:py-24', className)}>
      <p className="label">{eyebrow}</p>
      <h2 id={hid} className="mt-2 text-[30px] leading-tight font-[300] tracking-tight md:text-[40px]">
        {title}
      </h2>
      {lead ? <p className="mt-3 max-w-[64ch] text-[17px] text-muted">{lead}</p> : null}
      <div className="mt-8 md:mt-10">{children}</div>
    </section>
  )
}

/** Segmentli seçim: yerel radyo girişleri, klavyeyle oklar çalışır */
export function Seg<T extends string>({ legend, name, value, options, onChange, hideLegend }: { legend: string; name: string; value: T; options: { id: T; ad: string }[]; onChange: (v: T) => void; hideLegend?: boolean }) {
  return (
    <fieldset className="min-w-0">
      <legend className={cx('mb-1.5 text-[13px] text-muted', hideLegend && 'sr-only')}>{legend}</legend>
      <div className="inline-flex max-w-full flex-wrap gap-1 rounded-xl border border-line bg-bg/60 p-1">
        {options.map((o) => (
          <label key={o.id} className={cx('relative cursor-pointer rounded-lg px-3 py-1 text-[14px] whitespace-nowrap has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-1 has-[:focus-visible]:outline-[var(--focus)]', value === o.id ? 'bg-hover text-ink shadow-[inset_0_0_0_1px_rgb(167_139_250/0.45)]' : 'text-muted hover:text-ink')}>
            <input type="radio" className="sr-only" name={name} value={o.id} checked={value === o.id} onChange={() => onChange(o.id)} />
            {o.ad}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function Stat({ label, value, sub, tone }: { label: string; value: ReactNode; sub?: ReactNode; tone?: 'active' | 'done' | 'err' }) {
  return (
    <div className="panel min-w-0 px-4 py-3">
      <p className="label">{label}</p>
      <p className={cx('mt-1 font-mono text-[19px] leading-tight md:text-[22px] font-[300] tabular-nums mono-tight', tone === 'active' ? 'text-active' : tone === 'done' ? 'text-done' : tone === 'err' ? 'text-err' : 'text-ink')}>{value}</p>
      {sub ? <p className="mt-0.5 text-[13px] text-muted">{sub}</p> : null}
    </div>
  )
}

export function Panel({ title, action, children, className, as: Tag = 'div' }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string; as?: 'div' | 'section' | 'article' }) {
  return (
    <Tag className={cx('panel ticks min-w-0 p-4 md:p-5', className)}>
      {title || action ? (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          {title ? <h3 className="text-[16px] font-medium">{title}</h3> : <span />}
          {action}
        </div>
      ) : null}
      {children}
    </Tag>
  )
}

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="inline-block rounded-md border border-line-strong bg-panel-2 px-1.5 py-1 font-mono text-[11px] leading-none text-ink mono-tight">{children}</kbd>
}

export function Code({ children, label }: { children: string; label: string }) {
  return (
    <figure className="min-w-0">
      <figcaption className="label mb-1.5">{label}</figcaption>
      <pre className="scroll-x rounded-xl border border-line bg-bg/80 p-3.5 font-mono text-[12px] leading-relaxed text-muted mono-tight" tabIndex={0} aria-label={`${label} kodu`}>
        <code>{children}</code>
      </pre>
    </figure>
  )
}
