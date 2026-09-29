import { useLayoutEffect, useMemo, useRef, useState, type ButtonHTMLAttributes, type ComponentPropsWithoutRef, type CSSProperties, type ElementType, type ReactNode, type Ref } from 'react'
import { cx } from '../../shared/cx'
import { dagYol, dalgaYol, kutuYol, type Delik } from '../lib/kesik'

/** Elemanın piksel ölçüsü: kesim yolu bu ölçüde üretilir */
export function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [s, set] = useState({ w: 0, h: 0 })
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const oku = () => {
      const w = Math.round(el.offsetWidth)
      const h = Math.round(el.offsetHeight)
      set((p) => (p.w === w && p.h === h ? p : { w, h }))
    }
    oku()
    const ro = new ResizeObserver(oku)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, s] as const
}

export type Sekil = 'kutu' | 'dalga' | 'dag'
export interface DelikOran {
  x: number // 0…1 (genişliğe oran)
  y: number // 0…1 (yüksekliğe oran)
  r: number // px
}
export interface KesikOpt {
  sekil?: Sekil
  r?: number
  dalga?: number
  adim?: number
  taban?: number
  genlik?: number
  n?: number
  delikler?: DelikOran[]
}

/** Madde 6 · 12: ölçüye göre makas izi. Geri dönen değer clip-path: path(evenodd, …) dizgesidir */
export function useKesik(tohum: number, o: KesikOpt = {}) {
  const [ref, { w, h }] = useSize<HTMLDivElement>()
  const { sekil = 'kutu', r, dalga, adim, taban, genlik, n, delikler } = o
  const dk = JSON.stringify(delikler ?? [])
  const clip = useMemo(() => {
    if (w < 24 || h < 24) return undefined
    const dl: Delik[] = (JSON.parse(dk) as DelikOran[]).map((d) => ({ x: d.x * w, y: d.y * h, r: d.r }))
    const d = sekil === 'dalga' ? dalgaYol(w, h, tohum, { taban, genlik, n, delikler: dl }) : sekil === 'dag' ? dagYol(w, h, tohum, { taban, genlik, n }) : kutuYol(w, h, tohum, { r, dalga, adim, delikler: dl })
    return `path(evenodd, "${d}")`
  }, [w, h, tohum, sekil, r, dalga, adim, taban, genlik, n, dk])
  return { ref, clip, w, h }
}

/**
 * Madde 14: <PaperCard>. Dış kap gölge (drop-shadow) taşır, iç yüz makas izli şekildir.
 * Gölge kesim şeklini izler; delikli katmanda deliğin içine düşen gölge, doğal bir iç gölge verir.
 * nivel 1…5 = Shadow/PaperLayer1…5, z = z-index (katman sırası).
 */
export function PaperCard<T extends ElementType = 'div'>({
  as,
  renk = 'var(--krem)',
  nivel = 2,
  z,
  tohum = 1,
  duz,
  sekil,
  r,
  dalga,
  adim,
  taban,
  genlik,
  n,
  delikler,
  className,
  yuzClass,
  style,
  yuzStyle,
  elRef,
  children,
  ...rest
}: {
  as?: T
  elRef?: Ref<HTMLElement>
  renk?: string
  nivel?: 1 | 2 | 3 | 4 | 5
  z?: number
  tohum?: number
  duz?: boolean
  className?: string
  yuzClass?: string
  style?: CSSProperties
  yuzStyle?: CSSProperties
  children?: ReactNode
} & KesikOpt &
  Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children' | 'style'>) {
  const Tag = (as ?? 'div') as ElementType
  const { ref, clip } = useKesik(tohum, { sekil, r, dalga, adim, taban, genlik, n, delikler })
  return (
    <Tag ref={elRef} className={cx('kagit', className)} style={{ ['--gol' as string]: `var(--sh-${nivel})`, zIndex: z, ...style }} data-nivel={nivel} {...rest}>
      <div ref={ref} className={cx('kagit-yuz h-full', yuzClass)} data-duz={duz ? '' : undefined} style={{ ['--c' as string]: renk, clipPath: clip, ...yuzStyle }}>
        {children}
      </div>
    </Tag>
  )
}

/**
 * Paralaks katmanı: kendi kesim yüzü, kendi gölgesi ve `--dp` ilerlemesine bağlı genliği (ax, ay px) vardır.
 * ust: katmanın üst kenarı (%); yukarıdan genlik kadar taşar ki kayarken boşluk açılmasın.
 */
export function Katman({
  z,
  nivel = 2,
  renk,
  sekil = 'dalga',
  tohum = 1,
  ust = 0,
  ax = 0,
  ay = 0,
  tasma = 0,
  taban = 0.25,
  genlik = 0.12,
  n = 6,
  delikler,
  children,
  className,
}: {
  z: number
  tasma?: number
  nivel?: 1 | 2 | 3 | 4 | 5
  renk: string
  sekil?: Sekil
  tohum?: number
  ust?: number
  ax?: number
  ay?: number
  taban?: number
  genlik?: number
  n?: number
  delikler?: DelikOran[]
  children?: ReactNode
  className?: string
}) {
  return (
    <div className={cx('paralaks', className)} style={{ top: `calc(${ust}% - ${ay > 0 ? ay : 0}px)`, bottom: ay < 0 ? ay : 0, left: -tasma, right: -tasma, zIndex: z, ['--ax' as string]: ax, ['--ay' as string]: ay } as CSSProperties} data-katman="">
      <PaperCard nivel={nivel} renk={renk} sekil={sekil} tohum={tohum} taban={taban} genlik={genlik} n={n} delikler={delikler} className="absolute inset-0" />
      {children}
    </div>
  )
}

/** <PaperButton>: kâğıt parça; üstüne gelince kalkar (gölge büyür), basınca yüzeye iner */
export function PaperButton({ renk = 'var(--gunes)', boy, ikon, tohum, className, children, type = 'button', ref, ...rest }: { renk?: string; boy?: 'k' | 'b' | 'i'; ikon?: ReactNode; tohum?: number; children?: ReactNode; ref?: Ref<HTMLButtonElement> } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const t = tohum ?? (typeof children === 'string' ? children.length * 3 + 5 : 9)
  const { ref: yr, clip } = useKesik(t, { r: 11, dalga: 1.2, adim: 70 })
  return (
    <button ref={ref} type={type} data-boy={boy} className={cx('pbtn', className)} {...rest}>
      <span ref={yr as never} className="kagit-yuz" data-duz="" style={{ ['--c' as string]: renk, clipPath: clip }}>
        {ikon}
        {children}
      </span>
    </button>
  )
}
