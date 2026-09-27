import { useMemo, useState } from 'react'
import { CheckCircleIcon, WarningIcon, WarningOctagonIcon } from '@phosphor-icons/react'
import { IsoBlock, IsoGround, IsoScene, IsoShadow } from '../components/IsoScene'
import { Panel, SectionHead, Segmented } from '../components/ui'
import { depth, type Box } from '../lib/iso'
import { FACES, type Hue } from '../lib/palette'
import { cx } from '../../shared/cx'

type Region = 'ist' | 'fra' | 'iad'
type Metric = 'cpu' | 'mem'

const REGIONS: ReadonlyArray<{ id: Region; label: string }> = [
  { id: 'ist', label: 'İstanbul' },
  { id: 'fra', label: 'Frankfurt' },
  { id: 'iad', label: 'Virginia' },
]

const COLS = 4
const ROWS = 3

/** Bölge adından türeyen sabit, kurgusal veri: aynı bölge hep aynı değerleri verir */
function seeded(text: string) {
  let h = 2166136261
  for (const ch of text) {
    h ^= ch.codePointAt(0) ?? 0
    h = Math.imul(h, 16777619)
  }
  let s = h >>> 0 || 1
  return () => {
    s ^= s << 13
    s ^= s >>> 17
    s ^= s << 5
    return (s >>> 0) / 4294967296
  }
}

type Rack = { id: string; col: number; row: number; cpu: number; mem: number }

function racksFor(region: Region): Rack[] {
  const rnd = seeded(region)
  return Array.from({ length: COLS * ROWS }, (_, i) => {
    const col = i % COLS
    const row = Math.floor(i / COLS)
    return {
      id: `${String.fromCharCode(65 + row)}${col + 1}`,
      col,
      row,
      cpu: Math.round(28 + rnd() * 68),
      mem: Math.round(35 + rnd() * 60),
    }
  })
}

type Status = 'normal' | 'yuksek' | 'kritik'
const statusOf = (v: number): Status => (v >= 85 ? 'kritik' : v >= 65 ? 'yuksek' : 'normal')
const STATUS: Record<Status, { label: string; hue: Hue; icon: typeof CheckCircleIcon; color: string }> = {
  normal: { label: 'Normal', hue: 'blue', icon: CheckCircleIcon, color: 'var(--accent)' },
  yuksek: { label: 'Yüksek', hue: 'amber', icon: WarningIcon, color: 'var(--st-high)' },
  kritik: { label: 'Kritik', hue: 'rose', icon: WarningOctagonIcon, color: 'var(--st-crit)' },
}

const power = (r: Rack) => +(1.8 + r.cpu * 0.045 + r.mem * 0.01).toFixed(1)

function StatusTag({ s }: { s: Status }) {
  const S = STATUS[s]
  const Icon = S.icon
  return (
    <span className="inline-flex items-center gap-1.5 font-sans font-semibold">
      <Icon size={16} weight="fill" style={{ color: S.color }} aria-hidden="true" />
      {S.label}
    </span>
  )
}

export function Application() {
  const [region, setRegion] = useState<Region>('ist')
  const [metric, setMetric] = useState<Metric>('cpu')
  const [selected, setSelected] = useState('B2')
  const racks = useMemo(() => racksFor(region), [region])
  const value = (r: Rack) => (metric === 'cpu' ? r.cpu : r.mem)
  const avg = Math.round(racks.reduce((a, r) => a + value(r), 0) / racks.length)
  const critical = racks.filter((r) => statusOf(value(r)) === 'kritik').length
  const totalPower = racks.reduce((a, r) => a + power(r), 0)
  const sel = racks.find((r) => r.id === selected) ?? racks[0]

  const boxes = racks
    .map((r) => ({ r, box: { x: 0.45 + r.col * 1.4, y: 0.45 + r.row * 1.85, w: 0.8, d: 1.1, h: 0.25 + (value(r) / 100) * 1.7 } as Box }))
    .sort((a, b) => depth(a.box) - depth(b.box))

  return (
    <section id="uygulama" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="10"
          label="UI kullanım alanı"
          title="Veri merkezi paneli"
          lede="Lojistik, bulut altyapısı, analitik ve kripto borsaları. Burada bir veri merkezinin dolap haritası: blok yüksekliği yükü, rengi durumu gösterir. Filtreler, tablo ve kartlar düzdür."
        />
        <Panel className="flex flex-wrap items-end gap-6 p-4 md:p-5">
          <Segmented<Region> legend="Bölge" name="bolge" value={region} onChange={setRegion} options={REGIONS} />
          <Segmented<Metric>
            legend="Ölçüt"
            name="olcut"
            value={metric}
            onChange={setMetric}
            options={[
              { id: 'cpu', label: 'İşlemci' },
              { id: 'mem', label: 'Bellek' },
            ]}
          />
          <p className="ml-auto font-mono text-[13px] text-muted">Kurgusal veri · her bölge 12 dolap</p>
        </Panel>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <Panel className="flex flex-col justify-center gap-4 p-4 md:p-6">
            <div className="hidden md:block">
              <IsoScene unit={40} extent={[6, 6, 2.2]} pad={14} label={`Dolap haritası, ${REGIONS.find((r) => r.id === region)!.label}: ${critical} kritik dolap. Ayrıntılar yandaki tabloda.`}>
                {(P) => (
                  <>
                    <IsoBlock P={P} box={{ x: 0, y: 0, w: 6, d: 6, h: 0.001 }} hue="slate" build={false} />
                    <IsoGround P={P} size={[6, 6]} step={0.5} stroke="var(--grid-line)" />
                    {boxes.map(({ r, box }) => (
                      <IsoShadow key={`s-${r.id}`} P={P} box={box} build={false} length={0.45} />
                    ))}
                    {boxes.map(({ r, box }) => (
                      <g key={`${region}-${r.id}`} onClick={() => setSelected(r.id)} className="cursor-pointer">
                        <IsoBlock
                          P={P}
                          box={box}
                          hue={STATUS[statusOf(value(r))].hue}
                          build="up"
                          i={r.row * COLS + r.col}
                          topLabel={r.id}
                          highlight={r.id === sel.id}
                          opacity={r.id === sel.id ? 1 : 0.94}
                        />
                      </g>
                    ))}
                  </>
                )}
              </IsoScene>
            </div>
            <ul className="flex flex-wrap gap-4 text-[14px]" aria-label="Renk açıklaması">
              {(Object.keys(STATUS) as Status[]).map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="size-3 rounded-sm" style={{ background: FACES[STATUS[s].hue].left }} aria-hidden="true" />
                  <StatusTag s={s} />
                  <span className="text-muted">{s === 'normal' ? '< %65' : s === 'yuksek' ? '%65–84' : '≥ %85'}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <div className="flex min-w-0 flex-col gap-4">
            <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-line bg-line">
              {[
                ['Ortalama', `%${avg}`],
                ['Kritik', String(critical)],
                ['Güç', `${totalPower.toFixed(1).replace('.', ',')} kW`],
              ].map(([k, v]) => (
                <div key={k} className="bg-surface px-4 py-3">
                  <dt className="text-[13px] text-muted">{k}</dt>
                  <dd className="font-mono text-xl font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
            <Panel className="p-4">
              <p className="text-[13px] text-muted">Seçili dolap</p>
              <p className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-2xl font-semibold">{sel.id}</span>
                <StatusTag s={statusOf(value(sel))} />
              </p>
              <p className="mt-1 font-mono text-[13px] text-muted">
                işlemci %{sel.cpu} · bellek %{sel.mem} · {power(sel).toFixed(1).replace('.', ',')} kW
              </p>
            </Panel>
            <Panel className="overflow-hidden">
              <table className="w-full text-left text-[14px]">
                <caption className="sr-only">Dolaplar, {metric === 'cpu' ? 'işlemci' : 'bellek'} yükü</caption>
                <thead className="bg-bg text-muted">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Dolap</th>
                    <th className="px-3 py-2 text-right font-semibold">{metric === 'cpu' ? 'İşlemci' : 'Bellek'}</th>
                    <th className="px-3 py-2 font-semibold">Durum</th>
                    <th className="px-3 py-2 text-right font-semibold">Güç</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {racks.map((r) => (
                    <tr key={r.id} className={cx('border-t border-line', r.id === sel.id && 'bg-line')}>
                      <td className="px-1 py-0.5">
                        <button
                          type="button"
                          aria-pressed={r.id === sel.id}
                          onClick={() => setSelected(r.id)}
                          className="min-h-9 w-full cursor-pointer rounded px-2 text-left font-semibold hover:underline"
                        >
                          {r.id}
                        </button>
                      </td>
                      <td className="px-3 py-1 text-right">%{value(r)}</td>
                      <td className="px-3 py-1">
                        <StatusTag s={statusOf(value(r))} />
                      </td>
                      <td className="px-3 py-1 text-right">{power(r).toFixed(1).replace('.', ',')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
          </div>
        </div>
      </div>
    </section>
  )
}
