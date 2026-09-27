import { useCallback, useRef, type ButtonHTMLAttributes, type KeyboardEvent, type ReactNode, type Ref } from 'react'
import { clayClass, type Tone } from './types'
import { cx } from '../../shared/cx'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  ref?: Ref<HTMLButtonElement>
  tone?: Tone
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  /** Yalnızca ikon: kare yerine tam yuvarlak */
  round?: boolean
}

const SIZE = {
  sm: 'min-h-11 px-5 text-[15px] gap-2',
  md: 'min-h-13 px-7 text-[17px] gap-2.5',
  lg: 'min-h-16 px-9 text-xl gap-3',
} as const
const ROUND = { sm: 'size-11', md: 'size-13', lg: 'size-16' } as const

/**
 * Hap biçimli, şişkin düğme. Basınca havası iner: hacim birimi d %35'e düşer, düğme
 * yassılaşır; bırakınca yaylı eğriyle geri şişer. Enter tuşu da aynı tepkiyi verir.
 */
export function ClayButton({ ref: outerRef, tone = 'base', size = 'md', icon, round, className, children, type = 'button', onKeyDown, onKeyUp, ...rest }: Props) {
  const ref = useRef<HTMLButtonElement>(null)
  // İç ref (basılma tepkisi) ile dışarıdan gelen ref'i birleştir
  const setRef = useCallback(
    (el: HTMLButtonElement | null) => {
      ref.current = el
      if (typeof outerRef === 'function') outerRef(el)
      else if (outerRef) outerRef.current = el
    },
    [outerRef],
  )
  const squish = (on: boolean) => {
    const el = ref.current
    if (!el) return
    if (on) el.dataset.squish = ''
    else delete el.dataset.squish
  }
  return (
    <button
      ref={setRef}
      type={type}
      onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === 'Enter' && !e.repeat) {
          squish(true)
          window.setTimeout(() => squish(false), 140)
        }
        onKeyDown?.(e)
      }}
      onKeyUp={onKeyUp}
      className={cx(
        clayClass(tone, size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'md'),
        'clay-press inline-flex shrink-0 items-center justify-center rounded-max font-display leading-none font-bold',
        round ? ROUND[size] : SIZE[size],
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}
