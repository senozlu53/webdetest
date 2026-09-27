import { toDate } from '../data/invoices'

const currency = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 })
const compactCurrency = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  notation: 'compact',
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})
const compact = new Intl.NumberFormat('tr-TR', { notation: 'compact', minimumFractionDigits: 0, maximumFractionDigits: 1 })
const integer = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 })
const decimal = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
const percent = new Intl.NumberFormat('tr-TR', { style: 'percent', maximumFractionDigits: 0 })
const shortDate = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
const monthShort = new Intl.DateTimeFormat('tr-TR', { month: 'short', timeZone: 'UTC' })
const monthLong = new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric', timeZone: 'UTC' })

export const fmtCurrency = (v: number) => currency.format(v)
export const fmtCompactCurrency = (v: number) => compactCurrency.format(v)
export const fmtCompact = (v: number) => compact.format(v)
export const fmtInt = (v: number) => integer.format(v)
export const fmtDecimal = (v: number) => decimal.format(v)
export const fmtPercent = (v: number) => percent.format(v)
export const fmtDate = (day: number) => shortDate.format(toDate(day))
export const fmtMonthShort = (day: number) => monthShort.format(toDate(day))
export const fmtMonthLong = (day: number) => monthLong.format(toDate(day))
