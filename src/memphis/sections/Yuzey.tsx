import { useId, useState } from 'react'
import { MemphisCard } from '../components/MemphisCard'
import { PopButton } from '../components/PopButton'
import { Konfeti, Sekil } from '../components/Shapes'
import { IKONLAR, Ikon, UiIkon } from '../components/Icons'
import { Aralik, Kod, Section, Secim } from '../components/ui'
import { sarmal } from '../lib/rastgele'
import type { Ton } from '../lib/data'

type Desen = 'halftone' | 'polka' | 'cizgi' | 'kademe'
const RENK: Record<string, string> = { lacivert: '#073B4C', pembe: '#EF476F', camgobegi: '#06D6A0', hardal: '#FFD166' }

/** Madde 8: nokta vuruşlu zeminler ve konfeti */
export function Doku() {
  const pid = useId().replace(/:/g, '')
  const [desen, setDesen] = useState<Desen>('halftone')
  const [nokta, setNokta] = useState(3)
  const [aralik, setAralik] = useState(16)
  const [aci, setAci] = useState(0)
  const [renk, setRenk] = useState('lacivert')
  const c = RENK[renk]
  const css =
    desen === 'halftone'
      ? `/* Pattern/Halftone */\nbackground-image: radial-gradient(circle, ${c} ${nokta}px, transparent ${nokta + 0.6}px);\nbackground-size: ${aralik}px ${aralik}px;`
      : desen === 'polka'
        ? `background-image:\n  radial-gradient(circle, ${c} 22%, transparent 23%),\n  radial-gradient(circle, ${c} 22%, transparent 23%);\nbackground-size: ${aralik * 2}px ${aralik * 2}px;\nbackground-position: 0 0, ${aralik}px ${aralik}px;`
        : desen === 'cizgi'
          ? `background-image: repeating-linear-gradient(${-45 + aci}deg,\n  ${c} 0 ${nokta}px, transparent ${nokta}px ${aralik}px);`
          : `/* Kademeli halftone: SVG, her sütunda nokta büyür */\nbackground-image: url("data:image/svg+xml,…");`
  const konfetiler = sarmal(21, 90).map((p, i) => ({ x: 50 + p.x / 1.9, y: 50 + p.y / 1.1, tur: (['cubuk', 'nokta', 'ucgen'] as const)[i % 3], ton: (['sari', 'camgobegi', 'pembe'] as Ton[])[(i * 2) % 3], r: (i * 47) % 180 }))
  return (
    <Section id="doku" madde="Madde 8 · Doku ve yüzey" title="Nokta nokta" vurgu="doku" ton="camgobegi" sekil="daire" lead="Arka planlar nokta vuruşlu: halftone, puantiye, çizgi. Desen yüzeyi doldurur ama yazının arkasına girmez; metin her zaman düz bir kartta durur.">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.618fr_1fr]">
        <div className="relative min-h-[340px] min-w-0 overflow-hidden rounded-[18px] border-[4px] border-ink bg-paper shadow-[8px_8px_0_var(--shadow)]" data-desen-onizleme={desen}>
          <svg className="absolute inset-0 size-full" aria-hidden="true">
            <defs>
              {desen === 'kademe' ? (
                <pattern id={`${pid}k`} width={aralik * 12} height={aralik} patternUnits="userSpaceOnUse" patternTransform={`rotate(${aci})`}>
                  {Array.from({ length: 12 }, (_, i) => (
                    <circle key={i} cx={i * aralik + aralik / 2} cy={aralik / 2} r={Math.max(0.6, ((i + 1) / 12) * (aralik / 2) * (nokta / 3.5))} fill={c} />
                  ))}
                </pattern>
              ) : (
                <pattern id={`${pid}k`} width={desen === 'polka' ? aralik * 2 : aralik} height={desen === 'polka' ? aralik * 2 : aralik} patternUnits="userSpaceOnUse" patternTransform={`rotate(${aci})`}>
                  {desen === 'halftone' ? <circle cx={aralik / 2} cy={aralik / 2} r={nokta} fill={c} /> : null}
                  {desen === 'polka' ? (
                    <>
                      <circle cx={aralik / 2} cy={aralik / 2} r={aralik * 0.44} fill={c} />
                      <circle cx={aralik * 1.5} cy={aralik * 1.5} r={aralik * 0.44} fill={c} />
                    </>
                  ) : null}
                  {desen === 'cizgi' ? <rect width={nokta} height={aralik} fill={c} transform={`rotate(-45 ${aralik / 2} ${aralik / 2})`} /> : null}
                </pattern>
              )}
            </defs>
            <rect width="100%" height="100%" fill={`url(#${pid}k)`} />
          </svg>
          <MemphisCard kimlik="doku-kart" ton="beyaz" aci={3} className="relative m-8 max-w-[320px] rounded-[18px] p-5 md:m-12">
            <p className="dev text-[clamp(22px,7vw,28px)]">Yazı düz zeminde</p>
            <p className="mt-2 text-[15px]">Desen kartın dışında kalır. Böylece noktalar harflerin kenarını bozmaz.</p>
          </MemphisCard>
        </div>
        <MemphisCard kimlik="doku-kontrol" ton="beyaz" aci={1} oyuncak={false} className="grid min-w-0 grid-cols-1 content-start gap-5 rounded-[18px] p-6">
          <Secim<Desen> legend="Desen" name="doku-desen" value={desen} onChange={setDesen} options={[{ id: 'halftone', ad: 'Halftone' }, { id: 'polka', ad: 'Puantiye' }, { id: 'cizgi', ad: 'Çizgi' }, { id: 'kademe', ad: 'Kademeli' }]} />
          <Aralik label="Nokta" value={nokta} min={1} max={7} onChange={setNokta} format={(v) => `${v}px`} />
          <Aralik label="Aralık" value={aralik} min={8} max={32} step={2} onChange={setAralik} format={(v) => `${v}px`} />
          <Aralik label="Açı" value={aci} min={0} max={45} step={15} onChange={setAci} format={(v) => `${v}°`} />
          <Secim legend="Renk" name="doku-renk" value={renk} onChange={setRenk} ton="camgobegi" options={[{ id: 'lacivert', ad: 'Lacivert' }, { id: 'pembe', ad: 'Pembe' }, { id: 'camgobegi', ad: 'Cam göbeği' }, { id: 'hardal', ad: 'Hardal' }]} />
        </MemphisCard>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Kod label="Desen CSS">{css + (aci && desen !== 'cizgi' ? '\n/* Döndürülmüş desen CSS arka planıyla değil, SVG <pattern patternTransform="rotate(…)"> ile */' : '')}</Kod>
        <div className="relative min-h-[200px] overflow-hidden rounded-[18px] border-[4px] border-ink bg-yellow-50" aria-label="Konfeti süsleri" role="group">
          {konfetiler.map((k, i) => (
            <Konfeti key={i} tur={k.tur} ton={k.ton} className="absolute" style={{ left: `${k.x}%`, top: `${k.y}%`, rotate: `${k.r}deg` }} />
          ))}
          <div className="absolute inset-0 grid place-items-center">
            <PopButton ton="pembe" konfeti data-konfeti-at="">
              Konfeti at
            </PopButton>
          </div>
        </div>
      </div>
    </Section>
  )
}

const IKON_SIRA = Object.keys(IKONLAR) as (keyof typeof IKONLAR)[]

/** Madde 9: kaba, kalın çerçeveli, içi düz renkli ikonlar */
export function Ikonlar() {
  const [boy, setBoy] = useState<'32' | '48' | '72'>('48')
  return (
    <Section id="ikon" madde="Madde 9 · İkonografi" title="Kaba ve" vurgu="kalın" ton="sari" sekil="yarim" lead="İkonlar soyut: birkaç primitif, 4 piksel lacivert kontur, içi düz renk. Kontur ikon büyüse de küçülse de 4 piksel kalır (vector-effect: non-scaling-stroke).">
      <Secim legend="Boy" name="ikon-boy" value={boy} onChange={setBoy} options={[{ id: '32', ad: '32px' }, { id: '48', ad: '48px' }, { id: '72', ad: '72px' }]} />
      <ul className="m-0 mt-8 grid list-none grid-cols-2 gap-5 p-0 sm:grid-cols-4 lg:grid-cols-6">
        {IKON_SIRA.map((ad) => (
          <MemphisCard as="li" key={ad} kimlik={`ikon-${ad}`} ton="beyaz" aci={2.5} className="grid justify-items-center gap-3 rounded-[16px] p-4 text-center">
            <Ikon ad={ad} boyut={+boy} />
            <span className="font-bold">{IKONLAR[ad].ad}</span>
          </MemphisCard>
        ))}
      </ul>
      <div className="mt-10 flex flex-wrap items-center gap-6">
        <p className="max-w-[46ch]">
          Arayüz oklarını ve tik işaretini yazı tipi değil çizim verir; Syne ve Epilogue'da ok glifi yok. <UiIkon ad="ok" className="inline align-middle" />
        </p>
        <div className="flex gap-3" aria-hidden="true">
          <Sekil tur="arti" ton="pembe" boyut={40} golge />
          <Sekil tur="daire" ton="camgobegi" boyut={40} golge />
        </div>
      </div>
    </Section>
  )
}
