import { Section, SectionHeader } from '../components/Section'
import { SwissCol, SwissGrid } from '../components/SwissGrid'
import { Figure } from '../components/Figure'

export function Surface() {
  return (
    <Section id="sekil">
      <SectionHeader
        item="06–08"
        label="Şekil · Z-ekseni · Doku"
        title="Düz ve keskin"
        lede="Köşe yarıçapı 0. Gölge yok, doku yok. Derinlik yalnızca boyut farkı ve üst üste binmeyle kurulur."
      />

      <SwissGrid className="items-start gap-y-l">
        <SwissCol span={[12, 6, 5]}>
          <Figure number={1} caption="Şekil. Tam kare ve tam daire; border-radius ya 0 ya %50.">
            <div className="absolute bottom-0 left-0 size-[58%] bg-ink" />
            <div className="absolute right-0 top-0 size-[42%] rounded-full bg-accent" />
          </Figure>
        </SwissCol>

        <SwissCol span={[10, 6, 4]} start={[3, 7, 6]}>
          <Figure number={2} caption="Z-ekseni. box-shadow: none. Öndeki öğe büyür ya da üste biner.">
            <div className="absolute left-[12%] top-[12%] size-[64%] bg-paper" />
            <span
              aria-hidden="true"
              className="absolute -bottom-[0.14em] right-[4%] text-[clamp(160px,26vw,340px)] leading-none font-black"
            >
              Z
            </span>
            <div className="absolute left-[4%] top-[4%] size-[24%] bg-accent" />
          </Figure>
        </SwissCol>

        <SwissCol span={[8, 6, 3]} start={[1, 1, 10]}>
          <Figure number={3} caption="Doku. Saf, %100 dolgu. Gradyan, grain ve bulanıklık yok." ratio="3 / 4">
            <div className="absolute inset-0 grid grid-rows-4">
              <div className="border border-ink bg-paper" />
              <div className="bg-ink" />
              <div className="bg-accent" />
              <div className="bg-mute" />
            </div>
          </Figure>
        </SwissCol>
      </SwissGrid>
    </Section>
  )
}
