import { useState } from 'react'
import { HIZLI_SKOR, TAKIMLAR, DURUM_AD } from '../lib/data'
import { useEsports } from '../lib/store'
import { SlantedButton } from './Dugme'

const uzun = (k: string) => TAKIMLAR.find((t) => t.kisa === k)?.ad ?? k

function Liste({ kopya = false }: { kopya?: boolean }) {
  return (
    <ul className={kopya ? 'serit-liste serit-kopya' : 'serit-liste'} aria-hidden={kopya ? 'true' : undefined} data-serit-liste={kopya ? 'kopya' : 'asil'}>
      {HIZLI_SKOR.map((m, i) => (
        <li key={i} className="serit-oge" data-durum={m.durum}>
          <span className="sr-only">
            {DURUM_AD[m.durum]}: {uzun(m.a)} {m.durum === 'yakinda' ? 'saat' : 'skor'} {m.s} {uzun(m.b)}
          </span>
          <span aria-hidden="true">{m.a}</span>
          <span className="serit-skor rakam" aria-hidden="true">
            <span>{m.s}</span>
          </span>
          <span aria-hidden="true">{m.b}</span>
          {m.durum === 'canli' ? <span className="canli-nokta" aria-hidden="true" /> : null}
        </li>
      ))}
    </ul>
  )
}

/**
 * Hızlı kayan turnuva skoru (Madde 16). Kayan alanın üstüne gelince ve "Duraklat" ile durur (WCAG 2.2.2);
 * hareket kapalıyken kaymaz, skorlar satır satır durağan listelenir. İkinci kopya ekran okuyucudan gizlidir.
 */
export function SkorSeridi() {
  const [dur, setDur] = useState(false)
  const { hareket, duyur } = useEsports()
  return (
    <section className="serit" aria-label="Turnuva skorları" data-serit="" data-dur={dur ? '' : undefined}>
      <div className="flex items-stretch">
        {hareket ? (
          <div className="flex shrink-0 items-center px-3">
            <SlantedButton
              dar
              ton="hayalet"
              aria-pressed={dur}
              onClick={() => {
                setDur(!dur)
                duyur(dur ? 'Skor şeridi oynatılıyor' : 'Skor şeridi duraklatıldı')
              }}
              data-serit-dur=""
            >
              {dur ? 'Oynat' : 'Duraklat'}
            </SlantedButton>
          </div>
        ) : null}
        <div className="serit-pencere min-w-0 flex-1 overflow-hidden">
          <div className="serit-ray" data-serit-ray="">
            <Liste />
            <Liste kopya />
          </div>
        </div>
      </div>
    </section>
  )
}
