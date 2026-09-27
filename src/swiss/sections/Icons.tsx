import { Section, SectionHeader } from '../components/Section'
import { GeoIcon } from '../components/GeoIcon'
import { ICONS } from '../content'

export function Icons() {
  return (
    <Section id="ikonlar">
      <SectionHeader
        item="09"
        label="İkonografi"
        title="Kalın vektör"
        lede="24px ızgara, 3px çizgi, kare uç, sivri köşe. İkonlar soyut ve geometriktir; küçük boyutta da okunur."
      />
      <ul className="swiss-ruled grid list-none grid-cols-3 p-0 md:grid-cols-4 lg:grid-cols-6">
        {ICONS.map((icon) => (
          <li key={icon.name} className="flex aspect-square flex-col justify-between p-s">
            <GeoIcon name={icon.name} size={48} className="max-w-full" />
            <span className="flex flex-col">
              <span className="font-bold">{icon.label}</span>
              <span className="swiss-label font-normal normal-case tracking-normal">{icon.name}</span>
            </span>
          </li>
        ))}
      </ul>
    </Section>
  )
}
