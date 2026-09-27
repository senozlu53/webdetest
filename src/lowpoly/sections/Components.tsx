import { useState, type CSSProperties } from 'react'
import { ShuffleIcon } from '@phosphor-icons/react'
import { FacetButton, FacetField, Glass, SectionHead } from '../components/ui'
import { POSTERS } from '../three/posters'

const GALLERY = [
  { img: POSTERS.kristal, title: 'Kristal', meta: 'Oyun ödülü', shape: 'polygon(50% 0, 100% 28%, 84% 100%, 16% 100%, 0 28%)', hover: 'polygon(50% 0, 100% 0, 100% 100%, 0 100%, 0 0)' },
  { img: POSTERS.agac, title: 'Ağaç', meta: 'Peyzaj seti', shape: 'polygon(0 12%, 64% 0, 100% 18%, 92% 100%, 6% 88%)', hover: 'polygon(0 0, 64% 0, 100% 0, 100% 100%, 0 100%)' },
  { img: POSTERS.kaya, title: 'Kaya', meta: 'Sahne dolgusu', shape: 'polygon(10% 0, 100% 8%, 100% 76%, 70% 100%, 0 92%)', hover: 'polygon(0 0, 100% 0, 100% 100%, 70% 100%, 0 100%)' },
]

const R3F = `import { Canvas } from '@react-three/fiber'
import kristal from './assets/kristal.glb?url'

<Canvas flat frameloop={visible ? 'always' : 'never'}>
  <directionalLight position={[-5, 7, 5]} intensity={3.2} />
  <Suspense fallback={null}>
    <ShatterModel url={kristal} follow shattered={on} />
  </Suspense>
</Canvas>`

export function Components() {
  const [seed, setSeed] = useState(21)
  return (
    <section id="bilesenler" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="11 · 14"
          label={<span lang="en">UI Component Patterns</span>}
          title="Maskeli görsel, parçalı zemin"
          lede="Görseller poligon biçiminde kesilir ve üzerine gelince açılır. Arka planlar üretken çokgen ağlardır. 3B varlıklar React Three Fiber ile sayfaya yerleşir ve imleci izler."
        />
        <ul className="grid gap-6 md:grid-cols-3">
          {GALLERY.map((g) => (
            <li key={g.title} className="group">
              <figure>
                <div
                  className="aspect-[4/3] overflow-hidden transition-[clip-path] duration-500 ease-out [clip-path:var(--shape)] group-hover:[clip-path:var(--hover)] motion-reduce:transition-none"
                  style={{ '--shape': g.shape, '--hover': g.hover } as CSSProperties}
                >
                  <img src={g.img} alt={`${g.title} modelinin düşük poligon görüntüsü`} className="h-full w-full object-cover" />
                </div>
                <figcaption className="mt-3">
                  <span className="font-display text-lg font-bold">{g.title}</span>
                  <span className="block text-[14px] text-muted">{g.meta}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="relative isolate min-h-72 overflow-hidden">
            <div className="absolute inset-0 -z-10">
              <FacetField key={seed} seed={seed} cols={12} rows={7} animate />
            </div>
            <Glass className="absolute right-4 bottom-4 left-4 flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-display font-bold">Üretken çokgen zemin</p>
                <p className="font-mono text-[12px] text-muted">tohum {seed} · 168 üçgen</p>
              </div>
              <FacetButton variant="ghost" onClick={() => setSeed((s) => (s * 7 + 13) % 997)} icon={<ShuffleIcon size={18} weight="bold" aria-hidden="true" />}>
                Yeni desen
              </FacetButton>
            </Glass>
          </div>
          <Glass className="flex flex-col gap-4 p-6">
            <h3 className="text-xl font-bold">React Three Fiber · Madde 14</h3>
            <p className="text-[15px] text-muted">
              Modeller GLB dosyasıdır (<span className="font-mono text-ink">scripts/lowpoly-glb.mjs</span> üretir: paylaşımsız köşeler, yüz başına normal, köşe
              rengi). <span className="font-mono text-ink">useLoader(GLTFLoader)</span> ile yüklenir, sahne DOM'un içinde bir canvas'tır. three.js yalnızca sahne
              gerektiğinde indirilir; görünmeyen sahne çizilmez.
            </p>
            <pre className="overflow-x-auto border border-line bg-bg p-4 font-mono text-[12.5px] leading-relaxed">
              <code>{R3F}</code>
            </pre>
          </Glass>
        </div>
      </div>
    </section>
  )
}
