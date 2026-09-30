import { useEffect, useMemo, useRef, useState } from 'react'
import { TAKIMLAR, puanOf, type Takim } from '../lib/data'
import { useEsports } from '../lib/store'
import { SiraOku } from './ui'

type Anahtar = 'ad' | 'g' | 'kd' | 'puan'
const KOLONLAR: { id: string; ad: string; s?: true }[] = [
  { id: 'sira', ad: 'Sıra' },
  { id: 'ad', ad: 'Takım', s: true },
  { id: 'sehir', ad: 'Şehir' },
  { id: 'g', ad: 'G–M', s: true },
  { id: 'kd', ad: 'K/D', s: true },
  { id: 'seri', ad: 'Seri' },
  { id: 'puan', ad: 'Puan', s: true },
]
/** canlı güncellemede sırayla galibiyet alan takımlar: sabit, test edilebilir */
const SIRA = [3, 1, 5, 0, 2, 4, 6, 3, 1, 7]
const oran = (n: number) => n.toFixed(2).replace('.', ',')

/**
 * <LeaderboardTable>: açılı satırlı skor tablosu (Madde 11 · 14). Gerçek `<table>`: sütun başlığı düğmeleri `aria-sort` taşır;
 * satırın iki ucu `clip-path` ile eğik kesilir, ilk üç sıra neon şeritlidir. `canli` açıkken puanlar 2,6 saniyede bir güncellenir.
 */
export function LeaderboardTable({ takimlar = TAKIMLAR, canli = false, etiket = 'Turnuva sıralaması' }: { takimlar?: Takim[]; canli?: boolean; etiket?: string }) {
  const [anahtar, setAnahtar] = useState<Anahtar>('puan')
  const [yon, setYon] = useState<'asc' | 'desc'>('desc')
  const [veri, setVeri] = useState<Takim[]>(takimlar)
  const [degisen, setDegisen] = useState<string | null>(null)
  const { hareket, duyur } = useEsports()
  const [say, setSay] = useState(0)

  useEffect(() => setVeri(takimlar), [takimlar])
  const sayRef = useRef(0)
  useEffect(() => {
    if (!canli || !hareket) return
    let zaman = 0
    const t = window.setInterval(() => {
      const n = sayRef.current++
      const i = SIRA[n % SIRA.length]
      setVeri((v) => v.map((x, j) => (j === i ? { ...x, g: x.g + 1, seri: 'G' + (x.seri.startsWith('G') ? +x.seri.slice(1) + 1 : 1) } : x)))
      setDegisen(takimlar[i]?.id ?? null)
      setSay(n + 1)
      window.clearTimeout(zaman)
      zaman = window.setTimeout(() => setDegisen(null), 950)
    }, 2600)
    return () => {
      window.clearInterval(t)
      window.clearTimeout(zaman)
    }
  }, [canli, hareket, takimlar])

  const sira = useMemo(() => {
    const s = [...veri].sort((a, b) => puanOf(b) - puanOf(a) || a.ad.localeCompare(b.ad, 'tr'))
    return new Map(s.map((t, i) => [t.id, i + 1]))
  }, [veri])
  const satirlar = useMemo(
    () =>
      [...veri].sort((a, b) => {
        const f = (t: Takim) => (anahtar === 'ad' ? t.ad : anahtar === 'g' ? t.g : anahtar === 'kd' ? t.kd : puanOf(t))
        const x = f(a)
        const y = f(b)
        const c = typeof x === 'number' ? x - (y as number) : String(x).localeCompare(String(y), 'tr')
        return yon === 'asc' ? c : -c
      }),
    [veri, anahtar, yon],
  )
  const sirala = (k: Anahtar, ad: string) => {
    const y = k === anahtar ? (yon === 'asc' ? 'desc' : 'asc') : k === 'ad' ? 'asc' : 'desc'
    setAnahtar(k)
    setYon(y)
    duyur(`Tablo ${ad} sütununa göre ${y === 'asc' ? 'artan' : 'azalan'} sıralandı`)
  }
  return (
    <div className="overflow-x-auto" role="region" aria-label={`${etiket}, yatay kaydırılabilir`} tabIndex={0} data-liderlik="" data-say={say}>
      <table className="lb">
        <caption className="sr-only">{etiket}. Sütun başlıklarına basarak sıralayın.</caption>
        <thead>
          <tr>
            {KOLONLAR.map((k) =>
              k.s ? (
                <th key={k.id} scope="col" aria-sort={anahtar === k.id ? (yon === 'asc' ? 'ascending' : 'descending') : 'none'}>
                  <button type="button" onClick={() => sirala(k.id as Anahtar, k.ad)} data-sirala={k.id}>
                    {k.ad}
                    <SiraOku yon={anahtar === k.id ? (yon === 'asc' ? 'artan' : 'azalan') : 'yok'} />
                  </button>
                </th>
              ) : (
                <th key={k.id} scope="col">
                  {k.ad}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {satirlar.map((t) => {
            const r = sira.get(t.id)!
            return (
              <tr key={t.id} data-takim={t.id} data-podyum={r <= 3 ? r : undefined} data-degisti={degisen === t.id ? '' : undefined}>
                <td className="lb-sira">{r}</td>
                <th scope="row">{t.ad}</th>
                <td>{t.sehir}</td>
                <td className="rakam">
                  {t.g}–{t.m}
                </td>
                <td className="rakam">{oran(t.kd)}</td>
                <td>
                  <span className="lb-seri rakam" data-g={t.seri.startsWith('G') ? '' : undefined} data-m={t.seri.startsWith('M') ? '' : undefined}>
                    <span>{t.seri}</span>
                  </span>
                </td>
                <td className="rakam font-bold" data-puan={puanOf(t)}>
                  {puanOf(t)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
