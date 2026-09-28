import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../shared/cx'

export type Fill = 'yellow' | 'red' | 'blue' | 'green' | 'pink' | 'white' | 'ink'
export type Size = 's' | 'm' | 'l'
/** yarim: Madde 15 birebir (üstüne gelince 2px iner, gölge 4px). tam: Madde 11, üstüne gelince gölge kaybolur, buton tamamen çöker */
export type Press = 'yarim' | 'tam'

const FILL: Record<Fill, string> = {
  yellow: 'fill-yellow',
  red: 'fill-red',
  blue: 'fill-blue',
  green: 'fill-green',
  pink: 'fill-pink',
  white: 'bg-surface text-ink',
  ink: 'fill-ink',
}
const SIZE: Record<Size, string> = {
  s: 'min-h-10 px-4 text-[14px]',
  m: 'min-h-12 px-5 text-[16px]',
  l: 'min-h-16 px-7 text-[20px]',
}

/**
 * <SolidButton> (Madde 11 · 14 · 15). Sınıf dizisi tanımdaki Tailwind satırının birebir karşılığı;
 * koyu temada dark: varyantıyla beyaz çerçeve ve beyaz gölgeye döner. Basınca (active) gölge 0 olur.
 */
export const SolidButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { fill?: Fill; size?: Size; press?: Press; icon?: ReactNode; loading?: boolean }>(function SolidButton(
  { fill = 'yellow', size = 'm', press = 'yarim', icon, loading, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx(
        'inline-flex items-center justify-center gap-2.5 rounded-brut font-display font-extrabold tracking-[0.01em] uppercase [font-stretch:112%] select-none',
        'border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] dark:border-white dark:shadow-[6px_6px_0px_rgba(255,255,255,1)]',
        'transition-[transform,box-shadow] duration-[80ms] ease-linear',
        press === 'yarim'
          ? 'hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_rgba(255,255,255,1)]'
          : 'hover:translate-x-[6px] hover:translate-y-[6px] hover:shadow-none dark:hover:shadow-none',
        'active:translate-x-[6px] active:translate-y-[6px] active:shadow-none dark:active:shadow-none',
        'disabled:cursor-not-allowed disabled:opacity-100 disabled:[background:repeating-linear-gradient(-45deg,var(--surface)_0_8px,var(--bg)_8px_16px)] disabled:text-muted disabled:pointer-events-none disabled:shadow-none dark:disabled:shadow-none',
        FILL[fill],
        SIZE[size],
        className,
      )}
      {...rest}
    >
      {loading ? (
        <span className="blink inline-block size-3 bg-current" aria-hidden="true" />
      ) : (
        icon
      )}
      {children}
    </button>
  )
})
