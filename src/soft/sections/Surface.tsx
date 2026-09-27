import { useEffect, useState } from 'react'
import { FadeSection } from '../components/FadeSection'
import { SectionIntro } from '../components/SectionIntro'
import { Switch } from '../components/Switch'
import { RADII, SHADOWS } from '../content'
import { cx } from '../../shared/cx'

const GRAIN_KEY = 'soft-grain'

function useGrain() {
  const [on, setOn] = useState(() => {
    try {
      return localStorage.getItem(GRAIN_KEY) !== 'off'
    } catch {
      return true
    }
  })
  useEffect(() => {
    document.documentElement.dataset.grain = on ? 'on' : 'off'
    try {
      localStorage.setItem(GRAIN_KEY, on ? 'on' : 'off')
    } catch {
      /* yalnızca bu oturum */
    }
  }, [on])
  return [on, setOn] as const
}

export function Surface() {
  const [grain, setGrain] = useGrain()

  return (
    <FadeSection id="yuzey" className="py-24 md:py-32">
      <div className="soft-frame">
        <SectionIntro
          item="06–08"
          label="Şekil · Gölge · Doku"
          title={
            <>
              Yuvarlak, <em className="text-gold-deep">hafif</em>, mat
            </>
          }
          lede="Köşeler 16 ile 24px arasında yumuşar, düğmeler hap olur. Gölgeler geniş açılı ve neredeyse görünmezdir. Yüzey mat kağıt gibidir."
        />

        <h3 className="text-h3">Yarıçap</h3>
        <ul className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {RADII.map((r) => (
            <li key={r.token} className="flex flex-col gap-4">
              <div className="grid aspect-[5/4] place-items-center rounded-card bg-sand">
                <span className={cx('block h-[46%] w-[62%] border border-gold-deep/50 bg-glow', r.className)} />
              </div>
              <div className="flex flex-col px-2 leading-snug">
                <span className="font-medium">{r.token}</span>
                <span className="text-small text-ink-soft">
                  {r.value} · {r.use}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <h3 className="mt-20 text-h3">Z-ekseni ve gölge</h3>
        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {SHADOWS.map((s) => (
            <li key={s.token} className="flex flex-col gap-4">
              <div className="grid aspect-[16/10] place-items-center rounded-card">
                <span className={cx('block h-[58%] w-[68%] rounded-card border border-line/60 bg-float-solid', s.className)} />
              </div>
              <div className="flex flex-col px-2 leading-snug">
                <span className="font-medium">{s.token}</span>
                <span className="text-small tabular-nums text-ink-soft">{s.value}</span>
                <span className="text-small text-ink-soft">{s.use}</span>
              </div>
            </li>
          ))}
        </ul>

        <h3 className="mt-20 text-h3">Doku ve yüzey</h3>
        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <div
            className="relative min-h-[280px] overflow-hidden rounded-card lg:col-span-7"
            style={{
              background:
                'radial-gradient(80% 90% at 15% 20%, var(--glow) 0%, transparent 60%), radial-gradient(70% 80% at 90% 90%, color-mix(in oklab, var(--gold) 22%, var(--sand)) 0%, var(--sand) 70%)',
            }}
          >
            <p className="absolute bottom-6 left-7 max-w-[34ch] text-small">
              Yumuşak degrade: iki geniş radyal ışık, kumdan altına. Keskin geçiş ve parlak nokta yok.
            </p>
          </div>
          <div className="flex flex-col justify-between gap-8 rounded-card bg-sand px-7 py-6 md:px-12 md:py-8 lg:col-span-5">
            <p className="text-ink-soft">
              Sayfanın tamamına belli belirsiz bir kağıt dokusu serilir: 180px'lik gürültü karosu, açık modda çarpma,
              koyu modda yumuşak ışık karışımıyla.
            </p>
            <Switch
              id="doku-anahtari"
              label="Kağıt dokusu"
              description={grain ? 'Açık · belli belirsiz' : 'Kapalı · düz mat yüzey'}
              checked={grain}
              onChange={setGrain}
            />
          </div>
        </div>
      </div>
    </FadeSection>
  )
}
