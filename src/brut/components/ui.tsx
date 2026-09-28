import { useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { IconCheck, IconWarning } from './Icons'
import { cx } from '../../shared/cx'

/** Bölüm: devasa başlık, numara çıkartması, asimetrik boşluk (Madde 12) */
export function Section({ id, n, kicker, title, lead, children, className }: { id: string; n: string; kicker: string; title: ReactNode; lead?: ReactNode; children: ReactNode; className?: string }) {
  const hid = useId()
  return (
    <section id={id} aria-labelledby={hid} className={cx('mx-auto w-full max-w-7xl scroll-mt-24 px-4 pt-20 pb-24 md:px-8 md:pt-28 md:pb-32', className)}>
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-brut border-[3px] border-line fill-ink px-2.5 py-0.5 font-display text-[15px] font-black [font-stretch:125%]">{n}</span>
        <p className="kicker">{kicker}</p>
      </div>
      <h2 id={hid} className="display mt-4 max-w-[16ch] break-words">
        {title}
      </h2>
      {lead ? <p className="mt-5 max-w-[58ch] text-[19px] leading-snug font-medium text-muted max-sm:text-[17px]">{lead}</p> : null}
      <div className="mt-10 md:mt-14">{children}</div>
    </section>
  )
}

/** Radyo çipleri: yerel radyo girişleri; seçili olan dolu ve gölgesiz (basılı) */
export function Chips<T extends string>({ legend, name, value, options, onChange, hideLegend, fill = 'yellow' }: { legend: string; name: string; value: T; options: { id: T; ad: ReactNode }[]; onChange: (v: T) => void; hideLegend?: boolean; fill?: 'yellow' | 'pink' | 'blue' | 'green' }) {
  return (
    <fieldset className="min-w-0">
      <legend className={cx('mb-2 text-[14px] font-bold', hideLegend && 'sr-only')}>{legend}</legend>
      <div className="flex flex-wrap gap-2.5">
        {options.map((o) => {
          const on = value === o.id
          return (
            <label
              key={o.id}
              className={cx(
                'snap relative inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-brut border-[3px] border-line px-3 text-[15px] font-bold select-none has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-dashed has-[:focus-visible]:outline-[var(--ink)]',
                on ? `fill-${fill} translate-x-[3px] translate-y-[3px]` : 'bg-surface text-ink brut-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px]',
              )}
            >
              <input type="radio" className="sr-only" name={name} value={o.id} checked={on} onChange={() => onChange(o.id)} />
              {on ? <IconCheck size={16} strokeWidth={3} /> : null}
              {o.ad}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export function Switch({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  const id = useId()
  return (
    <div className="flex items-start gap-3">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cx('relative mt-0.5 h-9 w-16 shrink-0 rounded-brut border-[3px] border-line brut-shadow-sm snap press', checked ? 'fill-green' : 'bg-surface')}
      >
        <span className={cx('absolute top-1/2 size-5 -translate-y-1/2 rounded-brut border-[3px] border-line bg-ink', checked ? 'right-1' : 'left-1')} aria-hidden="true" />
        <span className="sr-only">{checked ? 'açık' : 'kapalı'}</span>
      </button>
      <label htmlFor={id} className="cursor-pointer">
        <span className="block font-bold">{label}</span>
        {hint ? <span className="block text-[14px] text-muted">{hint}</span> : null}
      </label>
    </div>
  )
}

export function Check({ label, checked, onChange }: { label: ReactNode; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 font-bold has-[:focus-visible]:[&>span:first-of-type]:outline-3 has-[:focus-visible]:[&>span:first-of-type]:outline-offset-4 has-[:focus-visible]:[&>span:first-of-type]:outline-dashed has-[:focus-visible]:[&>span:first-of-type]:outline-[var(--ink)]">
      <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className={cx('grid size-7 shrink-0 place-items-center rounded-brut border-[3px] border-line', checked ? 'fill-yellow' : 'bg-surface')} aria-hidden="true">
        {checked ? <IconCheck size={18} strokeWidth={3.5} /> : null}
      </span>
      <span>{label}</span>
    </label>
  )
}

export function Field({ label, error, hint, className, ...rest }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; hint?: string }) {
  const id = useId()
  const eid = `${id}-e`
  const hidId = `${id}-h`
  return (
    <div className={cx('min-w-0', className)}>
      <label htmlFor={id} className="mb-1.5 block font-bold">
        {label}
      </label>
      <input id={id} className="field snap w-full" aria-invalid={error ? true : undefined} aria-describedby={cx(error && eid, hint && hidId) || undefined} {...rest} />
      {hint && !error ? (
        <p id={hidId} className="mt-1.5 text-[14px] text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={eid} className="mt-2 inline-flex items-center gap-1.5 rounded-brut border-[3px] border-line fill-red px-2 py-0.5 text-[14px] font-bold">
          <IconWarning size={16} /> {error}
        </p>
      ) : null}
    </div>
  )
}

export function Code({ label, children, labelLang }: { label: string; children: string; labelLang?: string }) {
  return (
    <figure className="min-w-0">
      <figcaption className="kicker mb-2" lang={labelLang}>
        {label}
      </figcaption>
      <pre className="scroll-x rounded-brut border-[3px] border-line fill-ink p-4 font-mono text-[13px] leading-relaxed brut-shadow-sm" tabIndex={0} aria-label={`${label} kodu`}>
        <code>{children}</code>
      </pre>
    </figure>
  )
}

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="inline-block rounded-brut border-[3px] border-line bg-surface px-1.5 py-0.5 font-mono text-[13px] leading-none font-bold">{children}</kbd>
}
