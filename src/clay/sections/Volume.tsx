import { useEffect, useId, useRef, useState, type CSSProperties, type RefObject } from 'react'
import { SectionHead } from '../components/SectionHead'
import { ClayCard } from '../components/ClayCard'
import { ClayToggle } from '../components/ClayToggle'
import { Pop } from '../components/Pop'
import { VOLUME_D, type Tone, type Volume as VolumeSize } from '../components/types'
import { cx } from '../../shared/cx'

const TONES: ReadonlyArray<{ id: Tone; label: string }> = [
  { id: 'base', label: 'Beyaz' },
  { id: 'pink', label: 'Pembe' },
  { id: 'purple', label: 'Mor' },
  { id: 'blue', label: 'Mavi' },
  { id: 'mint', label: 'Nane' },
  { id: 'butter', label: 'Tereyağı' },
  { id: 'lilac', label: 'Lila' },
]

type RGBA = { r: number; g: number; b: number; a: number }

/** Tarayıcının çözdüğü rengi (rgb(), rgba() ya da color(srgb …)) sayılara çevirir. */
function parseColor(v: string): RGBA {
  const n = v.match(/-?[\d.]+/g)?.map(Number) ?? [0, 0, 0, 1]
  if (v.startsWith('color(')) return { r: Math.round(n[0] * 255), g: Math.round(n[1] * 255), b: Math.round(n[2] * 255), a: n[3] ?? 1 }
  return { r: n[0], g: n[1], b: n[2], a: n[3] ?? 1 }
}
const rgba = (c: RGBA) => `rgba(${c.r},${c.g},${c.b},${+c.a.toFixed(2)})`
const hex = (c: RGBA) => '#' + [c.r, c.g, c.b].map((x) => x.toString(16).padStart(2, '0')).join('').toUpperCase()
const px = (n: number) => `${+n.toFixed(1)}px`

function useResolvedColors(probe: RefObject<HTMLSpanElement | null>, deps: unknown[]) {
  const [colors, setColors] = useState<{ drop: RGBA; lo: RGBA; hi: RGBA } | null>(null)
  useEffect(() => {
    const el = probe.current
    if (!el) return
    const read = (name: string) => {
      el.style.backgroundColor = `var(${name})`
      return parseColor(getComputedStyle(el).backgroundColor)
    }
    setColors({ drop: read('--clay-drop'), lo: read('--clay-lo'), hi: read('--clay-hi-tone') })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return colors
}

/** Tek sayıdan üç gölge (Madde 12): drop (2d, 2d, 4d) · iç koyu (−d, −d, 2d) · iç açık (d, d, 2d). */
function layers(d: number) {
  return { drop: [2 * d, 2 * d, 4 * d], lo: [-d, -d, 2 * d], hi: [d, d, 2 * d] }
}

const ANATOMY = [
  { title: 'Drop Shadow', note: 'Dış derinlik: nesneyi zeminden kaldırır', shadow: '12px 12px 24px var(--clay-drop)' },
  { title: 'Inner Shadow · açık', note: 'Sol üst kenarda şişkinlik ışığı', shadow: 'inset 6px 6px 12px var(--tone-lilac-hi)' },
  { title: 'Inner Shadow · koyu', note: 'Sağ alt kenarda kıvrılan gölge', shadow: 'inset -6px -6px 12px var(--clay-lo)' },
  {
    title: '= ClayVolume',
    note: 'Üçü birlikte: şişirilmiş kil',
    shadow: '12px 12px 24px var(--clay-drop), inset -6px -6px 12px var(--clay-lo), inset 6px 6px 12px var(--tone-lilac-hi)',
  },
] as const

const CSS_FORMULA = `.clay {
  --d: calc(var(--d-base) * var(--d-scale) * var(--d-press, 1));
  box-shadow:
    calc(var(--d) * 2) calc(var(--d) * 2) calc(var(--d) * 4) var(--clay-drop),
    inset calc(var(--d) * -1) calc(var(--d) * -1) calc(var(--d) * 2) var(--clay-lo),
    inset var(--d) var(--d) calc(var(--d) * 2) var(--clay-hi-tone);
}
.clay-sm { --d-base: 2px }  .clay-md { --d-base: 4px }
.clay-lg { --d-base: 6px }  .clay-xl { --d-base: 8px }`

export function Volume({ themeKey }: { themeKey: string }) {
  const [d, setD] = useState(4)
  const [tone, setTone] = useState<Tone>('pink')
  const [radius, setRadius] = useState(56)
  const [pressed, setPressed] = useState(false)
  const probe = useRef<HTMLSpanElement>(null)
  const colors = useResolvedColors(probe, [tone, themeKey])
  const sliderId = useId()
  const radiusId = useId()

  const dd = pressed ? d * 0.35 : d
  const L = layers(dd)
  const css = colors
    ? `${px(L.drop[0])} ${px(L.drop[1])} ${px(L.drop[2])} ${rgba(colors.drop)}, inset ${px(L.lo[0])} ${px(L.lo[1])} ${px(L.lo[2])} ${rgba(colors.lo)}, inset ${px(L.hi[0])} ${px(L.hi[1])} ${px(L.hi[2])} ${rgba(colors.hi)}`
    : ''
  const tw = `shadow-[${css.replace(/, (?=inset|\d)/g, ',').replace(/ /g, '_')}]`
  const figma = colors
    ? [
        { name: 'Drop Shadow', v: L.drop, c: colors.drop },
        { name: 'Inner Shadow · koyu', v: L.lo, c: colors.lo },
        { name: 'Inner Shadow · açık', v: L.hi, c: colors.hi },
      ]
    : []

  return (
    <section id="hacim" className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="07 · 12 · 13 · 15"
          label="Z-ekseni ve gölge"
          title="Tek sayıdan üç gölge"
          lede="Figma'da her bileşen aynı üçlü gölge setini taşır. X, Y ve Blur değerleri tek bir hacim biriminden (d) türetilir; d = 4px tanımdaki satırı birebir verir."
        />

        {/* Anatomi: katmanlar tek tek */}
        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {ANATOMY.map((a, i) => (
            <Pop as="li" i={i} key={a.title} className="flex min-w-0 flex-col items-center gap-5 text-center">
              <div className="size-36 rounded-clay" style={{ background: 'var(--tone-lilac)', boxShadow: a.shadow }} aria-hidden="true" />
              <div>
                <p className="font-display text-xl font-extrabold">
                  <span className="mr-1.5 font-mono text-[15px] text-accent">{i + 1}</span>
                  <span lang={i === 3 ? undefined : 'en'}>{a.title}</span>
                </p>
                <p className="text-[15px] text-muted">{a.note}</p>
              </div>
            </Pop>
          ))}
        </ol>

        {/* Hacim laboratuvarı */}
        <Pop className="mt-16">
          <ClayCard tone="base" volume="xl" className="grid gap-10 p-6 md:p-10 lg:grid-cols-[1fr_1.1fr]">
            <div className="flex min-w-0 flex-col gap-7">
              <h3 className="text-3xl font-extrabold">Hacim laboratuvarı</h3>
              <div>
                <div className="flex items-baseline justify-between">
                  <label htmlFor={sliderId} className="font-bold">
                    Hacim birimi <span className="font-mono">d</span>
                  </label>
                  <output htmlFor={sliderId} className="font-mono font-bold">
                    {d}px
                  </output>
                </div>
                <input id={sliderId} type="range" min={2} max={12} value={d} onChange={(e) => setD(Number(e.target.value))} className="clay-range mt-3 w-full" />
              </div>
              <div>
                <div className="flex items-baseline justify-between">
                  <label htmlFor={radiusId} className="font-bold">
                    Köşe yarıçapı
                  </label>
                  <output htmlFor={radiusId} className="font-mono font-bold">
                    {radius}px
                  </output>
                </div>
                <input id={radiusId} type="range" min={24} max={96} step={4} value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="clay-range mt-3 w-full" />
              </div>
              <fieldset>
                <legend className="font-bold">Ton · Color/PastelBase</legend>
                <div className="mt-3 flex flex-wrap gap-3">
                  {TONES.map((t) => (
                    <label key={t.id} className="cursor-pointer has-[:focus-visible]:rounded-max has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-ring">
                      <input type="radio" name="clay-tone" value={t.id} checked={tone === t.id} onChange={() => setTone(t.id)} className="sr-only" />
                      <span
                        className={cx(
                          `clay clay-sm tone-${t.id} inline-flex min-h-11 items-center rounded-max px-4 font-bold transition-transform duration-(--spring-dur) ease-(--spring)`,
                          tone === t.id && 'translate-y-0.5 scale-95 outline-3 outline-offset-3 outline-ink',
                        )}
                      >
                        {t.label}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <ClayCard tone="base" volume="md" className="rounded-soft px-5 py-2">
                <ClayToggle checked={pressed} onChange={setPressed} label="Basılı (havası inmiş)" description="d %35'e düşer" />
              </ClayCard>
            </div>

            <div className="flex min-w-0 flex-col gap-6">
              <div className="clay-well clay-md grid min-h-72 place-items-center rounded-clay p-10">
                <div
                  className={cx(`clay tone-${tone} relative grid size-44 place-items-center font-display text-lg font-extrabold`)}
                  style={{ '--d-base': `${d}px`, '--d-press': pressed ? 0.35 : 1, borderRadius: radius, transition: '--d 600ms var(--spring)' } as CSSProperties}
                >
                  d = {(+dd.toFixed(1)).toLocaleString('tr')}
                  {/* Gölge renklerini çözmek için görünmez sonda: ton sınıfının değişkenlerini devralır */}
                  <span ref={probe} aria-hidden="true" className="absolute size-0 overflow-hidden" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[420px] text-left text-[15px]">
                  <caption className="mb-2 text-left font-bold">Figma efektleri</caption>
                  <thead className="text-muted">
                    <tr>
                      <th className="py-1.5 pr-3 font-bold">Efekt</th>
                      <th className="py-1.5 pr-3 font-bold">X</th>
                      <th className="py-1.5 pr-3 font-bold">Y</th>
                      <th className="py-1.5 pr-3 font-bold">Blur</th>
                      <th className="py-1.5 font-bold">Renk</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    {figma.map((f) => (
                      <tr key={f.name} className="border-t-2 border-well">
                        <td className="py-2 pr-3 font-sans font-bold" lang="en">
                          {f.name.replace(' · koyu', '').replace(' · açık', '')}
                          <span className="text-muted" lang="tr">
                            {f.name.includes('·') ? ` · ${f.name.split('· ')[1]}` : ''}
                          </span>
                        </td>
                        <td className="py-2 pr-3">{+f.v[0].toFixed(1)}</td>
                        <td className="py-2 pr-3">{+f.v[1].toFixed(1)}</td>
                        <td className="py-2 pr-3">{+f.v[2].toFixed(1)}</td>
                        <td className="py-2">
                          <span className="mr-2 inline-block size-3.5 rounded-full align-middle ring-1 ring-muted" style={{ background: rgba(f.c) }} />
                          {hex(f.c)} · %{Math.round(f.c.a * 100)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <p className="mb-2 font-bold">CSS</p>
                <pre className="clay-well clay-sm overflow-x-auto rounded-soft p-4 font-mono text-[13px] leading-relaxed">
                  <code>{`box-shadow: ${css.replace(/, inset/g, ',\n  inset')};`}</code>
                </pre>
              </div>
              <div>
                <p className="mb-2 font-bold">Tailwind</p>
                <pre className="clay-well clay-sm overflow-x-auto rounded-soft p-4 font-mono text-[13px] leading-relaxed">
                  <code>{tw}</code>
                </pre>
              </div>
            </div>
          </ClayCard>
        </Pop>

        {/* Tokenlar ve formül */}
        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <Pop>
            <ClayCard tone="base" volume="lg" className="h-full p-6 md:p-8">
              <h3 className="text-2xl font-extrabold">Figma tokenları · Madde 13</h3>
              <dl className="mt-5 grid gap-4">
                {(Object.keys(VOLUME_D) as VolumeSize[]).map((k) => {
                  const l = layers(VOLUME_D[k])
                  return (
                    <div key={k} className="flex flex-col gap-0.5">
                      <dt className="font-mono font-bold">
                        Effects/ClayVolume/{k} <span className="font-sans text-[15px] font-medium text-muted">· d = {VOLUME_D[k]}px</span>
                      </dt>
                      <dd className="font-mono text-[14px] text-muted">
                        {l.drop.join(' ')} · inset {l.lo.join(' ')} · inset {l.hi.join(' ')}
                      </dd>
                    </div>
                  )
                })}
                <div className="flex flex-col gap-0.5 border-t-2 border-well pt-4">
                  <dt className="font-mono font-bold">Radius/MaxRounded</dt>
                  <dd className="font-mono text-[14px] text-muted">9999px · kil 56px · yumuşak 32px</dd>
                </div>
                <div className="flex flex-col gap-0.5">
                  <dt className="font-mono font-bold">Color/PastelBase</dt>
                  <dd className="font-mono text-[14px] text-muted">#F9F8FD · kil #FFFFFF</dd>
                </div>
              </dl>
            </ClayCard>
          </Pop>
          <Pop i={1}>
            <ClayCard tone="base" volume="lg" className="flex h-full flex-col gap-4 p-6 md:p-8">
              <h3 className="text-2xl font-extrabold">CSS · Madde 15</h3>
              <p className="text-muted">
                Tanımdaki satır Tailwind'de <span className="font-mono text-ink">shadow-clay</span> olarak durur. Bileşenler ise aynı değeri tek bir değişkenden
                hesaplar; boyut, basılma ve mobil küçülme yalnızca <span className="font-mono text-ink">--d</span>'yi değiştirir.
              </p>
              <pre className="clay-well clay-sm overflow-x-auto rounded-soft p-4 font-mono text-[13px] leading-relaxed">
                <code>{CSS_FORMULA}</code>
              </pre>
              <div className="flex flex-wrap items-center gap-4">
                <div className="grid h-20 w-36 shrink-0 place-items-center rounded-max bg-white font-mono text-[13px] font-bold text-[#2b2150] shadow-clay">shadow-clay</div>
                <p className="flex-1 text-[15px] text-muted">
                  Açık temada <span className="font-mono">clay-md</span> ile aynı. Koyu temada renkler değiştiği için bileşenler sınıfı kullanır.
                </p>
              </div>
            </ClayCard>
          </Pop>
        </div>
      </div>
    </section>
  )
}
