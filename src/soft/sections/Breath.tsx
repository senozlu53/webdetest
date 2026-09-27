import { useEffect, useReducer, useState } from 'react'
import { PillButton } from '../components/PillButton'
import { LineIcon } from '../components/LineIcon'

/** 4-7-8 nefes: 4 sn al, 7 sn tut, 8 sn ver. Önerilen: 4 tur. */
const PHASES = [
  { label: 'Nefes al', secs: 4, scale: 1 },
  { label: 'Tut', secs: 7, scale: 1 },
  { label: 'Nefes ver', secs: 8, scale: 0.6 },
] as const
const ROUNDS = 4
const REST_SCALE = 0.6

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduce(media.matches)
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])
  return reduce
}

type State = { running: boolean; done: boolean; phase: number; left: number; round: number }
type Action = 'start' | 'stop' | 'tick'

const INITIAL: State = { running: false, done: false, phase: 0, left: PHASES[0].secs, round: 1 }

function reducer(s: State, action: Action): State {
  switch (action) {
    case 'start':
      return { ...INITIAL, running: true }
    case 'stop':
      return { ...s, running: false }
    case 'tick': {
      if (!s.running) return s
      if (s.left > 1) return { ...s, left: s.left - 1 }
      const next = (s.phase + 1) % PHASES.length
      if (next === 0) {
        if (s.round >= ROUNDS) return { ...s, running: false, done: true }
        return { ...s, phase: 0, round: s.round + 1, left: PHASES[0].secs }
      }
      return { ...s, phase: next, left: PHASES[next].secs }
    }
  }
}

export function Breath() {
  const reduce = usePrefersReducedMotion()
  const [state, dispatch] = useReducer(reducer, INITIAL)
  const { running, done, phase, left, round } = state

  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => dispatch('tick'), 1000)
    return () => window.clearInterval(id)
  }, [running])

  const current = PHASES[phase]
  const scale = running && !reduce ? current.scale : REST_SCALE
  // Tutma evresinde boyut sabit kalır; al ve ver evreleri kendi süresince ilerler.
  const duration = running && phase !== 1 ? current.secs : 0.5

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative grid size-56 place-items-center" aria-hidden="true">
        <span className="absolute inset-0 rounded-full border border-line" />
        <span
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 30%, var(--glow), color-mix(in oklab, var(--gold) 60%, var(--sand)))',
            transform: `scale(${scale})`,
            transition: `transform ${duration}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`,
          }}
        />
        <span className="relative font-serif text-h2 tabular-nums">{running ? left : done ? '4/4' : '4·7·8'}</span>
      </div>
      <p aria-live="polite" className="min-h-[1.8em] text-center font-medium">
        {running ? `${current.label} · tur ${round}/${ROUNDS}` : done ? 'Dört tur tamamlandı.' : 'Hazır olduğunda başla.'}
      </p>
      {running ? (
        <PillButton variant="soft" onClick={() => dispatch('stop')} icon={<LineIcon name="pause" size={18} />}>
          Durdur
        </PillButton>
      ) : (
        <PillButton variant="primary" onClick={() => dispatch('start')} icon={<LineIcon name="play" size={18} />}>
          {done ? 'Yeniden başla' : 'Başla'}
        </PillButton>
      )}
    </div>
  )
}
