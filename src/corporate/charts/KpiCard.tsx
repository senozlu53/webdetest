import { ArrowDownRightIcon, ArrowUpRightIcon } from '@phosphor-icons/react'
import { Card } from '../ui/card'
import { Sparkline } from './Sparkline'
import { cn } from '../lib/utils'

type Delta = { text: string; direction: 'up' | 'down'; good: boolean; period: string }

type Props = {
  label: string
  value: string
  delta?: Delta
  note?: string
  spark?: number[]
}

/** Stat tile: etiket · değer · değişim (yön × iyi mi) · 12 aylık eğilim. */
export function KpiCard({ label, value, delta, note, spark }: Props) {
  const Arrow = delta?.direction === 'up' ? ArrowUpRightIcon : ArrowDownRightIcon
  return (
    <Card className="flex flex-col gap-3 p-5">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="flex items-end justify-between gap-3">
        <p className="text-3xl leading-tight font-semibold tracking-tight whitespace-nowrap">{value}</p>
        {spark ? <Sparkline values={spark} width={80} /> : null}
      </div>
      {delta ? (
        <p className="flex flex-wrap items-center gap-x-1.5 text-sm">
          <span className={cn('inline-flex items-center gap-1 font-semibold', delta.good ? 'text-success-text' : 'text-error-text')}>
            <Arrow size={16} weight="bold" aria-hidden="true" />
            {delta.text}
            <span className="sr-only">{delta.good ? '(olumlu)' : '(olumsuz)'}</span>
          </span>
          <span className="text-muted-foreground">{delta.period}</span>
        </p>
      ) : null}
      {note ? <p className="text-sm text-muted-foreground">{note}</p> : null}
    </Card>
  )
}
