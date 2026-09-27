import { useMemo, useState } from 'react'
import { HoloCanvas } from '../components/HoloCanvas'
import { HoloButton, HoloPanel, PanelHead, SectionHead, Segmented } from '../components/ui'
import { HoloIcon } from '../components/Icons'
import { embeddingCloud, icosphere, lattice, merge, ring, type Mesh } from '../lib/geo3d'
import { useHolo } from '../lib/store'

type Obj = 'kure' | 'kafes' | 'gomme'
const BASE_ZOOM: Record<Obj, number> = { kure: 0.8, kafes: 1, gomme: 1.1 }
const OBJECTS: ReadonlyArray<{ id: Obj; label: string; desc: string }> = [
  { id: 'kure', label: 'Veri küresi', desc: 'İki kez bölünmüş ikosfer ve iki eğik yörünge halkası.' },
  { id: 'kafes', label: 'Tensör kafesi', desc: '5 × 5 × 5 düğümlü küp kafes; her düğüm eksenleri boyunca komşusuna bağlı.' },
  { id: 'gomme', label: 'Gömme uzayı', desc: 'Altair Gömme modelinin iki kümesi: kod belgeleri ve sohbet kayıtları; seyrek noktalar diğer.' },
]

/** 3B görüntüleyici (Madde 11 · 16): sürükle ya da ok tuşlarıyla döndür, + / − ile yakınlaş, dönmeyi durdur */
export function Viewer() {
  const s = useHolo()
  const [obj, setObj] = useState<Obj>('kure')
  const [playing, setPlaying] = useState(true)
  const [zoom, setZoom] = useState(1)
  const meshes = useMemo<Record<Obj, Mesh>>(
    () => ({
      kure: merge(icosphere(2, 1), ring(1.4, 120, 1.2), ring(1.62, 140, -0.5, 0.3)),
      kafes: lattice(5, 1.5),
      gomme: embeddingCloud(),
    }),
    [],
  )
  const mesh = meshes[obj]
  const info = OBJECTS.find((o) => o.id === obj)!
  const zoomBy = (d: number) => setZoom((z) => Math.max(0.6, Math.min(1.6, +(z + d).toFixed(2))))

  return (
    <section id="goruntuleyici" className="px-4 py-20 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="11 · 16"
          label="3B görüntüleyici"
          title="Uzayda yavaşça dönen veri"
          lede="Model ağırlıkları, tensörler ve gömme vektörleri boşlukta süzülen tel kafes nesneler olarak. Nesne kendiliğinden yavaşça döner; sürükleyerek ya da ok tuşlarıyla çevirebilirsiniz."
        />
        <HoloPanel tick className="grid gap-6 p-4 md:p-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="holo-edge relative rounded-2xl border border-line-soft bg-[radial-gradient(ellipse_at_50%_45%,var(--glow),transparent_70%)]">
            <span className="dot-grid absolute inset-0 rounded-2xl" aria-hidden="true" />
            <HoloCanvas
              mesh={mesh}
              playing={playing}
              zoom={zoom * BASE_ZOOM[obj]}
              speed={0.22}
              interactive
              onZoom={zoomBy}
              label={`${info.label}. ${info.desc}`}
              describedBy="goruntuleyici-ipucu"
              className="h-[340px] overflow-hidden md:h-[440px]"
            />
            <p className="pointer-events-none absolute bottom-3 left-4 font-tech text-[12px] text-muted tabular-nums" aria-hidden="true">
              {mesh.points.length} nokta · {mesh.edges.length} kenar · yakınlık {Math.round(zoom * 100)}%
            </p>
          </div>
          <div className="flex min-w-0 flex-col gap-5">
            <PanelHead title="Nesne" icon={<HoloIcon name="kup" size={16} />} />
            <Segmented<Obj> legend="Görüntülenen nesne" hideLegend name="nesne" value={obj} onChange={setObj} options={OBJECTS} size="sm" />
            <p className="text-[15px] text-muted">{info.desc}</p>
            {obj === 'gomme' ? (
              <ul className="flex flex-col gap-2 text-[14px]" aria-label="Kümeler">
                {[
                  ['Kod belgeleri', 'var(--series-a)'],
                  ['Sohbet kayıtları', 'var(--series-b)'],
                  ['Diğer', 'var(--muted)'],
                ].map(([k, c]) => (
                  <li key={k} className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full" style={{ background: c, boxShadow: `0 0 8px ${c}` }} aria-hidden="true" />
                    {k}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <HoloButton size="sm" onClick={() => setPlaying((p) => !p)} aria-pressed={!playing} icon={<HoloIcon name={playing ? 'duraklat' : 'oynat'} size={14} glow={false} />}>
                {playing ? 'Dönmeyi durdur' : 'Döndür'}
              </HoloButton>
              <HoloButton size="sm" onClick={() => zoomBy(-0.1)} aria-label="Uzaklaş" disabled={zoom <= 0.6}>
                −
              </HoloButton>
              <HoloButton size="sm" onClick={() => zoomBy(0.1)} aria-label="Yakınlaş" disabled={zoom >= 1.6}>
                +
              </HoloButton>
              <HoloButton size="sm" variant="ghost" onClick={() => setZoom(1)}>
                Sıfırla
              </HoloButton>
            </div>
            <p id="goruntuleyici-ipucu" className="text-[13px] text-muted">
              Görüntüleyiciye odaklanıp ok tuşlarıyla döndürün, + ve − ile yakınlaşın.
              {s.motion === 'kapali' ? ' Hareket kapalı: nesne kendiliğinden dönmez.' : ''}
            </p>
          </div>
        </HoloPanel>
      </div>
    </section>
  )
}
