import type { ReactNode } from 'react'
import { cx } from '../../shared/cx'

export type ZincirMod = 'cerceve' | 'asili'

/**
 * <ChainBorder>: paslı zincir çerçeve (Madde 6 · 11 · 14).
 * `cerceve`: dört kenarda zincir şeridi ve köşe levhaları. `asili`: kartı iki zincirle tavana asar; `uzun` ekranın üstünden iner (modal).
 * Dar ekranda ya da "düz" süs tercihinde zincirler kalkar, çocuk düz panel olarak kalır.
 */
export function ChainBorder({ mod = 'cerceve', uzun = false, kemer = false, className, children }: { mod?: ZincirMod; uzun?: boolean; kemer?: boolean; className?: string; children: ReactNode }) {
  return (
    <div className={cx('zc', className)} data-mod={mod} data-kemer={kemer ? 'sivri' : 'duz'}>
      {mod === 'asili' ? (
        <>
          <span className={cx('zc-asili', uzun && 'zc-uzun')} data-yon="sol" aria-hidden="true" />
          <span className={cx('zc-asili', uzun && 'zc-uzun')} data-yon="sag" aria-hidden="true" />
          <span className={cx('zc-halka', uzun && 'zc-halka-uzun')} data-yon="sol" aria-hidden="true" />
          <span className={cx('zc-halka', uzun && 'zc-halka-uzun')} data-yon="sag" aria-hidden="true" />
        </>
      ) : (
        <>
          {kemer ? null : <span className="zc-serit zc-yatay zc-ust" aria-hidden="true" />}
          <span className="zc-serit zc-yatay zc-alt" aria-hidden="true" />
          <span className="zc-serit zc-dikey zc-sol" aria-hidden="true" />
          <span className="zc-serit zc-dikey zc-sag" aria-hidden="true" />
          <span className="zc-kose" data-y="ust" data-x="sol" aria-hidden="true" />
          <span className="zc-kose" data-y="ust" data-x="sag" aria-hidden="true" />
          <span className="zc-kose" data-y="alt" data-x="sol" aria-hidden="true" />
          <span className="zc-kose" data-y="alt" data-x="sag" aria-hidden="true" />
        </>
      )}
      <div className="zc-govde">{children}</div>
    </div>
  )
}
