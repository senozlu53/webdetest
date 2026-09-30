import { useEffect, useRef, useState } from 'react'
import { OZEL_SOHBET, SOHBET } from '../lib/data'
import { useEsports } from '../lib/store'
import { SlantedButton } from './Dugme'
import { EsportsCard } from './Kart'
import { Aralik } from './ui'

const KALITE = ['720p60', '1080p60', '1440p120'] as const

/** sabit sahte dalgalanma: test edilebilir, rastgelelik yok */
const dalga = (n: number) => ((n * 7919) % 41) - 17

/**
 * Canlı yayın entegrasyon paneli (Madde 11). Bu bir simülasyondur: harici oynatıcı ya da ağ isteği yoktur.
 * Sahne SVG'dir; izleyici sayısı ve sohbet yazılı senaryodan akar. Oynat/duraklat, ses, kalite ve sohbeti dondurma denetlenir.
 * Hareket kapalıyken akış durur ve sohbet durağan gösterilir.
 */
export function LivePanel() {
  const { hareket, duyur } = useEsports()
  const [oynuyor, setOynuyor] = useState(true)
  const [sohbetDon, setSohbetDon] = useState(false)
  const [kalite, setKalite] = useState<(typeof KALITE)[number]>('1080p60')
  const [ses, setSes] = useState(60)
  const [izleyici, setIzleyici] = useState(18432)
  const [satirlar, setSatirlar] = useState(() => SOHBET.slice(0, 5).map((s, i) => ({ ...s, id: i })))
  const say = useRef(5)
  const akis = hareket && oynuyor
  useEffect(() => {
    if (!akis) return
    const t = window.setInterval(() => {
      const n = say.current++
      setIzleyici((v) => v + dalga(n))
      if (!sohbetDon) setSatirlar((s) => [...s, { ...SOHBET[n % SOHBET.length], id: n }].slice(-6))
    }, 2200)
    return () => window.clearInterval(t)
  }, [akis, sohbetDon])
  return (
    <EsportsCard kesim="kose" className="p-0" data-yayin-panel="">
      <div className="yayin">
        <div className="min-w-0">
          <div className="yayin-sahne" data-yayin-sahne="" data-durdu={akis ? undefined : ''}>
            <svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
              <rect width="160" height="90" fill="#05060a" />
              <path d="M0 62L160 62M0 70L160 70M0 80L160 80M0 90L160 90" stroke="#00f0ff" strokeOpacity=".16" strokeWidth=".4" />
              <path d="M80 58L-20 90M80 58L20 90M80 58L60 90M80 58L100 90M80 58L140 90M80 58L180 90" stroke="#00f0ff" strokeOpacity=".16" strokeWidth=".4" />
              <path d="M0 58H160" stroke="#39ff14" strokeOpacity=".5" strokeWidth=".5" />
              <path d="M14 20L34 14L44 24L36 44L16 44Z" fill="#12141a" stroke="#00f0ff" strokeWidth=".8" />
              <path d="M112 12L146 12L146 34L128 46L112 34Z" fill="#12141a" stroke="#39ff14" strokeWidth=".8" />
              <path d="M52 30L76 30L84 38L76 46L52 46Z" fill="#00f0ff" fillOpacity=".12" stroke="#00f0ff" strokeWidth=".5" />
              <path d="M88 26L106 22L110 30L98 40Z" fill="#39ff14" fillOpacity=".12" stroke="#39ff14" strokeWidth=".5" />
              <circle cx="80" cy="34" r="2" fill="#ff4500" />
              <text x="80" y="66" textAnchor="middle" fill="#f2f6fa" fontFamily="'Orbitron Variable', sans-serif" fontSize="10" fontWeight="800">
                1 – 1
              </text>
              <text x="80" y="73" textAnchor="middle" fill="#b4c0cf" fontFamily="Rajdhani, sans-serif" fontSize="3.4" fontWeight="700" letterSpacing=".6">
                KARAR RAUNDU · SEKTÖR 7
              </text>
            </svg>
            <span className="yayin-tarama" aria-hidden="true" />
            <div className="yayin-ust">
              <span className="canli-rozet">
                <span className="canli-nokta" aria-hidden="true" />
                Canlı
              </span>
              <span className="rakam bg-[#f2f6fa] px-2 text-[0.9375rem] font-bold text-[#0d0e12]" data-izleyici={izleyici}>
                {izleyici.toLocaleString('tr-TR')} izleyici
              </span>
            </div>
            <div className="yayin-hud">
              <p className="rakam text-[0.9375rem] font-bold" aria-hidden="true">
                V9 · GH
              </p>
              <p className="rakam text-[0.9375rem] font-bold" data-kalite={kalite}>
                {kalite}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-end gap-x-6 gap-y-4 p-5">
            <SlantedButton
              dar
              ton="birincil"
              aria-pressed={oynuyor}
              onClick={() => {
                setOynuyor(!oynuyor)
                duyur(oynuyor ? 'Yayın duraklatıldı' : 'Yayın oynatılıyor')
              }}
              data-yayin-oynat=""
            >
              {oynuyor ? 'Duraklat' : 'Oynat'}
            </SlantedButton>
            <div className="min-w-[180px] flex-1">
              <Aralik id="yayin-ses" label="Ses" value={ses} min={0} max={100} onChange={setSes} format={(v) => `%${v}`} />
            </div>
            <div className="min-w-[150px]">
              <label htmlFor="yayin-kalite" className="t-etiket block">
                Kalite
              </label>
              <select id="yayin-kalite" className="alan mt-2" value={kalite} onChange={(e) => setKalite(e.target.value as (typeof KALITE)[number])} data-yayin-kalite="">
                {KALITE.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="flex min-w-0 flex-col">
          <div className="yayin-sohbet flex-1" data-sohbet="">
            <p className="t-etiket t-soluk">Sohbet</p>
            <ul aria-label="Sohbet akışı (bilgi amaçlı, duyurulmaz)" aria-live="off" className="grid gap-2">
              {satirlar.map((s) => (
                <li key={s.id} className="sohbet-satir" data-sohbet-satir="">
                  <b>{s.kim}</b>
                  {s.metin}
                </li>
              ))}
            </ul>
          </div>
          <div className="border-l-4 border-[color:var(--vurgu)] bg-[#0a0b0e] p-4 pt-2">
            {hareket ? (
              <SlantedButton dar ton="hayalet" aria-pressed={sohbetDon} onClick={() => setSohbetDon(!sohbetDon)} data-sohbet-don="">
                {sohbetDon ? 'Sohbeti sürdür' : 'Sohbeti dondur'}
              </SlantedButton>
            ) : (
              <p className="t-alt">Hareket durduğu için akış durağan.</p>
            )}
            <p className="t-alt mt-2 text-[0.9375rem]">{OZEL_SOHBET}</p>
          </div>
        </div>
      </div>
    </EsportsCard>
  )
}
