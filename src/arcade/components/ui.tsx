import { useId, type ReactNode } from 'react'
import { cx } from '../../shared/cx'
import type { Ton } from '../lib/data'
import { ArcadeText } from './ArcadeText'
import { Ikon } from './Sprite'

/** Bölüm: "MADDE 04 · RENK" üst yazı, Press Start başlık, VT323 giriş */
export function Section({ id, madde, title, lead, ton = 'sari', children, className }: { id: string; madde: string; title: ReactNode; lead?: ReactNode; ton?: Ton; children: ReactNode; className?: string }) {
  const hid = useId()
  return (
    <section id={id} aria-labelledby={hid} className={cx('mx-auto w-full max-w-[calc(var(--u)*400)] px-4 pt-24 pb-8 md:px-8', className)}>
      <p className="kicker text-muted">{madde}</p>
      <ArcadeText as="h2" id={hid} boyut="l" ton={ton} neon className="mt-3 max-w-[24ch]">
        {title}
      </ArcadeText>
      {lead ? <p className="mt-5 max-w-[60ch] text-body-l text-muted">{lead}</p> : null}
      <div className="mt-10">{children}</div>
    </section>
  )
}

/** Seçim çipleri: radyo grubu, seçili olan dolu ve ok işaretli (renk tek başına söylemesin) */
export function Secim<T extends string>({ legend, name, value, options, onChange, ton = 'sari', gizli }: { legend: string; name: string; value: T; options: { id: T; ad: ReactNode }[]; onChange: (v: T) => void; ton?: Ton; gizli?: boolean }) {
  return (
    <fieldset className="min-w-0 border-0 p-0">
      <legend className={cx('kicker mb-2 text-muted', gizli && 'sr-only')}>{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value === o.id
          return (
            <label key={o.id} data-ton={ton} className={cx('pbtn has-[:focus-visible]:outline-[length:var(--u)] has-[:focus-visible]:outline-offset-[calc(var(--u)*2)] has-[:focus-visible]:outline-[var(--focus)] has-[:focus-visible]:outline-dashed', !on && '[--hi:var(--bg)] [--on:var(--ink)] [--hl:var(--bg)] [--lo:var(--lo-white)]')} data-boy="k">
              <input type="radio" className="sr-only" name={name} value={o.id} checked={on} onChange={() => onChange(o.id)} />
              <Ikon ad="sag" buyukluk={1} className={on ? '' : 'invisible'} />
              {o.ad}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

/** Açık/kapalı anahtarı: ON / OFF yazısıyla (renk tek başına değil) */
export function Anahtar({ label, hint, checked, onChange }: { label: string; hint?: ReactNode; checked: boolean; onChange: (v: boolean) => void }) {
  const id = useId()
  const hid = useId()
  return (
    <div className="flex items-start gap-4">
      <button id={id} type="button" role="switch" aria-checked={checked} aria-describedby={hint ? hid : undefined} onClick={() => onChange(!checked)} data-ton={checked ? 'yesil' : 'beyaz'} data-boy="k" className={cx('pbtn w-[calc(var(--u)*30)] shrink-0', !checked && '[--hi:var(--bg)] [--on:var(--ink)] [--hl:var(--bg)]')}>
        <span lang="en">{checked ? 'On' : 'Off'}</span>
      </button>
      <div className="min-w-0 pt-1">
        <label htmlFor={id} className="block cursor-pointer text-body-l">
          {label}
        </label>
        {hint ? (
          <span id={hid} className="block text-muted">
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
      <label htmlFor={id} className="flex items-baseline justify-between gap-3">
        <span>{label}</span>
        <span className="tabnum">{shown}</span>
      </label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} aria-valuetext={shown} className="mt-2 w-full cursor-pointer accent-[var(--yellow)]" />
    </div>
  )
}

/** Kod bloğu: siyah panel, yatay kayar, klavyeyle odaklanır */
export function Kod({ children, label }: { children: string; label: string }) {
  return (
    <pre className="px kod m-1 text-ink" tabIndex={0} aria-label={label} data-golge="0">
      <code>{children}</code>
    </pre>
  )
}

/** Madde etiketi: küçük dolu rozet */
export function Rozet({ children, ton = 'sari' }: { children: ReactNode; ton?: Ton }) {
  return (
    <span data-ton={ton} data-dolu="" data-golge="0" className="px inline-block px-2 py-1 font-ps text-xs leading-[1.5] uppercase">
      {children}
    </span>
  )
}
