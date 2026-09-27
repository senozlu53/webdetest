import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { cx } from '../../shared/cx'

type Props = {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  format: (value: number) => string
  /** Ortadaki büyük değer ve altındaki açıklama */
  display?: (value: number) => { main: string; sub?: string }
  size?: number
  className?: string
}

const START = 135 // derece; saat yönünde, +x ekseninden
const SWEEP = 270

function polar(cx: number, cy: number, r: number, deg: number) {
  const a = (deg * Math.PI) / 180
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
}

function arcPath(cx: number, cy: number, r: number, from: number, to: number) {
  const a = polar(cx, cy, r, from)
  const b = polar(cx, cy, r, to)
  const large = to - from > 180 ? 1 : 0
  return `M ${a.x} ${a.y} A ${r} ${r} 0 ${large} 1 ${b.x} ${b.y}`
}

/**
 * Dairesel kaydırıcı (SoftSlider). Çıkıntılı gövde, içe gömülü oluk, kabartma düğme.
 * Sürükleyerek ya da klavyeyle (oklar, PageUp/PageDown, Home/End) değiştirilir.
 */
export function SoftSlider({ label, value, min, max, step = 1, onChange, format, display, size = 240, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const f = (value - min) / (max - min)
  const angle = START + SWEEP * f
  const c = size / 2
  const r = size * 0.34
  const knob = polar(c, c, r, angle)
  const shown = display ? display(value) : { main: format(value) }

  const clamp = useCallback(
    (v: number) => Math.min(max, Math.max(min, Math.round(v / step) * step)),
    [min, max, step],
  )

  const fromPointer = (e: PointerEvent) => {
    const box = ref.current?.getBoundingClientRect()
    if (!box) return
    const deg = (Math.atan2(e.clientY - (box.top + box.height / 2), e.clientX - (box.left + box.width / 2)) * 180) / Math.PI
    let rel = (deg - START + 360) % 360
    if (rel > SWEEP) rel = rel > SWEEP + (360 - SWEEP) / 2 ? 0 : SWEEP
    onChange(clamp(min + (rel / SWEEP) * (max - min)))
  }

  const onKey = (e: KeyboardEvent) => {
    const big = step * 5
    const map: Record<string, number> = {
      ArrowUp: value + step,
      ArrowRight: value + step,
      ArrowDown: value - step,
      ArrowLeft: value - step,
      PageUp: value + big,
      PageDown: value - big,
      Home: min,
      End: max,
    }
    if (e.key in map) {
      e.preventDefault()
      onChange(clamp(map[e.key]))
    }
  }

  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={format(value)}
      onKeyDown={onKey}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        setDragging(true)
        fromPointer(e)
      }}
      onPointerMove={(e) => dragging && fromPointer(e)}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
      className={cx('relative shrink-0 cursor-grab touch-none rounded-full select-none active:cursor-grabbing', className)}
      style={{ width: size, height: size }}
    >
      <div className="neu neu-raised absolute inset-0 rounded-full" />
      <div className="neu-inset absolute inset-[9%] rounded-full" />
      <svg width={size} height={size} className="absolute inset-0" aria-hidden="true">
        <path d={arcPath(c, c, r, START, START + SWEEP)} fill="none" stroke="var(--neu-dark)" strokeWidth={size * 0.012} strokeLinecap="round" />
        {f > 0.001 ? (
          <path d={arcPath(c, c, r, START, angle)} fill="none" stroke="var(--accent)" strokeWidth={size * 0.03} strokeLinecap="round" />
        ) : null}
      </svg>
      <div className="neu neu-raised neu-convex absolute inset-[24%] grid place-items-center rounded-full text-center">
        <div className="flex flex-col leading-none">
          <span className="font-extrabold tabular-nums" style={{ fontSize: size * 0.16 }}>
            {shown.main}
          </span>
          {shown.sub ? <span className="mt-1.5 text-sm font-semibold text-muted">{shown.sub}</span> : null}
        </div>
      </div>
      <span
        aria-hidden="true"
        className={cx('neu neu-raised-sm absolute rounded-full', !dragging && 'transition-[left,top] duration-500 ease-spring')}
        style={{
          width: size * 0.1,
          height: size * 0.1,
          left: knob.x - size * 0.05,
          top: knob.y - size * 0.05,
        }}
      >
        <span className="absolute inset-[30%] rounded-full bg-accent" />
      </span>
    </div>
  )
}
