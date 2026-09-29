import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref } from 'react'
import { cx } from '../../shared/cx'
import { Gorsel, type SahneAd } from './Gorsel'
import { Belir } from './ui'

type Varyant = 'cizgi' | 'dolu' | 'metin'
type Ortak = { varyant?: Varyant; boy?: 'k' | 'b'; ikon?: ReactNode; children?: ReactNode; className?: string }

/** Madde 14: <QuietButton>. İnce çerçeve, ağır olmayan hover: dolgu 0,7 saniyede yavaşça değişir */
export function QuietButton({ varyant = 'cizgi', boy, ikon, className, children, type = 'button', ref, ...rest }: Ortak & { ref?: Ref<HTMLButtonElement> } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button ref={ref} type={type} data-varyant={varyant} data-boy={boy} className={cx('qbtn', className)} {...rest}>
      {children}
      {ikon}
    </button>
  )
}
export function QuietLink({ varyant = 'cizgi', boy, ikon, className, children, ...rest }: Ortak & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a data-varyant={varyant} data-boy={boy} className={cx('qbtn', className)} {...rest}>
      {children}
      {ikon}
    </a>
  )
}

const SPAN: Record<number, string> = { 1: 'md:col-span-1', 2: 'md:col-span-2', 3: 'md:col-span-3', 4: 'md:col-span-4', 5: 'md:col-span-5', 6: 'md:col-span-6', 7: 'md:col-span-7', 8: 'md:col-span-8', 9: 'md:col-span-9', 10: 'md:col-span-10', 11: 'md:col-span-11', 12: 'md:col-span-12' }
const START: Record<number, string> = { 1: 'md:col-start-1', 2: 'md:col-start-2', 3: 'md:col-start-3', 4: 'md:col-start-4', 5: 'md:col-start-5', 6: 'md:col-start-6', 7: 'md:col-start-7', 8: 'md:col-start-8', 9: 'md:col-start-9' }

/** Madde 14 · 12: <EditorialGrid>. 12 kolonlu, sabit oranlı; kolonlar arası boşluk cömert */
export function EditorialGrid({ children, className, aralik = true }: { children: ReactNode; className?: string; aralik?: boolean }) {
  return (
    <div className={cx('grid grid-cols-1 gap-x-[var(--oluk)] md:grid-cols-12', aralik ? 'gap-y-[var(--aralik)]' : 'gap-y-8', className)} data-editorial-grid="">
      {children}
    </div>
  )
}
const LG_SPAN: Record<number, string> = { 3: 'lg:col-span-3', 4: 'lg:col-span-4', 5: 'lg:col-span-5', 6: 'lg:col-span-6', 7: 'lg:col-span-7', 8: 'lg:col-span-8', 12: 'lg:col-span-12' }

export function Kolon({ span = 12, lg, baslangic, className, children, belir = true }: { span?: number; lg?: number; baslangic?: number; className?: string; children: ReactNode; belir?: boolean }) {
  const c = cx('min-w-0', SPAN[span], lg ? LG_SPAN[lg] : '', baslangic ? START[baslangic] : '', className)
  return belir ? <Belir className={c}>{children}</Belir> : <div className={c}>{children}</div>
}

/** Madde 14 · 11: <FullBleedImage>. Kenardan kenara görsel; altyazı görselin altında, ince */
export function FullBleedImage({ sahne, oran = '21 / 9', altyazi, no, konum, className, tasma = false }: { sahne: SahneAd; oran?: string; altyazi?: ReactNode; no?: string; konum?: string; className?: string; tasma?: boolean }) {
  return (
    <figure className={cx('m-0 w-full', className)} data-fullbleed="" style={tasma ? { width: '100vw', marginLeft: 'calc(50% - 50vw)' } : undefined}>
      <div className="w-full overflow-hidden" style={{ aspectRatio: oran }}>
        <Gorsel sahne={sahne} konum={konum} />
      </div>
      {altyazi ? (
        <figcaption className="mx-auto flex max-w-[1320px] items-baseline justify-between gap-6 px-5 pt-4 sm:px-8 lg:px-12">
          <span className="text-[15px] text-soluk">{altyazi}</span>
          {no ? <span className="kicker shrink-0">{no}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  )
}
