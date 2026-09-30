import { useId, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../shared/cx'
import type { IkonAd } from '../lib/data'
import { Ikon } from './Ikon'

type Ton = 'tas' | 'altin' | 'kan' | 'yalin'

export function Buton({ ton = 'tas', ikon, className, children, type = 'button', ...rest }: { ton?: Ton; ikon?: IkonAd } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} data-ton={ton} className={cx('dugme', className)} {...rest}>
      {ikon ? <Ikon ad={ikon} boy={22} /> : null}
      <span>{children}</span>
    </button>
  )
}
export function Baglanti({ ton = 'tas', ikon, className, children, ...rest }: { ton?: Ton; ikon?: IkonAd } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a data-ton={ton} className={cx('dugme', className)} {...rest}>
      {ikon ? <Ikon ad={ikon} boy={22} /> : null}
      <span>{children}</span>
    </a>
  )
}

export function Secim<T extends string>({ legend, name, value, options, onChange, gizli }: { legend: string; name: string; value: T; options: { id: T; ad: ReactNode }[]; onChange: (v: T) => void; gizli?: boolean }) {
  return (
    <fieldset className="min-w-0 border-0 p-0">
      <legend className={cx('t-etiket t-soluk mb-3', gizli && 'sr-only')}>{legend}</legend>
      <div className="flex flex-wrap gap-2">
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
        <span className="t-etiket">{label}</span>
        <span className="rakam text-[0.9375rem]">{shown}</span>
      </label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} aria-valuetext={shown} className="aralik" />
    </div>
  )
}

export function Anahtar({ label, hint, checked, onChange }: { label: string; hint?: ReactNode; checked: boolean; onChange: (v: boolean) => void }) {
  const id = useId()
  const hid = useId()
  return (
    <div className="flex items-start gap-4">
      <button id={id} type="button" role="switch" aria-checked={checked} aria-describedby={hint ? hid : undefined} onClick={() => onChange(!checked)} className="anahtar" data-sessiz="">
        <span className="anahtar-iz" aria-hidden="true" />
      </button>
      <div className="min-w-0 pt-3">
        <label htmlFor={id} className="cursor-pointer text-[1.0625rem] font-semibold">
          {label} <span className="t-etiket t-soluk ml-2">{checked ? 'Açık' : 'Kapalı'}</span>
        </label>
        {hint ? (
          <span id={hid} className="t-alt block">
            {hint}
          </span>
        ) : null}
      </div>
    </div>
  )
}

export function Alan({ label, hata, ipucu, children }: { label: string; hata?: string; ipucu?: string; children: (p: { id: string; 'aria-invalid'?: true; 'aria-describedby'?: string }) => ReactNode }) {
  const id = useId()
  const hid = `${id}-h`
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="t-etiket">
        {label}
      </label>
      <div className="mt-2">{children({ id, 'aria-invalid': hata ? true : undefined, 'aria-describedby': hata || ipucu ? hid : undefined })}</div>
      {hata || ipucu ? (
        <p id={hid} className={cx('mt-2 text-[1rem]', hata ? 'font-semibold' : 't-soluk')} data-alan-hata={hata ? '' : undefined}>
          {hata ? <span className="t-etiket mr-2 border border-current px-1.5 py-0.5">Hata</span> : null}
          {hata ?? ipucu}
        </p>
      ) : null}
    </div>
  )
}

export function Kod({ children, label, dar = false, className }: { children: string; label: string; dar?: boolean; className?: string }) {
  return (
    <pre className={cx('kod', dar && 'kod-dar', className)} tabIndex={0} aria-label={label}>
      <code>{children}</code>
    </pre>
  )
}

export const KAP = 'mx-auto w-full max-w-[1240px] px-[var(--kenar)]'

/** Sıralama oku: yazı tipinde ▲ ▼ ↕ glifi bulunmadığı için çizim */
export function SiraOku({ yon }: { yon: 'yok' | 'artan' | 'azalan' }) {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" focusable="false" fill="currentColor">
      {yon !== 'azalan' ? <path d={yon === 'yok' ? 'M6 0.5 L9.5 5 H2.5 Z' : 'M6 2 L10.500 8.500 H1.500 Z'} /> : null}
      {yon !== 'artan' ? <path d={yon === 'yok' ? 'M6 11.500 L2.500 7 H9.500 Z' : 'M6 10 L1.500 3.500 H10.500 Z'} /> : null}
    </svg>
  )
}

/** Geçti ya da kaldı işareti: ✓ ✕ glifleri yazı tipinde olmadığı için çizim */
export function Isaret({ gecti }: { gecti: boolean }) {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 inline-block align-[-1px]">
      <path d={gecti ? 'M2 6.500 L5 9.500 L10.500 3' : 'M2.500 2.500 L9.500 9.500 M9.500 2.500 L2.500 9.500'} />
    </svg>
  )
}
