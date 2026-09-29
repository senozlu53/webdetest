import { useMemo, type ButtonHTMLAttributes, type CSSProperties, type ReactNode, type Ref } from 'react'
import { cx } from '../../shared/cx'
import { firca } from '../lib/firca'
import type { Pigment } from '../lib/simge'
import { PIGMENT, useGorunur, useSize } from './Leke'

/** Tek fırça darbesi (SVG). Uçta seyrelen kıllar, kenarda birikmiş pigment */
export function FircaDarbe({
  w,
  h,
  tohum = 1,
  renk = 'ultramarin',
  op = 0.7,
  kalin = 0.62,
  kuru = 0.5,
  egim = 5,
  kuruFiltre = false,
  className,
  style,
}: {
  w: number
  h: number
  tohum?: number
  renk?: Pigment
  op?: number
  kalin?: number
  kuru?: number
  egim?: number
  kuruFiltre?: boolean
  className?: string
  style?: CSSProperties
}) {
  const { yol, teller } = useMemo(() => firca(Math.max(w, 10), Math.max(h, 10), tohum, { kalin, kuru, egim }), [w, h, tohum, kalin, kuru, egim])
  return (
    <svg width={w} height={h} viewBox={`0 0 ${Math.max(w, 10)} ${Math.max(h, 10)}`} className={cx('block overflow-visible', className)} style={style} aria-hidden="true">
      <g filter={`url(#${kuruFiltre ? 'wc-firca-kuru' : 'wc-firca'})`} opacity={op}>
        <path d={yol} fill={PIGMENT[renk]} />
        {teller.map((d, i) => (
          <path key={i} d={d} stroke={PIGMENT[renk]} strokeWidth={1.6} strokeLinecap="round" fill="none" />
        ))}
      </g>
    </svg>
  )
}

/** Bir öğenin arkasını (taşarak) fırçayla boyar, ölçüyü izler. Madde 7: gölge yerine altına daha koyu ton eklenir */
export function FircaArka({ renk = 'ultramarin', tohum = 1, op = 0.62, alt = true, kalin = 0.9, tasma = [10, 8] as [number, number], kuru = 0.5, className }: { renk?: Pigment; tohum?: number; op?: number; alt?: boolean; kalin?: number; tasma?: [number, number]; kuru?: number; className?: string }) {
  const [ref, { w, h }] = useSize<HTMLSpanElement>()
  const [gRef, gorunur] = useGorunur<HTMLSpanElement>(0.05)
  return (
    <span
      ref={(el) => {
        ;(ref as { current: HTMLSpanElement | null }).current = el
        ;(gRef as { current: HTMLSpanElement | null }).current = el
      }}
      className={cx('pointer-events-none absolute z-[-1]', className)}
      style={{ inset: `-${tasma[1]}px -${tasma[0]}px` }}
      aria-hidden="true"
      data-firca-arka=""
    >
      {w > 20 && gorunur ? (
        <>
          {alt ? <FircaDarbe w={w} h={h} tohum={tohum + 7} renk="murekkep" op={op * 0.32} kalin={kalin} kuru={kuru} className="alt-firca absolute top-[3px] left-[3px]" /> : null}
          <FircaDarbe w={w} h={h} tohum={tohum} renk={renk} op={op} kalin={kalin} kuru={kuru} className="leke absolute inset-0" style={{ opacity: `calc(${op} * var(--su))`, mixBlendMode: 'var(--blend)' as CSSProperties['mixBlendMode'] }} />
        </>
      ) : null}
    </span>
  )
}

/** Madde 11 · 14: <WashButton>. Arkasında suluboya lekesi olan düğme; üstüne gelince leke hafifçe yayılır */
export function WashButton({ renk = 'ultramarin', boy, ikon, tohum, className, children, type = 'button', ref, ...rest }: { renk?: Pigment; boy?: 'k' | 'b'; ikon?: ReactNode; tohum?: number; children?: ReactNode; ref?: Ref<HTMLButtonElement> } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const t = tohum ?? (typeof children === 'string' ? children.length * 5 + 3 : 11)
  const [r, { w, h }] = useSize<HTMLSpanElement>()
  return (
    <button ref={ref} type={type} data-boy={boy} className={cx('wbtn', className)} {...rest}>
      <span ref={r} className="wbtn-leke" aria-hidden="true">
        {w > 20 ? <FircaDarbe w={w} h={h} tohum={t} renk={renk} op={0.62} kalin={0.86} kuru={0.4} className="size-full" style={{ opacity: 'var(--su)' }} /> : null}
      </span>
      {ikon}
      {children}
    </button>
  )
}

/** Başlık altı fırça çizgisi (dekoratif, metne binmez: kendi satırında) */
export function FircaCizgi({ renk = 'gul', tohum = 3, w: sabitW, h = 22, className, op = 0.7 }: { renk?: Pigment; tohum?: number; w?: number; h?: number; className?: string; op?: number }) {
  const [ref, { w }] = useSize<HTMLDivElement>()
  const W = sabitW ?? w
  return (
    <div ref={ref} className={cx('w-full', className)} style={{ height: h }} aria-hidden="true" data-leke-ok="">
      {W > 20 ? <FircaDarbe w={W} h={h} tohum={tohum} renk={renk} op={op} kalin={0.55} kuru={0.9} className="leke" kuruFiltre style={{ mixBlendMode: 'var(--blend)' as CSSProperties['mixBlendMode'], opacity: 'var(--su)' }} /> : null}
    </div>
  )
}
