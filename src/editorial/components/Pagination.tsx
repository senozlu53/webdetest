import { cx } from '../../shared/cx'
import { Ikon } from './Ikon'

/** Sayfa numaraları: 1 … s−k … s … s+k … N. Ortada kalan boşluklar "…" ile gösterilir. */
export function sayfaListesi(toplam: number, sayfa: number, komsu: number): (number | 'nokta-1' | 'nokta-2')[] {
  const gorunen = new Set<number>([1, toplam, sayfa])
  for (let i = 1; i <= komsu; i++) {
    gorunen.add(sayfa - i)
    gorunen.add(sayfa + i)
  }
  const sirali = [...gorunen].filter((n) => n >= 1 && n <= toplam).sort((a, b) => a - b)
  const sonuc: (number | 'nokta-1' | 'nokta-2')[] = []
  sirali.forEach((n, i) => {
    if (i > 0) {
      const onceki = sirali[i - 1]
      if (n - onceki === 2) sonuc.push(onceki + 1)
      else if (n - onceki > 2) sonuc.push(i === sirali.length - 1 ? 'nokta-2' : 'nokta-1')
    }
    sonuc.push(n)
  })
  return sonuc
}

/**
 * <Pagination>: sayfa numaralandırma. Her numara bir düğmedir (min 48 piksel), geçerli sayfa aria-current="page".
 * Önceki ve sonraki, uç sayfada devre dışıdır.
 */
export function Pagination({ toplam, sayfa, onChange, komsu = 1, etiket = 'Sayfalama', className }: { toplam: number; sayfa: number; onChange: (s: number) => void; komsu?: number; etiket?: string; className?: string }) {
  const liste = sayfaListesi(toplam, sayfa, komsu)
  return (
    <nav aria-label={etiket} className={cx(className)} data-sayfalama={sayfa} data-toplam={toplam}>
      <ul className="sayfalama-liste">
        <li>
          <button type="button" className="sayfa-d" disabled={sayfa <= 1} onClick={() => onChange(sayfa - 1)} aria-label="Önceki sayfa" data-onceki="">
            <Ikon ad="ok-sol" className="!size-4" />
            <span className="max-[479px]:sr-only">Önceki</span>
          </button>
        </li>
        {liste.map((n) =>
          typeof n === 'number' ? (
            <li key={n}>
              <button type="button" className="sayfa-d" aria-current={n === sayfa ? 'page' : undefined} aria-label={`Sayfa ${n}`} onClick={() => onChange(n)} data-no={n}>
                {n}
              </button>
            </li>
          ) : (
            <li key={n} aria-hidden="true">
              <span className="sayfa-nokta">…</span>
            </li>
          ),
        )}
        <li>
          <button type="button" className="sayfa-d" disabled={sayfa >= toplam} onClick={() => onChange(sayfa + 1)} aria-label="Sonraki sayfa" data-sonraki="">
            <span className="max-[479px]:sr-only">Sonraki</span>
            <Ikon ad="ok-sag" className="!size-4" />
          </button>
        </li>
      </ul>
    </nav>
  )
}
