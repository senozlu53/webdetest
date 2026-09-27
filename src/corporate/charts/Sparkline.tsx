/**
 * 12 noktalı eğilim çizgisi: çizgi geri planda (de-emphasis), son dönem vurgu renginde.
 * Değerler kartta yazılı olduğu için dekoratiftir.
 */
export function Sparkline({ values, width = 112, height = 32 }: { values: number[]; width?: number; height?: number }) {
  if (values.length < 2) return null
  const min = Math.min(...values)
  const max = Math.max(...values)
  const pad = 4
  const x = (i: number) => pad + (i * (width - pad * 2)) / (values.length - 1)
  const y = (v: number) => height - pad - ((v - min) / (max - min || 1)) * (height - pad * 2)
  const points = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  const last = values.length - 1
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" className="shrink-0 overflow-visible">
      <polyline points={points} fill="none" stroke="var(--chart-deemphasis)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={x(last)} cy={y(values[last])} r="4" fill="var(--chart-1)" stroke="var(--card)" strokeWidth="2" />
    </svg>
  )
}
