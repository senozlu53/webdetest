/**
 * Örnek veri: kurgusal bir B2B tahsilat platformunun 24 aylık fatura kaydı.
 * (Panel en çok 12 ay gösterir; önceki 12 ay "önceki döneme göre" karşılaştırması içindir.)
 * Tohumlu rastgele üretilir; her açılışta aynı sayılar çıkar.
 * Tarihler UTC gün numarası olarak tutulur (saat dilimi kayması olmasın).
 */

export type InvoiceStatus = 'paid' | 'open' | 'due-soon' | 'overdue' | 'canceled'

export type Invoice = {
  id: string
  no: string
  customer: string
  sector: string
  issued: number
  due: number
  paid: number | null
  amount: number
  canceled: boolean
  reminded: boolean
}

const DAY = 86_400_000
export const dayOf = (y: number, m: number, d: number) => Date.UTC(y, m - 1, d) / DAY
export const toDate = (day: number) => new Date(day * DAY)

/** Örnek verinin "bugün"ü */
export const TODAY = dayOf(2026, 9, 27)

const CUSTOMERS = [
  { name: 'Anadolu Lojistik A.Ş.', sector: 'Lojistik', base: 96_000, terms: 30 },
  { name: 'Boğaziçi Yazılım Ltd.', sector: 'Teknoloji', base: 58_000, terms: 30 },
  { name: 'Ege Tekstil San. A.Ş.', sector: 'Tekstil', base: 142_000, terms: 60 },
  { name: 'Kapadokya Turizm', sector: 'Turizm', base: 36_000, terms: 15 },
  { name: 'Marmara Gıda A.Ş.', sector: 'Gıda', base: 118_000, terms: 45 },
  { name: 'Toros Makina Ltd.', sector: 'Makine', base: 210_000, terms: 60 },
  { name: 'Karadeniz Enerji A.Ş.', sector: 'Enerji', base: 265_000, terms: 45 },
  { name: 'Mavi Liman Denizcilik', sector: 'Denizcilik', base: 88_000, terms: 30 },
  { name: 'Pera Mimarlık', sector: 'Mimarlık', base: 24_000, terms: 15 },
  { name: 'Yeşilırmak Tarım Koop.', sector: 'Tarım', base: 42_000, terms: 45 },
  { name: 'Kuzey Yapı A.Ş.', sector: 'İnşaat', base: 174_000, terms: 60 },
  { name: 'Atlas Medikal Ltd.', sector: 'Sağlık', base: 67_000, terms: 30 },
] as const

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function generate(): Invoice[] {
  const rand = mulberry32(20260927)
  const pick = <T,>(list: readonly T[]) => list[Math.floor(rand() * list.length)]
  const out: Invoice[] = []
  let serial = 1

  // Ekim 2024 → Eylül 2026
  for (let i = 0; i < 24; i++) {
    const year = 2024 + Math.floor((9 + i) / 12)
    const month = ((9 + i) % 12) + 1
    const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate()
    const maxDay = year === 2026 && month === 9 ? 26 : lastDay
    const count = 12 + Math.round(i * 0.4) + Math.floor(rand() * 5)

    for (let n = 0; n < count; n++) {
      const c = pick(CUSTOMERS)
      const issued = dayOf(year, month, 1 + Math.floor(rand() * maxDay))
      const due = issued + c.terms
      const amount = Math.round((c.base * (0.6 + rand())) / 50) * 50
      const canceled = rand() < 0.025

      let paid: number | null = null
      if (!canceled) {
        if (due <= TODAY) {
          if (rand() < 0.88) paid = issued + Math.round(c.terms * (0.7 + rand() * 0.55))
        } else if (rand() < 0.25) {
          paid = issued + 5 + Math.floor(rand() * Math.max(1, c.terms - 5))
        }
        if (paid !== null && paid > TODAY) paid = null
      }

      out.push({
        id: `inv-${serial}`,
        no: `FTR-${year}-${String(serial).padStart(4, '0')}`,
        customer: c.name,
        sector: c.sector,
        issued,
        due,
        paid,
        amount,
        canceled,
        reminded: false,
      })
      serial++
    }
  }
  return out.sort((a, b) => b.issued - a.issued)
}

export const INVOICES = generate()

export function statusOf(inv: Invoice, today = TODAY): InvoiceStatus {
  if (inv.canceled) return 'canceled'
  if (inv.paid !== null) return 'paid'
  if (inv.due < today) return 'overdue'
  if (inv.due - today <= 7) return 'due-soon'
  return 'open'
}

/** Seçilen dönemin ilk günü: son `months` ayın başlangıcı (içinde bulunulan ay dahil). */
export function rangeStart(months: number, today = TODAY) {
  const d = toDate(today)
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - (months - 1), 1) / DAY
}

export type MonthBucket = { key: string; start: number; end: number }

export function monthsBetween(start: number, today = TODAY): MonthBucket[] {
  const buckets: MonthBucket[] = []
  const s = toDate(start)
  let y = s.getUTCFullYear()
  let m = s.getUTCMonth()
  for (;;) {
    const bStart = Date.UTC(y, m, 1) / DAY
    if (bStart > today) break
    const bEnd = Date.UTC(y, m + 1, 1) / DAY
    buckets.push({ key: `${y}-${String(m + 1).padStart(2, '0')}`, start: bStart, end: Math.min(bEnd, today + 1) })
    m++
    if (m > 11) {
      m = 0
      y++
    }
  }
  return buckets
}
