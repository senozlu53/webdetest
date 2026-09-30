import type { AnchorHTMLAttributes, ButtonHTMLAttributes, CSSProperties, ReactNode, Ref } from 'react'
import { cx } from '../../shared/cx'

export type Ton = 'birincil' | 'ikincil' | 'turuncu' | 'hayalet'

function Ok() {
  return (
    <svg className="bt-ok" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
      <path d="M2 2L9 8L2 14H6L13 8L6 2Z" fill="currentColor" />
    </svg>
  )
}
function stil(egim: number | undefined, sure: number | undefined, style?: CSSProperties): CSSProperties | undefined {
  if (egim === undefined && sure === undefined) return style
  return { ...(egim !== undefined ? { ['--bt-egim' as string]: `${egim}deg` } : {}), ...(sure !== undefined ? { ['--bt-sure' as string]: `${sure}ms` } : {}), ...style }
}

/**
 * <SlantedButton>: eğik paralelkenar düğme (Madde 14 · 16). Üzerine gelince ya da odaklanınca sağa doğru kayan neon dilim (skew slide).
 * Yazı, düğmenin tersi yönde eğilir ve düz okunur; hareket kapalıyken dilim anında dolar.
 */
export function SlantedButton({
  ton = 'ikincil',
  ok = false,
  egim,
  sure,
  dar = false,
  className,
  children,
  type = 'button',
  style,
  ...rest
}: { ton?: Ton; ok?: boolean; egim?: number; sure?: number; dar?: boolean; children: ReactNode; ref?: Ref<HTMLButtonElement> } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} data-ton={ton} className={cx('bt', dar && 'bt-dar', className)} style={stil(egim, sure, style)} {...rest}>
      <span className="bt-yazi">
        {children}
        {ok ? <Ok /> : null}
      </span>
    </button>
  )
}
export function SlantedLink({ ton = 'ikincil', ok = false, egim, sure, dar = false, className, children, style, ...rest }: { ton?: Ton; ok?: boolean; egim?: number; sure?: number; dar?: boolean; children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a data-ton={ton} className={cx('bt', dar && 'bt-dar', className)} style={stil(egim, sure, style)} {...rest}>
      <span className="bt-yazi">
        {children}
        {ok ? <Ok /> : null}
      </span>
    </a>
  )
}
