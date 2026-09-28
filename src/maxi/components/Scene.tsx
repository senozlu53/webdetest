import { Component, lazy, Suspense, useState, type ReactNode } from 'react'
import { useMaxi } from '../lib/store'
import { useInView } from '../hooks/useMedia'
import { Blob, Starburst } from './Shapes'

const Objects3D = lazy(() => import('../three/Objects3D'))

function webgl() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

class Boundary extends Component<{ fallback: ReactNode; children: ReactNode }, { err: boolean }> {
  state = { err: false }
  static getDerivedStateFromError() {
    return { err: true }
  }
  render() {
    return this.state.err ? this.props.fallback : this.props.children
  }
}

/** WebGL yoksa ya da sahne yüklenemezse: aynı kompozisyon düz çıkartmalarla */
export function Fallback3D() {
  return (
    <div className="relative size-full" aria-hidden="true">
      <Blob seed={11} size={260} fill="var(--lilac)" className="absolute top-[6%] left-[8%]" />
      <Starburst size={170} fill="var(--pink)" className="absolute right-[10%] bottom-[12%]" />
      <span className="holo sticker absolute top-[18%] right-[18%] size-40 rounded-full" />
    </div>
  )
}

/** Madde 9: 3D varlıklar; görünür değilken ve hareket kapalıyken kare çizmez */
export function Scene({ colors, onPop, compact, className }: { colors: string[]; onPop?: (i: number) => void; compact?: boolean; className?: string }) {
  const { motion, kaos } = useMaxi()
  const [gl] = useState(webgl)
  const [ref, inView] = useInView<HTMLDivElement>('80px')
  const animate = motion && inView && kaos !== 'sakin'
  return (
    <div ref={ref} className={className} data-scene={gl ? '3d' : 'duz'}>
      {gl ? (
        <Boundary fallback={<Fallback3D />}>
          <Suspense fallback={<Fallback3D />}>
            <Objects3D animate={animate} colors={colors} onPop={onPop} compact={compact} />
          </Suspense>
        </Boundary>
      ) : (
        <Fallback3D />
      )}
    </div>
  )
}
