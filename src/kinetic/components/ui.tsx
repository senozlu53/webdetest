import { useId, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../shared/cx'
import { Dev } from './Harfler'
import { Kayma } from './Kayma'

/* ───────── yazı biçimli düğme (Madde 9): ikon yok, etiket vurguda aşağı yuvarlanır ───────── */
type Ton = 'cizgi' | 'vurgu' | 'yalin'
function Etiket({ children }: { children: ReactNode }) {
  return (
    <span className="kbtn-y">
      <span className="kbtn-a">{children}</span>
      <span className="kbtn-b" aria-hidden="true">
        {children}
      </span>
    </span>
  )
}
export function Buton({ ton = 'cizgi', className, children, type = 'button', ...rest }: { ton?: Ton } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} data-ton={ton} className={cx('kbtn', className)} {...rest}>
      <Etiket>{children}</Etiket>
    </button>
  )
}
export function Baglanti({ ton = 'cizgi', className, children, ...rest }: { ton?: Ton } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a data-ton={ton} className={cx('kbtn', className)} {...rest}>
      <Etiket>{children}</Etiket>
    </a>
  )
}

/* ───────── seçim çipi grubu ───────── */
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

/** Anahtar: durum kelimeyle de yazılır (AÇIK / KAPALI), renk tek başına anlam taşımaz */
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
        <p id={hid} className={cx('mt-2 text-[15px]', hata ? 'font-semibold text-vurgu-yazi' : 'text-soluk')} data-alan-hata={hata ? '' : undefined}>
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

/** Bölüm: küçük üst yazı, kaydırma hızıyla eğilen dev başlık ve dar giriş metni */
export function Bolum({ id, no, toplam = 14, madde, baslik, vurgulu, lead, children, className }: { id: string; no: string; toplam?: number; madde: ReactNode; baslik: string; vurgulu?: number[]; lead?: ReactNode; children: ReactNode; className?: string }) {
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
        <Kayma className="mt-6" egim={8} esnet={1.04}>
          <h2 id={hid} className="m-0">
            <Dev metin={baslik} vurgulu={vurgulu} efekt={['imlec']} boy="clamp(38px, 9.4vw, 152px)" ad="bolum-baslik" />
          </h2>
        </Kayma>
        {lead ? <p className="mt-10 max-w-[56ch] text-[clamp(18px,1.5vw,22px)] text-soluk">{lead}</p> : null}
      </div>
      <div className="mt-[calc(var(--bolum)*0.55)]">{children}</div>
    </section>
  )
}
