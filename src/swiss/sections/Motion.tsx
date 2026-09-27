import { useState } from 'react'
import { Section, SectionHeader } from '../components/Section'
import { SwissCol, SwissGrid } from '../components/SwissGrid'
import { SwissButton } from '../components/SwissButton'
import { GeoIcon } from '../components/GeoIcon'

const RULES = [
  { label: 'Hover, odak, durum', value: '0ms · geçiş yok' },
  { label: 'Scroll reveal', value: '240ms · steps(4)' },
  { label: 'Sayfa açılışı', value: '280ms · steps(4) · 90ms arayla' },
  { label: 'Hareket azaltma', value: 'Tümü kapalı' },
] as const

const POSITIONS = 4

export function Motion() {
  const [position, setPosition] = useState(0)

  return (
    <Section id="hareket">
      <SectionHeader
        item="16"
        label={<span lang="en">Motion Language</span>}
        title="Anında kesme"
        lede="Yumuşak easing eğrisi kullanılmaz. Durum değişimi tek karede olur; reveal animasyonları dört sert adımda biter."
      />

      <SwissGrid className="gap-y-l">
        <SwissCol span={[12, 12, 7]}>
          <div className="swiss-ruled grid grid-cols-4" aria-hidden="true">
            {Array.from({ length: POSITIONS }, (_, i) => (
              <div key={i} className="relative aspect-square">
                <span className="swiss-label absolute left-xs top-xs tabular-nums">{i + 1}</span>
                {i === position ? <span className="absolute inset-[22%] bg-accent" /> : null}
              </div>
            ))}
          </div>
          <div className="mt-s flex flex-wrap items-center gap-s">
            <SwissButton
              variant="solid"
              onClick={() => setPosition((p) => (p + 1) % POSITIONS)}
              icon={<GeoIcon name="arrow-right" size={16} />}
            >
              Kes
            </SwissButton>
            <p aria-live="polite" className="tabular-nums">
              Kare {position + 1}. konumda. Ara kare yok.
            </p>
          </div>
        </SwissCol>

        <SwissCol span={[12, 8, 4]} start={[1, 1, 9]}>
          <dl className="grid gap-s">
            {RULES.map((r) => (
              <div key={r.label} className="border-t border-ink pt-xs">
                <dt className="swiss-label">{r.label}</dt>
                <dd className="text-lead font-bold tabular-nums">{r.value}</dd>
              </div>
            ))}
          </dl>
        </SwissCol>
      </SwissGrid>
    </Section>
  )
}
