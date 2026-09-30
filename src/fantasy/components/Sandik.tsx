import { useState } from 'react'
import { ESYALAR, GANIMET } from '../lib/data'
import { useOyun } from '../lib/oyun'
import { useFantasy } from '../lib/store'
import { useYaldiz } from '../lib/yaldiz'
import { Ikon } from './Ikon'
import { Buton } from './ui'

/**
 * <Sandik>: kapak katlanarak açılır (Madde 16). Kapağın ön yüzü menteşe çizgisine doğru ölçeklenip kaybolur,
 * iç yüzü (kırmızı astar) yukarı doğru açılır; içeriden ışık ve altın yaldız çıkar. Ganimet sabittir.
 */
export function Sandik() {
  const { ekle, altinEkle } = useOyun()
  const { hareket, duyur } = useFantasy()
  const { patlat } = useYaldiz()
  const [acik, setAcik] = useState(false)
  const [alindi, setAlindi] = useState(false)
  const ac = (e: React.MouseEvent) => {
    setAcik(true)
    setAlindi(false)
    duyur('Sandık açıldı')
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
    patlat(r.left + r.width / 2, r.top + r.height * 0.4, 30)
  }
  const yagmala = () => {
    for (const g of GANIMET) {
      if (g.id === 'altin-sikke') altinEkle(g.adet)
      else ekle(g.id, g.adet)
    }
    setAlindi(true)
    duyur('Ganimet envantere eklendi')
  }
  return (
    <div className="sandik-kap" data-sandik={acik ? 'acik' : 'kapali'} data-alindi={alindi ? '' : undefined}>
      <button type="button" className="sandik-dugme" aria-label={acik ? 'Sandık açık' : 'Sandığı aç'} aria-pressed={acik} disabled={acik} onClick={ac} data-sandik-ac="" data-sessiz="">
        <svg viewBox="0 0 160 130" className="sandik-svg" aria-hidden="true" focusable="false">
          <g className="sandik-isik">
            <ellipse cx="80" cy="56" rx="62" ry="34" fill="#ffe9a0" fillOpacity=".28" />
            <path d="M80 56 L30 4 M80 56 L80 0 M80 56 L130 4 M80 56 L8 30 M80 56 L152 30" stroke="#ffe9a0" strokeOpacity=".5" strokeWidth="3" strokeLinecap="round" />
          </g>
          <rect x="22" y="62" width="116" height="56" rx="3" fill="url(#g-ahsap)" stroke="#17110a" strokeWidth="2" />
          <path d="M22 78H138M22 96H138" stroke="#17110a" strokeOpacity=".3" strokeWidth="1.2" />
          <rect x="30" y="62" width="12" height="56" fill="url(#g-celik)" stroke="#17110a" strokeWidth="1.5" />
          <rect x="118" y="62" width="12" height="56" fill="url(#g-celik)" stroke="#17110a" strokeWidth="1.5" />
          <g className="sandik-ic-dolgu">
            <rect x="26" y="58" width="108" height="10" fill="#120d08" />
            {[36, 52, 68, 84, 100, 116].map((x, i) => (
              <ellipse key={x} cx={x} cy={57 - (i % 2) * 2} rx="9" ry="4" fill="url(#g-altin)" stroke="#17110a" strokeWidth="1.2" />
            ))}
          </g>
          <g className="sandik-kapak-ic">
            <path d="M26 58 V40 C26 26 48 20 80 20 C112 20 134 26 134 40 V58 Z" fill="url(#g-kan)" stroke="#17110a" strokeWidth="2" />
            <path d="M32 54 V42 C32 32 52 26 80 26 C108 26 128 32 128 42 V54" fill="none" stroke="url(#g-altin)" strokeWidth="3" />
          </g>
          <g className="sandik-kapak-dis">
            <path d="M22 66 V44 C22 26 46 16 80 16 C114 16 138 26 138 44 V66 Z" fill="url(#g-ahsap)" stroke="#17110a" strokeWidth="2" />
            <path d="M28 44 C34 30 54 22 80 22" fill="none" stroke="#fff" strokeOpacity=".25" strokeWidth="2.4" strokeLinecap="round" />
            <rect x="30" y="18" width="12" height="48" fill="url(#g-celik)" stroke="#17110a" strokeWidth="1.5" />
            <rect x="118" y="18" width="12" height="48" fill="url(#g-celik)" stroke="#17110a" strokeWidth="1.5" />
            <path d="M68 52 H92 V78 H68 Z" fill="url(#g-altin)" stroke="#17110a" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="80" cy="61" r="4" fill="#17110a" />
            <path d="M77.500 63 H82.500 L84 73 H76 Z" fill="#17110a" />
          </g>
        </svg>
      </button>
      <div className="sandik-alt" aria-live="polite">
        {!acik ? (
          <p className="t-alt">Sandık kilitsiz. Kapağına dokun.</p>
        ) : (
          <>
            <ul className="sandik-ganimet" data-ganimet="">
              {GANIMET.map((g, i) => {
                const e = ESYALAR.find((x) => x.id === g.id)!
                return (
                  <li key={g.id} className="ganimet" style={{ ['--i' as string]: i }} data-ganimet-id={g.id}>
                    <Ikon ad={e.ikon} boy={44} />
                    <span className="min-w-0">
                      <span className="block leading-tight font-semibold">{e.ad}</span>
                      <span className="rakam t-alt">× {g.adet}</span>
                    </span>
                  </li>
                )
              })}
            </ul>
            <div className="mt-3 flex flex-wrap gap-2">
              <Buton ton="altin" onClick={yagmala} disabled={alindi} data-yagmala="">
                {alindi ? 'Yağmalandı' : 'Yağmala'}
              </Buton>
              <Buton
                ton="yalin"
                onClick={() => {
                  setAcik(false)
                  setAlindi(false)
                }}
                data-sandik-kapat=""
              >
                Kapağı kapat
              </Buton>
            </div>
          </>
        )}
        <p className="sr-only">{hareket ? 'Hareket açık' : 'Hareket kapalı: sandık anında açılır'}</p>
      </div>
    </div>
  )
}
