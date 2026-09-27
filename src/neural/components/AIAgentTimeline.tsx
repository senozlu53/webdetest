import { useId, type ReactNode } from 'react'
import { STATUS, type StepStatus } from '../lib/agent'
import { dur } from '../lib/format'
import { useSize } from '../hooks/useSize'
import { IconCheck, IconSkip, IconX } from './Icons'
import { cx } from '../../shared/cx'

export type Orientation = 'yatay' | 'dikey'
export interface TimelineStep {
  id: string
  ad: string
  ne?: string
  status: StepStatus
  ms?: number
  /** 0–1: adımın içindeki ilerleme */
  progress: number
  retries?: number
}

const RING: Record<StepStatus, string> = {
  bekliyor: 'var(--node-idle)',
  calisiyor: 'var(--node-active)',
  tamam: 'var(--node-done)',
  hata: 'var(--err)',
  atlandi: 'var(--node-idle)',
}
export const STATUS_TEXT: Record<StepStatus, string> = {
  bekliyor: 'text-muted',
  calisiyor: 'text-active',
  tamam: 'text-done',
  hata: 'text-err',
  atlandi: 'text-muted',
}

/** Adım düğümü (Figma'da Variant: State=Bekliyor | Çalışıyor | Tamam | Hata | Atlandı) */
export function StepNode({ status, n, size = 44 }: { status: StepStatus; n: number; size?: number }) {
  return (
    <span
      className={cx('relative grid shrink-0 place-items-center rounded-full bg-bg', status === 'calisiyor' && 'glow-active', status === 'tamam' && 'glow-done')}
      style={{ width: size, height: size, border: `1.5px ${status === 'atlandi' ? 'dashed' : 'solid'} ${RING[status]}` }}
      aria-hidden="true"
    >
      {status === 'calisiyor' ? <span className="node-pulse absolute -inset-px rounded-full border border-active" /> : null}
      {status === 'bekliyor' ? <span className="font-mono text-[13px] text-muted mono-tight">{String(n).padStart(2, '0')}</span> : null}
      {status === 'calisiyor' ? (
        <svg viewBox="0 0 24 24" width={size * 0.5} height={size * 0.5} className="spin" fill="none">
          <circle cx="12" cy="12" r="8" stroke="rgb(250 204 21 / 0.25)" strokeWidth="2.5" />
          <circle cx="12" cy="12" r="8" stroke="var(--node-active)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="14 60" />
        </svg>
      ) : null}
      {status === 'tamam' ? <IconCheck size={size * 0.45} className="text-done" strokeWidth={2} /> : null}
      {status === 'hata' ? <IconX size={size * 0.42} className="text-err" strokeWidth={2} /> : null}
      {status === 'atlandi' ? <IconSkip size={size * 0.45} className="text-idle" strokeWidth={2} /> : null}
    </span>
  )
}

/**
 * Adımlar arası Bezier bağlantı (Madde 6 · 15). Gerçek piksel ölçüsüyle çizilir.
 * Dolu kısım stroke-dashoffset ile ilerler; çalışan adımda üstünden veri akar.
 */
export function Connector({ progress, flowing, orientation, className }: { progress: number; flowing?: boolean; orientation: Orientation; className?: string }) {
  const [ref, { w, h }] = useSize<HTMLDivElement>()
  const gid = `g${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const d =
    orientation === 'yatay'
      ? `M2 ${h / 2}C${w * 0.35} ${h / 2 - 7} ${w * 0.65} ${h / 2 + 7} ${w - 2} ${h / 2}`
      : `M${w / 2} 2C${w / 2 - 7} ${h * 0.35} ${w / 2 + 7} ${h * 0.65} ${w / 2} ${h - 2}`
  return (
    <div ref={ref} className={cx(orientation === 'yatay' ? 'h-11 min-w-4 flex-1' : 'min-h-6 w-11 flex-1', className)} aria-hidden="true">
      {w > 0 && h > 0 ? (
        <svg width={w} height={h} className="block overflow-visible" fill="none" strokeLinecap="round">
          <defs>
            <linearGradient id={gid} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={orientation === 'yatay' ? w : 0} y2={orientation === 'yatay' ? 0 : h}>
              <stop offset="0" stopColor="#60a5fa" />
              <stop offset="1" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
          <path d={d} stroke="var(--line-strong)" strokeWidth={1.5} strokeDasharray="2 5" />
          <path d={d} pathLength={1} className="edge-draw" style={{ ['--p' as string]: progress }} stroke={`url(#${gid})`} strokeWidth={2} />
          {flowing ? <path d={d} pathLength={1} className="edge-flow fx-only" stroke="#e0e7ff" strokeWidth={2.5} style={{ ['--flow-dur' as string]: '1.4s' }} /> : null}
        </svg>
      ) : null}
    </div>
  )
}

const connProgress = (s: TimelineStep) => (s.status === 'tamam' || s.status === 'atlandi' ? 1 : s.status === 'calisiyor' || s.status === 'hata' ? s.progress * 0.95 : 0)

function StepText({ s, i, compact }: { s: TimelineStep; i: number; compact?: boolean }) {
  return (
    <>
      <p className="label">Adım {i + 1}</p>
      <p className="text-[17px] leading-snug font-medium">{s.ad}</p>
      <p className={cx('font-mono text-[12px] mono-tight', STATUS_TEXT[s.status])}>
        {STATUS[s.status]}
        {s.ms ? <span className="text-muted"> · {dur(s.ms / 1000)}</span> : null}
      </p>
      {s.retries ? <p className="text-[13px] text-muted">{s.retries} yeniden deneme</p> : null}
      {s.ne && !compact ? <p className="mt-1 text-[13px] leading-snug text-muted">{s.ne}</p> : null}
    </>
  )
}

/**
 * <AIAgentTimeline> (Madde 11 · 14 · 16): Anla, Ara, Analiz Et, Üret. Geniş ekranda yatay, dar ekranda dikey.
 * Etkin adım aria-current="step" taşır; durum her zaman metinle de yazılır.
 */
export function AIAgentTimeline({ steps, orientation, label = 'Ajan adımları', detail, compact }: { steps: TimelineStep[]; orientation: Orientation; label?: string; detail?: (s: TimelineStep, i: number) => ReactNode; compact?: boolean }) {
  const last = steps.length - 1
  if (orientation === 'yatay')
    return (
      <ol aria-label={label} className="flex">
        {steps.map((s, i) => (
          <li key={s.id} className="min-w-0 flex-1" aria-current={s.status === 'calisiyor' || s.status === 'hata' ? 'step' : undefined}>
            <div className="flex items-center">
              <StepNode status={s.status} n={i + 1} />
              {i < last ? <Connector className="mx-2" orientation="yatay" progress={connProgress(s)} flowing={s.status === 'calisiyor'} /> : null}
            </div>
            <div className="mt-3 pr-3">
              <StepText s={s} i={i} compact={compact} />
              {detail?.(s, i)}
            </div>
          </li>
        ))}
      </ol>
    )
  return (
    <ol aria-label={label} className="flex flex-col">
      {steps.map((s, i) => (
        <li key={s.id} className="grid grid-cols-[44px_minmax(0,1fr)] gap-x-4" aria-current={s.status === 'calisiyor' || s.status === 'hata' ? 'step' : undefined}>
          <div className="flex flex-col items-center">
            <StepNode status={s.status} n={i + 1} />
            {i < last ? <Connector className="my-1.5" orientation="dikey" progress={connProgress(s)} flowing={s.status === 'calisiyor'} /> : null}
          </div>
          <div className={cx('min-w-0 pt-0.5', i < last && 'pb-5')}>
            <StepText s={s} i={i} compact={compact} />
            {detail?.(s, i)}
          </div>
        </li>
      ))}
    </ol>
  )
}
