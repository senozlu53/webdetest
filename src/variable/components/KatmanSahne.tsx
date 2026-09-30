import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react'
import { useRef, type CSSProperties } from 'react'
import { cx } from '../../shared/cx'
import { AILELER, type Aile } from '../lib/data'
import { useVariable } from '../lib/store'
import { useKayit } from './hooks'

export interface KatmanTanim {
  metin: string
  aile: Aile
  /** eksen değerleri (CSS özel özellikleri) */
  eksen: Record<string, number>
  ton: number
}

function Katman({ t, i, n, oran, nx, ny, hareket }: { t: KatmanTanim; i: number; n: number; oran: number; nx: MotionValue<number>; ny: MotionValue<number>; hareket: boolean }) {
  const x = useTransform(nx, (v) => (v - 0.5) * 46 * (i + 1))
  const y = useTransform(ny, (v) => (v - 0.5) * 18 * (i + 1))
  const stil = {
    fontSize: `calc(var(--tb) * ${Math.pow(oran, i).toFixed(4)})`,
    left: `${i * 6}%`,
    bottom: `calc(var(--tb) * ${(i * 0.085).toFixed(3)})`,
    color: `color-mix(in srgb, var(--metin) ${t.ton}%, var(--zemin))`,
    zIndex: i,
    ...Object.fromEntries(Object.entries(t.eksen).map(([k, v]) => [k, v])),
  } as CSSProperties
  return (
    <motion.div className={cx('katman vk disp', AILELER[t.aile].css)} style={hareket ? { ...stil, x, y } : stil} aria-hidden="true" data-katman-i={i} data-son={i === n - 1 ? '' : undefined}>
      {t.metin}
    </motion.div>
  )
}

/**
 * <KatmanSahne>: farklı boyutlarda, üst üste binen metin katmanları (Madde 7). Gölge yoktur; derinliği boyut,
 * ton ve örtüşme verir: en büyük katman en soluk ve en arkada, en küçük katman en koyu ve en önde.
 * İmleç her katmanı farklı miktarda kaydırır (paralaks).
 */
export function KatmanSahne({ katmanlar, oran = 0.62, className }: { katmanlar: KatmanTanim[]; oran?: number; className?: string }) {
  const { hareket, kilitli } = useVariable()
  const sahne = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const nx = useSpring(mx, { stiffness: 90, damping: 14 })
  const ny = useSpring(my, { stiffness: 90, damping: 14 })
  const oynuyor = hareket && !kilitli
  useKayit('katman', oynuyor)
  const izle = (e: React.PointerEvent) => {
    if (!oynuyor) return
    const r = sahne.current!.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }
  const n = katmanlar.length
  return (
    <div
      ref={sahne}
      className={cx('katman-sahne', className)}
      style={{ ['--tb' as string]: 'clamp(110px, 25vw, 300px)', height: 'calc(var(--tb) * 1.12)' }}
      onPointerMove={izle}
      onPointerLeave={() => {
        mx.set(0.5)
        my.set(0.5)
      }}
      data-katman-sahne=""
      data-katman-say={n}
      data-katman-oran={oran}
    >
      {katmanlar.map((t, i) => (
        <Katman key={i} t={t} i={i} n={n} oran={oran} nx={nx} ny={ny} hareket={oynuyor} />
      ))}
      <span className="sr-only">{katmanlar.map((k) => k.metin).join(' ')}</span>
    </div>
  )
}
