import { useId, type ReactNode } from 'react'
import { cx } from '../../shared/cx'

/** Bölüm: mono üst yazı, krom başlık, yanında eğik fırça scripti */
export function Section({ id, madde, title, script, lead, children, className }: { id: string; madde: string; title: ReactNode; script?: ReactNode; lead?: ReactNode; children: ReactNode; className?: string }) {
  const hid = useId()
  return (
    <section id={id} aria-labelledby={hid} className={cx('mx-auto w-full max-w-[1200px] scroll-mt-24 px-4 pt-24 pb-10 md:px-8 md:pt-32', className)}>
      <p className="kicker text-cyan">{madde}</p>
      <h2 id={hid} className="mt-4 flex flex-wrap items-end gap-x-5 gap-y-1">
        <span className="chrome text-[clamp(40px,6.4vw,84px)]">{title}</span>
        {script ? <span className="script -mb-1 inline-block -rotate-6 text-[clamp(34px,4.6vw,60px)]">{script}</span> : null}
      </h2>
      {lead ? <p className="mt-6 max-w-[62ch] text-[17px] text-muted">{lead}</p> : null}
      <div className="mt-10 md:mt-14">{children}</div>
    </section>
  )
}

/** Madde 11: neon çerçeveli kaydırıcı. Dolu kısım pembe, iz cyan tüp */
export function NeonSlider({ label, value, min, max, step = 1, onChange, format, id: idProp }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; format?: (v: number) => string; id?: string }) {
  const auto = useId()
  const id = idProp ?? auto
  const shown = format ? format(value) : String(value)
  const p = ((value - min) / (max - min)) * 100
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-[14px] font-bold tracking-wide uppercase">
        <span>{label}</span>
        <span className="text-cyan tabular-nums">{shown}</span>
      </label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} aria-valuetext={shown} className="nrange mt-2" style={{ ['--p' as string]: `${p}%` }} />
    </div>
  )
}

/** Madde 11: neon anahtar. Açıkken cyan tüp yanar; durum yazıyla da (AÇIK / KAPALI) */
export function NeonSwitch({ label, hint, checked, onChange }: { label: string; hint?: ReactNode; checked: boolean; onChange: (v: boolean) => void }) {
  const id = useId()
  const hid = useId()
  return (
    <div className="flex items-start gap-4">
      <button id={id} type="button" role="switch" aria-checked={checked} aria-describedby={hint ? hid : undefined} onClick={() => onChange(!checked)} className="nswitch mt-0.5">
        <i aria-hidden="true" />
      </button>
      <div className="min-w-0">
        <label htmlFor={id} className="cursor-pointer font-bold">
          {label} <span className={cx('ml-1 text-[12px] tracking-widest', checked ? 'text-cyan' : 'text-muted')}>{checked ? 'AÇIK' : 'KAPALI'}</span>
        </label>
        {hint ? (
          <span id={hid} className="block text-[14px] text-muted">
            {hint}
          </span>
        ) : null}
      </div>
    </div>
  )
}

/** Neon radyo çipleri */
export function Secim<T extends string>({ legend, name, value, options, onChange, gizli }: { legend: string; name: string; value: T; options: { id: T; ad: ReactNode }[]; onChange: (v: T) => void; gizli?: boolean }) {
  return (
    <fieldset className="min-w-0 border-0 p-0">
      <legend className={cx('kicker mb-2 text-muted', gizli && 'sr-only')}>{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value === o.id
          return (
            <label key={o.id} className={cx('inline-flex min-h-10 cursor-pointer items-center rounded-[6px] border-2 px-3.5 text-[14px] font-bold tracking-wide uppercase select-none has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-[var(--focus)]', on ? 'border-pink bg-pink text-night shadow-[var(--glow-pink)]' : 'border-line text-text')}>
              <input type="radio" className="sr-only" name={name} value={o.id} checked={on} onChange={() => onChange(o.id)} />
              {o.ad}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export function Kod({ children, label, className }: { children: string; label: string; className?: string }) {
  return (
    <pre className={cx('overflow-x-auto rounded-[8px] border-2 border-line bg-[#0d0418] p-4 text-[13px] leading-relaxed text-text', className)} tabIndex={0} aria-label={label}>
      <code>{children}</code>
    </pre>
  )
}
