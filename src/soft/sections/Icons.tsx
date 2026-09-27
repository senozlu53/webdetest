import { FadeSection } from '../components/FadeSection'
import { SectionIntro } from '../components/SectionIntro'
import { LineIcon } from '../components/LineIcon'
import { ICONS } from '../content'

export function Icons() {
  return (
    <FadeSection id="ikonlar" className="py-24 md:py-32">
      <div className="soft-frame">
        <SectionIntro
          item="09"
          label="İkonografi"
          title={
            <>
              İnce ve <em className="text-gold-deep">dostane</em>
            </>
          }
          lede="24px ızgara, 1,5px çizgi, yuvarlak uç ve yuvarlak köşe. Dolgu yok; ikonlar metnin yanında bağırmaz."
        />
        <ul className="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {ICONS.map((icon) => (
            <li
              key={icon.name}
              className="flex aspect-square flex-col items-center justify-center gap-3 rounded-card bg-sand text-center transition-[background-color,box-shadow] duration-400 ease-soft hover:bg-float-solid hover:shadow-soft"
            >
              <LineIcon name={icon.name} size={36} className="text-gold-deep" />
              <span className="text-small">{icon.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </FadeSection>
  )
}
