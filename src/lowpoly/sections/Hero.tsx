import { lazy, Suspense, useRef, useState } from 'react'
import { PauseIcon, PlayIcon, CubeIcon } from '@phosphor-icons/react'
import poster from '../assets/hero-poster.webp'
import { FacetButton, Glass } from '../components/ui'
import { useSceneGate, useVisible } from '../hooks/useSceneGate'

// three.js yalnızca gerektiğinde indirilir: durağan görsel seçilirse hiç yüklenmez (Madde 17)
const HeroScene = lazy(() => import('../three/HeroScene'))

export function Hero({ dark }: { dark: boolean }) {
  const gate = useSceneGate()
  const ref = useRef<HTMLElement>(null)
  const visible = useVisible(ref)
  const [paused, setPaused] = useState(false)
  const [shattered, setShattered] = useState(false)
  const img = <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" />

  return (
    <section ref={ref} id="ust" className="grain relative isolate flex min-h-[640px] items-end overflow-hidden md:min-h-[88vh] md:items-center">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {gate.webgl ? (
          <Suspense fallback={img}>
            <HeroScene dark={dark} playing={visible && !paused} reduced={gate.reduced} shattered={shattered} onToggle={() => setShattered((s) => !s)} />
          </Suspense>
        ) : (
          img
        )}
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-8">
        {/* Madde 18: metin çokgen zeminin doğrudan üstünde değil, cam panelde */}
        <Glass className="facet-card max-w-[620px] p-7 md:p-10">
          <p className="font-display text-[13px] font-semibold tracking-[0.18em] text-muted uppercase">
            <span className="text-accent">Stil 009</span> · <span lang="en">3D / Spatial</span>
          </p>
          <h1 className="mt-4 text-5xl leading-[0.98] font-bold md:text-7xl">
            Keskin açılı
            <br />
            dijital origami
          </h1>
          <p className="mt-5 max-w-[46ch] text-lg text-muted">
            Yüzey detayını en aza indirip nesneleri düz gölgeli üçgenlerle kuran düşük poligon estetiği. Kristal imleci izler; tıklayınca parçalanır, yeniden birleşir.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {gate.webgl ? (
              <FacetButton onClick={() => setShattered((s) => !s)} aria-pressed={shattered} icon={<CubeIcon size={18} weight="bold" aria-hidden="true" />}>
                {shattered ? 'Kristali birleştir' : 'Kristali parçala'}
              </FacetButton>
            ) : null}
            {gate.webgl ? (
              <FacetButton
                variant="ghost"
                onClick={() => setPaused((p) => !p)}
                aria-pressed={paused}
                icon={paused ? <PlayIcon size={18} weight="fill" aria-hidden="true" /> : <PauseIcon size={18} weight="fill" aria-hidden="true" />}
              >
                {paused ? 'Sahneyi oynat' : 'Sahneyi durdur'}
              </FacetButton>
            ) : null}
            {gate.canOptIn ? (
              <FacetButton variant="ghost" onClick={gate.optIn}>
                3B sahneyi yükle
              </FacetButton>
            ) : null}
          </div>
          <p className="mt-5 font-mono text-[13px] text-muted" aria-live="polite">
            {gate.webgl ? `WebGL · React Three Fiber · kristal.glb (32 üçgen)${gate.reduced ? ' · hareket azaltıldı' : ''}` : `Durağan .webp görsel · ${gate.reason}`}
          </p>
        </Glass>
      </div>
    </section>
  )
}
