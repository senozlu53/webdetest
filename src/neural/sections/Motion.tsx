import { useEffect, useState } from 'react'
import { AIAgentTimeline, type TimelineStep } from '../components/AIAgentTimeline'
import { bez } from '../components/NeuralGraph'
import { IconReset } from '../components/Icons'
import { Panel, Section } from '../components/ui'
import { useNeural } from '../lib/store'
import type { StepStatus } from '../lib/agent'

const NET: [number, number, number, number][] = [
  [30, 40, 130, 90],
  [30, 140, 130, 90],
  [130, 90, 230, 40],
  [130, 90, 230, 140],
  [230, 40, 310, 90],
  [230, 140, 310, 90],
]

function Draw() {
  const [k, setK] = useState(0)
  return (
    <Panel
      title="Çizerek belirme"
      action={
        <button type="button" className="icon-btn size-8" onClick={() => setK((v) => v + 1)} aria-label="Çizimi yeniden oynat">
          <IconReset size={15} />
        </button>
      }
    >
      <svg key={k} viewBox="0 0 340 180" className="w-full" aria-hidden="true" fill="none" strokeLinecap="round">
        {NET.map(([a, b, c, d], i) => (
          <path key={i} className="draw-on" pathLength={1} d={bez(a, b, c, d)} stroke="url(#mo-g)" strokeWidth={2} style={{ ['--draw-delay' as string]: `${Math.floor(i / 2) * 260}ms` }} />
        ))}
        <defs>
          <linearGradient id="mo-g" x1="0" x2="1">
            <stop offset="0" stopColor="#60a5fa" />
            <stop offset="1" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
        {[
          [30, 40],
          [30, 140],
          [130, 90],
          [230, 40],
          [230, 140],
          [310, 90],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={9} fill="#0a0a0a" stroke="url(#mo-g)" strokeWidth={1.5} />
        ))}
      </svg>
      <p className="mt-2 text-[14px] text-muted">
        <code className="font-mono text-[12px] text-ink mono-tight">stroke-dashoffset</code> 1’den 0’a, 900ms; katman katman 260ms gecikme.
      </p>
    </Panel>
  )
}

function Flow() {
  return (
    <Panel title="Veri akışı">
      <svg viewBox="0 0 340 180" className="w-full" aria-hidden="true" fill="none" strokeLinecap="round">
        {[40, 90, 140].map((y, i) => (
          <g key={y}>
            <path d={bez(30, y, 310, 90)} stroke="var(--edge)" strokeWidth={1.5} />
            <path className="edge-flow" pathLength={1} d={bez(30, y, 310, 90)} stroke="#e0e7ff" strokeWidth={3} style={{ ['--flow-delay' as string]: `${i * 0.5}s` }} />
            <circle cx={30} cy={y} r={7} fill="#0a0a0a" stroke="#60a5fa" strokeWidth={1.5} />
          </g>
        ))}
        <circle cx={310} cy={90} r={11} fill="#0a0a0a" stroke="#a78bfa" strokeWidth={1.5} className="glow" />
      </svg>
      <p className="mt-2 text-[14px] text-muted">
        <code className="font-mono text-[12px] text-ink mono-tight">stroke-dasharray: 0.07 0.93</code>, 2,4 sn doğrusal, sonsuz. Hareket kapalıyken akış çizgisi gizlenir, bağlantı kalır.
      </p>
    </Panel>
  )
}

function Pulse() {
  return (
    <Panel title="Parlayan ve titreşen düğüm">
      <div className="flex h-[150px] items-center justify-around" aria-hidden="true">
        <span className="flex flex-col items-center gap-3">
          <span className="relative grid size-14 place-items-center rounded-full border-[1.5px] border-active bg-bg glow-active">
            <span className="node-pulse absolute -inset-px rounded-full border border-active" />
            <span className="node-flicker size-3 rounded-full bg-active" />
          </span>
          <span className="font-mono text-[11px] text-active mono-tight">İŞLİYOR</span>
        </span>
        <span className="flex flex-col items-center gap-3">
          <span className="grid size-14 place-items-center rounded-full border-[1.5px] border-done bg-bg glow-done">
            <span className="size-3 rounded-full bg-done" />
          </span>
          <span className="font-mono text-[11px] text-done mono-tight">TAMAM</span>
        </span>
        <span className="flex flex-col items-center gap-3">
          <span className="grid size-14 place-items-center rounded-full border-[1.5px] border-idle bg-bg">
            <span className="size-3 rounded-full bg-idle" />
          </span>
          <span className="font-mono text-[11px] text-muted mono-tight">BOŞTA</span>
        </span>
      </div>
      <p className="mt-2 text-[14px] text-muted">Halka 1,6 sn’de 2,3 katına büyüyüp söner; çekirdek düzensiz aralıklarla titrer. Durum her zaman yazıyla da verilir.</p>
    </Panel>
  )
}

const LOOP: StepStatus[][] = [
  ['calisiyor', 'bekliyor', 'bekliyor', 'bekliyor'],
  ['tamam', 'calisiyor', 'bekliyor', 'bekliyor'],
  ['tamam', 'tamam', 'calisiyor', 'bekliyor'],
  ['tamam', 'tamam', 'tamam', 'calisiyor'],
  ['tamam', 'tamam', 'tamam', 'tamam'],
]

function Progress() {
  const { motion } = useNeural()
  const [{ i, p }, setS] = useState({ i: 0, p: 0 })
  useEffect(() => {
    if (!motion) return
    const t = window.setInterval(() => setS((v) => (v.p >= 1 ? { i: (v.i + 1) % LOOP.length, p: 0 } : { i: v.i, p: v.p + 0.25 })), 380)
    return () => window.clearInterval(t)
  }, [motion])
  const st = motion ? LOOP[i] : LOOP[2]
  const steps: TimelineStep[] = ['Anla', 'Ara', 'Analiz Et', 'Üret'].map((ad, k) => ({ id: ad, ad, status: st[k], progress: st[k] === 'calisiyor' ? (motion ? p : 0.5) : 0 }))
  return (
    <Panel title="Görev ilerlemesi">
      <div aria-hidden="true">
        <AIAgentTimeline compact orientation="yatay" steps={steps} label="Örnek görev ilerlemesi" />
      </div>
      <p className="mt-3 text-[14px] text-muted">Bağlantı adımın ilerlemesiyle dolar (420ms geçiş), çalışan adımın üstünden veri akar. Bu örnek kendini tekrarlar; hareket kapalıyken durur.</p>
    </Panel>
  )
}

export function Motion() {
  return (
    <Section id="hareket" eyebrow="Madde 15 · 16 · Hareket dili" title="Akış, parlama, ilerleme" lead="Hareket bilgi taşır: akan çizgi verinin yönünü, parlayan düğüm işlemi, dolan bağlantı ilerlemeyi gösterir. Hareket kapalıyken (ya da hareketi azalt tercihinde) çizgiler son hâlinde durur, toz ve akış durur; bilgi kaybolmaz.">
      <div className="grid gap-4 md:grid-cols-2">
        <Draw />
        <Flow />
        <Pulse />
        <Progress />
      </div>
      <div className="scroll-x mt-4 rounded-xl border border-line" tabIndex={0} role="region" aria-label="Hareket süreleri tablosu, yatay kaydırılabilir">
        <table className="w-full min-w-[520px] text-left text-[14px]">
          <caption className="sr-only">Hareket süreleri ve eğrileri</caption>
          <thead className="label">
            <tr className="border-b border-line">
              {['Hareket', 'Süre', 'Eğri', 'Nerede'].map((h) => (
                <th key={h} scope="col" className="px-3 py-2 font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Çizerek belirme', '900ms', 'cubic-bezier(0.3, 0.7, 0.3, 1)', 'En güçlü yol, yeni bağlantı'],
              ['Veri akışı', '2,4 sn · sonsuz', 'linear', 'Ağ kenarları, işlemci ağacı'],
              ['Bağlantı dolumu', '420ms', 'cubic-bezier(0.3, 0.7, 0.3, 1)', 'Zaman çizelgesi'],
              ['Düğüm nabzı', '1,6 sn · sonsuz', 'ease-out', 'Çalışan adım'],
              ['İleri geçiş dalgası', '3,2 sn · katman başına 0,36 sn', 'ease-out', 'Kahraman ağı'],
              ['Dijital toz', 'kare başına 0,02–0,12 px', 'sabit hız', 'Arka plan'],
              ['Izgara kayması', '40 sn · sonsuz', 'linear', 'Arka plan'],
            ].map((r) => (
              <tr key={r[0]} className="border-b border-line last:border-0">
                <th scope="row" className="px-3 py-2 font-normal">
                  {r[0]}
                </th>
                <td className="px-3 py-2 font-mono text-[12px] text-muted mono-tight">{r[1]}</td>
                <td className="px-3 py-2 font-mono text-[12px] text-muted mono-tight">{r[2]}</td>
                <td className="px-3 py-2 text-muted">{r[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  )
}
