import { useState } from 'react'
import { FadeSection } from '../components/FadeSection'
import { SectionIntro } from '../components/SectionIntro'
import { SoftCard } from '../components/SoftCard'
import { PillButton } from '../components/PillButton'
import { LineIcon } from '../components/LineIcon'
import { MOTION } from '../content'

/** cubic-bezier(0.45, 0.05, 0.55, 0.95) eğrisi, 0–1 aralığı 200 birime ölçeklenmiş. */
const P1 = [0.45, 0.05] as const
const P2 = [0.55, 0.95] as const
const ORIGIN = 24
const SIZE = 200

function bezier(t: number, a: number, b: number) {
  const u = 1 - t
  return 3 * u * u * t * a + 3 * u * t * t * b + t * t * t
}

const toX = (v: number) => ORIGIN + v * SIZE
const toY = (v: number) => ORIGIN + SIZE - v * SIZE

const CURVE = Array.from({ length: 41 }, (_, i) => {
  const t = i / 40
  return `${toX(bezier(t, P1[0], P2[0])).toFixed(1)},${toY(bezier(t, P1[1], P2[1])).toFixed(1)}`
}).join(' ')

function EasingCurve() {
  return (
    <svg viewBox="0 0 248 248" className="h-auto w-full max-w-[320px]" role="img" aria-label="ease-in-out eğrisi: yavaş başlar, ortada hızlanır, yavaş biter">
      <rect x={ORIGIN} y={ORIGIN} width={SIZE} height={SIZE} rx="16" fill="var(--sand)" />
      <g stroke="var(--field)" strokeWidth="1" strokeDasharray="3 5" fill="none">
        <line x1={toX(0)} y1={toY(0)} x2={toX(P1[0])} y2={toY(P1[1])} />
        <line x1={toX(1)} y1={toY(1)} x2={toX(P2[0])} y2={toY(P2[1])} />
      </g>
      <polyline points={CURVE} fill="none" stroke="var(--gold-deep)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <g fill="var(--float-solid)" stroke="var(--gold-deep)" strokeWidth="1.5">
        <circle cx={toX(P1[0])} cy={toY(P1[1])} r="5" />
        <circle cx={toX(P2[0])} cy={toY(P2[1])} r="5" />
      </g>
      <g fill="var(--ink-soft)" fontSize="11" style={{ fontFamily: 'inherit' }}>
        <text x={ORIGIN} y={ORIGIN + SIZE + 18}>zaman</text>
        <text x={ORIGIN + SIZE} y={ORIGIN + SIZE + 18} textAnchor="end">1</text>
        <text x={ORIGIN - 6} y={ORIGIN + 10} textAnchor="end">1</text>
      </g>
    </svg>
  )
}

export function Motion() {
  const [played, setPlayed] = useState(false)

  return (
    <FadeSection id="hareket" className="py-24 md:py-32">
      <div className="soft-frame">
        <SectionIntro
          item="16"
          label={<span lang="en">Motion Language</span>}
          title={
            <>
              Acele <em className="text-gold-deep">etmeyen</em> hareket
            </>
          }
          lede="Geçişler 300 ile 500ms arasında, yavaş başlayıp yavaş biten bir eğriyle oynar. Sayfa 900ms'de açılır; hero ışığı kaydırmayla birlikte yavaşça kayar."
        />

        <div className="grid gap-6 lg:grid-cols-12">
          <SoftCard blur="none" elevation="soft" className="flex flex-col items-start gap-6 lg:col-span-5">
            <EasingCurve />
            <div>
              <p className="font-medium">ease-in-out</p>
              <p className="text-small tabular-nums text-ink-soft">cubic-bezier(0.45, 0.05, 0.55, 0.95)</p>
            </div>
          </SoftCard>

          <SoftCard blur="none" elevation="soft" className="flex flex-col gap-8 lg:col-span-7">
            <ul className="flex flex-col gap-5">
              {MOTION.map((m) => (
                <li key={m.token} className="flex flex-col gap-2">
                  <span className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-medium">
                      <span lang="en">{m.token}</span> · <span className="tabular-nums">{m.ms}ms</span>
                    </span>
                    <span className="text-small text-ink-soft">{m.use}</span>
                  </span>
                  <span className="relative block h-12 rounded-pill bg-sand" aria-hidden="true">
                    <span className="absolute inset-y-1.5 right-1.5 left-1.5">
                      <span
                        className="absolute top-0 size-9 rounded-full bg-gold shadow-rest transition-[left] ease-soft"
                        style={{ left: played ? 'calc(100% - 36px)' : '0px', transitionDuration: `${m.ms}ms` }}
                      />
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-4">
              <PillButton
                variant="primary"
                onClick={() => setPlayed((p) => !p)}
                icon={<LineIcon name={played ? 'arrow-right' : 'play'} size={18} className={played ? 'rotate-180' : undefined} />}
              >
                {played ? 'Geri al' : 'Oynat'}
              </PillButton>
              <p className="text-small text-ink-soft">Hareket azaltma açıksa tüm geçişler 1ms'ye iner.</p>
            </div>
          </SoftCard>
        </div>
      </div>
    </FadeSection>
  )
}
