import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../shared/cx'
import { ChainBorder } from './ChainBorder'

export type YuzeyAd = 'demir' | 'tas' | 'deri' | 'kadife' | 'duz'
export type ZincirTur = 'yok' | 'cerceve' | 'asili'

/** Sivri kemer profili (üretilmiş doku dosyasındaki çokgenle aynı eğri). Yükseklik --k ile ölçeklenir. */
export const KEMER_YOL =
  'M0 100 L0.6 86.98 L1.5 79.48 L3 71.1 L5 62.92 L7.5 54.93 L11 46.01 L15 37.75 L20 29.29 L25 22.27 L31 15.26 L37 9.44 L43 4.6 L47 1.84 L50 0 L53 1.84 L57 4.6 L63 9.44 L69 15.26 L75 22.27 L80 29.29 L85 37.75 L89 46.01 L92.5 54.93 L95 62.92 L97 71.1 L98.5 79.48 L99.4 86.98 L100 100'

/**
 * <GothicCard>: sivri kemer başlıklı gotik kart (Madde 6 · 7 · 8 · 14).
 * Yüzey dokusu (paslı demir, taş, yırtık deri, kadife), derin iç gölge, arkadan sızan kırmızı ışık, perçinler ve isteğe bağlı zincir.
 * Dar ekranda kemer, zincir ve doku düşer; `--kan` kenarlıklı düz koyu panel kalır.
 */
export function GothicCard({
  kemer = 'sivri',
  yuzey = 'demir',
  zincir = 'yok',
  sizinti = true,
  sallan = false,
  yirtik = false,
  kemerH,
  uzun = false,
  as: Tag = 'div',
  className,
  sarmal,
  style,
  children,
  ...rest
}: {
  kemer?: 'sivri' | 'duz'
  yuzey?: YuzeyAd
  zincir?: ZincirTur
  sizinti?: boolean
  sallan?: boolean
  yirtik?: boolean
  /** kemer yüksekliği (px) */
  kemerH?: number
  uzun?: boolean
  as?: ElementType
  className?: string
  sarmal?: string
  style?: CSSProperties
  children: ReactNode
} & Omit<HTMLAttributes<HTMLElement>, 'children' | 'style'>) {
  const sivri = kemer === 'sivri'
  const kart = (
    <Tag className={cx('gk', className)} data-kemer={kemer} data-yuzey={yuzey} data-yirtik={yirtik ? '' : undefined} {...rest}>
      <span className="gk-dekor" aria-hidden="true">
        {sivri ? (
          <svg className="gk-kemer-cizgi" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
            <path d={KEMER_YOL} />
          </svg>
        ) : null}
      </span>
      <div className="gk-ic">{children}</div>
    </Tag>
  )
  const kSt: CSSProperties = {
    ...(kemerH !== undefined ? { ['--kemer-h' as string]: `${kemerH}px` } : {}),
    ...style,
  }
  return (
    <div className={cx('gk-w', sarmal)} data-sizinti={sizinti ? undefined : 'yok'} data-zincir={zincir} data-kemer={kemer} data-sallan={sallan && zincir === 'asili' ? '' : undefined} style={kSt}>
      {zincir === 'yok' ? (
        kart
      ) : (
        <ChainBorder mod={zincir} uzun={uzun} kemer={sivri}>
          {kart}
        </ChainBorder>
      )}
    </div>
  )
}
