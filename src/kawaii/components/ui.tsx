import { useId, type ReactNode } from 'react'
import { cx } from '../../shared/cx'

/** Bölüm: yuvarlak üst etiket, kalın yuvarlak başlık, yumuşak giriş metni */
export function Section({ id, madde, title, lead, children, className, ikon }: { id: string; madde: string; title: ReactNode; lead?: ReactNode; children: ReactNode; className?: string; ikon?: ReactNode }) {
  const hid = useId()
  return (
    <section id={id} aria-labelledby={hid} className={cx('mx-auto w-full max-w-[1200px] scroll-mt-28 px-4 pt-20 pb-8 md:px-8 md:pt-28', className)}>
      <p className="kicker inline-flex items-center gap-2 rounded-bubble bg-paper px-4 py-1.5 shadow-[0_6px_14px_rgb(255_170_165/0.25)] [border:var(--line)_solid_var(--brown)]">
        {ikon}
        {madde}
      </p>
      <h2 id={hid} className="mt-5 text-[clamp(38px,6vw,68px)] [overflow-wrap:anywhere]">
        {title}
      </h2>
      {lead ? <p className="mt-5 max-w-[62ch] text-[18px] text-muted">{lead}</p> : null}
      <div className="mt-10 md:mt-12">{children}</div>
    </section>
  )
}

/** Hap biçimli radyo çipleri: seçili olan dolgu ve onay işaretiyle (renk tek başına durum söylemez) */
export function Secim<T extends string>({ legend, name, value, options, onChange, gizli }: { legend: string; name: string; value: T; options: { id: T; ad: ReactNode }[]; onChange: (v: T) => void; gizli?: boolean }) {
  return (
    <fieldset className="min-w-0 border-0 p-0">
      <legend className={cx('kicker mb-2 text-muted', gizli && 'sr-only')}>{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value === o.id
          return (
            <label key={o.id} className="kchip" data-on={on ? '' : undefined}>
              <input type="radio" className="sr-only" name={name} value={o.id} checked={on} onChange={() => onChange(o.id)} />
              {on ? (
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                  <path d="M5 12.5 L10 17 L19 7" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : null}
              {o.ad}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

/** Kalın hap ray, gülen yuvarlak tutamak */
export function KSlider({ label, value, min, max, step = 1, onChange, format, renk = 'salmon' }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; format?: (v: number) => string; renk?: 'mint' | 'peach' | 'salmon' | 'rose' }) {
  const id = useId()
  const shown = format ? format(value) : String(value)
  const p = ((value - min) / (max - min)) * 100
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-[16px] font-extrabold">
        <span>{label}</span>
        <span className="tabular-nums">{shown}</span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        aria-valuetext={shown}
        className="krange mt-2"
        style={{
          ['--p' as string]: `${p}%`,
          ['--c' as string]: `var(--${renk})`,
        }}
      />
    </div>
  )
}

/** Yumuşak anahtar: tutamak küçük bir yüz; açıkken gülümser, kapalıyken uyur. Durum yazıyla da verilir */
export function KSwitch({ label, hint, checked, onChange }: { label: string; hint?: ReactNode; checked: boolean; onChange: (v: boolean) => void }) {
  const id = useId()
  const hid = useId()
  return (
    <div className="flex items-start gap-4">
      <button id={id} type="button" role="switch" aria-checked={checked} aria-describedby={hint ? hid : undefined} onClick={() => onChange(!checked)} className="kswitch mt-0.5">
        <i aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22">
            {checked ? (
              <>
                <circle cx="8.5" cy="10.5" r="1.7" fill="currentColor" />
                <circle cx="15.5" cy="10.5" r="1.7" fill="currentColor" />
                <path d="M9 14.5 Q12 17.5 15 14.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </>
            ) : (
              <path d="M6.5 11 q2 1.8 4 0 M13.5 11 q2 1.8 4 0 M10.5 15.5 h3" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            )}
          </svg>
        </i>
      </button>
      <div className="min-w-0">
        <label htmlFor={id} className="cursor-pointer font-extrabold">
          {label} <span className="ml-1 rounded-bubble bg-cream px-2 py-0.5 text-[13px] text-muted">{checked ? 'Açık' : 'Kapalı'}</span>
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

/** Kısa kod satırları sarılır; hizalı çok satırlı bloklar (sar={false}) yatay kayar */
export function Kod({ children, label, className, sar = true }: { children: string; label: string; className?: string; sar?: boolean }) {
  return (
    <pre className={cx('kod overflow-x-auto', !sar && '!whitespace-pre', className)} tabIndex={0} aria-label={label}>
      <code>{children}</code>
    </pre>
  )
}
