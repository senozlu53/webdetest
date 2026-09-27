import { FadeSection } from '../components/FadeSection'
import { SectionIntro } from '../components/SectionIntro'
import { SoftCard } from '../components/SoftCard'
import { LineIcon } from '../components/LineIcon'
import { PRINCIPLES } from '../content'
import { cx } from '../../shared/cx'

export function Principles() {
  return (
    <FadeSection id="ilkeler" className="py-24 md:py-32">
      <div className="soft-frame">
        <SectionIntro
          item="03"
          label="Karakteristikler"
          title="Dört his"
          lede="Soft Minimalism bir renk paletinden çok bir ruh hâlidir. Sayfa kullanıcıyı acele ettirmez; göz dinlenir, el yavaşlar."
        />
        <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {PRINCIPLES.map((p, i) => (
            <SoftCard as="li" key={p.name} blur="none" elevation="soft" padding="compact" className={cx(i % 2 === 1 && 'xl:translate-y-12')}>
              <span className="grid size-14 place-items-center rounded-full bg-sand text-gold-deep">
                <LineIcon name={p.icon} size={26} />
              </span>
              <h3 className="mt-8 text-h3">{p.name}</h3>
              <p className="mt-3 text-ink-soft">{p.text}</p>
            </SoftCard>
          ))}
        </ul>
      </div>
    </FadeSection>
  )
}
