import { useMemo, useState } from 'react'
import { CheckCircleIcon, ClockIcon, TableIcon, WarningCircleIcon, ChartBarIcon } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { KpiCard } from '../charts/KpiCard'
import { ColumnChart } from '../charts/ColumnChart'
import { StatusBar } from '../charts/StatusBar'
import { InvoiceTable } from './InvoiceTable'
import { computeMetrics, type Period } from '../data/metrics'
import { TODAY, type Invoice } from '../data/invoices'
import { fmtCompact, fmtCompactCurrency, fmtCurrency, fmtDate, fmtDecimal, fmtInt, fmtMonthLong, fmtMonthShort, fmtPercent } from '../lib/format'
import { cn } from '../lib/utils'

const PERIODS: ReadonlyArray<{ value: Period; label: string }> = [
  { value: 3, label: 'Son 3 ay' },
  { value: 6, label: 'Son 6 ay' },
  { value: 12, label: 'Son 12 ay' },
]

type Props = {
  invoices: Invoice[]
  onRemind: (ids: string[]) => void
  onCancel: (id: string) => void
}

export function Overview({ invoices, onRemind, onCancel }: Props) {
  const [period, setPeriod] = useState<Period>(6)
  const [chartAsTable, setChartAsTable] = useState(false)
  const m = useMemo(() => computeMetrics(invoices, period), [invoices, period])
  const scoped = useMemo(() => invoices.filter((i) => i.issued >= m.start), [invoices, m.start])
  const periodLabel = `önceki ${period} aya göre`

  const columns = m.monthly.map((b) => ({
    key: b.key,
    label: fmtMonthShort(b.start),
    fullLabel: b.partial ? `${fmtMonthLong(b.start)} (${fmtDate(TODAY)} itibarıyla)` : fmtMonthLong(b.start),
    value: b.collected,
  }))

  return (
    <div className="flex flex-col gap-6">
      {/* Filtre satırı: altındaki her şeyi aynı dönemle sınırlar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Dönem" className="inline-flex rounded-md border bg-card p-1">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              type="button"
              aria-pressed={period === p.value}
              onClick={() => setPeriod(p.value)}
              className={cn(
                'h-11 cursor-pointer rounded-sm px-4 text-sm font-medium transition-colors duration-150',
                period === p.value ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-accent',
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          {fmtDate(m.start)} – {fmtDate(TODAY)} · Örnek veri
        </p>
      </div>

      <section aria-label="Temel göstergeler" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Tahsil edilen"
          value={fmtCompactCurrency(m.collected)}
          spark={m.sparkCollected}
          delta={{
            text: fmtPercent(Math.abs(m.collectedDelta)),
            direction: m.collectedDelta >= 0 ? 'up' : 'down',
            good: m.collectedDelta >= 0,
            period: periodLabel,
          }}
        />
        <KpiCard
          label="Açık alacak"
          value={fmtCompactCurrency(m.outstanding)}
          note={`${fmtInt(m.outstandingCount)} fatura ödeme bekliyor`}
        />
        <KpiCard
          label="Gecikmiş alacak"
          value={fmtCompactCurrency(m.overdue)}
          note={`${fmtInt(m.overdueCount)} fatura · açık alacaktaki payı ${fmtPercent(m.outstanding ? m.overdue / m.outstanding : 0)}`}
        />
        <KpiCard
          label="Ortalama tahsil süresi"
          value={`${fmtDecimal(m.avgDays)} gün`}
          spark={m.sparkDays}
          delta={{
            text: `${fmtDecimal(Math.abs(m.avgDaysDelta))} gün`,
            direction: m.avgDaysDelta >= 0 ? 'up' : 'down',
            good: m.avgDaysDelta <= 0,
            period: periodLabel,
          }}
        />
      </section>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="min-w-0 xl:col-span-2">
          <CardHeader className="flex-row items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <CardTitle>Aylık tahsilat</CardTitle>
              <CardDescription>Ödeme tarihine göre, Türk lirası</CardDescription>
            </div>
            <Button variant="outline" onClick={() => setChartAsTable((v) => !v)} aria-pressed={chartAsTable}>
              {chartAsTable ? <ChartBarIcon size={18} aria-hidden="true" /> : <TableIcon size={18} aria-hidden="true" />}
              {chartAsTable ? 'Grafik' : 'Tablo'}
            </Button>
          </CardHeader>
          <CardContent>
            {chartAsTable ? (
              <table className="w-full text-sm">
                <caption className="sr-only">Aylık tahsilat</caption>
                <thead>
                  <tr className="border-b">
                    <th scope="col" className="h-11 text-left font-semibold text-muted-foreground">
                      Ay
                    </th>
                    <th scope="col" className="h-11 text-right font-semibold text-muted-foreground">
                      Tahsilat
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {columns.map((c) => (
                    <tr key={c.key} className="border-b last:border-0">
                      <th scope="row" className="py-2.5 text-left font-normal">
                        {c.fullLabel}
                      </th>
                      <td className="py-2.5 text-right tabular-nums">{fmtCurrency(c.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <ColumnChart
                data={columns}
                formatValue={fmtCurrency}
                formatTick={fmtCompact}
                summary={`Aylık tahsilat, ${columns.length} ay. En yüksek ${fmtCurrency(Math.max(...columns.map((c) => c.value)))}.`}
              />
            )}
            <p className="mt-3 text-sm text-muted-foreground">Son sütun {fmtDate(TODAY)} itibarıyla, ay henüz kapanmadı.</p>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Faturalanan tutarın durumu</CardTitle>
            <CardDescription>Dönemde kesilen, iptal edilmemiş faturalar</CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <StatusBar
              formatValue={fmtCompactCurrency}
              formatPercent={fmtPercent}
              segments={[
                { ...m.breakdown[0], color: 'var(--chart-good)', Icon: CheckCircleIcon },
                { ...m.breakdown[1], color: 'var(--chart-info)', Icon: ClockIcon },
                { ...m.breakdown[2], color: 'var(--chart-critical)', Icon: WarningCircleIcon },
              ]}
            />
          </CardContent>
        </Card>
      </div>

      <section aria-labelledby="donem-faturalari" className="flex flex-col gap-3">
        <h2 id="donem-faturalari" className="text-lg font-semibold">
          Dönemin faturaları
        </h2>
        <InvoiceTable invoices={scoped} caption="Dönemin faturaları" onRemind={onRemind} onCancel={onCancel} />
      </section>
    </div>
  )
}
