import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { CapsuleGeometry, Color, ExtrudeGeometry, IcosahedronGeometry, MathUtils, MeshPhysicalMaterial, PMREMGenerator, Shape, TorusKnotGeometry, type Group, type Mesh } from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'


/** Sayfa geneli imleç (−1…1); sahne her karede okur, yeniden render tetiklemez */
const pointer = { x: 0, y: 0 }
let bound = false
function bindPointer() {
  if (bound) return
  bound = true
  window.addEventListener(
    'pointermove',
    (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    },
    { passive: true },
  )
}

/** Oda ortamından yansıma haritası: krom ve cila gerçek görünsün */
function Env() {
  const { gl, scene } = useThree()
  useEffect(() => {
    const pm = new PMREMGenerator(gl)
    const rt = pm.fromScene(new RoomEnvironment(), 0.04)
    scene.environment = rt.texture
    return () => {
      scene.environment = null
      rt.dispose()
      pm.dispose()
    }
  }, [gl, scene])
  return null
}

function starShape(n = 12, ro = 1, ri = 0.64) {
  const s = new Shape()
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 ? ri : ro
    const a = (Math.PI * i) / n
    const x = r * Math.cos(a)
    const y = r * Math.sin(a)
    if (i === 0) s.moveTo(x, y)
    else s.lineTo(x, y)
  }
  s.closePath()
  return s
}

interface ObjProps {
  kind: 'knot' | 'star' | 'pill' | 'blob'
  position: [number, number, number]
  color: string
  spin: number
  animate: boolean
  onPop?: () => void
}

/** Tek 3D varlık: döner, süzülür; tıklayınca patlar gibi büyüyüp yerine oturur (yay) */
function Obj({ kind, position, color, spin, animate, onPop }: ObjProps) {
  const mesh = useRef<Mesh>(null)
  const pop = useRef({ s: 1, v: 0 })
  const time = useRef({ value: 0 })
  const geo = useMemo(() => {
    if (kind === 'knot') return new TorusKnotGeometry(0.58, 0.2, 220, 32)
    if (kind === 'pill') return new CapsuleGeometry(0.36, 0.9, 12, 32)
    if (kind === 'blob') return new IcosahedronGeometry(0.62, 24)
    const g = new ExtrudeGeometry(starShape(), { depth: 0.3, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.07, bevelSegments: 4, curveSegments: 1 })
    g.center()
    g.scale(0.72, 0.72, 0.72)
    return g
  }, [kind])
  const mat = useMemo(() => {
    const m =
      kind === 'knot'
        ? new MeshPhysicalMaterial({ color: '#ffffff', metalness: 1, roughness: 0.14, iridescence: 1, iridescenceIOR: 2.1, iridescenceThicknessRange: [120, 900] })
        : new MeshPhysicalMaterial({ color, metalness: 0.05, roughness: kind === 'pill' ? 0.32 : 0.22, clearcoat: 1, clearcoatRoughness: 0.08, sheen: kind === 'pill' ? 1 : 0, sheenColor: new Color('#ffffff') })
    if (kind === 'blob') {
      // Madde 6: organik damla. Köşe noktaları GPU'da zamanla dalgalanır
      m.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = time.current
        shader.vertexShader = 'uniform float uTime;\n' + shader.vertexShader.replace(
          '#include <begin_vertex>',
          `vec3 transformed = vec3(position);
           float n = sin(position.x * 3.1 + uTime * 1.3) * sin(position.y * 2.7 + uTime * 0.9) * sin(position.z * 3.4 + uTime * 1.1);
           transformed += normal * n * 0.2;`,
        )
      }
    }
    return m
  }, [kind, color])
  useEffect(() => {
    if (kind !== 'knot') mat.color.set(color)
  }, [color, kind, mat])
  useEffect(
    () => () => {
      geo.dispose()
      mat.dispose()
    },
    [geo, mat],
  )
  useFrame((state, dt) => {
    const m = mesh.current
    if (!m) return
    const t = state.clock.elapsedTime
    if (animate) {
      time.current.value = t
      m.rotation.x += dt * spin * 0.6
      m.rotation.y += dt * spin
      m.position.y = position[1] + Math.sin(t * 0.9 + position[0]) * 0.12
    }
    // Yay: tıklamadan sonra büyüyüp sönümlenerek 1'e döner
    const p = pop.current
    p.v += (1 - p.s) * 0.18
    p.v *= 0.78
    p.s += p.v
    m.scale.setScalar(p.s)
  })
  const click = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    pop.current.v += 0.28
    onPop?.()
  }
  return <mesh ref={mesh} geometry={geo} material={mat} position={position} onClick={click} />
}

function Rig({ animate, children }: { animate: boolean; children: React.ReactNode }) {
  const g = useRef<Group>(null)
  useFrame((_, dt) => {
    if (!g.current || !animate) return
    const k = 1 - Math.exp(-dt * 3)
    g.current.rotation.y = MathUtils.lerp(g.current.rotation.y, pointer.x * 0.45, k)
    g.current.rotation.x = MathUtils.lerp(g.current.rotation.x, pointer.y * 0.3, k)
  })
  return <group ref={g}>{children}</group>
}

export interface Scene3DProps {
  animate: boolean
  colors: string[]
  onPop?: (i: number) => void
  compact?: boolean
}

/** Madde 9: ikon yerine büyük, hareketli 3D varlıklar. Şeffaf tuval; kolajın üstüne biner */
export default function Objects3D({ animate, colors, onPop, compact }: Scene3DProps) {
  useEffect(() => bindPointer(), [])
  const items: Omit<ObjProps, 'animate' | 'color' | 'onPop'>[] = compact
    ? [
        { kind: 'knot', position: [0, 0.2, 0], spin: 0.5 },
        { kind: 'star', position: [-1.15, -0.8, 0.4], spin: 0.8 },
        { kind: 'blob', position: [1.2, -0.7, 0.2], spin: 0.3 },
      ]
    : [
        { kind: 'knot', position: [0.3, 0.55, 0], spin: 0.45 },
        { kind: 'star', position: [-1.45, -0.75, 0.6], spin: 0.7 },
        { kind: 'pill', position: [1.55, -0.95, 0.4], spin: 0.9 },
        { kind: 'blob', position: [-1.35, 1.2, -0.6], spin: 0.25 },
      ]
  return (
    <Canvas flat dpr={[1, 1.75]} frameloop={animate ? 'always' : 'demand'} camera={{ position: [0, 0, 5.4], fov: 42 }} gl={{ alpha: true, antialias: true, powerPreference: 'low-power', preserveDrawingBuffer: true }} aria-hidden="true">
      <Env />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} />
      <directionalLight position={[-4, -2, 2]} intensity={0.9} color="#ff9ad5" />
      <Rig animate={animate}>
        {items.map((it, i) => (
          <Obj key={it.kind} {...it} animate={animate} color={colors[i % colors.length]} onPop={() => onPop?.(i)} />
        ))}
      </Rig>
    </Canvas>
  )
}
