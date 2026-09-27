import { lazy, Suspense, useRef, useState, type PointerEvent } from 'react'
import { ArrowArcLeftIcon, ArrowArcRightIcon, ArrowCounterClockwiseIcon, CubeIcon } from '@phosphor-icons/react'
import { FacetButton, Glass, Origami, SectionHead } from '../components/ui'
import { useSceneGate, useVisible } from '../hooks/useSceneGate'
import { MODELS, type ModelId } from '../three/models'
import { POSTERS } from '../three/posters'
import { cx } from '../../shared/cx'

const ShowcaseScene = lazy(() => import('../three/ShowcaseScene'))

const TINTS = [
  { id: 'dogal', name: 'Doğal', hex: '#ffffff' },
  { id: 'kum', name: 'Kum', hex: '#f3e3bd' },
  { id: 'turkuaz', name: 'Turkuaz', hex: '#a7c9ca' },
  { id: 'gece', name: 'Gece', hex: '#8aa0b4' },
] as const

const PRODUCT: Record<ModelId, { icon: 'kristal' | 'ucak' | 'dag' | 'yaprak'; title: string; bytes: number; price: number; blurb: string }> = {
  kristal: { icon: 'kristal', title: 'Kristal · Oyun ödülü', bytes: 4404, price: 240, blurb: 'Sekizgen taç ve sivri pavyon. Seviye sonu ödülü ya da ürün vitrini için.' },
  ucak: { icon: 'ucak', title: 'Kağıt uçak · Arayüz maskotu', bytes: 1472, price: 120, blurb: 'Beş üçgenlik origami. Gönder düğmeleri ve yükleme ekranları için.' },
  kaya: { icon: 'dag', title: 'Kaya · Sahne dolgusu', bytes: 9588, price: 180, blurb: 'Bir kez bölünmüş, gürültüyle bozulmuş ikosahedron. Oyun sahnelerinde tekrar tekrar kullanılır.' },
  agac: { icon: 'yaprak', title: 'Ağaç · Peyzaj seti', bytes: 6768, price: 160, blurb: 'Altıgen gövde, üç kat koni. Düşük poligon ormanlar için tek başına yeterli.' },
}

const TL = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 })
const KB = (b: number) => `${(b / 1024).toFixed(1).replace('.', ',')} KB`

export function Showcase({ dark }: { dark: boolean }) {
  const gate = useSceneGate()
  const box = useRef<HTMLDivElement>(null)
  const visible = useVisible(box)
  const [model, setModel] = useState<ModelId>('kristal')
  const [tint, setTint] = useState<(typeof TINTS)[number]['id']>('dogal')
  const [spin, setSpin] = useState(true)
  const [shattered, setShattered] = useState(false)
  const [rot, setRot] = useState({ x: 0, y: 0 })
  const drag = useRef<{ x: number; y: number; rx: number; ry: number } | null>(null)
  const m = MODELS[model]
  const p = PRODUCT[model]

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    drag.current = { x: e.clientX, y: e.clientY, rx: rot.x, ry: rot.y }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d) return
    setRot({ x: Math.max(-0.8, Math.min(0.8, d.rx + (e.clientY - d.y) * 0.008)), y: d.ry + (e.clientX - d.x) * 0.01 })
  }
  const onUp = () => (drag.current = null)

  return (
    <section id="vitrin" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="10 · 14 · 16"
          label="UI kullanım alanı"
          title="Ürün vitrini"
          lede="3B landing sayfaları, oyunlar, portfolyolar ve yaratıcı ajanslar. GLB modeller React Three Fiber ile doğrudan sayfaya yerleşir; sürükleyerek döndürün, tıklayınca parçalansın."
        />
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div
            ref={box}
            className="relative aspect-[4/3] w-full cursor-grab touch-none overflow-hidden bg-surface active:cursor-grabbing"
            onPointerDown={gate.webgl ? onDown : undefined}
            onPointerMove={gate.webgl ? onMove : undefined}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            role="img"
            aria-label={`${m.name} modeli, ${m.tris} üçgen${shattered ? ', parçalanmış' : ''}`}
          >
            {gate.webgl ? (
              <Suspense fallback={<img src={POSTERS[model]} alt="" className="h-full w-full object-cover" />}>
                <ShowcaseScene
                  model={model}
                  tint={TINTS.find((t) => t.id === tint)!.hex}
                  spin={spin && !gate.reduced}
                  shattered={shattered}
                  rotation={rot}
                  dark={dark}
                  playing={visible}
                  onToggle={() => setShattered((s) => !s)}
                  background={dark ? '#16212b' : '#ffffff'}
                />
              </Suspense>
            ) : (
              <img src={POSTERS[model]} alt="" className="h-full w-full object-cover" />
            )}
            <p className="glass absolute bottom-3 left-3 px-3 py-1.5 font-mono text-[12px]">
              {m.file} · {m.tris} üçgen · {KB(p.bytes)}
            </p>
          </div>

          <Glass className="flex flex-col gap-5 p-6">
            <div className="flex items-start gap-3">
              <Origami name={p.icon} size={44} />
              <div>
                <h3 className="text-2xl font-bold">{p.title}</h3>
                <p className="text-[15px] text-muted">{p.blurb}</p>
              </div>
            </div>
            <fieldset>
              <legend className="mb-2 text-[14px] font-semibold">Model</legend>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(MODELS) as ModelId[]).map((id) => (
                  <label key={id} className="cursor-pointer has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring">
                    <input
                      type="radio"
                      name="vitrin-model"
                      value={id}
                      checked={model === id}
                      onChange={() => {
                        setModel(id)
                        setShattered(false)
                      }}
                      className="sr-only"
                    />
                    <span className={cx('flex min-h-11 items-center justify-between gap-2 border px-3 text-[14px] font-semibold', model === id ? 'border-accent bg-line' : 'border-line text-muted hover:text-ink')}>
                      {MODELS[id].name}
                      <span className="font-mono text-[12px] font-normal">{MODELS[id].tris}△</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-2 text-[14px] font-semibold">Renk varyantı</legend>
              <div className="flex flex-wrap gap-2">
                {TINTS.map((t) => (
                  <label key={t.id} className="cursor-pointer has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring">
                    <input type="radio" name="vitrin-renk" value={t.id} checked={tint === t.id} onChange={() => setTint(t.id)} className="sr-only" />
                    <span className={cx('flex min-h-11 items-center gap-2 border px-3 text-[14px] font-semibold', tint === t.id ? 'border-accent bg-line' : 'border-line text-muted hover:text-ink')}>
                      <span className="size-3.5" style={{ background: t.hex, clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }} aria-hidden="true" />
                      {t.name}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="flex flex-wrap gap-2">
              <FacetButton onClick={() => setShattered((s) => !s)} aria-pressed={shattered} disabled={!gate.webgl} icon={<CubeIcon size={18} weight="bold" aria-hidden="true" />}>
                {shattered ? 'Birleştir' : 'Parçala'}
              </FacetButton>
              <FacetButton variant="ghost" onClick={() => setSpin((s) => !s)} aria-pressed={spin} disabled={!gate.webgl || gate.reduced}>
                Dönüş
              </FacetButton>
            </div>
            <div className="flex items-center gap-2" role="group" aria-label="Modeli döndür">
              <FacetButton variant="ghost" onClick={() => setRot((r) => ({ ...r, y: r.y - Math.PI / 4 }))} disabled={!gate.webgl} aria-label="Sola döndür" icon={<ArrowArcLeftIcon size={18} weight="bold" aria-hidden="true" />} />
              <FacetButton variant="ghost" onClick={() => setRot((r) => ({ ...r, y: r.y + Math.PI / 4 }))} disabled={!gate.webgl} aria-label="Sağa döndür" icon={<ArrowArcRightIcon size={18} weight="bold" aria-hidden="true" />} />
              <FacetButton variant="ghost" onClick={() => setRot({ x: 0, y: 0 })} disabled={!gate.webgl} aria-label="Açıyı sıfırla" icon={<ArrowCounterClockwiseIcon size={18} weight="bold" aria-hidden="true" />} />
              <span className="ml-auto font-display text-2xl font-bold">{TL.format(p.price)}</span>
            </div>
            <p className="text-[14px] text-muted">
              {gate.webgl ? 'Sürükleme, düğmeler ve tıklama aynı işi yapar; klavye düğmelerle kullanılır.' : `Durağan görsel · ${gate.reason}.`}
              {gate.canOptIn ? (
                <>
                  {' '}
                  <button type="button" onClick={gate.optIn} className="cursor-pointer font-semibold text-accent underline underline-offset-4">
                    3B vitrini yükle
                  </button>
                </>
              ) : null}
            </p>
          </Glass>
        </div>
      </div>
    </section>
  )
}
