import { useState, type ButtonHTMLAttributes, type ReactNode, type Ref } from 'react'
import { cx } from '../../shared/cx'
import { LottieIkon } from './LottieMascot'

export type BtnRenk = 'peach' | 'mint' | 'salmon' | 'rose' | 'paper'

/**
 * Madde 2 · 14 · 15: <KawaiiButton>. Hatmi gibi 3B: üstte parlak ışık, altta 6px kalınlık (rengin koyu tonu),
 * dışta aynı rengin bulanık gölgesi. Tamamen hap biçimli (Radius/Bubble). En az 48px yükseklik.
 * lottie verilirse içindeki gülen kalp / yıldız Lottie ile üstüne gelince, odakta ve basınca oynar.
 */
export function KawaiiButton({
  renk = 'peach',
  boy,
  ikon,
  lottie,
  className,
  children,
  type = 'button',
  ref,
  onPointerEnter,
  onFocus,
  onClick,
  ...rest
}: {
  renk?: BtnRenk
  boy?: 'k' | 'b'
  ikon?: ReactNode
  lottie?: 'kalp' | 'yildiz'
  children?: ReactNode
  ref?: Ref<HTMLButtonElement>
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const [tetik, setTetik] = useState(0)
  const oyna = () => lottie && setTetik((t) => t + 1)
  return (
    <button
      ref={ref}
      type={type}
      data-renk={renk === 'peach' ? undefined : renk}
      data-boy={boy}
      className={cx('kbtn', className)}
      onPointerEnter={(e) => {
        oyna()
        onPointerEnter?.(e)
      }}
      onFocus={(e) => {
        oyna()
        onFocus?.(e)
      }}
      onClick={(e) => {
        oyna()
        onClick?.(e)
      }}
      {...rest}
    >
      {lottie ? <LottieIkon tip={lottie} boyut={boy === 'b' ? 36 : boy === 'k' ? 26 : 30} tetik={tetik} /> : ikon}
      {children}
    </button>
  )
}
