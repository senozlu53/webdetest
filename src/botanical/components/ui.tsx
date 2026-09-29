import { useId, type CSSProperties, type ReactNode } from 'react'
import { cx } from '../../shared/cx'
import { useGorunur } from './hooks'
import { Ikon } from './Ikon'
import type { SimgeAd } from '../lib/simge'

/** Görününce çok yavaş beliren sarmalayıcı (Madde 16). Hareket kapalıyken doğrudan görünür */
export function Belir({ children, className, gecikme = 0, sure, as: Tag = 'div' }: { children: ReactNode; className?: string; gecikme?: number; sure?: number; as?: 'div' | 'li' | 'section' | 'p' | 'article' }) {
  const [ref, g] = useGorunur<HTMLElement>(0.08)
  const T = Tag as 'div'
  return (
    <T ref={ref as never} className={cx('belir', className)} data-goruldu={g ? '' : undefined} style={{ ['--belir-gecikme' as string]: `${gecikme}ms`, ...(sure ? { ['--belir-sure' as string]: `${sure}ms` } : {}) } as CSSProperties}>
      {children}
    </T>
  )
}

/** Bölüm: cömert boşluk, rozetli üst yazı, büyük Playfair başlık ve dar ana metin */
export function Section({ id, madde, title, lead, children, className, ikon = 'yaprak' }: { id: string; madde: ReactNode; title: ReactNode; lead?: ReactNode; children: ReactNode; className?: string; ikon?: SimgeAd }) {
  const hid = useId()
  return (
    <section id={id} aria-labelledby={hid} className={cx('mx-auto w-full max-w-[1240px] scroll-mt-16 px-5 sm:px-8 lg:px-12', className)} style={{ paddingBlock: 'var(--bolum)' }}>
      <Belir>
        <div className="grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-12">
          <p className="kicker flex items-center gap-3 md:col-span-4 lg:col-span-3">
            <span className="grid size-11 shrink-0 place-items-center bg-zeytin text-[#f8f4ea]" style={{ borderRadius: 'var(--r-tas)' }} aria-hidden="true">
              <Ikon ad={ikon} boyut={24} />
            </span>
            <span>{madde}</span>
          </p>
          <div className="min-w-0 md:col-span-8 lg:col-span-9">
            <h2 id={hid} className="baslik text-[clamp(32px,5vw,62px)]">
              {title}
            </h2>
            {lead ? <p className="mt-6 max-w-[62ch] text-[clamp(17px,1.35vw,19.5px)] text-soluk">{lead}</p> : null}
          </div>
        </div>
      </Belir>
      <div style={{ marginTop: 'calc(var(--aralik) * 1.05)' }}>{children}</div>
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

/** Taş biçimli çiplerle seçim; seçili olan yaprak işaretli, dolu ve kalın (renk tek başına değil) */
export function Secim<T extends string>({ legend, name, value, options, onChange, gizli }: { legend: string; name: string; value: T; options: { id: T; ad: ReactNode }[]; onChange: (v: T) => void; gizli?: boolean }) {
  return (
    <fieldset className="min-w-0 border-0 p-0">
      <legend className={cx('kicker mb-2.5', gizli && 'sr-only')}>{legend}</legend>
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

export function Aralik({ label, value, min, max, step = 1, onChange, format }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; format?: (v: number) => string }) {
  const id = useId()
  const shown = format ? format(value) : String(value)
  const p = ((value - min) / (max - min)) * 100
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="flex items-baseline justify-between gap-3">
        <span className="etiket">{label}</span>
        <span className="font-mono text-[14px] tabular-nums text-soluk">{shown}</span>
      </label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} aria-valuetext={shown} className="aralik" style={{ ['--p' as string]: `${p}%` } as CSSProperties} />
    </div>
  )
}

/** Taş tutamaklı anahtar. Durum yazıyla da verilir (AÇIK / KAPALI) */
export function Anahtar({ label, hint, checked, onChange }: { label: string; hint?: ReactNode; checked: boolean; onChange: (v: boolean) => void }) {
  const id = useId()
  const hid = useId()
  return (
    <div className="flex items-start gap-4">
      <button id={id} type="button" role="switch" aria-checked={checked} aria-describedby={hint ? hid : undefined} onClick={() => onChange(!checked)} className="anahtar">
        <i aria-hidden="true" />
      </button>
      <div className="min-w-0 pt-2.5">
        <label htmlFor={id} className="cursor-pointer text-[17.5px] font-semibold">
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

/** Onay kutusu: yumuşak kare, işaretlenince içinde yaprak */
export function Onay({ id, label, checked, onChange, hata, describedBy }: { id: string; label: ReactNode; checked: boolean; onChange: (v: boolean) => void; hata?: boolean; describedBy?: string }) {
  return (
    <label htmlFor={id} className="flex min-h-12 cursor-pointer items-start gap-4">
      <input id={id} type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-invalid={hata ? true : undefined} aria-describedby={describedBy} />
      <span
        className={cx('mt-1 grid size-7 shrink-0 place-items-center bg-yuzey2 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-[var(--focus)]', hata ? 'border-2 border-kil-yazi' : 'border-[1.5px] border-kontrol')}
        style={{ borderRadius: '0.9rem 0.4rem 0.9rem 0.4rem' }}
        aria-hidden="true"
      >
        {checked ? <Ikon ad="tik" boyut={18} className="text-zeytin-yazi" kalin={2.4} /> : null}
      </span>
      <span className="text-[17px] leading-[1.55]">{label}</span>
    </label>
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
      <div className="mt-1.5">{children({ id, 'aria-invalid': hata ? true : undefined, 'aria-describedby': hata || ipucu ? hid : undefined })}</div>
      {hata || ipucu ? (
        <p id={hid} className={cx('mt-1.5 text-[15.5px]', hata ? 'font-bold text-kil-yazi' : 'text-soluk')} data-alan-hata={hata ? '' : undefined}>
          {hata ? <span aria-hidden="true">✕ </span> : null}
          {hata ?? ipucu}
        </p>
      ) : null}
    </div>
  )
}

/** Adet seçici: eksi / değer / artı, ≥44 px hedefler */
export function Adet({ value, onChange, min = 0, max = 20, label }: { value: number; onChange: (n: number) => void; min?: number; max?: number; label: string }) {
  return (
    <div className="inline-flex items-center gap-1" role="group" aria-label={label}>
      <button type="button" className="ebtn" data-ton="hayalet" data-boy="k" style={{ minWidth: 46, minHeight: 46, borderRadius: '1.1rem 0.7rem 1.2rem 0.8rem' }} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`${label}: azalt`}>
        <span className="ebtn-ic !px-3" aria-hidden="true">
          −
        </span>
      </button>
      <output className="rakam min-w-9 text-center text-[19px]" aria-live="polite" data-adet={value}>
        {value}
      </output>
      <button type="button" className="ebtn" data-ton="hayalet" data-boy="k" style={{ minWidth: 46, minHeight: 46, borderRadius: '0.8rem 1.2rem 0.7rem 1.1rem' }} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`${label}: artır`}>
        <span className="ebtn-ic !px-3" aria-hidden="true">
          +
        </span>
      </button>
    </div>
  )
}
