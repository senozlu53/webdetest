import { useId, useRef, useState, type ButtonHTMLAttributes, type KeyboardEvent, type ReactNode } from 'react'
import { cx } from '../../shared/cx'
import { Pixel } from './Pixel'
import type { IkonAd } from '../lib/pixel'

/** Klasik düğme: 2px kabartma, basınca çöker. Varsayılan düğmenin fazladan koyu çerçevesi var */
export function Button({ varsayilan, ikon, className, children, type = 'button', ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { varsayilan?: boolean; ikon?: IkonAd }) {
  return (
    <button type={type} className={cx('btn', varsayilan && 'varsayilan', className)} {...rest}>
      {ikon ? <Pixel ad={ikon} /> : null}
      {children}
    </button>
  )
}

export function GroupBox({ legend, children, className }: { legend: ReactNode; children: ReactNode; className?: string }) {
  return (
    <fieldset className={cx('groove m-0 min-w-0 px-3 pt-1 pb-3', className)}>
      <legend className="px-1">{legend}</legend>
      {children}
    </fieldset>
  )
}

export function Check({ label, checked, onChange, id: idProp }: { label: ReactNode; checked: boolean; onChange: (v: boolean) => void; id?: string }) {
  const auto = useId()
  const id = idProp ?? auto
  return (
    <span className="inline-flex items-center gap-1.5">
      <input id={id} type="checkbox" className="c95" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <label htmlFor={id}>{label}</label>
    </span>
  )
}

export function Radios<T extends string>({ legend, name, value, options, onChange, yatay }: { legend: ReactNode; name: string; value: T; options: { id: T; ad: ReactNode }[]; onChange: (v: T) => void; yatay?: boolean }) {
  return (
    <GroupBox legend={legend}>
      <div className={cx('flex gap-x-4 gap-y-1.5', yatay ? 'flex-wrap' : 'flex-col')}>
        {options.map((o) => (
          <label key={o.id} className="inline-flex items-center gap-1.5">
            <input type="radio" className="r95" name={name} value={o.id} checked={value === o.id} onChange={() => onChange(o.id)} />
            {o.ad}
          </label>
        ))}
      </div>
    </GroupBox>
  )
}

export function Select<T extends string>({ label, value, options, onChange, id: idProp, className }: { label: ReactNode; value: T; options: { id: T; ad: string }[]; onChange: (v: T) => void; id?: string; className?: string }) {
  const auto = useId()
  const id = idProp ?? auto
  return (
    <span className={cx('inline-flex flex-wrap items-center gap-2', className)}>
      <label htmlFor={id}>{label}</label>
      <select id={id} className="s95 min-w-0" value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.ad}
          </option>
        ))}
      </select>
    </span>
  )
}

/** İlerleme çubuğu: kesikli bloklar dolar; ara değer yok, geçiş yok (Madde 16) */
export function Progress({ deger, etiket, bloklar = 20 }: { deger: number; etiket: string; bloklar?: number }) {
  const dolu = Math.round((deger / 100) * bloklar)
  return (
    <div className="field flex h-5 items-stretch gap-0.5 p-0.5" role="progressbar" aria-label={etiket} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(deger)} data-bloklar={dolu}>
      {Array.from({ length: bloklar }, (_, i) => (
        <span key={i} className={cx('flex-1', i < dolu ? 'bg-sel' : '')} />
      ))}
    </div>
  )
}

export interface Sekme {
  id: string
  ad: string
  icerik: ReactNode
}

/** Madde 11: klasik sekmeler. Seçili sekme 2px yükselir ve panele kaynaşır; ok tuşlarıyla gezilir */
export function Tabs({ sekmeler, etiket, secili, onSec }: { sekmeler: Sekme[]; etiket: string; secili?: string; onSec?: (id: string) => void }) {
  const [ic, setIc] = useState(sekmeler[0].id)
  const aktif = secili ?? ic
  const sec = (id: string) => (onSec ? onSec(id) : setIc(id))
  const uid = useId()
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const tus = (e: KeyboardEvent, i: number) => {
    const n = sekmeler.length
    const k = e.key === 'ArrowRight' ? (i + 1) % n : e.key === 'ArrowLeft' ? (i - 1 + n) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1
    if (k < 0) return
    e.preventDefault()
    sec(sekmeler[k].id)
    refs.current[k]?.focus()
  }
  return (
    <div>
      <div role="tablist" aria-label={etiket} className="relative z-10 flex flex-wrap items-end pl-0.5">
        {sekmeler.map((s, i) => {
          const on = s.id === aktif
          return (
            <button
              key={s.id}
              ref={(el) => {
                refs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`${uid}-t-${s.id}`}
              aria-selected={on}
              aria-controls={`${uid}-p-${s.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => sec(s.id)}
              onKeyDown={(e) => tus(e, i)}
              className={cx(
                'relative border-2 border-b-0 border-t-[var(--hi)] border-r-[var(--sh)] border-l-[var(--hi)] bg-face px-3 text-face-text focus-visible:outline-offset-[-0.3125rem]',
                on ? '-mx-0.5 -mb-0.5 pt-1 pb-1.5' : 'mt-0.5 py-0.5',
              )}
            >
              {s.ad}
            </button>
          )
        })}
      </div>
      {sekmeler.map((s) =>
        s.id === aktif ? (
          <div key={s.id} role="tabpanel" id={`${uid}-p-${s.id}`} aria-labelledby={`${uid}-t-${s.id}`} tabIndex={0} className="outset p-3 focus-visible:outline-offset-[-0.375rem]">
            {s.icerik}
          </div>
        ) : null,
      )}
    </div>
  )
}

/** Durum çubuğu: çukur paneller */
export function StatusBar({ parcalar }: { parcalar: ReactNode[] }) {
  return (
    <div className="mt-0.5 flex gap-0.5 text-[0.8125rem]">
      {parcalar.map((p, i) => (
        <span key={i} className={cx('panel truncate px-1.5 py-0.5', i === 0 ? 'min-w-0 flex-1' : 'shrink-0')}>
          {p}
        </span>
      ))}
    </div>
  )
}

/** Kod: beyaz çukur alan, yatay kayar */
export function Code({ children, etiket }: { children: string; etiket: string }) {
  return (
    <pre className="field k95 m-0 overflow-x-auto p-2 font-mono text-[0.8125rem] leading-snug" tabIndex={0} aria-label={etiket}>
      <code>{children}</code>
    </pre>
  )
}
