import type { ReactNode } from 'react'
import { Section } from '../components/ui'
import { bez } from '../components/NeuralGraph'

function Mini({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 160 72" className="h-[72px] w-full" aria-hidden="true" fill="none" strokeLinecap="round">
      {children}
    </svg>
  )
}

const TRAITS: { ad: string; metin: string; art: ReactNode }[] = [
  {
    ad: 'Ağ grafikleri',
    metin: 'Varlıklar düğüm, ilişkiler Bezier bağlantı. Kalınlık ağırlığı, saydamlık güveni taşır.',
    art: (
      <Mini>
        {[
          [20, 18, 70, 36],
          [20, 54, 70, 36],
          [70, 36, 130, 16],
          [70, 36, 130, 56],
          [20, 18, 130, 16],
        ].map(([a, b, c, d], i) => (
          <path key={i} d={bez(a, b, c, d)} stroke={i === 4 ? 'var(--edge)' : 'url(#tg)'} strokeWidth={i === 4 ? 1 : 1.6} />
        ))}
        <defs>
          <linearGradient id="tg" gradientUnits="userSpaceOnUse" x1="0" x2="160" y1="0" y2="0">
            <stop offset="0" stopColor="#60a5fa" />
            <stop offset="1" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
        {[
          [20, 18],
          [20, 54],
          [70, 36],
          [130, 16],
          [130, 56],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={6} fill="#0a0a0a" stroke="url(#tg)" strokeWidth={1.4} />
        ))}
      </Mini>
    ),
  },
  {
    ad: 'Bağlantı noktaları',
    metin: 'Her düğümün bir durumu var: boşta gri, işlemde sarı, tamamlanınca yeşil. Durum metinle de yazılır.',
    art: (
      <Mini>
        <path d="M34 36H126" stroke="var(--line-strong)" strokeDasharray="2 5" />
        <circle cx={34} cy={36} r={11} fill="#0a0a0a" stroke="var(--node-done)" strokeWidth={1.5} className="glow-done" />
        <path d="M29 36.5l3.5 3.5 6-7" stroke="var(--node-done)" strokeWidth={1.8} />
        <circle cx={80} cy={36} r={11} fill="#0a0a0a" stroke="var(--node-active)" strokeWidth={1.5} className="glow-active" />
        <circle cx={80} cy={36} r={4} fill="var(--node-active)" className="node-flicker" />
        <circle cx={126} cy={36} r={11} fill="#0a0a0a" stroke="var(--node-idle)" strokeWidth={1.5} />
      </Mini>
    ),
  },
  {
    ad: 'Veri partikülleri',
    metin: 'Toz ve partiküller üç derinlikte: uzaktaki küçük ve bulanık, odaktaki keskin.',
    art: (
      <Mini>
        {[
          [18, 20, 2, 1.4, 0.4],
          [44, 52, 2.2, 1.4, 0.4],
          [70, 14, 3, 0, 0.9],
          [96, 44, 3.4, 0, 1],
          [120, 24, 6, 2.2, 0.35],
          [142, 58, 8, 3, 0.25],
          [58, 34, 1.6, 1, 0.5],
        ].map(([x, y, r, b, o], i) => (
          <circle key={i} className="dof" cx={x} cy={y} r={r} fill={i % 2 ? '#a78bfa' : '#60a5fa'} opacity={o} style={{ filter: b ? `blur(${b}px)` : undefined }} />
        ))}
      </Mini>
    ),
  },
  {
    ad: 'Analitik katmanlar',
    metin: 'Kenarlar, kümeler, aykırılar ve kopyalar ayrı katmanlar; her biri açılıp kapanır.',
    art: (
      <Mini>
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M30 ${46 - i * 12}L80 ${58 - i * 12}L130 ${46 - i * 12}L80 ${34 - i * 12}Z`} stroke={i === 2 ? '#a78bfa' : 'var(--line-strong)'} fill={i === 2 ? 'rgb(167 139 250 / 0.1)' : 'rgb(255 255 255 / 0.02)'} />
        ))}
        <circle cx={80} cy={22} r={2.4} fill="#facc15" />
        <circle cx={96} cy={23} r={2} fill="#60a5fa" />
        <circle cx={66} cy={24} r={2} fill="#60a5fa" />
      </Mini>
    ),
  },
  {
    ad: 'Şeffaf süreç',
    metin: 'Ajan her adımında ne düşündüğünü, hangi aracı çağırdığını ve ne bulduğunu gösterir.',
    art: (
      <Mini>
        <path d={bez(22, 36, 62, 36)} stroke="url(#tg)" strokeWidth={2} />
        <path d={bez(62, 36, 102, 36)} stroke="url(#tg)" strokeWidth={2} strokeDasharray="30 60" />
        <path d={bez(102, 36, 140, 36)} stroke="var(--line-strong)" strokeDasharray="2 5" />
        {[
          [22, 'var(--node-done)'],
          [62, 'var(--node-done)'],
          [102, 'var(--node-active)'],
          [140, 'var(--node-idle)'],
        ].map(([x, c], i) => (
          <circle key={i} cx={x as number} cy={36} r={8} fill="#0a0a0a" stroke={c as string} strokeWidth={1.5} />
        ))}
      </Mini>
    ),
  },
]

export function Traits() {
  return (
    <Section id="karakter" eyebrow="Madde 3 · Karakteristikler" title="Görünmeyeni görünür kılan beş öğe" lead="Teknik ve mistik: veri akışı gerçek bir ağ gibi çizilir, ama her parlamanın bir anlamı var ve her görselin okunabilir bir karşılığı bulunur.">
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {TRAITS.map((t) => (
          <li key={t.ad} className="panel p-4">
            {t.art}
            <h3 className="mt-3 text-[17px] font-medium">{t.ad}</h3>
            <p className="mt-1 text-[14px] leading-relaxed text-muted">{t.metin}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
