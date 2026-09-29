import { useId, useMemo, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type Ref, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cx } from '../../shared/cx'
import { Ikon } from './Icons'
import { Izler, Karala, RoughBox, useCizgi, useTohum } from './Rough'
import { elips, kutu, yuvarlak } from '../lib/rough'

/**
 * Madde 2 · 14: <RoughButton>. Kurşun kalemle çizilmiş dikdörtgen; üç ayrı deneme, üstüne gelince kare kare titrer.
 * tur: cizgi (yalnız kontur), murekkep (mürekkep mavisi dolgu, krem yazı 11,46:1), kirmizi (koyu kırmızı dolgu, beyaz yazı 6,22:1).
 */
export type BtnTur = 'cizgi' | 'murekkep' | 'kirmizi'
export function RoughButton({ tur = 'cizgi', boy, ikon, tohum, className, children, type = 'button', ref, ...rest }: { tur?: BtnTur; boy?: 'k' | 'b'; ikon?: ReactNode; tohum?: number; children?: ReactNode; ref?: Ref<HTMLButtonElement> } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const t = useTohum(3)
  const dolgu = tur === 'murekkep' ? '#1d3557' : tur === 'kirmizi' ? '#c1121f' : undefined
  return (
    <RoughBox
      as="button"
      elRef={ref}
      type={type}
      sekil="yuvarlak"
      r={12}
      tohum={tohum ?? t}
      cizgi={2.2}
      renk={tur === 'kirmizi' ? '#c1121f' : tur === 'murekkep' ? '#1d3557' : 'var(--komur)'}
      dolgu={dolgu}
      dolguTip="solid"
      kare={3}
      data-tur={tur}
      data-boy={boy}
      className={cx('rbtn', className)}
      {...rest}
    >
      {ikon}
      {children}
    </RoughBox>
  )
}

/** Onay kutusu / seçenek ortak iskeleti: gerçek <input>, üstünde çizilen kutu ve karalama */
function KutuSec({ tip, checked, onChange, label, hint, name, value, disabled, className }: { tip: 'checkbox' | 'radio'; checked: boolean; onChange: (v: boolean) => void; label: ReactNode; hint?: ReactNode; name?: string; value?: string; disabled?: boolean; className?: string }) {
  const t = useTohum(tip === 'radio' ? 50 : 20)
  const { k, kusurCarpan } = useCizgi()
  const klip = useId()
  const hid = useId()
  const izler = useMemo(() => {
    const o = { kusur: 1.1 * kusurCarpan, sw: 2.2 * k, stroke: '#2b2b2b', tohum: t }
    return tip === 'radio' ? elips(28, 28, o) : kutu(28, 28, o)
  }, [tip, t, k, kusurCarpan])
  return (
    <label className={cx('group flex min-h-12 cursor-pointer items-start gap-3 py-1', disabled && 'cursor-not-allowed opacity-60', className)}>
      <span className="kutu-sec mt-0.5" data-titre="">
        <input type={tip} checked={checked} name={name} value={value} disabled={disabled} aria-describedby={hint ? hid : undefined} onChange={(e) => onChange(e.target.checked)} />
        <svg className="rough-cizim" viewBox="0 0 36 36" width="36" height="36" aria-hidden="true">
          {tip === 'radio' ? (
            <defs>
              <clipPath id={klip}>
                <ellipse cx="18" cy="18" rx="12" ry="11.5" />
              </clipPath>
            </defs>
          ) : null}
          <g className="kare" data-i={0} transform="translate(4 4)">
            <Izler izler={izler} />
          </g>
          <Karala w={24} h={24} x={6} y={6} ac={checked} tohum={t + 4} sw={3 * k} aralik={5} klip={tip === 'radio' ? klip : undefined} renk="var(--murekkep)" />
        </svg>
      </span>
      <span className="min-w-0 pt-1">
        <span className="font-bold">{label}</span>
        {hint ? (
          <span id={hid} className="block text-[15px] text-soluk">
            {hint}
          </span>
        ) : null}
      </span>
    </label>
  )
}

/** Madde 11: tıklanınca karalanarak dolan onay kutusu */
export const KaralamaKutu = (p: { checked: boolean; onChange: (v: boolean) => void; label: ReactNode; hint?: ReactNode; name?: string; disabled?: boolean; className?: string }) => <KutuSec tip="checkbox" {...p} />
export const KaralamaSecenek = (p: { checked: boolean; onChange: (v: boolean) => void; label: ReactNode; hint?: ReactNode; name: string; value: string; disabled?: boolean; className?: string }) => <KutuSec tip="radio" {...p} />

/** Anahtar: kalem çizgisi ray, tutamak (içi karalanınca açık). Durum yazıyla da verilir */
export function Anahtar({ label, hint, checked, onChange }: { label: string; hint?: ReactNode; checked: boolean; onChange: (v: boolean) => void }) {
  const id = useId()
  const hid = useId()
  const t = useTohum(70)
  const { k, kusurCarpan } = useCizgi()
  const ray = useMemo(() => yuvarlak(68, 30, 15, { kusur: 1 * kusurCarpan, sw: 2.2 * k, stroke: '#2b2b2b', tohum: t }), [t, k, kusurCarpan])
  const tutamak = useMemo(() => elips(26, 26, { kusur: 1 * kusurCarpan, sw: 2.2 * k, stroke: '#2b2b2b', tohum: t + 2 }), [t, k, kusurCarpan])
  const klip = useId()
  return (
    <div className="flex items-start gap-4">
      <button id={id} type="button" role="switch" aria-checked={checked} aria-describedby={hint ? hid : undefined} onClick={() => onChange(!checked)} className="anahtar mt-0.5" data-titre="">
        <svg className="rough-cizim" viewBox="0 0 76 48" width="76" height="48" aria-hidden="true">
          <defs>
            <clipPath id={klip}>
              <ellipse cx="13" cy="13" rx="12" ry="12" />
            </clipPath>
          </defs>
          <g className="kare" data-i={0} transform="translate(4 9)">
            <Izler izler={ray} />
          </g>
          <g style={{ transform: `translate(${checked ? 36 : 8}px, 11px)`, transition: 'transform 260ms steps(5, end)' }}>
            <g className="kare" data-i={0}>
              <Izler izler={tutamak} />
            </g>
            <g transform="translate(0 0)">
              <Karala w={22} h={22} x={2} y={2} ac={checked} tohum={t + 9} sw={2.6 * k} aralik={4.5} klip={klip} renk="var(--murekkep)" />
            </g>
          </g>
        </svg>
      </button>
      <div className="min-w-0">
        <label htmlFor={id} className="cursor-pointer font-bold">
          {label} <span className="ml-1 font-daktilo text-[14px] tracking-widest text-murekkep">{checked ? 'AÇIK' : 'KAPALI'}</span>
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

/** Kalem çizgisi kaydırıcı */
export function Aralik({ label, value, min, max, step = 1, onChange, format }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; format?: (v: number) => string }) {
  const id = useId()
  const shown = format ? format(value) : String(value)
  const p = ((value - min) / (max - min)) * 100
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 font-bold">
        <span>{label}</span>
        <span className="font-daktilo text-[15px] tabular-nums text-murekkep">{shown}</span>
      </label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} aria-valuetext={shown} className="kalem-aralik mt-1" style={{ ['--p' as string]: `${p}%` }} />
    </div>
  )
}

/** Titrek çerçeveli form alanı iskeleti: etiket, ipucu ve hata metni alana bağlanır */
function AlanKabuk({ id, etiket, ipucu, hata, tohum, children, className }: { id: string; etiket: string; ipucu?: ReactNode; hata?: string; tohum: number; children: ReactNode; className?: string }) {
  return (
    <div className={cx('min-w-0', className)}>
      <label htmlFor={id} className="mb-1.5 block font-bold">
        {etiket}
      </label>
      <RoughBox as="span" className="alan" tohum={tohum} sekil="yuvarlak" r={8} cizgi={hata ? 2.8 : 2.2} renk={hata ? '#e63946' : 'var(--komur)'} kare={3} pad={3}>
        {children}
      </RoughBox>
      {ipucu && !hata ? (
        <p id={`${id}-ipucu`} className="mt-1.5 text-[15px] text-soluk">
          {ipucu}
        </p>
      ) : null}
      {hata ? (
        <p id={`${id}-hata`} role="alert" className="mt-2 flex items-start gap-2 font-not text-[20px] leading-tight text-kirmiziK">
          <Ikon ad="kalem" boyut={24} className="mt-0.5" />
          <span className="min-w-0">{hata}</span>
        </p>
      ) : null}
    </div>
  )
}
const desc = (id: string, ipucu: unknown, hata?: string) => (hata ? `${id}-hata` : ipucu ? `${id}-ipucu` : undefined)

export function MetinAlani({ etiket, ipucu, hata, className, ...rest }: { etiket: string; ipucu?: ReactNode; hata?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId()
  const t = useTohum(90)
  return (
    <AlanKabuk id={id} etiket={etiket} ipucu={ipucu} hata={hata} tohum={t} className={className}>
      <input id={id} className="alan-girdi" aria-invalid={hata ? true : undefined} aria-describedby={desc(id, ipucu, hata)} {...rest} />
    </AlanKabuk>
  )
}
export function CokSatir({ etiket, ipucu, hata, className, ...rest }: { etiket: string; ipucu?: ReactNode; hata?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId()
  const t = useTohum(110)
  return (
    <AlanKabuk id={id} etiket={etiket} ipucu={ipucu} hata={hata} tohum={t} className={className}>
      <textarea id={id} className="alan-girdi" aria-invalid={hata ? true : undefined} aria-describedby={desc(id, ipucu, hata)} {...rest} />
    </AlanKabuk>
  )
}
export function Acilir({ etiket, ipucu, hata, className, children, ...rest }: { etiket: string; ipucu?: ReactNode; hata?: string; children: ReactNode } & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId()
  const t = useTohum(130)
  return (
    <AlanKabuk id={id} etiket={etiket} ipucu={ipucu} hata={hata} tohum={t} className={className}>
      <select id={id} className="alan-girdi cursor-pointer" aria-invalid={hata ? true : undefined} aria-describedby={desc(id, ipucu, hata)} {...rest}>
        {children}
      </select>
    </AlanKabuk>
  )
}

/** Çip radyo grubu (Madde 15 yarıçapı). Seçili çip mürekkep dolgu + onay işareti: renk tek başına değil */
export function Secim<T extends string>({ legend, name, value, options, onChange, gizli }: { legend: string; name: string; value: T; options: { id: T; ad: ReactNode }[]; onChange: (v: T) => void; gizli?: boolean }) {
  return (
    <fieldset className="min-w-0 border-0 p-0">
      <legend className={cx('kicker mb-2', gizli && 'sr-only')}>{legend}</legend>
      <div className="flex flex-wrap gap-2.5">
        {options.map((o) => {
          const on = value === o.id
          return (
            <label key={o.id} className="cip" data-on={on ? '' : undefined}>
              <input type="radio" className="sr-only" name={name} value={o.id} checked={on} onChange={() => onChange(o.id)} />
              {on ? <Ikon ad="onay" boyut={18} sw={5} renk="#f9f6f0" kare={1} /> : null}
              {o.ad}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
