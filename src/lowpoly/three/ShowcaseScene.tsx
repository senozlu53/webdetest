import { Suspense, useEffect, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { CylinderGeometry } from 'three'
import { ShatterModel } from './Shatter'
import { MODELS, type ModelId } from './models'
import { bindPointer } from './pointer'

/** Yedi kenarlı, düz gölgeli kaide */
function Pedestal({ dark }: { dark: boolean }) {
  const geometry = useMemo(() => new CylinderGeometry(1.7, 2, 0.35, 7, 1).toNonIndexed(), [])
  return (
    <mesh geometry={geometry} position={[0, -1.55, 0]} rotation={[0, 0.3, 0]}>
      <meshStandardMaterial color={dark ? '#314e52' : '#7a9e9f'} flatShading roughness={1} metalness={0} />
    </mesh>
  )
}

type Props = {
  model: ModelId
  tint: string
  spin: boolean
  shattered: boolean
  rotation: { x: number; y: number }
  dark: boolean
  playing: boolean
  onToggle: () => void
  background: string
}

export default function ShowcaseScene({ model, tint, spin, shattered, rotation, dark, playing, onToggle, background }: Props) {
  useEffect(() => bindPointer(), [])
  const m = MODELS[model]
  return (
    <Canvas
      flat
      dpr={[1, 1.75]}
      frameloop={playing ? 'always' : 'never'}
      camera={{ position: [0, 0.4, 5.6], fov: 36 }}
      gl={{ antialias: true, powerPreference: 'low-power', preserveDrawingBuffer: true }}
      aria-hidden="true"
    >
      <color attach="background" args={[background]} />
      <hemisphereLight args={[dark ? '#7a9e9f' : '#f2f2f2', '#101820', dark ? 0.55 : 1]} />
      <directionalLight position={[-5, 7, 5]} intensity={3.2} color="#f2eadb" />
      <directionalLight position={[6, 1, 5]} intensity={1} color="#7a9e9f" />
      <directionalLight position={[-3, -5, 3]} intensity={0.5} color="#e8d8b0" />
      <Pedestal dark={dark} />
      <Suspense fallback={null}>
        <ShatterModel key={model} url={m.url} shattered={shattered} spin={spin} tint={tint} scale={m.scale} position={[0, m.y, 0]} dragRotation={rotation} onToggle={onToggle} />
      </Suspense>
    </Canvas>
  )
}
