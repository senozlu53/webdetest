import type { ElementType, HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../shared/cx'
import type { IkonAd } from '../lib/data'
import { Ikon } from './Ikon'

/** Madde 6 · 12: dört köşeye mutlak konumla sabitlenen filigree süsü. Süs olduğu için ekran okuyucudan gizli; sadeleşince kapanır. */
function Kose() {
  return (
    <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true" focusable="false">
      <path d="M2 47 V12 Q2 2 12 2 H47" fill="none" stroke="url(#g-altin)" strokeWidth="3" strokeLinecap="round" />
      <path d="M8 47 V15 Q8 8 15 8 H47" fill="none" stroke="#8f7220" strokeWidth="1.4" />
      <path d="M14 14 C25 14 28 25 20 26.5 C13.500 27.500 12 20 17 19" fill="none" stroke="url(#g-altin)" strokeWidth="2" strokeLinecap="round" />
      <path d="M2 2 H13 L2 13 Z" fill="url(#g-altin)" stroke="#17110a" strokeWidth="1" strokeLinejoin="round" />
      <circle cx="7.500" cy="7.500" r="3.200" fill="url(#g-kan)" stroke="#17110a" strokeWidth="1" />
      <path d="M32 2 L36 6 L32 10 L28 6 Z M2 32 L6 36 L2 40 L-2 36 Z" fill="url(#g-altin)" stroke="#17110a" strokeWidth="0.8" strokeLinejoin="round" />
    </svg>
  )
}
export function Koseler() {
  return (
    <>
      {(['us', 'ud', 'as', 'ad'] as const).map((k) => (
        <span key={k} className="suslu-kose" data-kose={k} aria-hidden="true">
          <Kose />
        </span>
      ))}
    </>
  )
}

export type Yuzey = 'tas' | 'parsomen' | 'deri' | 'metal' | 'ahsap'

/** Madde 8 · 14: doku, iç gölge ve süsleme taşıyan panel. Metin renkleri yüzeye göre değişir (taşta açık, parşömende koyu). */
export function Panel({ yuzey = 'tas', suslu = true, className, children, as: Tag = 'div', ...rest }: { yuzey?: Yuzey; suslu?: boolean; className?: string; children: ReactNode; as?: ElementType } & HTMLAttributes<HTMLElement>) {
  const T = Tag as 'div'
  return (
    <T className={cx('panel', className)} data-yuzey={yuzey} data-suslu={suslu ? '' : undefined} {...rest}>
      {suslu ? <Koseler /> : null}
      {children}
    </T>
  )
}

/** Madde 6: dairesel madalyon */
export function Madalyon({ ikon, boy = 96, className, etiket }: { ikon: IkonAd; boy?: number; className?: string; etiket?: string }) {
  return (
    <span className={cx('madalyon', className)} style={{ width: boy, height: boy }} data-madalyon="" role={etiket ? 'img' : undefined} aria-label={etiket} aria-hidden={etiket ? undefined : 'true'}>
      <span className="madalyon-ic">
        <Ikon ad={ikon} boy={Math.round(boy * 0.6)} />
      </span>
    </span>
  )
}

/** Madde 6: kalkan formu (altın kenar, taş iç) */
export function KalkanSekil({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx('kalkan-sekil', className)} data-kalkan="">
      <div className="kalkan-ic">{children}</div>
    </div>
  )
}

export function Ayrac({ className }: { className?: string }) {
  return <div className={cx('ayrac', className)} aria-hidden="true" data-ayrac="" />
}
export type { ReactNode }
