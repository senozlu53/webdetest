import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import kristalUrl from '../assets/kristal.glb?url'
import { Terrain } from './Terrain'
import { ShatterModel } from './Shatter'
import { bindPointer, pointer } from './pointer'

/** Madde 16: kamera imleçle hafifçe kayar (paralaks); arazi ve kristal farklı derinlikte olduğu için ayrışır */
function Parallax({ enabled }: { enabled: boolean }) {
  const { camera } = useThree()
  const base = useRef(new Vector3(0, 2.4, 9.5))
  const look = useRef(new Vector3(0, 0.6, 0))
  useFrame((_, dt) => {
    const k = 1 - Math.exp(-dt * 2.5)
    const tx = base.current.x + (enabled ? pointer.x * 0.9 : 0)
    const ty = base.current.y + (enabled ? -pointer.y * 0.45 : 0)
    camera.position.x += (tx - camera.position.x) * k
    camera.position.y += (ty - camera.position.y) * k
    camera.lookAt(look.current)
  })
  return null
}

type Props = { dark: boolean; playing: boolean; reduced: boolean; shattered: boolean; onToggle: () => void; onReady?: () => void }

export default function HeroScene({ dark, playing, reduced, shattered, onToggle, onReady }: Props) {
  useEffect(() => bindPointer(), [])
  const sky = dark ? '#101820' : '#d9dedd'
  return (
    <Canvas
      flat
      dpr={[1, 1.75]}
      frameloop={playing ? 'always' : 'never'}
      camera={{ position: [0, 2.4, 9.5], fov: 38, near: 0.1, far: 60 }}
      gl={{ antialias: true, powerPreference: 'low-power', preserveDrawingBuffer: true }}
      onCreated={() => onReady?.()}
      aria-hidden="true"
    >
      <color attach="background" args={[sky]} />
      <fog attach="fog" args={[sky, 10, 30]} />
      {/* Dramatik ışık: sol üstten güçlü ana ışık, sağ önden turkuaz dolgu; yüzler arası ton farkı büyür */}
      <hemisphereLight args={[dark ? '#7a9e9f' : '#f2f2f2', '#101820', dark ? 0.55 : 1]} />
      <directionalLight position={[-6, 8, 5]} intensity={dark ? 3.4 : 3.2} color="#f2eadb" />
      <directionalLight position={[7, 1.5, 6]} intensity={dark ? 1.1 : 0.8} color="#7a9e9f" />
      <directionalLight position={[-3, -5, 3]} intensity={0.5} color="#e8d8b0" />
      <Parallax enabled={!reduced} />
      <Terrain />
      <Suspense fallback={null}>
        <ShatterModel url={kristalUrl} shattered={shattered} spin={!reduced} follow={!reduced} scale={1.15} position={[2.8, 1.25, 1.5]} onToggle={onToggle} />
      </Suspense>
    </Canvas>
  )
}
