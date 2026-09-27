import { useState } from 'react'
import { ArrowCounterClockwiseIcon } from '@phosphor-icons/react'
import { IsometricContainer, LayeredCard } from '../components/IsometricContainer'
import { IsoBlock, IsoScene, IsoShadow } from '../components/IsoScene'
import { Button, Panel, SectionHead, Segmented } from '../components/ui'
import { depth, type Box } from '../lib/iso'
import { FACES, type Hue } from '../lib/palette'
import { cx } from '../../shared/cx'

// Küçük bir kampüs: zemin katından yukarı doğru üst üste binen bloklar
const TOWER: Array<{ box: Box; hue: Hue }> = [
  { box: { x: 0.5, y: 0.5, w: 3, d: 3, h: 0.4 }, hue: 'slate' },
  { box: { x: 0.8, y: 0.8, z: 0.4, w: 1.1, d: 1.1, h: 1.1 }, hue: 'blue' },
  { box: { x: 2.1, y: 0.8, z: 0.4, w: 1.1, d: 1.1, h: 0.7 }, hue: 'emerald' },
  { box: { x: 0.8, y: 2.1, z: 0.4, w: 1.1, d: 1.1, h: 0.7 }, hue: 'amber' },
  { box: { x: 2.1, y: 2.1, z: 0.4, w: 1.1, d: 1.1, h: 1.5 }, hue: 'violet' },
  { box: { x: 0.8, y: 0.8, z: 1.5, w: 1.1, d: 1.1, h: 0.6 }, hue: 'blue' },
  { box: { x: 2.1, y: 2.1, z: 1.9, w: 1.1, d: 1.1, h: 0.5 }, hue: 'rose' },
  { box: { x: 2.1, y: 2.1, z: 2.4, w: 1.1, d: 1.1, h: 0.4 }, hue: 'violet' },
]

const STACK = [
  { name: 'Arayüz', hue: 'blue' as Hue },
  { name: 'API ağ geçidi', hue: 'emerald' as Hue },
  { name: 'İş kuyruğu', hue: 'amber' as Hue },
  { name: 'Veri katmanı', hue: 'violet' as Hue },
]

export function Motion() {
  const [run, setRun] = useState(0)
  const [dir, setDir] = useState<'down' | 'up'>('down')
  const [flat, setFlat] = useState(false)
  // İnşa sırası: alttan üste (z), aynı katta uzaktan yakına
  const ordered = TOWER.map((t, i) => ({ ...t, i })).sort((a, b) => (a.box.z ?? 0) - (b.box.z ?? 0) || depth(a.box) - depth(b.box))
  const drawOrder = [...ordered].sort((a, b) => depth(a.box) + (a.box.z ?? 0) * 0.5 - (depth(b.box) + (b.box.z ?? 0) * 0.5))
  const seq = new Map(ordered.map((t, k) => [t.i, k]))

  return (
    <section id="hareket" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="16 · 17"
          label="Hareket ve mobil"
          title="Blok blok inşa"
          lede="Yapı Z ekseninde sırayla kurulur: her blok yerine düşer ya da zeminden yükselir, bir sonraki 90ms sonra gelir. Küçük ekranda izometrik katmanlar düz listeye döner."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <Panel className="flex flex-col gap-5 p-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <Segmented<'down' | 'up'>
                legend="Yön"
                name="insa-yonu"
                value={dir}
                onChange={(d) => {
                  setDir(d)
                  setRun((n) => n + 1)
                }}
                options={[
                  { id: 'down', label: 'Yukarıdan düşer' },
                  { id: 'up', label: 'Aşağıdan yükselir' },
                ]}
              />
              <Button onClick={() => setRun((n) => n + 1)} icon={<ArrowCounterClockwiseIcon size={16} weight="bold" aria-hidden="true" />}>
                Yeniden inşa et
              </Button>
            </div>
            <div key={`${run}-${dir}`} className="mx-auto w-full max-w-[420px]">
              <IsoScene unit={52} extent={[4, 4, 3]} pad={10} label="Sıralı inşa edilen blok yapı">
                {(P) => (
                  <>
                    {ordered.map((t) => (
                      <IsoShadow key={`s${t.i}`} P={P} box={t.box} i={seq.get(t.i)} ground={0} length={0.5} />
                    ))}
                    {drawOrder.map((t) => (
                      <IsoBlock key={t.i} P={P} box={t.box} hue={t.hue} i={seq.get(t.i)} build={dir} />
                    ))}
                  </>
                )}
              </IsoScene>
            </div>
            <p className="text-[14px] text-muted">
              640ms, hafif aşmalı eğri; sıra alttan üste, aynı katta uzaktan yakına. Yalnız <span className="font-mono">transform</span> ve{' '}
              <span className="font-mono">opacity</span> değişir. Hareketi azalt açıksa yapı hazır gelir.
            </p>
          </Panel>

          <Panel className="flex flex-col gap-5 p-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold">Madde 17 · Mobilde düz yığın</h3>
                <p className="text-[15px] text-muted">İzometri geniş alan ister: s·√2 genişlik. 768px altında katmanlar sıralı bir listeye dönüşür.</p>
              </div>
              <Segmented<'3d' | 'flat'>
                legend="Önizleme"
                name="mobil-onizleme"
                value={flat ? 'flat' : '3d'}
                onChange={(v) => setFlat(v === 'flat')}
                options={[
                  { id: '3d', label: 'Masaüstü' },
                  { id: 'flat', label: 'Mobil' },
                ]}
              />
            </div>
            <div className={cx('grid min-h-80 place-items-center rounded-md border border-line bg-bg p-4', flat && 'place-items-stretch')}>
              {flat ? (
                <ol className="mx-auto flex w-full max-w-[320px] flex-col gap-2">
                  {STACK.map((l, i) => (
                    <li key={l.name} className="flex items-center gap-3 rounded-md border border-line bg-surface px-4 py-3">
                      <span className="font-mono text-[13px] text-muted">{String(i + 1).padStart(2, '0')}</span>
                      <span className="h-6 w-1.5 rounded-full" style={{ background: FACES[l.hue].left }} aria-hidden="true" />
                      <span className="font-semibold">{l.name}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <>
                  <div className="hidden md:block">
                    <IsometricContainer size={190} maxZ={3 * 42 + 10}>
                      {[...STACK].reverse().map((l, i) => (
                        <LayeredCard key={l.name} z={i * 42 + 4} inset={10} className="border-2 p-3" style={{ background: FACES[l.hue].top, borderColor: FACES[l.hue].right }}>
                          <span className="font-mono text-[12px] font-semibold text-[#0F172A]">{l.name}</span>
                        </LayeredCard>
                      ))}
                    </IsometricContainer>
                  </div>
                  <p className="text-[14px] text-muted md:hidden">Bu ekran zaten dar: 3B katmanlar gösterilmez, “Mobil” önizlemesi gerçek görünümdür.</p>
                </>
              )}
            </div>
            <ul className="grid gap-2 text-[14px] sm:grid-cols-3">
              <li className="rounded-md border border-line p-3">
                <span className="block font-semibold">Aynı sıra</span>
                <span className="text-muted">Üstten alta katman sırası korunur.</span>
              </li>
              <li className="rounded-md border border-line p-3">
                <span className="block font-semibold">Renk işareti</span>
                <span className="text-muted">Sol yüz tonu şerit olarak kalır.</span>
              </li>
              <li className="rounded-md border border-line p-3">
                <span className="block font-semibold">Tek DOM</span>
                <span className="text-muted">3B görsel süs, liste asıl içerik.</span>
              </li>
            </ul>
          </Panel>
        </div>
      </div>
    </section>
  )
}
