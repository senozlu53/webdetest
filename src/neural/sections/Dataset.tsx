import { useMemo, useRef, useState } from 'react'
import { PanZoom, type PanZoomHandle } from '../components/PanZoom'
import { IconLayers, IconX } from '../components/Icons'
import { Panel, Section, Stat } from '../components/ui'
import { useMedia } from '../hooks/useMedia'
import { CLUSTERS, EDGES, H, POINTS, Q_LABEL, Q_RAMP, STATS, TOTAL_ROWS, W, cluster, hull, isDup, neighbors, pairOf, qBucket, type Point } from '../lib/dataset'
import { num, pct } from '../lib/format'
import { useNeural } from '../lib/store'
import { cx } from '../../shared/cx'

type Layer = 'kenar' | 'kume' | 'aykiri' | 'kopya' | 'derinlik'
const LAYERS: { id: Layer; ad: string }[] = [
  { id: 'kenar', ad: 'Benzerlik kenarları' },
  { id: 'kume', ad: 'Küme sınırları' },
  { id: 'aykiri', ad: 'Aykırılar' },
  { id: 'kopya', ad: 'Kopyalar' },
  { id: 'derinlik', ad: 'Derinlik (odak)' },
]

const tri = (x: number, y: number, s: number) => `M${x} ${y - s}L${x + s * 0.95} ${y + s * 0.7}L${x - s * 0.95} ${y + s * 0.7}Z`

function flags(p: Point) {
  const f: string[] = []
  if (p.aykiri) f.push('aykırı')
  if (isDup(p)) f.push('kopya')
  return f
}

export function Dataset() {
  const { announce, fx, contrast } = useNeural()
  const wide = useMedia('(min-width: 768px)')
  const [on, setOn] = useState<Record<Layer, boolean>>({ kenar: true, kume: true, aykiri: true, kopya: true, derinlik: true })
  const [sel, setSel] = useState<number | null>(null)
  const pz = useRef<PanZoomHandle>(null)
  const hulls = useMemo(() => CLUSTERS.map((c) => ({ c, ...hull(c) })), [])
  const p = sel !== null ? POINTS[sel] : null
  const nb = useMemo(() => (p ? neighbors(p, 3) : []), [p])
  const dof = on.derinlik && fx === 'tam' && contrast === 'normal'
  const flagged = POINTS.filter((x) => x.aykiri || isDup(x)).sort((a, b) => (a.aykiri === b.aykiri ? a.i - b.i : a.aykiri ? -1 : 1))

  const select = (pt: Point | null, center = false) => {
    setSel(pt ? pt.i : null)
    if (pt) {
      announce(`${pt.id} seçildi: ${cluster(pt.c).ad}, kalite ${num(pt.q, 2)}${flags(pt).length ? `, ${flags(pt).join(' ve ')}` : ''}`)
      if (center) pz.current?.focus(pt.x, pt.y, 3)
    }
  }

  const onTap = (x: number, y: number, k: number) => {
    let best: Point | null = null
    let bd = 18 / k
    for (const q of POINTS) {
      const d = Math.hypot(q.x - x, q.y - y)
      if (d < bd) {
        bd = d
        best = q
      }
    }
    select(best)
  }

  const art = (k: number) => {
    const u = 1 / k
    const rOf = (q: Point) => (on.derinlik ? 2.6 + q.z * 3.6 : 4.2) * u
    const layer = (q: Point) => (q.z < 0.33 ? 0 : q.z < 0.66 ? 1 : 2)
    const drawPoint = (q: Point) => {
      const r = rOf(q)
      const fill = Q_RAMP[qBucket(q.q)]
      const op = on.derinlik ? [0.5, 0.8, 1][layer(q)] : 1
      if (q.aykiri && on.aykiri) return <path key={q.i} d={tri(q.x, q.y, r * 1.6)} fill="rgb(250 204 21 / 0.25)" stroke="var(--node-active)" strokeWidth={1.5 * u} opacity={op} />
      if (isDup(q) && on.kopya) return <rect key={q.i} x={q.x - r * 1.1} y={q.y - r * 1.1} width={r * 2.2} height={r * 2.2} fill="rgb(248 113 113 / 0.3)" stroke="var(--err)" strokeWidth={1.5 * u} opacity={op} />
      return <circle key={q.i} cx={q.x} cy={q.y} r={r} fill={fill} opacity={op} />
    }
    const far = POINTS.filter((q) => on.derinlik && layer(q) === 0)
    const rest = POINTS.filter((q) => !(on.derinlik && layer(q) === 0))
    return (
      <>
        <defs>
          <filter id="dof-far" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={1.3 * u} />
          </filter>
        </defs>
        <rect x={0} y={0} width={W} height={H} fill="transparent" />
        {on.kume
          ? hulls.map(({ c, cx: x, cy: y, r }) => (
              <g key={c.id}>
                <circle cx={x} cy={y} r={r} fill="rgb(99 102 241 / 0.04)" stroke="var(--line-strong)" strokeWidth={u} strokeDasharray={`${4 * u} ${5 * u}`} />
                <text x={x} y={y - r - 8 * u} textAnchor="middle" fontSize={13 * u} fill="var(--ink)" className="font-sans">
                  {c.ad}
                </text>
                <text x={x} y={y - r + 8 * u} textAnchor="middle" fontSize={11 * u} fill="var(--muted)" className="font-mono mono-tight">
                  {c.n} örnek
                </text>
              </g>
            ))
          : null}
        {on.kenar ? (
          <g stroke="var(--edge)" strokeWidth={u}>
            {EDGES.map(([a, b]) => (
              <line key={`${a}-${b}`} x1={POINTS[a].x} y1={POINTS[a].y} x2={POINTS[b].x} y2={POINTS[b].y} />
            ))}
          </g>
        ) : null}
        {on.kopya ? (
          <g stroke="var(--err)" strokeWidth={1.2 * u} strokeDasharray={`${3 * u} ${3 * u}`}>
            {POINTS.filter((q) => q.kopyaOf !== null).map((q) => (
              <line key={q.i} x1={q.x} y1={q.y} x2={POINTS[q.kopyaOf!].x} y2={POINTS[q.kopyaOf!].y} />
            ))}
          </g>
        ) : null}
        <g className="dof" filter={dof ? 'url(#dof-far)' : undefined}>
          {far.map(drawPoint)}
        </g>
        <g>{rest.map(drawPoint)}</g>
        {p ? (
          <g pointerEvents="none">
            {nb.map((o) => (
              <line key={o.i} x1={p.x} y1={p.y} x2={o.x} y2={o.y} stroke="#c7d2fe" strokeWidth={1.8 * u} />
            ))}
            {nb.map((o) => (
              <circle key={o.i} cx={o.x} cy={o.y} r={rOf(o) + 3 * u} fill="none" stroke="#c7d2fe" strokeWidth={1.2 * u} />
            ))}
            <circle cx={p.x} cy={p.y} r={rOf(p) + 6 * u} fill="none" stroke="var(--ink)" strokeWidth={2 * u} className="glow" />
          </g>
        ) : null}
      </>
    )
  }

  return (
    <Section id="veri" eyebrow="Madde 10 · 17 · Veri seti analizi" title="Gömme uzayında veri setini gezin" lead={`nöral-veri/v3’ten ${STATS.n} örneklik kesit, iki boyuta indirgenmiş gömme uzayında. Katmanları açıp kapatın, bir noktaya dokunup komşularını görün. Harita her ekranda kaydırılır ve yakınlaştırılır; mobilde asıl etkileşim budur.`}>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <Stat label="Toplam örnek" value={num(TOTAL_ROWS)} sub={`haritada ${STATS.n}`} />
        <Stat label="Kopya" value={num(STATS.dup)} sub={`örneklemin ${pct(STATS.dup / STATS.n, 1)}`} tone="err" />
        <Stat label="Aykırı" value={num(STATS.out)} sub={`örneklemin ${pct(STATS.out / STATS.n, 1)}`} tone="active" />
        <Stat label="Ortalama kalite" value={num(STATS.q, 2)} sub="0–1 arası puan" />
      </div>

      <fieldset className="mt-4 flex flex-wrap items-center gap-2">
        <legend className="sr-only">Analitik katmanlar</legend>
        <span className="mr-1 flex items-center gap-1.5 text-[14px] text-muted" aria-hidden="true">
          <IconLayers size={16} /> Katmanlar
        </span>
        {LAYERS.map((l) => (
          <label key={l.id} className={cx('chip cursor-pointer py-1 text-[12px] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--focus)]', on[l.id] ? 'border-[rgb(167_139_250/0.6)] bg-[rgb(167_139_250/0.12)] text-ink' : 'hover:text-ink')}>
            <input type="checkbox" className="sr-only" checked={on[l.id]} onChange={(e) => setOn((o) => ({ ...o, [l.id]: e.target.checked }))} />
            <span className={cx('grid size-3.5 place-items-center rounded-[4px] border', on[l.id] ? 'border-violet bg-violet' : 'border-line-strong')} aria-hidden="true">
              {on[l.id] ? (
                <svg viewBox="0 0 12 12" width="10" height="10">
                  <path d="M2.5 6.2l2.2 2.2 4.8-5" stroke="#0a0a0a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                </svg>
              ) : null}
            </span>
            {l.ad}
          </label>
        ))}
      </fieldset>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <PanZoom ref={pz} cw={W} ch={H} height={wide ? '520px' : '420px'} label={`Veri seti haritası: ${STATS.n} örnek, ${CLUSTERS.length} küme`} onTap={onTap}>
            {art}
          </PanZoom>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-muted" aria-label="Harita açıklaması">
            <li className="flex items-center gap-2">
              <span className="flex" aria-hidden="true">
                {Q_RAMP.map((c) => (
                  <span key={c} className="h-2.5 w-4 first:rounded-l-full last:rounded-r-full" style={{ background: c }} />
                ))}
              </span>
              Kalite: düşük – yüksek
            </li>
            <li className="flex items-center gap-2">
              <svg width="14" height="14" aria-hidden="true">
                <path d={tri(7, 8, 6)} fill="rgb(250 204 21 / 0.25)" stroke="var(--node-active)" strokeWidth="1.5" />
              </svg>
              Aykırı (üçgen)
            </li>
            <li className="flex items-center gap-2">
              <svg width="14" height="14" aria-hidden="true">
                <rect x="2" y="2" width="10" height="10" fill="rgb(248 113 113 / 0.3)" stroke="var(--err)" strokeWidth="1.5" />
              </svg>
              Kopya (kare, kesik çizgiyle eşine bağlı)
            </li>
            <li className="flex items-center gap-2">
              <svg width="18" height="8" aria-hidden="true">
                <path d="M1 4H17" stroke="var(--edge-strong)" strokeWidth="1.5" />
              </svg>
              En yakın 2 komşu
            </li>
          </ul>
        </div>

        <div className="grid min-w-0 content-start gap-4">
          <Panel title="Seçili örnek">
            {p ? (
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-mono text-[15px] mono-tight">{p.id}</p>
                    <p className="text-[14px] text-muted">{cluster(p.c).ad}</p>
                  </div>
                  <button type="button" className="icon-btn size-8" aria-label="Seçimi kaldır" onClick={() => setSel(null)}>
                    <IconX size={15} />
                  </button>
                </div>
                {flags(p).length ? (
                  <p className="mt-2 flex gap-1.5">
                    {p.aykiri ? <span className="chip border-[rgb(250_204_21/0.5)] text-active">aykırı · incele</span> : null}
                    {isDup(p) ? <span className="chip border-[rgb(248_113_113/0.5)] text-err">kopya · temizle</span> : null}
                  </p>
                ) : null}
                <dl className="mt-3 grid grid-cols-3 gap-2 text-[13px]">
                  <div>
                    <dt className="label">Kalite</dt>
                    <dd className="font-mono tabular-nums mono-tight">{num(p.q, 2)}</dd>
                  </div>
                  <div>
                    <dt className="label">Token</dt>
                    <dd className="font-mono tabular-nums mono-tight">{num(p.tok)}</dd>
                  </div>
                  <div>
                    <dt className="label">Derinlik</dt>
                    <dd className="font-mono tabular-nums mono-tight">{num(p.z, 2)}</dd>
                  </div>
                </dl>
                <p className="label mt-3">Metin</p>
                <p className="mt-1 rounded-lg border border-line bg-bg/70 p-2.5 font-mono text-[12px] leading-relaxed break-words text-ink mono-tight">{p.metin}</p>
                {pairOf(p) ? (
                  <p className="mt-3 text-[14px] text-muted">
                    Eşi:{' '}
                    <button type="button" className="font-mono text-[13px] text-blue underline underline-offset-2 mono-tight" onClick={() => select(pairOf(p), true)}>
                      {pairOf(p)!.id}
                    </button>
                  </p>
                ) : null}
                {nb.length ? (
                  <>
                    <p className="label mt-3">En yakın komşular</p>
                    <ul className="mt-1 flex flex-wrap gap-1.5">
                      {nb.map((o) => (
                        <li key={o.i}>
                          <button type="button" className="chip text-ink hover:border-[rgb(167_139_250/0.6)]" onClick={() => select(o, true)}>
                            {o.id}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
                <button type="button" className="btn btn-ghost mt-4 min-h-9 w-full text-[14px]" onClick={() => pz.current?.focus(p.x, p.y, 3)}>
                  Haritada ortala
                </button>
              </div>
            ) : (
              <p className="text-[14px] text-muted">Haritada bir noktaya dokunun ya da aşağıdaki listeden bir örnek seçin.</p>
            )}
          </Panel>
          <Panel title="Kümeler">
            <ul className="space-y-2">
              {[...CLUSTERS]
                .sort((a, b) => b.pay - a.pay)
                .map((c) => (
                  <li key={c.id}>
                    <button type="button" className="group w-full text-left" onClick={() => pz.current?.focus(hull(c).cx, hull(c).cy, 2.2)} aria-label={`${c.ad}: veri setinin yüzde ${Math.round(c.pay * 100)}’i, ortalama kalite ${num(c.kalite, 2)}. Haritada göster`}>
                      <span className="flex items-baseline justify-between gap-2 text-[14px]">
                        <span className="group-hover:text-ink">{c.ad}</span>
                        <span className="font-mono text-[12px] text-muted tabular-nums mono-tight">
                          {pct(c.pay)} · kalite {num(c.kalite, 2)}
                        </span>
                      </span>
                      <span className="mt-1 block h-2 overflow-hidden rounded-full bg-[rgb(255_255_255/0.06)]">
                        <span className="block h-full rounded-full bg-[linear-gradient(90deg,#60a5fa,#a78bfa)]" style={{ width: `${(c.pay / 0.21) * 100}%` }} />
                      </span>
                    </button>
                  </li>
                ))}
            </ul>
          </Panel>
        </div>
      </div>

      <Panel title="İncelenecek örnekler" className="mt-4">
        <div className="scroll-x max-h-[320px] overflow-y-auto rounded-xl border border-line" tabIndex={0} role="region" aria-label="İncelenecek örnekler tablosu, kaydırılabilir">
          <table className="w-full min-w-[640px] text-left text-[14px] whitespace-nowrap">
            <caption className="sr-only">Aykırı ve kopya olarak işaretlenen örnekler</caption>
            <thead className="label sticky top-0 bg-panel">
              <tr>
                {['Örnek', 'Küme', 'Bayrak', 'Kalite', 'Kalite aralığı', ''].map((h, i) => (
                  <th key={i} scope="col" className="px-3 py-2 font-normal">
                    {h || <span className="sr-only">Eylem</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {flagged.map((q) => (
                <tr key={q.i} className={cx('border-t border-line', sel === q.i && 'bg-hover')}>
                  <th scope="row" className="px-3 py-1.5 font-mono text-[12px] font-normal mono-tight">
                    {q.id}
                  </th>
                  <td className="px-3 py-1.5">{cluster(q.c).ad}</td>
                  <td className={cx('px-3 py-1.5', q.aykiri ? 'text-active' : 'text-err')}>{q.aykiri ? 'Aykırı' : `Kopya · eşi ${pairOf(q)!.id}`}</td>
                  <td className="px-3 py-1.5 font-mono text-[12px] tabular-nums mono-tight">{num(q.q, 2)}</td>
                  <td className="px-3 py-1.5 text-muted">{Q_LABEL[qBucket(q.q)]}</td>
                  <td className="px-3 py-1.5 text-right">
                    <button type="button" className="text-[13px] whitespace-nowrap text-blue underline underline-offset-2" onClick={() => select(q, true)}>
                      Haritada göster
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </Section>
  )
}
