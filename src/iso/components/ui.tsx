import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from '../../shared/cx'

/* Madde 18: arayüz öğeleri düzdür. İzometri yalnızca illüstrasyon ve veri görselinde. */

export function SectionHead({ item, label, title, lede }: { item: string; label: ReactNode; title: ReactNode; lede?: ReactNode }) {
  return (
    <header className="mb-10 max-w-[760px] md:mb-14">
      <p className="font-mono text-[13px] tracking-wide text-muted uppercase">
        <span className="text-accent">{item}</span> · {label}
      </p>
      <h2 className="mt-3 text-3xl leading-[1.1] font-bold md:text-5xl">{title}</h2>
      {lede ? <p className="mt-4 max-w-[64ch] text-[17px] text-muted">{lede}</p> : null}
    </header>
  )
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost'; icon?: ReactNode }

export function Button({ variant = 'secondary', icon, className, children, type = 'button', ...rest }: BtnProps) {
  return (
    <button
      type={type}
      className={cx(
        'inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md px-4 text-[15px] font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary' && 'bg-accent text-bg hover:opacity-90',
        variant === 'secondary' && 'border border-field bg-surface text-ink hover:bg-line',
        variant === 'ghost' && 'text-ink hover:bg-line',
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}

export function Panel({ className, children, as: As = 'div' }: { className?: string; children: ReactNode; as?: 'div' | 'section' | 'article' | 'figure' }) {
  return <As className={cx('min-w-0 rounded-lg border border-line bg-surface', className)}>{children}</As>
}

type SegOption<T extends string> = { id: T; label: ReactNode }

/** Düz segment seçici: yerel radyo düğmeleri, oklarla gezilir. */
export function Segmented<T extends string>({ legend, name, value, options, onChange, className }: { legend: string; name: string; value: T; options: ReadonlyArray<SegOption<T>>; onChange: (v: T) => void; className?: string }) {
  return (
    <fieldset className={className}>
      <legend className="mb-2 text-[14px] font-semibold">{legend}</legend>
      <div className="inline-flex max-w-full flex-wrap rounded-md border border-field bg-surface p-1">
        {options.map((o) => (
          <label key={o.id} className="max-w-full shrink-0 cursor-pointer rounded has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-1 has-[:focus-visible]:outline-ring">
            <input type="radio" name={name} value={o.id} checked={value === o.id} onChange={() => onChange(o.id)} className="sr-only" />
            <span className={cx('flex min-h-9 items-center gap-1.5 rounded px-3 text-[14px] font-semibold', value === o.id ? 'bg-ink text-bg' : 'text-muted hover:text-ink')}>
              {o.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function Code({ children, className }: { children: string; className?: string }) {
  return (
    <pre className={cx('overflow-x-auto rounded-md border border-line bg-bg p-4 font-mono text-[13px] leading-relaxed', className)}>
      <code>{children}</code>
    </pre>
  )
}
