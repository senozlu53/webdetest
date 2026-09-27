import { useMemo } from 'react'
import { BufferAttribute, Color, PlaneGeometry } from 'three'
import { RAMP } from '../lib/facets'
import { rng } from '../lib/rng'

const STOPS = RAMP.map(([t, c]) => [t, new Color(`rgb(${c.map(Math.round).join(',')})`)] as const)

function rampColor(t: number) {
  const x = Math.min(1, Math.max(0, t))
  for (let i = 1; i < STOPS.length; i++) {
    if (x <= STOPS[i][0]) {
      const k = (x - STOPS[i - 1][0]) / (STOPS[i][0] - STOPS[i - 1][0])
      return STOPS[i - 1][1].clone().lerp(STOPS[i][1], k)
    }
  }
  return STOPS[STOPS.length - 1][1].clone()
}

/**
 * Düşük poligon arazi: seyrek bir düzlem, sabit tohumla yükseltilir, sonra köşeleri paylaşmayan
 * üçgenlere açılır (toNonIndexed). Böylece her yüzün kendi normali olur ve ışıkla tek tonda boyanır.
 */
export function Terrain({ seed = 11, width = 30, depth = 18, segX = 30, segZ = 16 }: { seed?: number; width?: number; depth?: number; segX?: number; segZ?: number }) {
  const geometry = useMemo(() => {
    const r = rng(seed)
    const g = new PlaneGeometry(width, depth, segX, segZ)
    g.rotateX(-Math.PI / 2)
    const pos = g.attributes.position as BufferAttribute
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const u = x / width + 0.5
      const back = 1 - (z / depth + 0.5) // 1 = en arka
      // Arkada yükselen sıradağlar, önde alçak tepeler
      const ridge = Math.pow(back, 1.35) * (3.6 + 2.2 * Math.sin(u * 9.1 + 0.7) * Math.cos(u * 3.3))
      const hills = 0.45 * Math.sin(u * 13 + back * 5) + (r() - 0.5) * 0.7
      pos.setX(i, x + (r() - 0.5) * (width / segX) * 0.7)
      pos.setZ(i, z + (r() - 0.5) * (depth / segZ) * 0.7)
      pos.setY(i, Math.max(-0.3, ridge + hills * (0.35 + back)))
    }
    const flat = g.toNonIndexed()
    g.dispose()
    flat.computeVertexNormals()
    const p = flat.attributes.position as BufferAttribute
    const colors = new Float32Array(p.count * 3)
    for (let t = 0; t < p.count; t += 3) {
      const h = (p.getY(t) + p.getY(t + 1) + p.getY(t + 2)) / 3
      const c = rampColor(0.2 + h / 6.4)
      for (let k = 0; k < 3; k++) c.toArray(colors, (t + k) * 3)
    }
    flat.setAttribute('color', new BufferAttribute(colors, 3))
    return flat
  }, [seed, width, depth, segX, segZ])

  return (
    <mesh geometry={geometry} position={[0, -1.6, -4]}>
      <meshStandardMaterial vertexColors flatShading roughness={1} metalness={0} />
    </mesh>
  )
}
