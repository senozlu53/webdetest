import { useMemo, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type CSSProperties, type HTMLAttributes, type ReactNode, type Ref } from 'react'
import { cx } from '../../shared/cx'
import { bolucuCizgi, elCerceve, enso as ensoUret } from '../lib/cizim'
import type { Sir, SeramikTur } from '../lib/seramik'
import { useWabi, type Yon } from '../lib/store'
import { useGorunur, useSize } from './hooks'
import { Seramik } from './Seramik'
import { Belir } from './Belir'

/* ───────────────────────── <WabiContainer> ve <Yer> (Madde 11 · 12 · 14 · 17) ───────────────────────── */

/**
 * 12 kolonlu, bilerek dengesiz bir kap. Çocukları <Yer> ile kolonlara asimetrik yerleştirilir;
 * `yon="sag"` bütün yerleşimi aynalar (sağa yaslı). Dar kapta (< 720 px) yatay asimetri dikeye çevrilir.
 */
export function WabiContainer({ children, className, yon, ...rest }: { children: ReactNode; className?: string; yon?: Yon } & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'children'>) {
  return (
    <div className={cx('wabi-kap', className)} data-yon={yon} data-wabi-kap="" {...rest}>
      {children}
    </div>
  )
}

/** Izgarada b. kolondan başlayan, s kolon genişliğinde bir yer. `ind`: dar kapta girinti (%), `ust`: üst boşluk (rem) */
export function Yer({
  b = 2,
  s = 6,
  ind = 0,
  ust = 0,
  children,
  className,
  style,
  as: Tag = 'div',
  ...rest
}: { b?: number; s?: number; ind?: number; ust?: number; children?: ReactNode; className?: string; style?: CSSProperties; as?: 'div' | 'li' | 'article' | 'section' | 'figure' } & Omit<HTMLAttributes<HTMLElement>, 'className' | 'children' | 'style'>) {
  const T = Tag as 'div'
  return (
    <T className={cx('asim', className)} style={{ ['--b' as string]: b, ['--s' as string]: s, ['--ind' as string]: ind, ['--ust' as string]: ust, ...style } as CSSProperties} {...rest}>
      {children}
    </T>
  )
}

/* ───────────────────────── düğme ───────────────────────── */

type Ton = 'cizgi' | 'mat' | 'metin'
type Ortak = { ton?: Ton; boy?: 'k'; ikon?: ReactNode; children?: ReactNode; className?: string }

export function WabiButton({ ton = 'cizgi', boy, ikon, className, children, type = 'button', ref, ...rest }: Ortak & { ref?: Ref<HTMLButtonElement> } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button ref={ref} type={type} data-ton={ton} data-boy={boy} className={cx('wbtn', className)} {...rest}>
      {children}
      {ikon}
    </button>
  )
}
export function WabiLink({ ton = 'cizgi', boy, ikon, className, children, ...rest }: Ortak & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a data-ton={ton} data-boy={boy} className={cx('wbtn', className)} {...rest}>
      {children}
      {ikon}
    </a>
  )
}

/* ───────────────────────── elle çizilmiş bölücü ve fırça çemberi ───────────────────────── */

/** Düz olmayan ince ayraç. Görününce çok yavaş çizilir; hareket kapalıyken baştan görünür */
export function Bolucu({ tohum = 3, className }: { tohum?: number; className?: string }) {
  const { k } = useWabi()
  const [ref, g] = useGorunur<SVGSVGElement>(0.3)
  const d = useMemo(() => bolucuCizgi(tohum, k), [tohum, k])
  return (
    <svg ref={ref} viewBox="0 0 1000 8" preserveAspectRatio="none" className={cx('h-2 w-full', className)} aria-hidden="true" role="presentation" data-bolucu="">
      <path d={d} pathLength={1} className="cizgi-yol cizil" data-goruldu={g ? '' : undefined} />
    </svg>
  )
}

/** Fırça çemberi (ensō): kalın başlar, incelir, uçları birleşmez */
export function Enso({ boyut = 120, tohum = 5, kalin = 9, className }: { boyut?: number; tohum?: number; kalin?: number; className?: string }) {
  const { k } = useWabi()
  const d = useMemo(() => ensoUret(52, tohum, kalin, k), [tohum, kalin, k])
  return (
    <svg viewBox="-70 -70 140 140" width={boyut} height={boyut} className={cx('shrink-0', className)} aria-hidden="true" role="presentation" data-enso="">
      <path d={d} className="enso-yol" />
    </svg>
  )
}

/* ───────────────────────── <ImperfectCard> (Madde 6 · 11 · 14) ───────────────────────── */

/**
 * Elle çizilmiş gibi kusurlu çerçeveli kart. Gölge yok; çerçeve çok yavaş çizilir, üzerine gelince koyulaşır.
 * İç boşluk bilerek dengesizdir (solu sağdan geniş). `mat`: mat siyah dolgulu ters kart.
 */
export function ImperfectCard({
  tohum = 1,
  kaydir = 0,
  mat = false,
  dolgu = true,
  className,
  children,
  as: Tag = 'article',
  ...rest
}: { tohum?: number; kaydir?: number; mat?: boolean; dolgu?: boolean; className?: string; children?: ReactNode; as?: 'article' | 'div' | 'li' | 'section' } & Omit<HTMLAttributes<HTMLElement>, 'className' | 'children'>) {
  const { k } = useWabi()
  const [ref, { w, h }] = useSize<HTMLElement>()
  const [gref, g] = useGorunur<SVGPathElement>(0.1)
  const d = useMemo(() => (w > 24 && h > 24 ? elCerceve(w, h, tohum, k, 11) : ''), [w, h, tohum, k])
  const T = Tag as 'article'
  return (
    <T ref={ref as never} className={cx('icard', className)} data-imperfect-card="" data-mat={mat ? '' : undefined} style={{ ['--kaydir' as string]: kaydir, ...rest.style } as CSSProperties} {...rest}>
      {d ? (
        <svg className="icard-cerceve" viewBox={`0 0 ${w} ${h}`} aria-hidden="true" focusable="false">
          {dolgu ? <path d={d} data-dolgu="" /> : null}
          <path ref={gref} d={d} pathLength={1} className="cizil" data-goruldu={g ? '' : undefined} data-cerceve={d.length} />
        </svg>
      ) : null}
      {children}
    </T>
  )
}

/* ───────────────────────── <ZenHero> (Madde 11 · 14) ───────────────────────── */

/**
 * Tek odak noktalı hero: ekranda yalnız bir nesne, bir başlık ve geniş bir boşluk.
 * Nesne ızgaranın bir yanına ve alt kısmına yerleşir; derinliği konumundan gelir, gölgesi yoktur.
 */
export function ZenHero({
  odak = 'vazo',
  sir = 'yaprak',
  dal = true,
  tohum = 7,
  no,
  etiket,
  baslik,
  children,
  boy = 380,
  minH,
  yon,
  className,
}: {
  odak?: SeramikTur
  sir?: Sir
  dal?: boolean
  tohum?: number
  no?: string
  etiket: string
  baslik: ReactNode
  children?: ReactNode
  boy?: number
  minH?: string
  yon?: Yon
  className?: string
}) {
  const dalVar = dal && (odak === 'vazo' || odak === 'testi')
  return (
    <div className={cx('relative', className)} data-zen-hero="" style={{ minHeight: minH ?? 'min(86vh, 880px)' }}>
      <WabiContainer yon={yon} className="h-full items-end" style={{ minHeight: minH ?? 'min(86vh, 880px)', paddingBlock: 'clamp(48px, 8vw, 96px) 0' }}>
        <Yer b={1} s={6} ind={0} ust={0} className="self-end pb-[clamp(24px,6vw,72px)]">
          {children}
        </Yer>
        <Yer b={8} s={4} ind={16} ust={5} className="self-end" data-odak="">
          <figure className="m-0 flex flex-col items-start pb-[clamp(16px,3vw,32px)]">
            <Belir sure={3600}>
              <Seramik tur={odak} sir={sir} tohum={tohum} boy={boy} dal={dalVar} etiket={etiket} />
            </Belir>
            <figcaption className="nesne-etiket mt-6 max-w-[26ch]">
              {no ? <span className="rakam not-italic">No. {no}</span> : null} {no ? '·' : ''} {baslik}
            </figcaption>
          </figure>
        </Yer>
      </WabiContainer>
    </div>
  )
}
