import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../shared/cx'
import type { Tone } from '../lib/store'

export type Boyut = 'sm' | 'md' | 'lg'

const BOYUT: Record<Boyut, string> = {
  sm: 'min-h-10 px-4 text-[11px] gap-1.5',
  md: 'min-h-12 px-6 text-[12.5px] gap-2',
  lg: 'min-h-14 px-8 text-[14px] gap-2.5',
}
const YUVARLAK: Record<Boyut, string> = { sm: 'size-10', md: 'size-12', lg: 'size-16' }

/**
 * Madde 11 · 14: parlak kapsül buton. Zemin iki gradyan katmanı (parlama + metal), derinlik dört iç gölge (Madde 12).
 * Basınca yansıma ters döner: üst gölge koyulaşır, buton 1px iner. Metin hep zeminin zıttı (Madde 18).
 */
export const ChromeButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { ton?: Tone; boyut?: Boyut; yuvarlak?: boolean; ikon?: ReactNode }>(function ChromeButton(
  { ton = 'chrome', boyut = 'md', yuvarlak, ikon, className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(
        ton,
        'relative inline-flex shrink-0 items-center justify-center rounded-full border border-[#2b3445]/55 font-logo leading-none tracking-[0.06em] uppercase select-none',
        'transition-[filter,translate] duration-100 hover:brightness-[1.06] active:translate-y-px active:[box-shadow:inset_0_3px_7px_rgb(0_0_0/0.38),inset_0_-1px_0_rgb(255_255_255/0.6)]',
        'disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:brightness-100',
        yuvarlak ? YUVARLAK[boyut] : BOYUT[boyut],
        className,
      )}
      {...rest}
    >
      {ikon}
      {children}
    </button>
  )
})
