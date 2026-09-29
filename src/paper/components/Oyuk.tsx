import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cx } from '../../shared/cx'
import { daire, poli } from '../lib/simge'
import { Kesik } from './Kesik'

/** Oyuk alan iskeleti: etiket + oyuk + ipucu / hata. Hata metni koyu mürekkep, yanında kesik ikon (renk tek başına değil) */
function OyukKabuk({ id, etiket, ipucu, hata, children, className }: { id: string; etiket: string; ipucu?: ReactNode; hata?: string; children: ReactNode; className?: string }) {
  return (
    <div className={cx('min-w-0', className)}>
      <label htmlFor={id} className="mb-2 block font-extrabold">
        {etiket}
      </label>
      {children}
      {ipucu && !hata ? (
        <p id={`${id}-ipucu`} className="mt-2 text-[15px] text-soluk">
          {ipucu}
        </p>
      ) : null}
      {hata ? (
        <p id={`${id}-hata`} role="alert" className="mt-3 flex items-start gap-2 rounded-lg bg-mercan px-3 py-2 text-[16px] font-bold" data-oyuk-hata="">
          <Kesik ad="kapat" boyut={22} nivel={1} halo={false} renk="var(--krem)" className="mt-0.5" />
          <span className="min-w-0">{hata}</span>
        </p>
      ) : null}
    </div>
  )
}
const desc = (id: string, ipucu: unknown, hata?: string) => (hata ? `${id}-hata` : ipucu ? `${id}-ipucu` : undefined)

/** Madde 11 · 14: <CutoutInput>. Yüzeye oyulmuş alan */
export function CutoutInput({ etiket, ipucu, hata, className, ...rest }: { etiket: string; ipucu?: ReactNode; hata?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId()
  return (
    <OyukKabuk id={id} etiket={etiket} ipucu={ipucu} hata={hata} className={className}>
      <input id={id} className="oyuk" aria-invalid={hata ? true : undefined} aria-describedby={desc(id, ipucu, hata)} {...rest} />
    </OyukKabuk>
  )
}
export function CutoutTextarea({ etiket, ipucu, hata, className, ...rest }: { etiket: string; ipucu?: ReactNode; hata?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId()
  return (
    <OyukKabuk id={id} etiket={etiket} ipucu={ipucu} hata={hata} className={className}>
      <textarea id={id} className="oyuk" aria-invalid={hata ? true : undefined} aria-describedby={desc(id, ipucu, hata)} {...rest} />
    </OyukKabuk>
  )
}
export function CutoutSelect({ etiket, ipucu, hata, className, children, ...rest }: { etiket: string; ipucu?: ReactNode; hata?: string; children: ReactNode } & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId()
  return (
    <OyukKabuk id={id} etiket={etiket} ipucu={ipucu} hata={hata} className={className}>
      <div className="relative">
        <select id={id} className="oyuk cursor-pointer appearance-none pr-14" aria-invalid={hata ? true : undefined} aria-describedby={desc(id, ipucu, hata)} {...rest}>
          {children}
        </select>
        <Kesik ad="ok" boyut={26} nivel={1} halo={false} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 rotate-90" />
      </div>
    </OyukKabuk>
  )
}

const TIK = poli(
  [
    [6, 17],
    [9.5, 13.5],
    [13.5, 17.5],
    [22.5, 7.5],
    [26, 11],
    [13.5, 25],
  ],
  true,
)

/** Zımbayla delinmiş kusursuz daire: işaretlenince deliğe renkli bir kâğıt yuvarlak oturur (onay işareti kesik) */
function DelikSec({
  tip,
  checked,
  onChange,
  label,
  hint,
  name,
  value,
  disabled,
  renk = 'var(--turkuaz)',
  className,
}: {
  tip: 'checkbox' | 'radio'
  checked: boolean
  onChange: (v: boolean) => void
  label: ReactNode
  hint?: ReactNode
  name?: string
  value?: string
  disabled?: boolean
  renk?: string
  className?: string
}) {
  const hid = useId()
  return (
    <label className={cx('flex min-h-12 cursor-pointer items-start gap-3 py-1.5', disabled && 'cursor-not-allowed opacity-60', className)}>
      <span className="delik mt-0.5" style={{ ['--c' as string]: renk }}>
        <input type={tip} checked={checked} name={name} value={value} disabled={disabled} aria-describedby={hint ? hid : undefined} onChange={(e) => onChange(e.target.checked)} />
        <svg viewBox="0 0 32 32" aria-hidden="true">
          {tip === 'checkbox' ? <path d={daire(16, 16, 15) + TIK} fill={renk} fillRule="nonzero" /> : <path d={daire(16, 16, 11)} fill={renk} />}
        </svg>
      </span>
      <span className="min-w-0 pt-1">
        <span className="font-extrabold">{label}</span>
        {hint ? (
          <span id={hid} className="block text-[15px] font-medium text-soluk">
            {hint}
          </span>
        ) : null}
      </span>
    </label>
  )
}
export const DelikKutu = (p: { checked: boolean; onChange: (v: boolean) => void; label: ReactNode; hint?: ReactNode; name?: string; disabled?: boolean; renk?: string; className?: string }) => <DelikSec tip="checkbox" {...p} />
export const DelikSecenek = (p: { checked: boolean; onChange: (v: boolean) => void; label: ReactNode; hint?: ReactNode; name: string; value: string; disabled?: boolean; renk?: string; className?: string }) => <DelikSec tip="radio" {...p} />

/** Yuva anahtarı: oyuğun içinde kayan kâğıt tırnak. Durum yazıyla da verilir */
export function Yuva({ label, hint, checked, onChange }: { label: string; hint?: ReactNode; checked: boolean; onChange: (v: boolean) => void }) {
  const id = useId()
  const hid = useId()
  return (
    <div className="flex items-start gap-4">
      <button id={id} type="button" role="switch" aria-checked={checked} aria-describedby={hint ? hid : undefined} onClick={() => onChange(!checked)} className="yuva mt-0.5">
        <i aria-hidden="true" />
      </button>
      <div className="min-w-0">
        <label htmlFor={id} className="cursor-pointer font-extrabold">
          {label} <span className="ml-1 font-mono text-[13px] font-extrabold tracking-widest">{checked ? 'AÇIK' : 'KAPALI'}</span>
        </label>
        {hint ? (
          <span id={hid} className="block text-[15px] font-medium text-soluk">
            {hint}
          </span>
        ) : null}
      </div>
    </div>
  )
}

/** Yarık kaydırıcı */
export function Yarik({ label, value, min, max, step = 1, onChange, format, renk = 'var(--gokyuzu)' }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; format?: (v: number) => string; renk?: string }) {
  const id = useId()
  const shown = format ? format(value) : String(value)
  const p = ((value - min) / (max - min)) * 100
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 font-extrabold">
        <span>{label}</span>
        <span className="font-mono text-[15px] tabular-nums">{shown}</span>
      </label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} aria-valuetext={shown} className="yarik mt-1" style={{ ['--p' as string]: `${p}%`, ['--c' as string]: renk }} />
    </div>
  )
}

/** Kesik kâğıt çip radyo grubu */
export function Secim<T extends string>({ legend, name, value, options, onChange, gizli }: { legend: string; name: string; value: T; options: { id: T; ad: ReactNode; renk?: string }[]; onChange: (v: T) => void; gizli?: boolean }) {
  return (
    <fieldset className="min-w-0 border-0 p-0">
      <legend className={cx('etiket mb-2.5', gizli && 'sr-only')}>{legend}</legend>
      <div className="flex flex-wrap gap-3">
        {options.map((o) => {
          const on = value === o.id
          return (
            <label key={o.id} className="cip" data-on={on ? '' : undefined} style={{ ['--c' as string]: o.renk ?? 'var(--gunes)' }}>
              <input type="radio" className="sr-only" name={name} value={o.id} checked={on} onChange={() => onChange(o.id)} />
              {on ? <Kesik ad="onay" boyut={20} nivel={1} halo={false} renk="var(--murekkep)" /> : null}
              {o.ad}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
