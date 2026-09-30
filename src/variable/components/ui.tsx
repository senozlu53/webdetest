import { useId, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../shared/cx'
import { Degisken } from './Degisken'
import type { Aile } from '../lib/data'

/** Simge: yazı tipinin kendi glifi (↑ ↓ + − × • § ¶ # @ &). Hedef boyutu sabit, süs olduğu için ekran okuyucudan gizli */
export function Glif({ g, className, don }: { g: string; className?: string; don?: number }) {
  return (
    <span className={cx('glif', className)} aria-hidden="true" data-glif={g} style={don ? { transform: `rotate(${don}deg)` } : undefined}>
      {g}
    </span>
  )
}

type Ton = 'cizgi' | 'patlama' | 'yalin'
export function Buton({ ton = 'cizgi', glif, className, children, type = 'button', ...rest }: { ton?: Ton; glif?: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} data-ton={ton} className={cx('kbtn', className)} {...rest}>
      <span>{children}</span>
      {glif ? <Glif g={glif} /> : null}
    </button>
  )
}
export function Baglanti({ ton = 'cizgi', glif, className, children, ...rest }: { ton?: Ton; glif?: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a data-ton={ton} className={cx('kbtn', className)} {...rest}>
      <span>{children}</span>
      {glif ? <Glif g={glif} /> : null}
    </a>
  )
}

export function Secim<T extends string>({ legend, name, value, options, onChange, gizli }: { legend: string; name: string; value: T; options: { id: T; ad: ReactNode }[]; onChange: (v: T) => void; gizli?: boolean }) {
  return (
    <fieldset className="min-w-0 border-0 p-0">
      <legend className={cx('kicker mb-3', gizli && 'sr-only')}>{legend}</legend>
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
        <span className="etiket">{label}</span>
        <span className="rakam text-[15px]">{shown}</span>
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
      <button id={id} type="button" role="switch" aria-checked={checked} aria-describedby={hint ? hid : undefined} onClick={() => onChange(!checked)} className="anahtar">
        <span className="anahtar-iz" aria-hidden="true" />
      </button>
      <div className="min-w-0 pt-3">
        <label htmlFor={id} className="cursor-pointer text-[17px] font-semibold">
          {label} <span className="etiket ml-2 text-soluk">{checked ? 'AÇIK' : 'KAPALI'}</span>
        </label>
        {hint ? (
          <span id={hid} className="block text-[15px] text-soluk">
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
      <label htmlFor={id} className="etiket">
        {label}
      </label>
      <div className="mt-2">{children({ id, 'aria-invalid': hata ? true : undefined, 'aria-describedby': hata || ipucu ? hid : undefined })}</div>
      {hata || ipucu ? (
        <p id={hid} className={cx('mt-2 text-[15px]', hata ? 'font-semibold text-patlama-yazi' : 'text-soluk')} data-alan-hata={hata ? '' : undefined}>
          {hata ? <span className="etiket mr-2">Hata</span> : null}
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

export const KENAR = 'mx-auto w-full max-w-[calc(1440px+2*var(--kenar))] px-[var(--kenar)]'

/** Bölüm: küçük üst yazı, imleçle bükülen dev başlık ve dar giriş metni */
export function Bolum({
  id,
  no,
  toplam = 14,
  madde,
  baslik,
  vurgulu,
  aile = 'flex',
  lead,
  children,
  className,
  boy = 'clamp(38px, 9.4vw, 148px)',
}: {
  id: string
  no: string
  toplam?: number
  madde: ReactNode
  baslik: string
  vurgulu?: number[]
  aile?: Aile
  lead?: ReactNode
  children: ReactNode
  className?: string
  boy?: string
}) {
  const hid = useId()
  return (
    <section id={id} aria-labelledby={hid} className={cx('scroll-mt-[128px] py-[var(--bolum)]', className)} data-bolum={id}>
      <div className={KENAR}>
        <p className="kicker">
          <span className="rakam text-[15px] text-metin">
            {no} / {String(toplam).padStart(2, '0')}
          </span>{' '}
          <span aria-hidden="true">—</span> {madde}
        </p>
        <h2 id={hid} className="mt-6 m-0">
          <Degisken metin={baslik} aile={aile} vurgulu={vurgulu} boy={boy} ad="bolum-baslik" />
        </h2>
        {lead ? <p className="mt-10 max-w-[56ch] text-[clamp(18px,1.5vw,22px)] text-soluk">{lead}</p> : null}
      </div>
      <div className="mt-[calc(var(--bolum)*0.5)]">{children}</div>
    </section>
  )
}
