import { useState, type CSSProperties } from 'react'
import { ArrowCounterClockwiseIcon, PlayIcon } from '@phosphor-icons/react'
import { SectionHead } from '../components/SectionHead'
import { ClayCard } from '../components/ClayCard'
import { ClayButton } from '../components/ClayButton'
import { Pop } from '../components/Pop'
import type { Tone } from '../components/types'

// CSS'teki --spring ile aynı örnekler (k=300, c=16, m=1; 600ms)
const SPRING = [
  0, 0.038, 0.137, 0.275, 0.434, 0.597, 0.751, 0.887, 0.999, 1.085, 1.145, 1.18, 1.194, 1.191, 1.174, 1.149, 1.119, 1.087, 1.056, 1.029, 1.006, 0.987,
  0.974, 0.966, 0.963, 0.962, 0.965, 0.97, 0.975, 0.981, 0.987, 0.993, 0.998, 1.002, 1.004, 1.006, 1,
]
// cubic-bezier(0, 0, 0.58, 1) · ease-out, aynı zaman ızgarasında
function easeOut(t: number) {
  // x(s) = 3(1−s)s²·0,58 + s³; x = t olan s ikiye bölmeyle bulunur, sonra y(s) = 3(1−s)s² + s³
  let lo = 0
  let hi = 1
  for (let i = 0; i < 30; i++) {
    const s = (lo + hi) / 2
    const x = 3 * (1 - s) * s * s * 0.58 + s * s * s
    if (x < t) lo = s
    else hi = s
  }
  const s = (lo + hi) / 2
  return 3 * (1 - s) * s * s + s * s * s
}
const EASE = SPRING.map((_, i) => easeOut(i / (SPRING.length - 1)))

const W = 520
const H = 240
const PAD = { l: 44, r: 96, t: 16, b: 34 }
const yMax = 1.3
const xs = (i: number) => PAD.l + (i / (SPRING.length - 1)) * (W - PAD.l - PAD.r)
const ys = (v: number) => PAD.t + (1 - v / yMax) * (H - PAD.t - PAD.b)
const path = (vals: number[]) => vals.map((v, i) => `${i ? 'L' : 'M'}${xs(i).toFixed(1)},${ys(v).toFixed(1)}`).join(' ')
const peak = SPRING.indexOf(Math.max(...SPRING))

const SHAPES: ReadonlyArray<{ tone: Tone; cls: string }> = [
  { tone: 'pink', cls: 'size-20 rounded-max' },
  { tone: 'blue', cls: 'h-20 w-32 rounded-max' },
  { tone: 'butter', cls: 'size-20 blob' },
  { tone: 'mint', cls: 'size-20 rounded-[40%]' },
  { tone: 'lilac', cls: 'h-20 w-28 blob-2' },
]

function Bleed({ scale, label }: { scale: number; label: string }) {
  const d = 8 * scale
  const bleed = { l: 2 * d, t: 2 * d, r: 6 * d, b: 6 * d }
  return (
    <figure className="flex flex-col items-center gap-4">
      <div className="relative" style={{ margin: `${bleed.t}px ${bleed.r}px ${bleed.b}px ${bleed.l}px` }}>
        <div
          aria-hidden="true"
          className="absolute rounded-[64px] border-2 border-dashed border-muted"
          style={{ left: -bleed.l, top: -bleed.t, right: -bleed.r, bottom: -bleed.b }}
        />
        <div className="clay clay-xl tone-lilac grid h-36 w-44 place-items-center rounded-clay font-display text-lg font-extrabold" style={{ '--d-scale': scale } as CSSProperties}>
          d = {(+d.toFixed(1)).toLocaleString('tr')}
        </div>
      </div>
      <figcaption className="text-center">
        <span className="block font-bold">{label}</span>
        <span className="text-[15px] text-muted">
          Gölge taşması sağ ve altta {(+(6 * d).toFixed(1)).toLocaleString('tr')}px, sol ve üstte {(+(2 * d).toFixed(1)).toLocaleString('tr')}px
        </span>
      </figcaption>
    </figure>
  )
}

export function Motion() {
  const [run, setRun] = useState(0)
  const [flip, setFlip] = useState(false)

  return (
    <section id="hareket" className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="16 · 17"
          label="Hareket ve mobil"
          title="Esner, zıplar, yerine oturur"
          lede="Öğeler ekrana girerken önce ezilir, sonra uzar ve yerine oturur. Basılma ve geçişler yaylı bir eğriyle çalışır. Küçük ekranda gölgeler küçülür, alan ve performans korunur."
        />

        <div className="grid gap-8 lg:grid-cols-2">
          <Pop>
            <ClayCard tone="base" volume="xl" className="flex h-full flex-col gap-6 p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h3 className="text-2xl font-extrabold">Giriş: ezil ve otur</h3>
                <ClayButton tone="pink" size="sm" onClick={() => setRun((n) => n + 1)} icon={<ArrowCounterClockwiseIcon size={18} weight="bold" aria-hidden="true" />}>
                  Yeniden oynat
                </ClayButton>
              </div>
              <div key={run} className="clay-well clay-md flex min-h-48 flex-wrap items-center justify-center gap-6 rounded-clay p-8" aria-hidden="true">
                {SHAPES.map((s, i) => (
                  <Pop key={i} i={i}>
                    <div className={`clay clay-lg tone-${s.tone} ${s.cls}`} />
                  </Pop>
                ))}
              </div>
              <p className="text-[15px] text-muted">
                820ms: %40'ta 1,08 × 0,92 ezilme, %62'de 0,95 × 1,06 uzama, sonra oturma. Öğeler 90ms arayla girer. Yalnızca <span className="font-mono">transform</span>{' '}
                ve <span className="font-mono">opacity</span> değişir; gölge bir kez boyanır.
              </p>
            </ClayCard>
          </Pop>

          <Pop i={1}>
            <ClayCard tone="base" volume="xl" className="flex h-full flex-col gap-5 p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h3 className="text-2xl font-extrabold">Yay ve yumuşak çıkış</h3>
                <ClayButton tone="primary" size="sm" onClick={() => setFlip((f) => !f)} icon={<PlayIcon size={18} weight="fill" aria-hidden="true" />}>
                  Oynat
                </ClayButton>
              </div>
              {[
                { label: 'Yay · --spring', ease: 'var(--spring)', tone: 'primary' },
                { label: 'ease-out', ease: 'cubic-bezier(0, 0, 0.58, 1)', tone: 'base' },
              ].map((r) => (
                <div key={r.label}>
                  <p className="mb-2 text-[15px] font-bold">{r.label}</p>
                  <div className="clay-well clay-sm relative h-14 rounded-max" aria-hidden="true">
                    <div className="@container absolute inset-2">
                      <div
                        className={`clay clay-sm tone-${r.tone} size-10 rounded-max`}
                        style={{ transform: flip ? 'translateX(calc(100cqw - 2.5rem))' : 'none', transition: `transform 600ms ${r.ease}` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <figure className="mt-2">
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Yay eğrisi hedefi yüzde 19,4 aşıp 0,2 saniyede geri döner ve 0,6 saniyede oturur; ease-out aşmadan yavaşlayarak durur.">
                  {[0, 0.5, 1].map((v) => (
                    <g key={v}>
                      <line x1={PAD.l} x2={W - PAD.r} y1={ys(v)} y2={ys(v)} stroke="var(--well)" strokeWidth={v === 1 ? 2 : 1} strokeDasharray={v === 1 ? '6 5' : undefined} />
                      <text x={PAD.l - 10} y={ys(v) + 4} textAnchor="end" fontSize="13" fill="var(--muted)" fontWeight="600">
                        {String(v).replace('.', ',')}
                      </text>
                    </g>
                  ))}
                  {[0, 0.2, 0.4, 0.6].map((t) => (
                    <text key={t} x={PAD.l + (t / 0.6) * (W - PAD.l - PAD.r)} y={H - 10} textAnchor="middle" fontSize="13" fill="var(--muted)" fontWeight="600">
                      {String(t).replace('.', ',')} sn
                    </text>
                  ))}
                  <path d={path(EASE)} fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" />
                  <path d={path(SPRING)} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx={xs(peak)} cy={ys(SPRING[peak])} r="5" fill="var(--accent)" stroke="var(--surface)" strokeWidth="2" />
                  <text x={xs(peak)} y={ys(SPRING[peak]) - 10} textAnchor="middle" fontSize="13" fill="var(--ink)" fontWeight="700">
                    %19,4 aşma
                  </text>
                  <text x={W - PAD.r + 8} y={ys(1.006) - 8} fontSize="13" fill="var(--accent)" fontWeight="700">
                    yay
                  </text>
                  <text x={W - PAD.r + 8} y={ys(1) + 16} fontSize="13" fill="var(--muted)" fontWeight="700">
                    ease-out
                  </text>
                </svg>
                <figcaption className="text-[15px] text-muted">
                  Yay: k = 300, c = 16, m = 1. CSS <span className="font-mono">linear()</span> ile 37 noktada örneklendi, JavaScript gerekmez.
                </figcaption>
              </figure>
            </ClayCard>
          </Pop>
        </div>

        <Pop className="mt-8">
          <ClayCard tone="base" volume="xl" className="p-6 md:p-10">
            <h3 className="text-2xl font-extrabold">Madde 17 · Küçük ekranda sade gölge</h3>
            <p className="mt-2 max-w-[70ch] text-muted">
              Düşen gölge, bulanıklığı kadar dışarı taşar ve bu alan boş kalmak zorundadır. 640px altında hacim birimi %60'a iner: xl kart md'ye, md düğme sm'ye
              yaklaşır. Taşma küçülür, kartlar sıkışmadan yan yana durur ve boyanan bulanık alan yaklaşık üçte bire iner.
            </p>
            <div className="mt-8 flex flex-wrap items-start justify-center gap-x-6 gap-y-10">
              <Bleed scale={1} label="Masaüstü · xl" />
              <Bleed scale={0.6} label="Mobil · ×0,6" />
            </div>
            <ul className="mt-8 grid gap-4 text-[15px] md:grid-cols-3">
              <li className="clay-well clay-sm rounded-soft p-5">
                <span className="block font-bold">Yalnız transform</span>
                <span className="text-muted">Süzülme, giriş ve zıplama gölgeyi yeniden boyamaz; katman olduğu gibi taşınır.</span>
              </li>
              <li className="clay-well clay-sm rounded-soft p-5">
                <span className="block font-bold">Basılma kısa</span>
                <span className="text-muted">Gölgeyi değiştiren tek hareket basılmadır: küçük öğelerde, 110ms'de iner, 600ms'de geri şişer.</span>
              </li>
              <li className="clay-well clay-sm rounded-soft p-5">
                <span className="block font-bold">Hareketi azalt</span>
                <span className="text-muted">Tercih açıkken giriş, süzülme ve zıplama kapanır; basılma anında olur.</span>
              </li>
            </ul>
          </ClayCard>
        </Pop>
      </div>
    </section>
  )
}
