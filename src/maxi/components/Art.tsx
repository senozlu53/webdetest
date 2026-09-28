import { memo } from 'react'
import type { ArtSpec } from '../lib/art'
import { blobPath, starPath } from '../lib/shapes'

const FONT = { serif: "'Fraunces Variable', Georgia, serif", sans: "'Anybody Variable', system-ui, sans-serif", mono: "'Martian Mono Variable', monospace" }

/** Üretken kolaj eseri (galeri). Halftone ve çizgi desenleri eserin kendi <pattern> tanımlarıyla */
export const Art = memo(function Art({ spec, className }: { spec: ArtSpec; className?: string }) {
  const id = `art${spec.seed}`
  return (
    <svg viewBox={`0 0 ${spec.w} ${spec.h}`} className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id={`${id}-dot`} width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="6" cy="6" r="3.4" fill="#111014" />
        </pattern>
        <pattern id={`${id}-str`} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <rect width="8" height="16" fill="#111014" />
        </pattern>
      </defs>
      <rect width={spec.w} height={spec.h} fill={spec.bg} />
      {spec.els.map((e, i) => {
        const t = `rotate(${e.rot.toFixed(1)} ${e.x.toFixed(1)} ${e.y.toFixed(1)})`
        switch (e.t) {
          case 'halftone':
            return (
              <g key={i}>
                <circle cx={e.x} cy={e.y} r={e.s} fill={e.c} />
                <circle cx={e.x + e.s * 0.18} cy={e.y + e.s * 0.18} r={e.s * 0.92} fill={`url(#${id}-dot)`} opacity={0.55} />
              </g>
            )
          case 'blob':
            return <path key={i} d={blobPath(e.seed, e.x, e.y, e.s, 7, 0.45)} fill={e.c} transform={t} />
          case 'burst':
            return <path key={i} d={starPath(e.x, e.y, e.s, e.s * 0.72, 14)} fill={e.c} stroke="#111014" strokeWidth={3} transform={t} />
          case 'stripes':
            return (
              <g key={i} transform={t}>
                <rect x={e.x - e.s} y={e.y - e.s * 0.4} width={e.s * 2} height={e.s * 0.8} fill={e.c} />
                <rect x={e.x - e.s} y={e.y - e.s * 0.4} width={e.s * 2} height={e.s * 0.8} fill={`url(#${id}-str)`} opacity={0.35} />
              </g>
            )
          case 'tri':
            return <path key={i} d={`M${e.x} ${e.y - e.s}L${e.x + e.s} ${e.y + e.s * 0.8}L${e.x - e.s} ${e.y + e.s * 0.8}Z`} fill={e.c} transform={t} />
          case 'ring':
            return <circle key={i} cx={e.x} cy={e.y} r={e.s * 0.6} fill="none" stroke={e.c} strokeWidth={e.s * 0.18} />
          case 'word':
            return (
              <g key={i} transform={t}>
                <rect x={e.x - e.s * 1.3} y={e.y - e.s * 0.72} width={e.s * 2.6} height={e.s * 1.02} fill={e.c2} />
                <text x={e.x} y={e.y} textAnchor="middle" fontFamily={FONT[e.font ?? 'sans']} fontWeight={900} fontSize={e.s * 0.72} fill={e.c === e.c2 ? '#111014' : e.c} fontStyle={e.font === 'serif' ? 'italic' : 'normal'}>
                  {e.word}
                </text>
              </g>
            )
        }
      })}
    </svg>
  )
})
