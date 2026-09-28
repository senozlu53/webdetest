import { useCallback, useMemo, useState } from 'react'
import { between, rng } from '../lib/rand'

export interface Spot {
  x: number
  y: number
  rot: number
  z: number
}

/**
 * Madde 14: öğelerin konumunu rastgele belirleyen düzen kancası. Tohumlu: aynı tohum aynı düzen;
 * karıştır() yeni tohum çeker. x ve y serbest alanın yüzdesidir (0–100): kutu eksi öğe boyu,
 * yani öğe hiçbir değerde kutudan taşmaz (Madde 12: Absolute Position).
 */
export function useScatter(count: number, initialSeed = 17) {
  const [seed, setSeed] = useState(initialSeed)
  const spots = useMemo<Spot[]>(() => {
    const r = rng(seed)
    return Array.from({ length: count }, (_, i) => ({
      x: Math.round(between(r, 0, 100)),
      y: Math.round(between(r, 0, 100)),
      rot: Math.round(between(r, -18, 18)),
      z: [10, 20, 30, 40, 50][i % 5],
    }))
  }, [seed, count])
  const shuffle = useCallback(() => setSeed((s) => (s * 16807 + 11) % 2147483647), [])
  return { spots, seed, shuffle }
}
