import { useId, type ReactNode } from 'react'
import { cx } from '../../shared/cx'
import type { Ton } from '../lib/data'
import { UiIkon } from './Icons'
import { Sekil } from './Shapes'

const VURGU: Record<Ton, string> = { sari: 'bg-yellow', camgobegi: 'bg-teal', pembe: 'on-pink', beyaz: 'bg-paper', lacivert: 'bg-ink text-paper' }

/** Bölüm: madde etiketi hap, dev başlık (bir kelimesi renkli blokta), giriş metni */
export function Section({ id, madde, title, vurgu, ton = 'sari', lead, children, className, sekil = 'daire' }: { id: string; madde: string; title: ReactNode; vurgu?: ReactNode; ton?: Ton; lead?: ReactNode; children: ReactNode; className?: string; sekil?: 'daire' | 'ucgen' | 'zikzak' | 'dalga' | 'kare' | 'yarim' | 'silindir' | 'arti' }) {
  const hid = useId()
  return (
    <section id={id} aria-labelledby={hid} className={cx('relative mx-auto w-full max-w-[1240px] scroll-mt-24 px-4 pt-24 pb-10 md:px-8 md:pt-32', className)}>
      <div className="flex items-center gap-3">
        <span className="kicker inline-block rounded-full border-[3px] border-ink bg-paper px-4 py-1">{madde}</span>
        <Sekil tur={sekil} ton={ton} boyut={34} className="kipir" />
      </div>
      <h2 id={hid} className="dev mt-5 max-w-[16ch] text-[clamp(34px,6.2vw,84px)] [overflow-wrap:anywhere]">
        {title}{' '}
        {vurgu ? <span className={cx('inline-block max-w-full -rotate-2 rounded-[6px] border-[4px] border-ink px-3 pb-1 leading-[1] shadow-[5px_5px_0_var(--shadow)]', VURGU[ton])}>{vurgu}</span> : null}
      </h2>
      {lead ? <p className="mt-6 max-w-[58ch] text-[19px] leading-relaxed max-sm:text-[17px]">{lead}</p> : null}
      <div className="mt-10 md:mt-14">{children}</div>
    </section>
  )
}

/** Hap çipleri: radyo grubu. Seçili olan dolu, tik işaretli (renk tek başına söylemez) */
export function Secim<T extends string>({ legend, name, value, options, onChange, ton = 'sari', gizli }: { legend: string; name: string; value: T; options: { id: T; ad: ReactNode }[]; onChange: (v: T) => void; ton?: Ton; gizli?: boolean }) {
  return (
    <fieldset className="min-w-0 border-0 p-0">
      <legend className={cx('kicker mb-2', gizli && 'sr-only')}>{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value === o.id
          return (
            <label key={o.id} className={cx('inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border-[3px] border-ink px-4 text-[15px] font-bold select-none has-[:focus-visible]:outline-4 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-[var(--focus)]', on ? cx(VURGU[ton], 'shadow-[3px_3px_0_var(--shadow)]') : 'bg-paper')}>
              <input type="radio" className="sr-only" name={name} value={o.id} checked={on} onChange={() => onChange(o.id)} />
              {on ? <UiIkon ad="tik" boyut={16} /> : null}
              {o.ad}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

/** Hap anahtarı: AÇIK / KAPALI yazısıyla */
export function Anahtar({ label, hint, checked, onChange }: { label: string; hint?: ReactNode; checked: boolean; onChange: (v: boolean) => void }) {
  const id = useId()
  const hid = useId()
  return (
    <div className="flex items-start gap-3">
      <button id={id} type="button" role="switch" aria-checked={checked} aria-describedby={hint ? hid : undefined} onClick={() => onChange(!checked)} className={cx('relative mt-0.5 h-9 w-[92px] shrink-0 rounded-full border-[3px] border-ink', checked ? 'bg-teal' : 'bg-paper')}>
        <span className={cx('absolute top-[3px] grid size-6 place-items-center rounded-full border-[3px] border-ink bg-yellow transition-[left] duration-[var(--yay-sure)] ease-yay', checked ? 'left-[59px]' : 'left-[3px]')} aria-hidden="true" />
        <span className={cx('absolute top-[7px] text-[11px] leading-none font-extrabold tracking-wide', checked ? 'left-2.5' : 'right-2.5')} aria-hidden="true">
          {checked ? 'AÇIK' : 'KAPALI'}
        </span>
      </button>
      <div className="min-w-0">
        <label htmlFor={id} className="cursor-pointer font-bold">
          {label}
        </label>
        {hint ? (
          <span id={hid} className="block text-[15px] text-muted">
            {hint}
          </span>
        ) : null}
      </div>
    </div>
  )
}

export function Aralik({ label, value, min, max, step = 1, onChange, format }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; format?: (v: number) => string }) {
  const id = useId()
  const shown = format ? format(value) : String(value)
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 font-bold">
        <span>{label}</span>
        <span className="font-mono text-[14px] tabular-nums">{shown}</span>
      </label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} aria-valuetext={shown} className="mt-2 w-full cursor-pointer accent-[var(--pink)]" />
    </div>
  )
}

/** Kod bloğu: lacivert zemin, beyaz yazı (12,08:1), yatay kayar */
export function Kod({ children, label, className }: { children: string; label: string; className?: string }) {
  return (
    <pre className={cx('overflow-x-auto rounded-[14px] border-[4px] border-ink bg-ink p-4 text-[13.5px] leading-relaxed text-paper shadow-[6px_6px_0_var(--yellow)]', className)} tabIndex={0} aria-label={label}>
      <code className="font-mono">{children}</code>
    </pre>
  )
}

export function Hap({ children, ton = 'sari', className }: { children: ReactNode; ton?: Ton; className?: string }) {
  return <span className={cx('inline-flex items-center gap-1 rounded-full border-[3px] border-ink px-3 py-0.5 text-[14px] font-extrabold', VURGU[ton], className)}>{children}</span>
}
