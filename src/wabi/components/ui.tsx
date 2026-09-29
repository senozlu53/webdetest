import { useId, type ReactNode } from 'react'
import { cx } from '../../shared/cx'
import { Belir } from './Belir'
import { WabiContainer, Yer } from './Wabi'

export { Belir }

/** Başlık yerleşimleri: her bölüm başlığı ve girişi ızgarada farklı yerde başlar */
const DUZEN = [
  { h: [2, 8], l: [5, 5] },
  { h: [4, 8], l: [4, 6] },
  { h: [1, 8], l: [3, 6] },
  { h: [3, 8], l: [6, 5] },
] as const

/** Bölüm: küçük üst yazı, ince serif başlık ve dar giriş metni; hepsi bilerek dengesiz yerleştirilir */
export function Section({ id, no, madde, title, lead, children, duzen = 0, className }: { id: string; no: string; madde: ReactNode; title: ReactNode; lead?: ReactNode; children: ReactNode; duzen?: 0 | 1 | 2 | 3; className?: string }) {
  const hid = useId()
  const d = DUZEN[duzen]
  return (
    <section id={id} aria-labelledby={hid} className={cx('bolum scroll-mt-16', className)}>
      <WabiContainer>
        <Yer b={d.h[0]} s={d.h[1]} ind={0}>
          <Belir>
            <p className="kicker">
              <span className="rakam text-[15px] tracking-[0.12em]">No. {no}</span> <span aria-hidden="true">·</span> {madde}
            </p>
            <h2 id={hid} className="baslik mt-6 text-[clamp(40px,6.4vw,92px)]">
              {title}
            </h2>
          </Belir>
        </Yer>
        {lead ? (
          <Yer b={d.l[0]} s={d.l[1]} ind={8} ust={2}>
            <Belir gecikme={300}>
              <p className="mt-[clamp(32px,5vw,72px)] max-w-[52ch] text-[clamp(17px,1.35vw,19.5px)] text-soluk">{lead}</p>
            </Belir>
          </Yer>
        ) : null}
      </WabiContainer>
      <div style={{ marginTop: 'calc(var(--uzay) * 1.1)' }}>{children}</div>
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

/** Yalın seçim: seçili olan dolu ve noktalı (renk tek başına değil) */
export function Secim<T extends string>({ legend, name, value, options, onChange, gizli }: { legend: string; name: string; value: T; options: { id: T; ad: ReactNode }[]; onChange: (v: T) => void; gizli?: boolean }) {
  return (
    <fieldset className="min-w-0 border-0 p-0">
      <legend className={cx('kicker mb-3', gizli && 'sr-only')}>{legend}</legend>
      <div className="flex flex-wrap gap-2.5">
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

export function Aralik({ label, value, min, max, step = 1, onChange, format, id: dis }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; format?: (v: number) => string; id?: string }) {
  const kimlik = useId()
  const id = dis ?? kimlik
  const shown = format ? format(value) : String(value)
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="flex items-baseline justify-between gap-3">
        <span className="etiket">{label}</span>
        <span className="font-mono text-[13px] text-soluk tabular-nums">{shown}</span>
      </label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} aria-valuetext={shown} className="aralik" />
    </div>
  )
}

/** Anahtar: çizgi üstünde bir taş. Durum yazıyla da verilir (AÇIK / KAPALI) */
export function Anahtar({ label, hint, checked, onChange }: { label: string; hint?: ReactNode; checked: boolean; onChange: (v: boolean) => void }) {
  const id = useId()
  const hid = useId()
  return (
    <div className="flex items-start gap-4">
      <button id={id} type="button" role="switch" aria-checked={checked} aria-describedby={hint ? hid : undefined} onClick={() => onChange(!checked)} className="anahtar">
        <i aria-hidden="true" />
      </button>
      <div className="min-w-0 pt-2.5">
        <label htmlFor={id} className="cursor-pointer text-[17px] font-normal">
          {label} <span className="ml-2 font-mono text-[11px] tracking-widest text-soluk">{checked ? 'AÇIK' : 'KAPALI'}</span>
        </label>
        {hint ? (
          <span id={hid} className="block text-[15.5px] text-soluk">
            {hint}
          </span>
        ) : null}
      </div>
    </div>
  )
}

/** Alan: etiket, ipucu ve hata metni bağlı */
export function Alan({ label, hata, ipucu, children }: { label: string; hata?: string; ipucu?: string; children: (p: { id: string; 'aria-invalid'?: true; 'aria-describedby'?: string }) => ReactNode }) {
  const id = useId()
  const hid = `${id}-h`
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="etiket">
        {label}
      </label>
      <div className="mt-1">{children({ id, 'aria-invalid': hata ? true : undefined, 'aria-describedby': hata || ipucu ? hid : undefined })}</div>
      {hata || ipucu ? (
        <p id={hid} className={cx('mt-2 text-[15.5px]', hata ? 'font-normal text-metin' : 'text-soluk')} data-alan-hata={hata ? '' : undefined}>
          {hata ? <span aria-hidden="true">✕ </span> : null}
          {hata ?? ipucu}
        </p>
      ) : null}
    </div>
  )
}

/** Adet seçici: eksi / değer / artı, ≥46 px hedefler */
export function Adet({ value, onChange, min = 1, max = 6, label }: { value: number; onChange: (n: number) => void; min?: number; max?: number; label: string }) {
  return (
    <div className="inline-flex items-center gap-2" role="group" aria-label={label}>
      <button type="button" className="wbtn" data-boy="k" style={{ minWidth: 46, padding: 0 }} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`${label}: azalt`}>
        −
      </button>
      <output className="rakam min-w-9 text-center text-[22px]" aria-live="polite" data-adet={value}>
        {value}
      </output>
      <button type="button" className="wbtn" data-boy="k" style={{ minWidth: 46, padding: 0 }} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`${label}: artır`}>
        +
      </button>
    </div>
  )
}
