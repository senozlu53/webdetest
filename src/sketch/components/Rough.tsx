import { useId, useLayoutEffect, useMemo, useRef, useState, type ComponentPropsWithoutRef, type CSSProperties, type ElementType, type ReactNode, type Ref } from 'react'
import { cx } from '../../shared/cx'
import { KUSUR_CARPAN, useSketch } from '../lib/store'
import { cizgi as cizgiCiz, elips, karalamaYol, kutu, yol as yolCiz, yuvarlak, type Iz, type Secenek } from '../lib/rough'

/** Elemanın piksel ölçüsü: rough çizimi bu ölçüye göre üretilir */
export function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [s, set] = useState({ w: 0, h: 0 })
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const oku = () => {
      const r = el.getBoundingClientRect()
      const w = Math.round(el.offsetWidth || r.width)
      const h = Math.round(el.offsetHeight || r.height)
      set((p) => (p.w === w && p.h === h ? p : { w, h }))
    }
    oku()
    const ro = new ResizeObserver(oku)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, s] as const
}

export function Izler({ izler }: { izler: Iz[] }) {
  return (
    <>
      {izler.map((p, j) => (
        <path key={j} d={p.d} stroke={p.stroke} strokeWidth={p.sw} fill={p.fill} />
      ))}
    </>
  )
}

/** Madde 17: çizgi kalınlığı ekranla birlikte ölçeklenir; kusur ayarı çarpan olarak girer */
export function useCizgi() {
  const { olcek, kusur } = useSketch()
  return { k: olcek, kusurCarpan: KUSUR_CARPAN[kusur] }
}

export type RoughSekil = 'kutu' | 'elips' | 'yuvarlak'

/**
 * Madde 14: <RoughBox>. Elemanın kendi ölçüsünde rough.js ile titrek bir çerçeve (ve isteğe bağlı dolgu) çizer.
 * Çizim SVG'de, aria-hidden ve pointer-events yok: içerik olduğu gibi erişilebilir kalır.
 * kare={3}: aynı şeklin üç ayrı denemesi; üstüne gelince kare kare titrer (Madde 16).
 */
export function RoughBox<T extends ElementType = 'div'>({
  as,
  tohum = 1,
  sekil = 'kutu',
  r = 10,
  cizgi = 2,
  renk = 'var(--komur)',
  dolgu,
  dolguTip = 'hachure',
  aralik = 7,
  kusur = 1.2,
  egrilik,
  kare = 1,
  pad = 3,
  cokluCizgi,
  elRef,
  className,
  children,
  ...rest
}: {
  as?: T
  tohum?: number
  sekil?: RoughSekil
  r?: number
  cizgi?: number
  renk?: string
  dolgu?: string
  dolguTip?: Secenek['dolguTip']
  aralik?: number
  kusur?: number
  egrilik?: number
  kare?: 1 | 3
  pad?: number
  cokluCizgi?: boolean
  elRef?: Ref<HTMLElement>
  className?: string
  children?: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>) {
  const Tag = (as ?? 'div') as ElementType
  const [ref, { w, h }] = useSize<HTMLElement>()
  const { k, kusurCarpan } = useCizgi()
  const kareler = useMemo(() => {
    if (w < 8 || h < 8) return []
    const iw = w - pad * 2
    const ih = h - pad * 2
    return Array.from({ length: kare }, (_, i) => {
      const o: Secenek = { kusur: kusur * kusurCarpan, sw: cizgi * k, stroke: renk, fill: dolgu, dolguTip, aralik, tohum: tohum + i * 13, dolguKalinlik: 1.5 * k, cokluCizgi, egrilik }
      return sekil === 'elips' ? elips(iw, ih, o) : sekil === 'yuvarlak' ? yuvarlak(iw, ih, r, o) : kutu(iw, ih, o)
    })
  }, [w, h, pad, kare, kusur, egrilik, kusurCarpan, cizgi, k, renk, dolgu, dolguTip, aralik, tohum, sekil, r, cokluCizgi])
  return (
    <Tag
      ref={(el: HTMLElement | null) => {
        ;(ref as { current: HTMLElement | null }).current = el
        if (typeof elRef === 'function') elRef(el)
        else if (elRef) (elRef as { current: HTMLElement | null }).current = el
      }}
      className={cx('relative', className)}
      data-titre={kare > 1 ? '' : undefined}
      {...rest}
    >
      <svg className="rough-cizim" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
        {kareler.map((izler, i) => (
          <g key={i} className="kare" data-i={i} transform={`translate(${pad} ${pad})`}>
            <Izler izler={izler} />
          </g>
        ))}
      </svg>
      {children}
    </Tag>
  )
}

/** viewBox ile esneyen çizim: ikonlar ve süsler. Çizgi kalınlığı çizimle birlikte küçülür (Madde 17) */
export interface Parca {
  d: string
  dolgu?: string
  dolguTip?: Secenek['dolguTip']
  sw?: number
  renk?: string
  aralik?: number
  kusur?: number
}
export function Cizim({
  w,
  h,
  parcalar,
  tohum = 1,
  kusur = 1,
  sw = 3,
  renk = 'var(--komur)',
  kare = 1,
  className,
  style,
  etiket,
  titre,
  hep,
}: {
  w: number
  h: number
  parcalar: Parca[]
  tohum?: number
  kusur?: number
  sw?: number
  renk?: string
  kare?: 1 | 3
  className?: string
  style?: CSSProperties
  etiket?: string
  titre?: boolean
  hep?: boolean
}) {
  const { kusurCarpan } = useCizgi()
  const kareler = useMemo(
    () => Array.from({ length: kare }, (_, i) => parcalar.map((p, j) => yolCiz(p.d, { kusur: (p.kusur ?? kusur) * kusurCarpan, sw: p.sw ?? sw, stroke: p.renk ?? renk, fill: p.dolgu, dolguTip: p.dolguTip ?? 'hachure', aralik: p.aralik ?? 5, tohum: tohum + j * 3 + i * 17, dolguKalinlik: 1.4 }))),
    [parcalar, tohum, kusur, kusurCarpan, sw, renk, kare],
  )
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={cx('block overflow-visible fill-none [stroke-linecap:round] [stroke-linejoin:round]', hep && 'titre-hep', className)}
      style={style}
      role={etiket ? 'img' : undefined}
      aria-label={etiket}
      aria-hidden={etiket ? undefined : true}
      data-titre={titre ? '' : undefined}
    >
      {kareler.map((iz, i) => (
        <g key={i} className="kare" data-i={i}>
          {iz.map((z, j) => (
            <Izler key={j} izler={z} />
          ))}
        </g>
      ))}
    </svg>
  )
}

/** Yatay titrek çizgi (ayraç, başlık altı) */
export function CizgiAyrac({ tohum = 1, cizgi = 2, renk = 'var(--komur)', className, kusur = 1.4 }: { tohum?: number; cizgi?: number; renk?: string; className?: string; kusur?: number }) {
  const [ref, { w }] = useSize<HTMLDivElement>()
  const { k, kusurCarpan } = useCizgi()
  const izler = useMemo(() => (w > 8 ? cizgiCiz(2, 5, w - 2, 5, { kusur: kusur * kusurCarpan, egrilik: 2.4, sw: cizgi * k, stroke: renk, tohum }) : []), [w, cizgi, k, renk, tohum, kusur, kusurCarpan])
  return (
    <div className={cx('w-full', className)} aria-hidden="true">
      <div ref={ref} className="h-[10px] w-full">
        <svg width={w} height={10} className="block overflow-visible fill-none [stroke-linecap:round]">
          <Izler izler={izler} />
        </svg>
      </div>
    </div>
  )
}

/**
 * Karalama: tek parça zikzak, `ac` olunca çizilerek dolar (pathLength=1 + stroke-dashoffset, kare kare).
 * Onay kutusu, seçenek ve düğme vurgusunda kullanılır.
 */
export function Karala({
  w,
  h,
  ac,
  tohum = 1,
  renk = 'var(--murekkep)',
  sw = 3,
  aralik = 6,
  aci = -18,
  klip,
  x = 0,
  y = 0,
  opacity = 1,
  tasma = 2,
}: {
  w: number
  h: number
  ac: boolean
  tohum?: number
  renk?: string
  sw?: number
  aralik?: number
  aci?: number
  klip?: string
  x?: number
  y?: number
  opacity?: number
  tasma?: number
}) {
  const d = useMemo(() => karalamaYol(w, h, { aralik, tohum, aci }), [w, h, aralik, tohum, aci])
  const kid = useId()
  return (
    <g clipPath={klip ? `url(#${klip})` : `url(#${kid})`} transform={`translate(${x} ${y})`}>
      {/* Zikzak kutuyu birkaç piksel taşabilir (Madde 6) ama sınırsızca değil */}
      {klip ? null : (
        <clipPath id={kid}>
          <rect x={-tasma} y={-tasma} width={w + tasma * 2} height={h + tasma * 2} />
        </clipPath>
      )}
      <path d={d} className="karala" data-ac={ac ? '1' : '0'} pathLength={1} stroke={renk} strokeWidth={sw} opacity={opacity} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  )
}

/** useId'den kararlı bir tohum */
export function useTohum(taban = 0) {
  const id = useId()
  let h = taban
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 9973
  return h + 1
}
