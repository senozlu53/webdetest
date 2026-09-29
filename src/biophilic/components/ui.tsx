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

/** Bölüm: başlık, üst yazı ve giriş metni cam bir panelde; içerik hemen altında */
export function Section({ id, madde, title, lead, children, className, ikon = 'yaprak' }: { id: string; madde: ReactNode; title: ReactNode; lead?: ReactNode; children: ReactNode; className?: string; ikon?: SimgeAd }) {
  const hid = useId()
  return (
    <section id={id} aria-labelledby={hid} className={cx('mx-auto w-full max-w-[1240px] scroll-mt-20 px-5 sm:px-8 lg:px-12', className)} style={{ paddingBlock: 'var(--bolum)' }}>
      <Belir>
        <header className="cam max-w-[900px] p-7 sm:p-10" data-bolum-bas="">
          <p className="kicker flex items-center gap-3">
            <span className="cam-ic grid size-11 shrink-0 place-items-center !rounded-full text-vurgu" aria-hidden="true">
              <Ikon ad={ikon} boyut={24} />
            </span>
            <span>{madde}</span>
          </p>
          <h2 id={hid} className="baslik mt-5 text-[clamp(32px,4.6vw,56px)]">
            {title}
          </h2>
          {lead ? <p className="mt-5 max-w-[62ch] text-[clamp(17px,1.3vw,19px)] text-soluk">{lead}</p> : null}
        </header>
      </Belir>
      <div style={{ marginTop: 'var(--aralik)' }}>{children}</div>
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

/** Çip seçimi; seçili olan yaprak işaretli, dolu ve kalın (renk tek başına değil) */
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

export function Aralik({ label, value, min, max, step = 1, onChange, format, id: dis }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; format?: (v: number) => string; id?: string }) {
  const kimlik = useId()
  const id = dis ?? kimlik
  const shown = format ? format(value) : String(value)
  const p = ((value - min) / (max - min)) * 100
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="flex items-baseline justify-between gap-3">
        <span className="etiket">{label}</span>
        <span className="font-mono text-[14px] text-soluk tabular-nums">{shown}</span>
      </label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} aria-valuetext={shown} className="aralik" style={{ ['--p' as string]: `${p}%` } as CSSProperties} />
    </div>
  )
}

/** Tutamaklı anahtar. Durum yazıyla da verilir (AÇIK / KAPALI) */
export function Anahtar({ label, hint, checked, onChange }: { label: string; hint?: ReactNode; checked: boolean; onChange: (v: boolean) => void }) {
  const id = useId()
  const hid = useId()
  return (
    <div className="flex items-start gap-4">
      <button id={id} type="button" role="switch" aria-checked={checked} aria-describedby={hint ? hid : undefined} onClick={() => onChange(!checked)} className="anahtar">
        <i aria-hidden="true" />
      </button>
      <div className="min-w-0 pt-2.5">
        <label htmlFor={id} className="cursor-pointer text-[17px] font-medium">
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
      <div className="mt-1.5">{children({ id, 'aria-invalid': hata ? true : undefined, 'aria-describedby': hata || ipucu ? hid : undefined })}</div>
      {hata || ipucu ? (
        <p id={hid} className={cx('mt-1.5 text-[15.5px]', hata ? 'font-semibold text-metin' : 'text-soluk')} data-alan-hata={hata ? '' : undefined}>
          {hata ? <span aria-hidden="true">✕ </span> : null}
          {hata ?? ipucu}
        </p>
      ) : null}
    </div>
  )
}

/** Adet seçici: eksi / değer / artı, ≥46 px hedefler */
export function Adet({ value, onChange, min = 0, max = 20, label }: { value: number; onChange: (n: number) => void; min?: number; max?: number; label: string }) {
  return (
    <div className="inline-flex items-center gap-1" role="group" aria-label={label}>
      <button type="button" className="dugme" data-ton="cam" data-boy="k" style={{ minWidth: 46, padding: 0 }} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`${label}: azalt`}>
        <Ikon ad="eksi" boyut={18} />
      </button>
      <output className="rakam min-w-10 text-center text-[19px]" aria-live="polite" data-adet={value}>
        {value}
      </output>
      <button type="button" className="dugme" data-ton="cam" data-boy="k" style={{ minWidth: 46, padding: 0 }} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`${label}: artır`}>
        <Ikon ad="arti" boyut={18} />
      </button>
    </div>
  )
}
