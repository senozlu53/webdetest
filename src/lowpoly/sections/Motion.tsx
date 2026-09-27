import { useState, type CSSProperties } from 'react'
import poster from '../assets/hero-poster.webp'
import { FacetButton, Glass, SectionHead } from '../components/ui'
import { useSceneGate } from '../hooks/useSceneGate'

// Büyük origami kristal: her parça kendi ağırlık merkezinden dışarı savrulur
const PIECES: Array<[string, string]> = [
  ['70,30 130,30 100,80', '#f4ead0'],
  ['30,80 70,30 100,80', '#9fbfc0'],
  ['100,80 130,30 170,80', '#e8d8b0'],
  ['30,80 100,80 60,120', '#7a9e9f'],
  ['60,120 100,80 100,190', '#56797a'],
  ['100,80 140,120 100,190', '#314e52'],
  ['100,80 170,80 140,120', '#c7b68b'],
  ['30,80 60,120 100,190', '#44686d'],
  ['140,120 170,80 100,190', '#1f3336'],
]

function centroid(p: string) {
  const v = p.split(' ').map((s) => s.split(',').map(Number))
  return [(v[0][0] + v[1][0] + v[2][0]) / 3, (v[0][1] + v[1][1] + v[2][1]) / 3]
}

export function Motion({ sizes }: { sizes: { three: string; poster: string } }) {
  const [apart, setApart] = useState(false)
  const gate = useSceneGate()
  return (
    <section id="hareket" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="16 · 17"
          label="Hareket ve mobil"
          title="Parçalan, birleş, dur"
          lede="3B modeller kendi ekseninde döner ve imlece göre paralaks yapar; tıklamada üçgenlerine ayrılıp yeniden birleşir. Mobilde WebGL durur, yerini sahneden alınmış bir .webp kare alır."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <Glass className="flex flex-col gap-5 p-6">
            <h3 className="text-xl font-bold">Parçalanan origami</h3>
            <svg viewBox="-20 0 240 220" className="mx-auto w-full max-w-[320px]" role="img" aria-label={apart ? 'Kristal parçalarına ayrılmış' : 'Kristal bütün'}>
              {PIECES.map(([p, fill], i) => {
                const [cx, cy] = centroid(p)
                const dx = (cx - 100) * 0.9
                const dy = (cy - 100) * 0.9
                const rot = ((i * 47) % 60) - 30
                return (
                  <polygon
                    key={i}
                    points={p}
                    fill={fill}
                    stroke={fill}
                    strokeWidth={0.6}
                    strokeLinejoin="round"
                    style={
                      {
                        transformBox: 'fill-box',
                        transformOrigin: 'center',
                        transform: apart ? `translate(${dx}px, ${dy}px) rotate(${rot}deg)` : 'none',
                        transition: `transform 700ms cubic-bezier(0.2, 0.8, 0.2, 1) ${i * 25}ms`,
                      } as CSSProperties
                    }
                    className="motion-reduce:transition-none"
                  />
                )
              })}
            </svg>
            <FacetButton onClick={() => setApart((a) => !a)} aria-pressed={apart} className="self-start">
              {apart ? 'Birleştir' : 'Parçala'}
            </FacetButton>
            <p className="text-[14px] text-muted">
              Aynı fikir 3B'de: her üçgen normali boyunca savrulur ve kendi merkezi etrafında döner, normali de onunla döner; düz ışık bozulmaz. 700ms, parçalar 25ms
              arayla.
            </p>
          </Glass>

          <Glass className="flex flex-col gap-5 p-6">
            <h3 className="text-xl font-bold">Madde 17 · Mobilde durağan kare</h3>
            <img src={poster} alt="Hero sahnesinin durağan .webp karesi" className="facet-card aspect-[16/9] w-full object-cover" />
            <dl className="grid grid-cols-2 gap-px bg-line text-[14px]">
              {[
                ['Bu cihazda', gate.webgl ? 'WebGL sahnesi' : 'Durağan .webp'],
                ['Neden', gate.webgl ? (gate.reduced ? 'Geniş ekran · hareket azaltıldı' : 'Geniş ekran, kısıt yok') : gate.reason ?? ''],
                ['three.js + R3F', sizes.three],
                ['Durağan kare', sizes.poster],
              ].map(([k, v]) => (
                <div key={k} className="bg-bg px-3 py-2.5">
                  <dt className="text-muted">{k}</dt>
                  <dd className="font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="text-[14px] text-muted">
              768px altında, veri tasarrufunda ya da WebGL yoksa sahne yüklenmez: three.js parçası hiç indirilmez. İsteyen “3B sahneyi yükle” ile açar. Ekran dışındaki sahne
              çizilmez; başlıktaki düğme sahneyi durdurur. Video hero da aynı işi görür; bu sayfa daha hafif olduğu için .webp kullanır.
            </p>
          </Glass>
        </div>
      </div>
    </section>
  )
}
