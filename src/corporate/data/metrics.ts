import { TODAY, monthsBetween, rangeStart, statusOf, type Invoice } from './invoices'

export type Period = 3 | 6 | 12

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0)
const mean = (xs: number[]) => (xs.length ? sum(xs) / xs.length : 0)

function paidBetween(invoices: Invoice[], from: number, to: number) {
  return invoices.filter((i) => !i.canceled && i.paid !== null && i.paid >= from && i.paid < to)
}

/** Dönem filtresi: KPI'lar, grafikler ve tablo aynı dilimden hesaplanır. */
export function computeMetrics(invoices: Invoice[], months: Period) {
  const start = rangeStart(months)
  const prevStart = rangeStart(months * 2)
  const end = TODAY + 1

  const paidNow = paidBetween(invoices, start, end)
  const paidPrev = paidBetween(invoices, prevStart, start)
  const issued = invoices.filter((i) => !i.canceled && i.issued >= start)

  const collected = sum(paidNow.map((i) => i.amount))
  const collectedPrev = sum(paidPrev.map((i) => i.amount))

  const statuses = issued.map((i) => ({ inv: i, status: statusOf(i) }))
  const openList = statuses.filter((s) => s.status === 'open' || s.status === 'due-soon')
  const overdueList = statuses.filter((s) => s.status === 'overdue')

  const days = paidNow.map((i) => (i.paid as number) - i.issued)
  const daysPrev = paidPrev.map((i) => (i.paid as number) - i.issued)

  const monthly = monthsBetween(start).map((b) => ({
    ...b,
    collected: sum(paidBetween(invoices, b.start, b.end).map((i) => i.amount)),
    partial: b.end === end,
  }))

  const last12 = monthsBetween(rangeStart(12)).map((b) => {
    const paid = paidBetween(invoices, b.start, b.end)
    return {
      collected: sum(paid.map((i) => i.amount)),
      avgDays: mean(paid.map((i) => (i.paid as number) - i.issued)),
    }
  })

  const paidAmount = sum(statuses.filter((s) => s.status === 'paid').map((s) => s.inv.amount))
  const openAmount = sum(openList.map((s) => s.inv.amount))
  const overdueAmount = sum(overdueList.map((s) => s.inv.amount))

  return {
    start,
    collected,
    collectedDelta: collectedPrev ? (collected - collectedPrev) / collectedPrev : 0,
    outstanding: openAmount + overdueAmount,
    outstandingCount: openList.length + overdueList.length,
    overdue: overdueAmount,
    overdueCount: overdueList.length,
    avgDays: mean(days),
    avgDaysDelta: mean(days) - mean(daysPrev),
    monthly,
    sparkCollected: last12.map((m) => m.collected),
    sparkDays: last12.map((m) => m.avgDays),
    breakdown: [
      { key: 'paid', label: 'Ödendi', amount: paidAmount },
      { key: 'open', label: 'Vadesi gelmedi', amount: openAmount },
      { key: 'overdue', label: 'Gecikmiş', amount: overdueAmount },
    ] as const,
  }
}

export type Metrics = ReturnType<typeof computeMetrics>
