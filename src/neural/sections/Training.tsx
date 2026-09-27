import { useEffect, useMemo, useRef, useState } from 'react'
import { LineChart } from '../charts/LineChart'
import { PanZoom } from '../components/PanZoom'
import { GpuTable, ProcessorTreeArt, TREE_H, TREE_W } from '../components/ProcessorTree'
import { IconCheck, IconPause, IconPlay, IconTable, IconWarning } from '../components/Icons'
import { Panel, Section, Seg, Stat } from '../components/ui'
import { useMedia } from '../hooks/useMedia'
import { CHECKPOINTS, EVENTS, EVERY, POINTS, SPIKE, START, TOKENS_PER_STEP, TOTAL, VALS, gpus as gpuAt } from '../lib/training'
import { dur, num, sci, tokens } from '../lib/format'
import { useNeural } from '../lib/store'
import { cx } from '../../shared/cx'

type Range = 'tum' | '5k' | '1k'
const SEC_PER_STEP = TOKENS_PER_STEP / 412_000

export function Training() {
  const { announce } = useNeural()
  const wide = useMedia('(min-width: 768px)')
  const [cur, setCur] = useState(START)
  const [live, setLive] = useState(true)
  const [range, setRange] = useState<Range>('5k')
  const [table, setTable] = useState(false)
  const [gpuTable, setGpuTable] = useState(false)
  const lastCk = useRef(Math.floor(START / 2000))

  // Canlı akış: her 0,7 sn'de 20 adım. Duraklatılabilir (WCAG 2.2.2)
  useEffect(() => {
    if (!live) return
    const t = window.setInterval(() => setCur((c) => Math.min(TOTAL, c + EVERY)), 700)
    return () => window.clearInterval(t)
  }, [live])
  useEffect(() => {
    if (cur >= TOTAL && live) {
      setLive(false)
      announce('Eğitim tamamlandı: 20.000 adım')
    }
    const ck = Math.floor(cur / 2000)
    if (ck > lastCk.current) {
      lastCk.current = ck
      announce(`Kontrol noktası kaydedildi: adım ${num(ck * 2000)}`)
    }
  }, [cur, live, announce])

  const pts = useMemo(() => POINTS.filter((p) => p.s <= cur), [cur])
  const vals = useMemo(() => VALS.filter((v) => v.s <= cur), [cur])
  const recent = pts.slice(-10)
  const trainNow = recent.reduce((a, p) => a + p.train, 0) / recent.length
  const valNow = vals[vals.length - 1]
  const x0 = range === 'tum' ? 0 : Math.max(0, cur - (range === '5k' ? 5000 : 1000))
  const g = useMemo(() => gpuAt(cur), [cur])
  const best = CHECKPOINTS.filter((c) => c.s <= cur).reduce<(typeof CHECKPOINTS)[number] | null>((b, c) => (!b || c.val < b.val ? c : b), null)
  const fmtStep = (x: number) => (x >= 1000 ? `${num(x / 1000, x % 1000 ? 1 : 0)} bin` : num(x))

  return (
    <Section id="egitim" eyebrow="Madde 10 · LLM eğitim paneli" title="Eğitim canlı akarken okunabilir kalır" lead="nöral-7b ön eğitimi (kurgu veri). Kayıp grafiği tek eksenli; öğrenme oranı kendi grafiğinde. Her grafik fareyle, dokunarak ya da ok tuşlarıyla okunur ve tablo olarak da açılır.">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
        <Stat label="Adım" value={`${num(cur)}`} sub={`/ ${num(TOTAL)} · %${Math.round((cur / TOTAL) * 100)}`} />
        <Stat label="Eğitim kaybı" value={num(trainNow, 2)} sub="son 200 adım ortalaması" />
        <Stat label="Doğrulama kaybı" value={valNow ? num(valNow.val, 2) : '–'} sub={valNow ? `perpleksite ${num(Math.exp(valNow.val), 1)}` : undefined} />
        <Stat label="Görülen token" value={tokens(cur * TOKENS_PER_STEP)} sub="412 bin token/sn" />
        <Stat label="Kalan süre" value={cur >= TOTAL ? 'Bitti' : dur((TOTAL - cur) * SEC_PER_STEP)} sub={cur >= TOTAL ? 'eğitim tamamlandı' : `adım başına ${num(SEC_PER_STEP, 1)} sn`} tone={cur >= TOTAL ? 'done' : undefined} />
      </div>

      {/* dataviz: süzgeçler grafiklerin üstünde tek satırda */}
      <div className="mt-4 flex flex-wrap items-end gap-3">
        <button type="button" className={cx('btn', live ? 'btn-ghost' : 'btn-primary')} onClick={() => setLive((v) => !v)} disabled={cur >= TOTAL} aria-pressed={!live}>
          {live ? <IconPause size={15} /> : <IconPlay size={15} />}
          {live ? 'Akışı duraklat' : 'Akışı sürdür'}
        </button>
        <Seg<Range> legend="Aralık" name="aralik" hideLegend value={range} onChange={setRange} options={[{ id: 'tum', ad: 'Tümü' }, { id: '5k', ad: 'Son 5.000' }, { id: '1k', ad: 'Son 1.000' }]} />
        <button type="button" className="btn btn-ghost" onClick={() => setTable((v) => !v)} aria-expanded={table} aria-controls="kayip-tablo">
          <IconTable size={16} /> {table ? 'Tabloyu gizle' : 'Tablo'}
        </button>
        <p className="ml-auto flex items-center gap-2 font-mono text-[12px] mono-tight" aria-hidden="true">
          <span className={cx('size-2 rounded-full', live ? 'node-flicker bg-active' : cur >= TOTAL ? 'bg-done' : 'bg-idle')} />
          <span className={live ? 'text-active' : 'text-muted'}>{live ? 'CANLI' : cur >= TOTAL ? 'TAMAMLANDI' : 'DURAKLATILDI'}</span>
        </p>
      </div>

      <div className="mt-4 grid items-start gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <Panel title="Kayıp">
          <ul className="mb-2 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-muted" aria-label="Açıklama">
            <li className="flex items-center gap-2">
              <svg width="22" height="8" aria-hidden="true">
                <path d="M1 4H21" stroke="var(--series-1)" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Eğitim kaybı (her 20 adım)
            </li>
            <li className="flex items-center gap-2">
              <svg width="22" height="8" aria-hidden="true">
                <path d="M1 4H21" stroke="var(--series-2)" strokeWidth="2" strokeDasharray="5 4" strokeLinecap="round" />
                <circle cx="11" cy="4" r="3" fill="var(--series-2)" />
              </svg>
              Doğrulama kaybı (her 500 adım)
            </li>
          </ul>
          <LineChart
            label="Kayıp grafiği: eğitim ve doğrulama kaybı, adıma göre"
            height={wide ? 400 : 250}
            x0={x0}
            x1={cur}
            endLabels
            fmtX={fmtStep}
            fmtY={(v) => num(v, 2)}
            notes={[{ x: SPIKE, label: 'sıçrama' }]}
            series={[
              { id: 'train', ad: 'Eğitim', color: 'var(--series-1)', data: pts.map((p) => ({ x: p.s, y: p.train })) },
              { id: 'val', ad: 'Doğrulama', color: 'var(--series-2)', data: vals.map((v) => ({ x: v.s, y: v.val })), dash: '6 5', markers: true },
            ]}
          />
          {table ? (
            <div id="kayip-tablo" className="scroll-x mt-3 max-h-[280px] overflow-y-auto rounded-xl border border-line" tabIndex={0} role="region" aria-label="Kayıp tablosu, kaydırılabilir">
              <table className="w-full min-w-[380px] text-left text-[14px]">
                <caption className="sr-only">Doğrulama noktalarında eğitim ve doğrulama kaybı, öğrenme oranı</caption>
                <thead className="label sticky top-0 bg-panel">
                  <tr>
                    {['Adım', 'Eğitim', 'Doğrulama', 'Öğrenme oranı'].map((h) => (
                      <th key={h} scope="col" className="px-3 py-2 font-normal">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="font-mono text-[12px] tabular-nums mono-tight">
                  {vals
                    .filter((v) => v.s >= x0)
                    .reverse()
                    .map((v) => {
                      const p = POINTS[v.s / EVERY]
                      return (
                        <tr key={v.s} className="border-t border-line">
                          <th scope="row" className="px-3 py-1.5 font-normal">
                            {num(v.s)}
                          </th>
                          <td className="px-3 py-1.5">{num(p.train, 3)}</td>
                          <td className="px-3 py-1.5">{num(v.val, 3)}</td>
                          <td className="px-3 py-1.5">{sci(p.lr)}</td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          ) : null}
        </Panel>

        <div className="grid min-w-0 gap-4">
          <Panel title="Öğrenme oranı">
            <LineChart
              label="Öğrenme oranı: ısınma ve kosinüs azalması; kesik kısım planlanan"
              height={150}
              x0={0}
              x1={TOTAL}
              zeroBase
              now={cur}
              fmtX={fmtStep}
              fmtY={(v) => sci(v)}
              series={[{ id: 'lr', ad: 'Öğrenme oranı', color: 'var(--series-lr)', data: POINTS.filter((_, i) => i % 5 === 0).map((p) => ({ x: p.s, y: p.lr })), futureFrom: cur }]}
            />
            <p className="mt-1 text-[13px] text-muted">
              Şu an <span className="font-mono text-ink mono-tight">{sci(POINTS[cur / EVERY].lr)}</span>; 1.000 adım ısınma, sonra kosinüsle 3,0e-5’e iner.
            </p>
          </Panel>
          <Panel title="Kontrol noktaları">
            <ol className="space-y-1.5 text-[14px]">
              {CHECKPOINTS.map((c) => {
                const saved = c.s <= cur
                return (
                  <li key={c.s} className="flex items-center gap-2.5">
                    <span className={cx('grid size-5 shrink-0 place-items-center rounded-full border', saved ? 'border-done text-done' : 'border-dashed border-idle')} aria-hidden="true">
                      {saved ? <IconCheck size={12} strokeWidth={2.2} /> : null}
                    </span>
                    <span className="font-mono text-[12px] tabular-nums mono-tight">{num(c.s)}</span>
                    <span className="text-muted">{saved ? `doğrulama ${num(c.val, 3)}` : 'planlandı'}</span>
                    {best && best.s === c.s ? <span className="chip ml-auto border-[rgb(74_222_128/0.5)] text-done">en iyi</span> : null}
                  </li>
                )
              })}
            </ol>
          </Panel>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <Panel
          title="İşlemci ağacı"
          action={
            <button type="button" className="btn btn-ghost min-h-8 px-3 text-[13px]" onClick={() => setGpuTable((v) => !v)} aria-expanded={gpuTable} aria-controls="gpu-tablo">
              <IconTable size={15} /> {gpuTable ? 'Tabloyu gizle' : 'Tablo'}
            </button>
          }
        >
          {wide ? (
            <svg viewBox={`0 0 ${TREE_W} ${TREE_H + 8}`} className="w-full" role="img" aria-label={`İşlemci ağacı: 2 düğüm, 8 GPU. Ortalama kullanım yüzde ${Math.round((g.reduce((a, x) => a + x.kullanim, 0) / 8) * 100)}. ${g.filter((x) => x.sicaklik >= 83).map((x) => `GPU ${x.id} sıcak, ${x.sicaklik} derece`).join('. ')}`}>
              <ProcessorTreeArt gpus={g} busy={live} />
            </svg>
          ) : (
            <PanZoom cw={TREE_W} ch={TREE_H + 8} height="300px" label="İşlemci ağacı: 2 düğüm, 8 GPU" maxRel={4} initial={{ x: 200, y: 190, rel: 2.1 }}>
              {() => <ProcessorTreeArt gpus={g} busy={live} />}
            </PanZoom>
          )}
          {g.some((x) => x.sicaklik >= 83) ? (
            <p className="mt-3 flex items-start gap-2 text-[14px]">
              <IconWarning size={16} className="mt-0.5 shrink-0 text-active" />
              <span>
                <span className="text-active">Uyarı:</span> <span className="text-muted">GPU 5 sıcak ({g[5].sicaklik}°C). Soğutma eğrisini kontrol edin; eşik 83°C.</span>
              </span>
            </p>
          ) : null}
          {gpuTable ? (
            <div id="gpu-tablo" className="mt-3">
              <GpuTable gpus={g} />
            </div>
          ) : null}
        </Panel>
        <Panel title="Olaylar">
          <ol className="space-y-3">
            {EVENTS.filter((e) => e.s <= cur)
              .reverse()
              .map((e) => (
                <li key={e.s} className="flex gap-3 text-[14px]">
                  <span className={cx('mt-1.5 size-2 shrink-0 rounded-full', e.kind === 'uyari' ? 'bg-active' : e.kind === 'tamam' ? 'bg-done' : 'bg-blue')} aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block font-mono text-[11px] text-faint mono-tight">
                      Adım {num(e.s)}
                      {e.kind === 'uyari' ? ' · uyarı' : ''}
                    </span>
                    <span className="text-ink">{e.text}</span>
                  </span>
                </li>
              ))}
          </ol>
        </Panel>
      </div>
    </Section>
  )
}
