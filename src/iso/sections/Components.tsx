import { useEffect, useId, useRef, useState } from 'react'
import { IsometricContainer, LayeredCard } from '../components/IsometricContainer'
import { IsoBlock, IsoGround, IsoScene, IsoShadow } from '../components/IsoScene'
import { Code, Panel, SectionHead } from '../components/ui'
import { FACES, type Hue } from '../lib/palette'
import { cx } from '../../shared/cx'

const LAYERS: ReadonlyArray<{ id: string; name: string; tech: string; detail: string; hue: Hue }> = [
  { id: 'ui', name: 'Arayüz', tech: 'React · CDN', detail: 'Statik dosyalar kenar sunucularda; ilk bayt 38 ms.', hue: 'blue' },
  { id: 'api', name: 'API ağ geçidi', tech: 'REST · gRPC', detail: 'Kimlik doğrulama ve hız sınırı; saniyede 2.400 istek.', hue: 'emerald' },
  { id: 'queue', name: 'İş kuyruğu', tech: 'Kafka · 12 bölüm', detail: 'Ağır işler kuyruğa alınır; gecikme dakikada 1.284 iş.', hue: 'amber' },
  { id: 'data', name: 'Veri katmanı', tech: 'PostgreSQL · Redis', detail: 'Birincil ve iki kopya; önbellek isabet oranı %94.', hue: 'violet' },
]

/** Madde 11: parçalara ayrılmış (exploded) katman görünümü, CSS 3D ile */
function Exploded() {
  const [gap, setGap] = useState(56)
  const [active, setActive] = useState('api')
  const id = useId()
  const size = 250
  const order = [...LAYERS].reverse() // en altta veri katmanı
  return (
    <Panel className="grid gap-8 p-6 lg:grid-cols-[1.2fr_1fr]">
      <div className="hidden md:block">
        <IsometricContainer size={size} maxZ={3 * 72 + 20} className="my-4">
          {/* Taban plakası */}
          <div className="absolute inset-0 rounded-md border border-dashed" style={{ borderColor: 'var(--grid-strong)' }} />
          {order.map((l, i) => {
            const on = l.id === active
            return (
              <LayeredCard
                key={l.id}
                z={i * gap + 6}
                inset={14}
                className="flex flex-col justify-between border-2 p-4"
                style={{
                  background: on ? FACES[l.hue].top : 'var(--glass)',
                  borderColor: on ? FACES[l.hue].right : 'var(--glass-line)',
                  opacity: on ? 1 : 0.92,
                }}
              >
                <span className="font-mono text-[13px] font-semibold" style={{ color: on ? '#0F172A' : 'var(--ink)' }}>
                  {String(LAYERS.indexOf(l) + 1).padStart(2, '0')} · {l.name}
                </span>
                <span className="grid grid-cols-4 gap-1.5">
                  {Array.from({ length: 8 }, (_, k) => (
                    <span key={k} className="h-3 rounded-sm" style={{ background: on ? FACES[l.hue].right : FACES[l.hue].left, opacity: on ? 0.9 : 0.55 }} />
                  ))}
                </span>
              </LayeredCard>
            )
          })}
        </IsometricContainer>
      </div>
      <div className="flex flex-col gap-5">
        <div>
          <h3 className="text-lg font-bold">Katmanlı mimari</h3>
          <p className="text-[15px] text-muted">
            Dört saydam katman Z ekseninde süzülür; her biri zemine sert bir gölge düşürür. Seçim ve ayar düz arayüzden yapılır; 3B görsel yalnızca gösterir.
          </p>
        </div>
        <div>
          <div className="flex items-baseline justify-between text-[14px] font-semibold">
            <label htmlFor={id}>Ayrışma (Z aralığı)</label>
            <output htmlFor={id} className="font-mono">
              {gap}px
            </output>
          </div>
          <input id={id} type="range" min={0} max={72} value={gap} onChange={(e) => setGap(Number(e.target.value))} className="mt-2 w-full accent-[var(--accent)]" />
        </div>
        <ul className="flex flex-col gap-2" aria-label="Katmanlar">
          {LAYERS.map((l, i) => (
            <li key={l.id}>
              <button
                type="button"
                aria-pressed={active === l.id}
                onClick={() => setActive(l.id)}
                className={cx(
                  'flex w-full cursor-pointer items-start gap-3 rounded-md border px-4 py-3 text-left',
                  active === l.id ? 'border-ink bg-line' : 'border-line bg-surface hover:bg-line',
                )}
              >
                <span className="mt-1 size-3 shrink-0 rounded-sm" style={{ background: FACES[l.hue].left }} aria-hidden="true" />
                <span className="flex flex-col">
                  <span className="font-semibold">
                    <span className="mr-2 font-mono text-[13px] text-muted">{String(i + 1).padStart(2, '0')}</span>
                    {l.name}
                  </span>
                  <span className="font-mono text-[13px] text-muted">{l.tech}</span>
                  {active === l.id ? <span className="mt-1 text-[14px]">{l.detail}</span> : null}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  )
}

const TRAFFIC = [
  { label: 'Oca', value: 42 },
  { label: 'Şub', value: 48 },
  { label: 'Mar', value: 61 },
  { label: 'Nis', value: 57 },
  { label: 'May', value: 74 },
  { label: 'Haz', value: 88 },
]

/** Yükseklik ilerlemesi 0 → 1; görünür olunca ve her "oynat" isteğinde baştan başlar */
function useRise(run: number, duration = 900) {
  const [t, setT] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setT(1)
      return
    }
    let raf = 0
    let start = 0
    const tick = (now: number) => {
      if (!start) start = now
      const k = Math.min(1, (now - start) / duration)
      setT(k)
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    const el = ref.current
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setT(0)
        raf = requestAnimationFrame(tick)
        io.disconnect()
      }
    })
    if (el) io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [run, duration])
  return { t, ref }
}

/** Madde 11: izometrik sütunlar. Değer etiketleri düz; tablo görünümü her zaman erişilebilir. */
function IsoColumns() {
  const [run, setRun] = useState(0)
  const { t, ref } = useRise(run)
  const max = 100
  const unitH = 3.2 / max
  return (
    <Panel className="flex flex-col gap-4 p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold">İzometrik sütunlar</h3>
          <p className="text-[15px] text-muted">Aylık API trafiği, milyon istek. Sütunlar sırayla yükselir.</p>
        </div>
        <button type="button" onClick={() => setRun((n) => n + 1)} className="min-h-11 cursor-pointer rounded-md border border-field bg-surface px-4 text-[14px] font-semibold hover:bg-line">
          Yeniden oynat
        </button>
      </div>
      <div ref={ref}>
        <IsoScene unit={40} extent={[7.2, 2.2, 3.6]} pad={16} label="İzometrik sütun grafiği; değerler aşağıdaki tabloda.">
          {(P) => (
            <>
              <IsoGround P={P} size={[7.2, 2.2]} step={0.6} stroke="var(--grid-line)" />
              {TRAFFIC.map((d, i) => {
                const local = Math.max(0, Math.min(1, t * 1.6 - i * 0.12))
                const ease = 1 - Math.pow(1 - local, 3)
                const h = Math.max(0.02, d.value * unitH * ease)
                const box = { x: 0.4 + i * 1.12, y: 0.7, w: 0.7, d: 0.7, h }
                return <IsoShadow key={`s${i}`} P={P} box={box} build={false} length={0.5} />
              })}
              {/* Uzaktan yakına: x büyüdükçe sütun geride kalır, önce çizilir */}
              {TRAFFIC.map((d, i) => ({ d, i }))
                .reverse()
                .map(({ d, i }) => {
                const local = Math.max(0, Math.min(1, t * 1.6 - i * 0.12))
                const ease = 1 - Math.pow(1 - local, 3)
                const h = Math.max(0.02, d.value * unitH * ease)
                const box = { x: 0.4 + i * 1.12, y: 0.7, w: 0.7, d: 0.7, h }
                const top = P(box.x + box.w / 2, box.y + box.d / 2, h)
                const base = P(box.x + box.w, box.y + box.d, 0)
                return (
                  <g key={d.label}>
                    <IsoBlock P={P} box={box} hue={i === TRAFFIC.length - 1 ? 'violet' : 'blue'} build={false} />
                    <text x={top[0]} y={top[1] - 10} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize={13} fontWeight={600} fill="var(--ink)" opacity={ease}>
                      {Math.round(d.value * ease)}
                    </text>
                    <text x={base[0] + 4} y={base[1] + 16} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--muted)">
                      {d.label}
                    </text>
                  </g>
                )
              })}
            </>
          )}
        </IsoScene>
      </div>
      <details className="rounded-md border border-line">
        <summary className="min-h-11 cursor-pointer px-4 py-2.5 text-[14px] font-semibold">Tablo olarak göster</summary>
        <table className="w-full text-left text-[14px]">
          <thead className="text-muted">
            <tr>
              <th className="px-4 py-2 font-semibold">Ay</th>
              <th className="px-4 py-2 text-right font-semibold">Milyon istek</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {TRAFFIC.map((d) => (
              <tr key={d.label} className="border-t border-line">
                <td className="px-4 py-2 font-sans">{d.label}</td>
                <td className="px-4 py-2 text-right">{d.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </Panel>
  )
}

const REACT = `<IsometricContainer size={250} maxZ={236}>
  {layers.map((l, i) => (
    <LayeredCard key={l.id} z={i * gap}>
      <LayerContent {...l} />
    </LayeredCard>
  ))}
</IsometricContainer>`

export function Components() {
  return (
    <section id="bilesenler" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="07 · 11 · 14"
          label={<span lang="en">UI Component Patterns</span>}
          title="Parçalara ayrılan katmanlar"
          lede="Exploded view, bir sistemin katmanlarını Z ekseninde açarak gösterir. Katmanlar saydamdır, altındakini gizlemez; her biri tek yönlü, sert bir gölge düşürür."
        />
        <Exploded />
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <IsoColumns />
          <Panel className="flex flex-col gap-4 p-6">
            <h3 className="text-lg font-bold">React · Madde 14</h3>
            <p className="text-[15px] text-muted">
              <span className="font-mono text-ink">IsometricContainer</span> düzlemi <span className="font-mono text-ink">rotateX · rotateZ</span> ile yatırır ve
              izdüşümün kapladığı alanı yerleşimde ayırır. <span className="font-mono text-ink">LayeredCard</span> içeriği düz yerleşir,{' '}
              <span className="font-mono text-ink">translateZ</span> ile yükselir. Sütunlar ve bloklar ise aynı açıyla çizilen SVG'dir.
            </p>
            <Code>{REACT}</Code>
            <p className="text-[14px] text-muted">768px altında 3B katmanlar gizlenir, yandaki düz liste tek başına kalır (Madde 17).</p>
          </Panel>
        </div>
      </div>
    </section>
  )
}
