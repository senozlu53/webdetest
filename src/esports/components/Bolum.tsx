import { useId, type ReactNode } from 'react'
import { cx } from '../../shared/cx'
import { Ayrac } from './Kart'

/** Bölüm: küçük künye, eğik şeritli başlık, ayraç ve giriş metni */
export function Bolum({ id, no, toplam = 14, madde, baslik, lead, children, className }: { id: string; no: string; toplam?: number; madde: string; baslik: string; lead?: ReactNode; children: ReactNode; className?: string }) {
  const hid = useId()
  return (
    <section id={id} aria-labelledby={hid} className={cx('scroll-mt-[9rem] py-[var(--bolum)]', className)} data-bolum={id}>
      <div className="kap">
        <p className="t-etiket t-soluk">
          <span className="rakam yazi-vurgu">
            {no} / {String(toplam).padStart(2, '0')}
          </span>{' '}
          · {madde}
        </p>
        <h2 id={hid} className="baslik-h2 mt-3">
          {baslik}
        </h2>
        <Ayrac className="mt-5" />
        {lead ? <p className="lead mt-6 max-w-[62ch]">{lead}</p> : null}
      </div>
      <div className="kap mt-12">{children}</div>
    </section>
  )
}
