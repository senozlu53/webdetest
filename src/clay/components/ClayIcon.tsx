import type { CSSProperties } from 'react'
import type { Icon } from '@phosphor-icons/react'
import { clayClass, type Tone } from './types'
import { cx } from '../../shared/cx'

/**
 * Sayfaya bir kez eklenen SVG filtreleri: dolu ikonu kil gibi şişirir.
 * CSS'teki üç gölgenin aynısı, herhangi bir biçim için: alfa kanalı kaydırılır, bulanıklaştırılır
 * ve biçimin içinde kalan kenar şeridi boyanır (iç gölge); dışta yumuşak bir düşen gölge.
 */
export function ClayDefs() {
  const filter = (id: string, d: number) => (
    <filter id={id} x="-25%" y="-25%" width="160%" height="160%" colorInterpolationFilters="sRGB">
      <feOffset in="SourceAlpha" dx={-d} dy={-d} result="offLo" />
      <feGaussianBlur in="offLo" stdDeviation={d} result="blurLo" />
      <feComposite in="SourceAlpha" in2="blurLo" operator="out" result="rimLo" />
      <feFlood style={{ floodColor: 'var(--icon-lo)' }} result="colLo" />
      <feComposite in="colLo" in2="rimLo" operator="in" result="shadeLo" />
      <feOffset in="SourceAlpha" dx={d} dy={d} result="offHi" />
      <feGaussianBlur in="offHi" stdDeviation={d} result="blurHi" />
      <feComposite in="SourceAlpha" in2="blurHi" operator="out" result="rimHi" />
      <feFlood style={{ floodColor: 'var(--icon-hi)' }} result="colHi" />
      <feComposite in="colHi" in2="rimHi" operator="in" result="shadeHi" />
      <feOffset in="SourceAlpha" dx={d * 1.5} dy={d * 1.5} result="offDrop" />
      <feGaussianBlur in="offDrop" stdDeviation={d * 1.5} result="blurDrop" />
      <feFlood style={{ floodColor: 'var(--icon-drop)' }} result="colDrop" />
      <feComposite in="colDrop" in2="blurDrop" operator="in" result="drop" />
      <feMerge>
        <feMergeNode in="drop" />
        <feMergeNode in="SourceGraphic" />
        <feMergeNode in="shadeLo" />
        <feMergeNode in="shadeHi" />
      </feMerge>
    </filter>
  )
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <defs>
        {filter('clay-icon', 1.6)}
        {filter('clay-icon-lg', 3)}
      </defs>
    </svg>
  )
}

type Props = {
  icon: Icon
  /** İkonun kendi rengi (CSS rengi) */
  color?: string
  size?: number
  /** Arkadaki kil karo; verilmezse ikon tek başına durur */
  tile?: Tone
  label?: string
  className?: string
}

/** Tıknaz, içi dolu ikon; kil filtresiyle üç boyutlu görünür (Madde 9). */
export function ClayIcon({ icon: IconCmp, color = 'var(--accent)', size = 40, tile, label, className }: Props) {
  const glyph = (
    <IconCmp
      size={size}
      weight="fill"
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      style={{ color, filter: `url(#${size >= 64 ? 'clay-icon-lg' : 'clay-icon'})`, overflow: 'visible' } as CSSProperties}
    />
  )
  if (!tile) return <span className={cx('inline-grid place-items-center', className)}>{glyph}</span>
  const pad = Math.round(size * 0.45)
  return (
    <span className={cx(clayClass(tile, size >= 48 ? 'md' : 'sm'), 'inline-grid shrink-0 place-items-center rounded-[36%]', className)} style={{ padding: pad }}>
      {glyph}
    </span>
  )
}
