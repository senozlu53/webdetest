import { Section, SectionHeader } from '../components/Section'
import { SwissCol, SwissGrid } from '../components/SwissGrid'
import { PRINCIPLES } from '../content'

export function Principles() {
  return (
    <Section id="ilkeler">
      <SectionHeader
        item="03"
        label="Karakteristikler"
        title="Beş kural"
        lede="Swiss Style bir yöntemdir. Bu beş kuraldan biri bozulduğunda kompozisyon dağılır."
      />
      <ol className="m-0 list-none p-0">
        {PRINCIPLES.map((p) => (
          <li key={p.name} className="border-t border-ink py-m">
            <SwissGrid className="gap-y-s">
              <SwissCol span={[12, 12, 5]}>
                <h3 className="text-h3 font-bold tracking-tight">{p.name}</h3>
              </SwissCol>
              <SwissCol span={[11, 6, 4]} start={[2, 1, 6]}>
                <p className="swiss-label mb-xs">Kural</p>
                <p className="max-w-[44ch]">{p.rule}</p>
              </SwissCol>
              <SwissCol span={[11, 6, 3]} start={[2, 7, 10]}>
                <p className="swiss-label mb-xs flex items-center gap-xs">
                  <span aria-hidden="true" className="inline-block size-[8px] bg-accent" />
                  Yasak
                </p>
                <p className="max-w-[40ch]">{p.never}</p>
              </SwissCol>
            </SwissGrid>
          </li>
        ))}
      </ol>
    </Section>
  )
}
