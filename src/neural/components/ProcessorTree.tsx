import { HOT_C, type Gpu } from '../lib/training'
import { num } from '../lib/format'

export const TREE_W = 800
export const TREE_H = 300

const gx = (i: number) => (i < 4 ? 65 + i * 90 : 465 + (i - 4) * 90)

/** Madde 9 · 10: işlemci ağacı — küme, iki düğüm, sekiz GPU. Halka doluluğu kullanımı, sarı halka sıcaklık uyarısını gösterir. */
export function ProcessorTreeArt({ gpus, busy }: { gpus: Gpu[]; busy: boolean }) {
  return (
    <g fill="none" strokeLinecap="round">
      <defs>
        <linearGradient id="pt-g" x1="0" x2="1">
          <stop offset="0" stopColor="#60a5fa" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      {[200, 600].map((x) => (
        <path key={x} d={`M400 58C400 94 ${x} 84 ${x} 112`} stroke="var(--edge-strong)" strokeWidth={1.5} />
      ))}
      {gpus.map((g) => {
        const px = g.dugum ? 600 : 200
        const d = `M${px} 150C${px} 190 ${gx(g.id)} 180 ${gx(g.id)} 212`
        return (
          <g key={g.id}>
            <path d={d} stroke="var(--edge)" strokeWidth={1.3} />
            {busy ? <path className="edge-flow fx-only" pathLength={1} d={d} stroke="url(#pt-g)" strokeWidth={2} style={{ ['--flow-delay' as string]: `${g.id * 0.21}s`, ['--flow-dur' as string]: '1.8s' }} /> : null}
          </g>
        )
      })}
      {/* Kök */}
      <g>
        <rect x={322} y={14} width={156} height={44} rx={22} fill="#0a0a0a" stroke="url(#pt-g)" strokeWidth={1.5} />
        <text x={400} y={41} textAnchor="middle" className="font-sans" fontSize={15} fill="var(--ink)" stroke="none">
          Küme · nöral-7b
        </text>
      </g>
      {[0, 1].map((d) => (
        <g key={d}>
          <rect x={(d ? 600 : 200) - 60} y={112} width={120} height={38} rx={19} fill="#0a0a0a" stroke="var(--line-strong)" strokeWidth={1.2} />
          <text x={d ? 600 : 200} y={136} textAnchor="middle" className="font-sans" fontSize={14} fill="var(--ink)" stroke="none">
            Düğüm {d}
          </text>
        </g>
      ))}
      {gpus.map((g) => {
        const hot = g.sicaklik >= HOT_C
        const x = gx(g.id)
        return (
          <g key={g.id}>
            <circle cx={x} cy={236} r={24} fill="#0a0a0a" stroke="rgb(255 255 255 / 0.12)" strokeWidth={4} />
            <circle cx={x} cy={236} r={24} stroke={hot ? 'var(--node-active)' : 'url(#pt-g)'} strokeWidth={4} pathLength={1} strokeDasharray={`${g.kullanim} 1`} transform={`rotate(-90 ${x} 236)`} className={hot ? 'glow-active' : undefined} />
            <circle cx={x} cy={236} r={4} fill={hot ? 'var(--node-active)' : '#a78bfa'} stroke="none" className={busy ? 'node-flicker' : undefined} style={{ animationDelay: `${g.id * 0.27}s` }} />
            <text x={x} y={280} textAnchor="middle" className="font-mono mono-tight" fontSize={12} fill="var(--ink)" stroke="none">
              GPU {g.id}
            </text>
            <text x={x} y={296} textAnchor="middle" className="font-mono mono-tight" fontSize={11} fill={hot ? 'var(--node-active)' : 'var(--muted)'} stroke="none">
              %{Math.round(g.kullanim * 100)} · {g.sicaklik}°C
            </text>
          </g>
        )
      })}
    </g>
  )
}

export function GpuTable({ gpus }: { gpus: Gpu[] }) {
  return (
    <div className="scroll-x rounded-xl border border-line" tabIndex={0} role="region" aria-label="GPU tablosu, yatay kaydırılabilir">
      <table className="w-full min-w-[420px] text-left text-[14px]">
        <caption className="sr-only">Sekiz GPU: kullanım, sıcaklık ve bellek</caption>
        <thead className="label">
          <tr className="border-b border-line">
            {['GPU', 'Düğüm', 'Kullanım', 'Sıcaklık', 'Bellek'].map((h) => (
              <th key={h} scope="col" className="px-3 py-2 font-normal">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="font-mono text-[12px] tabular-nums mono-tight">
          {gpus.map((g) => (
            <tr key={g.id} className="border-b border-line last:border-0">
              <th scope="row" className="px-3 py-1.5 font-normal">
                GPU {g.id}
              </th>
              <td className="px-3 py-1.5">{g.dugum}</td>
              <td className="px-3 py-1.5">%{Math.round(g.kullanim * 100)}</td>
              <td className={g.sicaklik >= HOT_C ? 'px-3 py-1.5 text-active' : 'px-3 py-1.5'}>
                {g.sicaklik}°C{g.sicaklik >= HOT_C ? ' · sıcak' : ''}
              </td>
              <td className="px-3 py-1.5">
                {num(g.bellek)} / 80 GB
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
