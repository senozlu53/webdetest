const BLOBS = [
  { color: 'var(--a1-1)', size: '70vmax', top: '-25%', left: '-20%', anim: 'drift-a', dur: '38s', delay: '0s' },
  { color: 'var(--a1-2)', size: '55vmax', top: '-10%', left: '55%', anim: 'drift-b', dur: '44s', delay: '-12s' },
  { color: 'var(--a1-3)', size: '60vmax', top: '45%', left: '40%', anim: 'drift-c', dur: '52s', delay: '-20s' },
  { color: 'var(--a1-4)', size: '45vmax', top: '60%', left: '-15%', anim: 'drift-b', dur: '48s', delay: '-30s' },
  { color: 'var(--a2-2)', size: '40vmax', top: '15%', left: '25%', anim: 'drift-a', dur: '60s', delay: '-8s' },
] as const

/**
 * Sayfanın ortam ışığı. Lekeler radial-gradient ile çizilir ve yalnızca transform ile
 * hareket eder: tarayıcı katmanı bir kez çizer, sonra GPU'da kaydırır.
 * "Sade" modda ilk üç leke kalır ve hız yarıya iner (bkz. ambient.css).
 */
export function AmbientBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-canvas">
      {BLOBS.map((b, i) => (
        <div
          key={i}
          className="ambient-blob"
          style={{
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
            background: `radial-gradient(closest-side, ${b.color}, transparent)`,
            animationName: b.anim,
            animationDelay: b.delay,
            ['--dur' as string]: b.dur,
          }}
        />
      ))}
      {/* Kenarlarda karartma: içerik ortada daha okunur */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(120% 90% at 50% 40%, transparent 40%, var(--canvas) 100%)', opacity: 0.7 }} />
    </div>
  )
}
