import { useId } from 'react'
import { Ikon } from './Ikon'

export interface Makale {
  no: string
  baslik: string
  yazar: string
  dk: number
  kategori: string
  dek: string
  metin: readonly string[]
}

/**
 * Açılır kapanır editoryal makale kartı. Başlık bir düğmedir (aria-expanded); panel açılınca yalnız solar (240 ms),
 * yer değiştirmez. Kapalı panel `hidden`, odak sırasından çıkar.
 */
export function ArticleCard({ makale, acik, onToggle }: { makale: Makale; acik: boolean; onToggle: () => void }) {
  const pid = useId()
  const bid = useId()
  return (
    <article className="makale" data-makale={makale.no}>
      <h3 className="m-0">
        <button type="button" id={bid} className="makale-d" aria-expanded={acik} aria-controls={pid} onClick={onToggle}>
          <span className="rakam t-alt">{makale.no}</span>
          <span className="min-w-0">
            <span className="t-etiket t-soluk block">
              {makale.kategori} · <span className="rakam">{makale.dk}</span> dk
            </span>
            <span className="makale-baslik t-h3 mt-1 block">{makale.baslik}</span>
          </span>
          <Ikon ad={acik ? 'eksi' : 'arti'} />
        </button>
      </h3>
      <div id={pid} role="region" aria-labelledby={bid} hidden={!acik} className="makale-panel gecis">
        <p className="t-dek max-w-[44ch]">{makale.dek}</p>
        {makale.metin.map((p) => (
          <p key={p.slice(0, 12)} className="t-govde olcu mt-4">
            {p}
          </p>
        ))}
        <p className="t-alt mt-4">{makale.yazar}</p>
      </div>
    </article>
  )
}
