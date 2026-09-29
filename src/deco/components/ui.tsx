import { useId, type CSSProperties, type ReactNode } from 'react'
import { cx } from '../../shared/cx'
import { Ayirac } from './Ornament'

/** Bölüm: ortalanmış üst yazı, ayraç, Cinzel başlık, ana metin */
export function Section({ id, madde, title, lead, children, className }: { id: string; madde: string; title: ReactNode; lead?: ReactNode; children: ReactNode; className?: string }) {
  const hid = useId()
  return (
    <section id={id} aria-labelledby={hid} className={cx('mx-auto w-full max-w-[1200px] scroll-mt-20 px-4 py-16 text-center md:px-8 md:py-24', className)}>
      <p className="kicker">{madde}</p>
      <Ayirac className="mt-5 max-w-[360px]" />
      <h2 id={hid} className="mt-6 text-[clamp(26px,4.6vw,56px)]">
        {title}
      </h2>
      {lead ? <p className="mx-auto mt-6 max-w-[62ch] text-[19px] text-soluk">{lead}</p> : null}
      <div className="mt-12 md:mt-16">{children}</div>
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

/** Seçim çipi grubu: seçili olan altın çerçeve, kalın yazı ve baklava işaretiyle (renk tek başına değil) */
export function Secim<T extends string>({ legend, name, value, options, onChange, gizli, hizala = 'ortala' }: { legend: string; name: string; value: T; options: { id: T; ad: ReactNode }[]; onChange: (v: T) => void; gizli?: boolean; hizala?: 'ortala' | 'sol' }) {
  return (
    <fieldset className="min-w-0 border-0 p-0">
      <legend className={cx('kicker mx-auto mb-3', gizli && 'sr-only', hizala === 'sol' && '!text-left')}>{legend}</legend>
      <div className={cx('flex flex-wrap gap-2.5', hizala === 'ortala' ? 'justify-center' : 'justify-start')}>
        {options.map((o) => {
          const on = value === o.id
          return (
            <label key={o.id} className="cip" data-on={on ? '' : undefined}>
              <input type="radio" className="sr-only" name={name} value={o.id} checked={on} onChange={() => onChange(o.id)} />
              {o.ad}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export function Aralik({ label, value, min, max, step = 1, onChange, format }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; format?: (v: number) => string }) {
  const id = useId()
  const shown = format ? format(value) : String(value)
  const p = ((value - min) / (max - min)) * 100
  return (
    <div className="min-w-0 text-left">
      <label htmlFor={id} className="flex items-baseline justify-between gap-3">
        <span className="etiket !text-metin">{label}</span>
        <span className="font-mono text-[15px] tabular-nums text-altin-yazi">{shown}</span>
      </label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} aria-valuetext={shown} className="aralik" style={{ ['--p' as string]: `${p}%` } as CSSProperties} />
    </div>
  )
}

/** Baklava tutamaklı anahtar. Durum yazıyla da verilir (AÇIK / KAPALI) */
export function Anahtar({ label, hint, checked, onChange }: { label: string; hint?: ReactNode; checked: boolean; onChange: (v: boolean) => void }) {
  const id = useId()
  const hid = useId()
  return (
    <div className="flex items-start gap-4 text-left">
      <button id={id} type="button" role="switch" aria-checked={checked} aria-describedby={hint ? hid : undefined} onClick={() => onChange(!checked)} className="anahtar">
        <i aria-hidden="true" />
      </button>
      <div className="min-w-0">
        <label htmlFor={id} className="cursor-pointer text-[17px] font-semibold">
          {label} <span className="ml-1 font-mono text-[12px] tracking-widest text-altin-yazi">{checked ? 'AÇIK' : 'KAPALI'}</span>
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

/** Onay kutusu: ince altın kare, işaretlenince içinde altın baklava ve çentik. Durum yazıyla da bellidir */
export function Onay({ id, label, checked, onChange, hata, describedBy }: { id: string; label: ReactNode; checked: boolean; onChange: (v: boolean) => void; hata?: boolean; describedBy?: string }) {
  return (
    <label htmlFor={id} className="flex min-h-12 cursor-pointer items-start gap-4 text-left">
      <input id={id} type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-invalid={hata ? true : undefined} aria-describedby={describedBy} />
      <span className={cx('mt-1 grid size-7 shrink-0 place-items-center border peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-[var(--focus)]', hata ? 'border-2 border-altin-parlak' : 'border-altin-cizgi')} aria-hidden="true">
        {checked ? (
          <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" className="text-altin-cizgi">
            <path d="M8 1.5L14.5 8L8 14.5L1.5 8Z" strokeWidth="1" />
            <path d="M5 8L7.2 10.2L11 6" strokeWidth="1.4" />
          </svg>
        ) : null}
      </span>
      <span className="text-[17px] leading-[1.6]">{label}</span>
    </label>
  )
}
