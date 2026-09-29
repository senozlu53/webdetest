import { useId, type ReactNode } from 'react'
import { cx } from '../../shared/cx'
import { FircaCizgi } from './Firca'
import { Ikon } from './Ikon'
import type { Pigment } from '../lib/simge'

/** Bölüm: küçük büyük harfli üst yazı, italik serif başlık, altında fırça çizgisi */
export function Section({ id, madde, title, lead, children, className, renk = 'gul', tohum }: { id: string; madde: string; title: ReactNode; lead?: ReactNode; children: ReactNode; className?: string; renk?: Pigment; tohum?: number }) {
  const hid = useId()
  return (
    <section id={id} aria-labelledby={hid} className={cx('mx-auto w-full max-w-[1200px] scroll-mt-20 px-4 py-14 md:px-8 md:py-20', className)}>
      <p className="kicker">{madde}</p>
      <h2 id={hid} className="mt-3 text-[clamp(42px,6.6vw,84px)] italic [overflow-wrap:anywhere]">
        {title}
      </h2>
      <FircaCizgi renk={renk} tohum={tohum ?? id.length * 3 + 2} className="mt-1 max-w-[360px]" />
      {lead ? <p className="mt-6 max-w-[62ch] text-[19px] text-soluk">{lead}</p> : null}
      <div className="mt-10 md:mt-12">{children}</div>
    </section>
  )
}

export function Kod({ children, label, className, sar = true }: { children: string; label: string; className?: string; sar?: boolean }) {
  return (
    <pre className={cx('kod overflow-x-auto', !sar && '!whitespace-pre', className)} tabIndex={0} aria-label={label}>
      <code>{children}</code>
    </pre>
  )
}

/** Seçim çipi grubu: seçili olan kalın yazı, kalın altı ve onay işaretiyle (renk tek başına değil) */
export function Secim<T extends string>({ legend, name, value, options, onChange, gizli }: { legend: string; name: string; value: T; options: { id: T; ad: ReactNode; renk?: string }[]; onChange: (v: T) => void; gizli?: boolean }) {
  return (
    <fieldset className="min-w-0 border-0 p-0">
      <legend className={cx('kicker mb-2.5', gizli && 'sr-only')}>{legend}</legend>
      <div className="flex flex-wrap gap-2.5">
        {options.map((o) => {
          const on = value === o.id
          return (
            <label key={o.id} className="cip" data-on={on ? '' : undefined} style={o.renk ? ({ ['--c' as string]: o.renk } as React.CSSProperties) : undefined}>
              <input type="radio" className="sr-only" name={name} value={o.id} checked={on} onChange={() => onChange(o.id)} />
              {on ? <Ikon ad="yaprak" boyut={20} filtre={false} /> : null}
              {o.ad}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export function FircaAralik({ label, value, min, max, step = 1, onChange, format, renk = 'var(--ultramarin)' }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; format?: (v: number) => string; renk?: string }) {
  const id = useId()
  const shown = format ? format(value) : String(value)
  const p = ((value - min) / (max - min)) * 100
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 font-semibold">
        <span>{label}</span>
        <span className="font-mono text-[15px] tabular-nums text-soluk">{shown}</span>
      </label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} aria-valuetext={shown} className="firca-arali mt-1" style={{ ['--p' as string]: `${p}%`, ['--c' as string]: renk } as React.CSSProperties} />
    </div>
  )
}

/** Damla anahtarı. Durum yazıyla da verilir (AÇIK / KAPALI) */
export function Damla({ label, hint, checked, onChange }: { label: string; hint?: ReactNode; checked: boolean; onChange: (v: boolean) => void }) {
  const id = useId()
  const hid = useId()
  return (
    <div className="flex items-start gap-4">
      <button id={id} type="button" role="switch" aria-checked={checked} aria-describedby={hint ? hid : undefined} onClick={() => onChange(!checked)} className="damla mt-0.5">
        <i aria-hidden="true" />
      </button>
      <div className="min-w-0">
        <label htmlFor={id} className="cursor-pointer font-semibold">
          {label} <span className="ml-1 font-mono text-[13px] tracking-widest text-soluk">{checked ? 'AÇIK' : 'KAPALI'}</span>
        </label>
        {hint ? (
          <span id={hid} className="block text-[16px] text-soluk">
            {hint}
          </span>
        ) : null}
      </div>
    </div>
  )
}
