import { useId, type CSSProperties, type ReactNode } from 'react'
import { cx } from '../../shared/cx'
import { useGorunur } from './hooks'
import { Ikon } from './Ikon'
import { SadePanel } from './Nouveau'

/** Görününce büyüyerek beliren sarmalayıcı (Madde 16). Hareket kapalıyken doğrudan görünür */
export function Belir({ children, className, gecikme = 0, sure, as: Tag = 'div' }: { children: ReactNode; className?: string; gecikme?: number; sure?: number; as?: 'div' | 'li' | 'section' | 'p' }) {
  const [ref, g] = useGorunur<HTMLElement>(0.08)
  const T = Tag as 'div'
  return (
    <T
      ref={ref as never}
      className={cx('belir', className)}
      data-goruldu={g ? '' : undefined}
      style={
        {
          ['--belir-gecikme' as string]: `${gecikme}ms`,
          ...(sure ? { ['--belir-sure' as string]: `${sure}ms` } : {}),
        } as CSSProperties
      }
    >
      {children}
    </T>
  )
}

/** Dalgalı ayraç: düz çizgi yok (Madde 6). Renk ve kalınlık maske ile tema değişkenlerinden gelir */
export function DalgaHat({ className, kisa = false }: { className?: string; kisa?: boolean }) {
  return <div className={cx('dalga-hat', kisa && 'dalga-hat-kisa', className)} role="presentation" aria-hidden="true" />
}

/** Bölüm: asimetrik başlık alanı; ana metin her zaman düz bir panelin içinde (Madde 18) */
export function Section({
  id,
  madde,
  title,
  lead,
  children,
  className,
  ikon = 'yaprak',
}: {
  id: string
  madde: ReactNode
  title: ReactNode
  lead?: ReactNode
  children: ReactNode
  className?: string
  ikon?: 'yaprak' | 'sarmasik' | 'zambak' | 'gul' | 'nilufer' | 'dal' | 'tomurcuk' | 'girdap' | 'kavis' | 'egrelti'
}) {
  const hid = useId()
  return (
    <section id={id} aria-labelledby={hid} className={cx('mx-auto w-full max-w-[1240px] scroll-mt-16 px-5 sm:px-8 lg:px-12', className)} style={{ paddingBlock: 'var(--bolum)' }}>
      <Belir>
        <div className="grid grid-cols-1 gap-x-10 gap-y-7 md:grid-cols-12">
          <div className="md:col-span-4 lg:col-span-3">
            <p className="kicker flex items-center gap-2.5">
              <Ikon ad={ikon} boyut={26} className="text-zeytin" />
              <span>{madde}</span>
            </p>
            <DalgaHat kisa className="mt-3" />
          </div>
          <div className="md:col-span-8 lg:col-span-9">
            <h2 id={hid} className="baslik text-[clamp(32px,5vw,64px)]">
              {title}
            </h2>
            {lead ? (
              <SadePanel className="mt-7 max-w-[64ch]" ic="sm:p-8">
                <p className="text-[clamp(17px,1.35vw,19px)]">{lead}</p>
              </SadePanel>
            ) : null}
          </div>
        </div>
      </Belir>
      <div style={{ marginTop: 'calc(var(--aralik) * 1.1)' }}>{children}</div>
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

/** Yalnız metinle seçim: seçili olan yaprak işaretli, kalın ve altı dalgalı (renk tek başına değil) */
export function Secim<T extends string>({ legend, name, value, options, onChange, gizli }: { legend: string; name: string; value: T; options: { id: T; ad: ReactNode }[]; onChange: (v: T) => void; gizli?: boolean }) {
  return (
    <fieldset className="min-w-0 border-0 p-0">
      <legend className={cx('kicker mb-2', gizli && 'sr-only')}>{legend}</legend>
      <div className="flex flex-wrap gap-x-5 gap-y-1">
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

/** Yaprak tutamaklı anahtar. Durum yazıyla da verilir (AÇIK / KAPALI) */
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

/** Onay kutusu: yumuşak kare, işaretlenince içinde yaprak */
export function Onay({ id, label, checked, onChange, hata, describedBy }: { id: string; label: ReactNode; checked: boolean; onChange: (v: boolean) => void; hata?: boolean; describedBy?: string }) {
  return (
    <label htmlFor={id} className="flex min-h-12 cursor-pointer items-start gap-4">
      <input id={id} type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-invalid={hata ? true : undefined} aria-describedby={describedBy} />
      <span className={cx('mt-1 grid size-7 shrink-0 place-items-center rounded-[12px_4px_12px_4px] border bg-panel peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-[var(--focus)]', hata ? 'border-2 border-gul' : 'border-toprak')} aria-hidden="true">
        {checked ? <Ikon ad="ok" boyut={18} className="text-zeytin" kalin={2.2} /> : null}
      </span>
      <span className="text-[17px] leading-[1.55]">{label}</span>
    </label>
  )
}
