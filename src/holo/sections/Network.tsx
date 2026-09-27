import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { AreaChart, type Sample } from '../charts/AreaChart'
import { RadarChart } from '../charts/RadarChart'
import { HoloButton, HoloPanel, PanelHead, SectionHead, StatusPill } from '../components/ui'
import { HoloIcon } from '../components/Icons'
import { useHolo } from '../lib/store'
import { RADAR_AXES, RADAR_SERIES, fmtNum } from '../lib/data'

type Job = { id: string; name: string; peer: string; dir: 'rx' | 'tx'; total: number; done: number; modelId?: string }
const JOBS: Job[] = [
  { id: 'j1', name: 'orion-70b-q4_k_m.gguf', peer: 'nas-01', dir: 'rx', total: 42.5, done: 16.2, modelId: 'orion-70b' },
  { id: 'j2', name: 'veri-kumesi-tr-v3.parquet', peer: 'nas-01', dir: 'rx', total: 18.4, done: 0 },
  { id: 'j3', name: 'kontrol-noktasi-0927.tar', peer: 'yedek-02', dir: 'tx', total: 12.8, done: 3.1 },
]

function seedSamples(): Sample[] {
  let s = 3
  const r = () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
  return Array.from({ length: 60 }, () => ({ rx: 9.1 + (r() - 0.5) * 0.6, tx: 2.3 + (r() - 0.5) * 0.6 }))
}

const SERIES = [
  { key: 'rx' as const, label: 'Alınan', color: 'var(--series-a)' },
  { key: 'tx' as const, label: 'Gönderilen', color: 'var(--series-b)' },
]

function ViewToggle({ table, onChange, controls }: { table: boolean; onChange: (t: boolean) => void; controls: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!table)}
      aria-pressed={table}
      aria-controls={controls}
      className="thin-glow inline-flex min-h-9 items-center gap-2 rounded-full px-3 font-tech text-[13px] font-semibold text-muted transition-colors hover:text-ink aria-pressed:text-cyan-text"
    >
      <HoloIcon name={table ? 'grafik' : 'tablo'} size={14} glow={false} />
      {table ? 'Grafik' : 'Tablo'}
    </button>
  )
}

function Legend({ items }: { items: ReadonlyArray<{ label: string; color: string; value?: string }> }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-1 text-[14px]" aria-label="Lejant">
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-2">
          <span className="h-0.5 w-5 rounded-full" style={{ background: i.color, boxShadow: `0 0 6px ${i.color}` } as CSSProperties} aria-hidden="true" />
          {i.label}
          {i.value ? <span className="text-muted tabular-nums">{i.value}</span> : null}
        </li>
      ))}
    </ul>
  )
}

export function Network() {
  const s = useHolo()
  const [samples, setSamples] = useState<Sample[]>(seedSamples)
  const [jobs, setJobs] = useState<Job[]>(JOBS)
  const [areaTable, setAreaTable] = useState(false)
  const [radarTable, setRadarTable] = useState(false)
  const jobsRef = useRef(jobs)
  jobsRef.current = jobs
  const { transfer, setStatus, say } = s

  // Her saniye bir örnek: aktarım açıkken ~9,3 Gbit/sn alınır; iş bitince model dizini güncellenir
  useEffect(() => {
    const t = window.setInterval(() => {
      const js = jobsRef.current
      const rxJob = js.find((j) => j.dir === 'rx' && j.done < j.total)
      const txJob = js.find((j) => j.dir === 'tx' && j.done < j.total)
      const n = () => Math.random() - 0.5
      const rx = transfer ? (rxJob ? 9.25 + n() * 0.5 : 0.3 + n() * 0.1) : 0.05
      const tx = transfer ? (txJob ? 2.35 + n() * 0.5 : 0.45 + n() * 0.1) : 0.03
      setSamples((xs) => [...xs.slice(1), { rx: Math.max(0, rx), tx: Math.max(0, tx) }])
      if (!transfer) return
      const finished: Job[] = []
      const next = js.map((j) => {
        if (j.done >= j.total || (j.id !== rxJob?.id && j.id !== txJob?.id)) return j
        const done = Math.min(j.total, j.done + (j.dir === 'rx' ? rx : tx) / 8)
        if (done >= j.total) finished.push(j)
        return { ...j, done }
      })
      jobsRef.current = next
      setJobs(next)
      for (const j of finished) {
        if (j.modelId) {
          setStatus([j.modelId], 'diskte')
          say(`${j.name} indirildi; model dizininde "Diskte"`)
        } else say(`${j.name} aktarımı tamamlandı`)
      }
    }, 1000)
    return () => window.clearInterval(t)
  }, [transfer, setStatus, say])

  const last = samples[samples.length - 1]
  const allDone = jobs.every((j) => j.done >= j.total)

  return (
    <section id="ag" className="px-4 py-20 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="10 · 11"
          label="Ağ ve grafikler"
          title="10GbE aktarım izleyici"
          lede="Model dosyaları NAS'tan 10 gigabitlik bağlantıyla iner. Alan grafiği son 60 saniyeyi, radar iki modeli altı eksende karşılaştırır. Değerler kurgusaldır; her iki grafiğin tablo görünümü de var."
        />
        <div className="grid gap-6 lg:grid-cols-[1.45fr_1fr]">
          <HoloPanel tick className="min-w-0 p-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <PanelHead title="Aktarım hızı · Gbit/sn" icon={<HoloIcon name="ag" size={16} />} />
              <div className="flex gap-2">
                <HoloButton
                  size="sm"
                  onClick={() => {
                    s.setTransfer(!transfer)
                    say(transfer ? 'Ağ aktarımı duraklatıldı' : 'Ağ aktarımı sürüyor')
                  }}
                  aria-pressed={!transfer}
                  icon={<HoloIcon name={transfer ? 'duraklat' : 'oynat'} size={14} glow={false} />}
                >
                  {transfer ? 'Duraklat' : 'Sürdür'}
                </HoloButton>
                <ViewToggle table={areaTable} onChange={setAreaTable} controls="alan-gorunum" />
              </div>
            </div>
            <div className="mt-3">
              <Legend
                items={[
                  { label: 'Alınan', color: 'var(--series-a)', value: `${fmtNum(last.rx)} Gbit/sn` },
                  { label: 'Gönderilen', color: 'var(--series-b)', value: `${fmtNum(last.tx)} Gbit/sn` },
                ]}
              />
            </div>
            <div id="alan-gorunum" className="mt-4">
              {areaTable ? (
                <table className="w-full text-left text-[14px] tabular-nums">
                  <caption className="sr-only">Son 10 saniyenin aktarım hızı, Gbit/sn</caption>
                  <thead className="font-tech text-[12px] tracking-[0.12em] text-muted uppercase">
                    <tr>
                      <th className="py-2 font-semibold">Zaman</th>
                      <th className="py-2 text-right font-semibold">Alınan</th>
                      <th className="py-2 text-right font-semibold">Gönderilen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {samples
                      .slice(-10)
                      .reverse()
                      .map((d, i) => (
                        <tr key={i} className="border-t border-line-soft">
                          <td className="py-1.5">{i === 0 ? 'şimdi' : `${i} sn önce`}</td>
                          <td className="py-1.5 text-right">{fmtNum(d.rx, 2)}</td>
                          <td className="py-1.5 text-right">{fmtNum(d.tx, 2)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <AreaChart data={samples} series={SERIES} height={300} label={`Son 60 saniyenin aktarım hızı. Şu an alınan ${fmtNum(last.rx)}, gönderilen ${fmtNum(last.tx)} gigabit/saniye.`} />
              )}
            </div>
          </HoloPanel>

          <div className="flex min-w-0 flex-col gap-6">
            <HoloPanel className="p-5 md:p-6">
              <PanelHead title="Bağlantı" meta="enp5s0" />
              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-[15px]">
                {[
                  ['Hız', '10GBASE-T'],
                  ['MTU', '9000 (jumbo)'],
                  ['Gecikme', '0,21 ms'],
                  ['Paket kaybı', '%0'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-tech text-[12px] tracking-[0.1em] text-muted uppercase">{k}</dt>
                    <dd className="tabular-nums">{v}</dd>
                  </div>
                ))}
              </dl>
            </HoloPanel>
            <HoloPanel className="flex-1 p-5 md:p-6">
              <div className="flex items-center justify-between gap-3">
                <PanelHead title="Aktarımlar" />
                <StatusPill tone={transfer && !allDone ? 'cyan' : 'muted'} pulse={transfer && !allDone}>
                  {allDone ? 'Hepsi bitti' : transfer ? 'Sürüyor' : 'Duraklatıldı'}
                </StatusPill>
              </div>
              <ul className="mt-4 flex flex-col gap-4">
                {jobs.map((j) => {
                  const pct = (j.done / j.total) * 100
                  return (
                    <li key={j.id}>
                      <p className="flex items-center justify-between gap-3 text-[14px]">
                        <span className="flex min-w-0 items-center gap-2">
                          <HoloIcon name={j.dir === 'rx' ? 'yukle' : 'kaldir'} size={16} className={j.dir === 'rx' ? 'text-cyan-text' : 'text-blue-text'} />
                          <span className="truncate font-mono text-[13px]">{j.name}</span>
                        </span>
                        <span className="shrink-0 font-tech text-[12px] text-muted tabular-nums">{Math.floor(pct)}%</span>
                      </p>
                      <div
                        className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--line-soft)]"
                        role="progressbar"
                        aria-label={`${j.name}, ${j.dir === 'rx' ? `${j.peer} kaynağından` : `${j.peer} hedefine`}`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.floor(pct)}
                      >
                        <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${pct}%`, background: j.dir === 'rx' ? 'var(--series-a)' : 'var(--series-b)', boxShadow: '0 0 8px var(--glow-strong)' } as CSSProperties} />
                      </div>
                      <p className="mt-1 text-[12px] text-muted tabular-nums">
                        {j.dir === 'rx' ? `${j.peer} → bu makine` : `bu makine → ${j.peer}`} · {fmtNum(j.done)} / {fmtNum(j.total)} GB
                      </p>
                    </li>
                  )
                })}
              </ul>
              {allDone ? (
                <HoloButton size="sm" className="mt-4" onClick={() => setJobs(JOBS.map((j) => ({ ...j, done: 0 })))}>
                  Aktarımları yeniden başlat
                </HoloButton>
              ) : null}
            </HoloPanel>
          </div>
        </div>

        <HoloPanel className="mt-6 p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <PanelHead title="Model karşılaştırma · radar" icon={<HoloIcon name="radar" size={16} />} meta="0–100 · kurgusal" />
            <ViewToggle table={radarTable} onChange={setRadarTable} controls="radar-gorunum" />
          </div>
          <div className="mt-3">
            <Legend items={RADAR_SERIES.map((r, i) => ({ label: r.label, color: i === 0 ? 'var(--series-a)' : 'var(--series-b)' }))} />
          </div>
          <div id="radar-gorunum" className="mt-4 grid items-center gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            {radarTable ? (
              <table className="w-full text-left text-[15px] tabular-nums md:col-span-2">
                <caption className="sr-only">Atlas 14B ve Nova 8B, altı eksende puan</caption>
                <thead className="font-tech text-[12px] tracking-[0.12em] text-muted uppercase">
                  <tr>
                    <th className="py-2 font-semibold">Eksen</th>
                    {RADAR_SERIES.map((r) => (
                      <th key={r.id} className="py-2 text-right font-semibold">
                        {r.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RADAR_AXES.map((a, i) => (
                    <tr key={a} className="border-t border-line-soft">
                      <th scope="row" className="py-2 font-normal">
                        {a}
                      </th>
                      {RADAR_SERIES.map((r) => (
                        <td key={r.id} className="py-2 text-right">
                          {r.values[i]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <>
                <RadarChart axes={RADAR_AXES} series={RADAR_SERIES.map((r, i) => ({ ...r, color: i === 0 ? 'var(--series-a)' : 'var(--series-b)' }))} title="Atlas 14B ve Nova 8B karşılaştırması" />
                <div className="flex flex-col gap-4 text-[15px]">
                  <p>
                    <span className="font-[500]">Atlas 14B</span> <span className="text-muted">akıl yürütme ve kodda önde (82 ve 74); daha büyük olduğu için yavaş ve belleğe daha ağır.</span>
                  </p>
                  <p>
                    <span className="font-[500]">Nova 8B</span> <span className="text-muted">hız, bellek verimi ve uzun bağlamda önde (88, 84, 90); 128K bağlam taşıyabilir.</span>
                  </p>
                  <p className="text-[14px] text-muted">İşaretçinin üzerine gelince iki modelin o eksendeki değeri görünür. Tüm değerler için "Tablo" görünümüne geçin.</p>
                </div>
              </>
            )}
          </div>
        </HoloPanel>
      </div>
    </section>
  )
}
