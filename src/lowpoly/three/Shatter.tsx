import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { BufferAttribute, BufferGeometry, Color, Mesh, MeshStandardMaterial, Quaternion, Vector3 } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { rng } from '../lib/rng'
import { pointer } from './pointer'

/** GLB dosyasından ilk ağın geometrisi ve malzemesi (düz gölgeli, köşe renkli) */
export function useGlbMesh(url: string) {
  const gltf = useLoader(GLTFLoader, url)
  return useMemo(() => {
    let found: Mesh | null = null
    gltf.scene.traverse((o) => {
      if (!found && (o as Mesh).isMesh) found = o as Mesh
    })
    const mesh = found as unknown as Mesh
    const geometry = (mesh.geometry as BufferGeometry).clone()
    const material = (mesh.material as MeshStandardMaterial).clone()
    material.flatShading = true
    material.roughness = 1
    material.metalness = 0
    return { geometry, material }
  }, [gltf])
}

type Props = {
  url: string
  /** 0 = bütün, 1 = parçalanmış */
  shattered: boolean
  spin?: boolean
  follow?: boolean
  tint?: string
  scale?: number
  position?: [number, number, number]
  onToggle?: () => void
  dragRotation?: { x: number; y: number }
}

/**
 * Madde 16: tıklamada parçalanan ve yeniden birleşen model. Her üçgen kendi merkezi etrafında
 * döner ve normali boyunca dışarı savrulur; normaller de aynı dönüşle döndüğü için düz ışık korunur.
 */
export function ShatterModel({ url, shattered, spin = true, follow = false, tint = '#ffffff', scale = 1, position = [0, 0, 0], onToggle, dragRotation }: Props) {
  const { geometry, material } = useGlbMesh(url)
  const mesh = useRef<Mesh>(null)
  const amount = useRef(0)
  const applied = useRef(-1)
  const spinAngle = useRef(0.6)

  const data = useMemo(() => {
    const pos = geometry.attributes.position as BufferAttribute
    const nrm = geometry.attributes.normal as BufferAttribute
    const base = Float32Array.from(pos.array as Float32Array)
    const baseN = Float32Array.from(nrm.array as Float32Array)
    const r = rng(pos.count)
    const tris = []
    for (let t = 0; t < pos.count / 3; t++) {
      const c = new Vector3()
      for (let k = 0; k < 3; k++) c.add(new Vector3(base[(t * 3 + k) * 3], base[(t * 3 + k) * 3 + 1], base[(t * 3 + k) * 3 + 2]))
      c.divideScalar(3)
      const n = new Vector3(baseN[t * 9], baseN[t * 9 + 1], baseN[t * 9 + 2])
      const dir = n.clone().multiplyScalar(1.1).add(new Vector3(r() - 0.5, r() - 0.5, r() - 0.5).multiplyScalar(0.9)).normalize()
      const axis = new Vector3(r() - 0.5, r() - 0.5, r() - 0.5).normalize()
      tris.push({ c, dir, axis, spin: (r() - 0.5) * 5, dist: 0.6 + r() * 0.8 })
    }
    return { pos, nrm, base, baseN, tris }
  }, [geometry])

  useEffect(() => {
    material.color = new Color(tint)
  }, [material, tint])

  const q = useMemo(() => new Quaternion(), [])
  const v = useMemo(() => new Vector3(), [])

  useFrame((_, dt) => {
    const target = shattered ? 1 : 0
    amount.current += (target - amount.current) * (1 - Math.exp(-dt * 5))
    if (Math.abs(target - amount.current) < 0.0005) amount.current = target
    const m = mesh.current
    if (m) {
      // Kendi ekseni etrafında yavaş dönüş + sürükleme ile eklenen açı
      if (spin) spinAngle.current += dt * 0.35
      const k = 1 - Math.exp(-dt * 10)
      m.rotation.y += (spinAngle.current + (dragRotation?.y ?? 0) - m.rotation.y) * k
      if (dragRotation) m.rotation.x += (dragRotation.x - m.rotation.x) * k
      if (follow) {
        // İmlece doğru dön (Madde 11): eğim imlecin konumuna yaklaşır
        m.rotation.x += (pointer.y * 0.45 - m.rotation.x) * (1 - Math.exp(-dt * 3))
        m.rotation.z += (-pointer.x * 0.3 - m.rotation.z) * (1 - Math.exp(-dt * 3))
      }
    }
    const f = amount.current
    if (Math.abs(f - applied.current) < 1e-4) return
    applied.current = f
    const { pos, nrm, base, baseN, tris } = data
    const P = pos.array as Float32Array
    const N = nrm.array as Float32Array
    tris.forEach((t, i) => {
      q.setFromAxisAngle(t.axis, t.spin * f)
      for (let k = 0; k < 3; k++) {
        const o = (i * 3 + k) * 3
        v.set(base[o] - t.c.x, base[o + 1] - t.c.y, base[o + 2] - t.c.z).applyQuaternion(q)
        P[o] = v.x + t.c.x + t.dir.x * t.dist * f
        P[o + 1] = v.y + t.c.y + t.dir.y * t.dist * f
        P[o + 2] = v.z + t.c.z + t.dir.z * t.dist * f
        v.set(baseN[o], baseN[o + 1], baseN[o + 2]).applyQuaternion(q)
        N[o] = v.x
        N[o + 1] = v.y
        N[o + 2] = v.z
      }
    })
    pos.needsUpdate = true
    nrm.needsUpdate = true
  })

  return (
    <mesh
      ref={mesh}
      geometry={geometry}
      material={material}
      scale={scale}
      position={position}
      frustumCulled={false}
      onClick={(e) => {
        e.stopPropagation()
        onToggle?.()
      }}
      onPointerOver={() => (document.body.style.cursor = onToggle ? 'pointer' : '')}
      onPointerOut={() => (document.body.style.cursor = '')}
    />
  )
}
