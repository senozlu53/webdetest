import { DURUM_AD, type Mac } from '../lib/data'
import { EsportsCard } from './Kart'

/**
 * Maç takvimi zaman çizelgesi (Madde 11 · Activity Timeline). Sıralı liste: sol kolonda saat, ortada elmas düğüm,
 * sağda eğik kart. Canlı maç turuncu ve nabız atar, `aria-current="step"` taşır; yaklaşan maçlar neon vurguludur.
 */
export function MacTakvimi({ maclar }: { maclar: Mac[] }) {
  return (
    <ol className="takvim" aria-label="Maç takvimi" data-takvim="">
      {maclar.map((m) => {
        const canli = m.durum === 'canli'
        return (
          <li key={m.id} className="takvim-oge" data-durum={m.durum} data-mac={m.id} aria-current={canli ? 'step' : undefined}>
            <div className="takvim-zaman">
              <p className="rakam text-[1.25rem] font-bold">{m.saat}</p>
              <p className="t-etiket t-soluk">{m.gun}</p>
            </div>
            <div className="takvim-hat" aria-hidden="true">
              <span className="takvim-dugum" />
            </div>
            <EsportsCard kesim="egik" vurgu={canli ? 'turuncu' : m.durum === 'yakinda' ? 'lime' : 'mavi'} parlama={canli} className="p-4 sm:p-5" sarmal="min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <p className="t-etiket t-soluk">
                  {m.tur}
                  <span className="takvim-ic-zaman rakam">
                    {' '}
                    · {m.gun} {m.saat}
                  </span>
                </p>
                <span className="durum-cip" data-durum={m.durum}>
                  {DURUM_AD[m.durum]}
                </span>
              </div>
              <p className="t-h3 mt-3 !text-[1.25rem] break-words">
                {m.a}
                <span className="rakam mx-3 inline-block bg-[#f2f6fa] px-3 py-0.5 text-[1.0625rem] text-[#0d0e12]" data-skor="">
                  {m.skor ? `${m.skor[0]}–${m.skor[1]}` : 'VS'}
                </span>
                {m.b}
              </p>
            </EsportsCard>
          </li>
        )
      })}
    </ol>
  )
}
