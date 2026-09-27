import type { ButtonHTMLAttributes, CSSProperties, ElementType, ReactNode } from 'react'
import { cx } from '../../shared/cx'
import { ripple } from '../hooks/useRipple'

/**
 * <HoloPanel>: süzülen cam panel. Opak koruyucu gradyan + 1px ince kontur + üç iç gölge + geniş dış parlama.
 * `tick` sol üst köşeye asimetrik bir ışık işareti koyar. İç içe kullanılınca alt panel yalnız ton ve kontur alır.
 */
export function HoloPanel({
  as: As = 'div',
  tick,
  className,
  children,
  ...rest
}: { as?: ElementType; tick?: boolean; className?: string; children: ReactNode } & Record<string, unknown>) {
  return (
    <As className={cx('holo-panel', tick && 'holo-tick', className)} {...rest}>
      {children}
    </As>
  )
}

/** Panel başlığı: teknik etiket + sağda ölçü/kod */
export function PanelHead({ title, meta, icon, as: As = 'h3' }: { title: ReactNode; meta?: ReactNode; icon?: ReactNode; as?: 'h2' | 'h3' | 'p' }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <As className="flex items-center gap-2 font-tech text-[13px] font-semibold tracking-[0.16em] text-cyan-text uppercase">
        {icon}
        {title}
      </As>
      {meta ? <span className="font-tech text-[12px] text-muted tabular-nums">{meta}</span> : null}
    </div>
  )
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'glass' | 'ghost'
  size?: 'md' | 'sm'
  icon?: ReactNode
}

/** Dalgalanmalı düğme. primary: camgöbeği–mavi gradyan; glass: ince konturlu cam; ghost: yalnız metin */
export function HoloButton({ variant = 'glass', size = 'md', icon, className, children, type = 'button', onPointerDown, onKeyDown, ...rest }: BtnProps) {
  const r = ripple<HTMLButtonElement>()
  return (
    <button
      type={type}
      onPointerDown={(e) => {
        r.onPointerDown(e)
        onPointerDown?.(e)
      }}
      onKeyDown={(e) => {
        r.onKeyDown(e)
        onKeyDown?.(e)
      }}
      className={cx(
        'ripple-host inline-flex items-center justify-center gap-2 rounded-full font-tech font-semibold tracking-[0.06em] whitespace-nowrap transition-[box-shadow,background-color,border-color,filter] duration-200 disabled:cursor-not-allowed disabled:opacity-45',
        size === 'md' ? 'min-h-11 px-5 text-[15px]' : 'min-h-9 px-3.5 text-[13px]',
        variant === 'primary' && 'text-on-accent [background:var(--accent-grad)] shadow-[0_0_18px_var(--glow-strong)] hover:shadow-[0_0_30px_var(--glow-strong)] hover:brightness-110',
        variant === 'glass' && 'thin-glow bg-[rgb(var(--surface-rgb)/0.55)] text-ink hover:border-cyan-text hover:bg-[rgb(var(--surface-rgb)/0.8)]',
        variant === 'ghost' && 'text-cyan-text hover:bg-[var(--tint)]',
        className,
      )}
      {...rest}
    >
      <span className="relative z-[1] inline-flex items-center gap-2">
        {icon}
        {children}
      </span>
    </button>
  )
}

export function SectionHead({ item, label, title, lede, id }: { item: string; label: string; title: string; lede?: string; id?: string }) {
  return (
    <header className="mb-10 max-w-3xl md:mb-12">
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-tech text-[13px] font-semibold tracking-[0.18em] text-cyan-text uppercase">
        <span className="whitespace-nowrap tabular-nums">{item}</span>
        <span className="h-px w-10 bg-[linear-gradient(90deg,var(--cyan),transparent)]" aria-hidden="true" />
        {label}
      </p>
      <h2 id={id} className="mt-4 text-[34px] leading-[1.08] font-[250] md:text-[48px]">
        {title}
      </h2>
      {lede ? <p className="mt-4 max-w-[62ch] text-[17px] text-muted">{lede}</p> : null}
    </header>
  )
}

/** Küçük durum rozeti: renk + ikon/nokta + etiket (renk tek başına anlam taşımaz) */
export function StatusPill({ tone, children, pulse }: { tone: 'cyan' | 'blue' | 'muted'; children: ReactNode; pulse?: boolean }) {
  const color = tone === 'cyan' ? 'var(--cyan-text)' : tone === 'blue' ? 'var(--blue-text)' : 'var(--muted)'
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line-soft px-2.5 py-0.5 font-tech text-[12px] font-semibold tracking-[0.06em]" style={{ color }}>
      <span className={cx('size-1.5 rounded-full', pulse && 'pulse-dot')} style={{ background: color, boxShadow: `0 0 8px ${color}` } as CSSProperties} aria-hidden="true" />
      {children}
    </span>
  )
}

/** Segmentli seçim (radyo grubu) */
export function Segmented<T extends string>({
  legend,
  name,
  value,
  options,
  onChange,
  size = 'md',
  hideLegend,
}: {
  legend: string
  name: string
  value: T
  options: ReadonlyArray<{ id: T; label: string; hint?: string }>
  onChange: (v: T) => void
  size?: 'md' | 'sm'
  hideLegend?: boolean
}) {
  return (
    <fieldset className="min-w-0">
      <legend className={cx('mb-1.5 font-tech text-[12px] font-semibold tracking-[0.14em] text-muted uppercase', hideLegend && 'sr-only')}>{legend}</legend>
      <div className="inline-flex max-w-full flex-wrap gap-1 rounded-full border border-line-soft bg-[rgb(var(--surface-rgb)/0.5)] p-1">
        {options.map((o) => (
          <label key={o.id} className="cursor-pointer rounded-full has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-cyan-text">
            <input type="radio" name={name} value={o.id} checked={value === o.id} onChange={() => onChange(o.id)} className="sr-only" />
            <span
              title={o.hint}
              className={cx(
                'flex items-center rounded-full font-tech font-semibold tracking-[0.04em] transition-colors',
                size === 'md' ? 'min-h-9 px-3.5 text-[14px]' : 'min-h-8 px-3 text-[13px]',
                value === o.id ? 'bg-[var(--tint)] text-cyan-text shadow-[inset_0_0_0_1px_var(--line),0_0_12px_var(--glow)]' : 'text-muted hover:text-ink',
              )}
            >
              {o.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
