import type { CSSProperties } from 'react'
import { SwissCol, SwissGrid } from '../components/SwissGrid'
import { UnderlineLink } from '../components/UnderlineLink'
import { GeoIcon } from '../components/GeoIcon'
import { HERO_META } from '../content'

export function Hero() {
  return (
    <section id="ust" className="pt-m">
      <div className="swiss-frame">
        <SwissGrid as="dl" className="gap-y-s">
          {HERO_META.map((item) => (
            <SwissCol key={item.label} span={[6, 3, 3]} className="border-t border-ink pt-xs">
              <dt className="swiss-label">{item.label}</dt>
              <dd className="m-0 tabular-nums">{item.value}</dd>
            </SwissCol>
          ))}
        </SwissGrid>

        {/* Z-ekseni: devasa tipografi kırmızı dairenin üstüne biner. Gölge yok. */}
        <div className="relative mt-l text-hero lg:mt-xl">
          <div
            aria-hidden="true"
            className="swiss-appear absolute right-0 top-[0.62em] size-[1.08em] rounded-full bg-accent"
            style={{ '--delay': '380ms' } as CSSProperties}
          />
          <h1 lang="en" className="relative m-0 font-black uppercase leading-[0.8] tracking-tighter">
            <span className="swiss-enter block" style={{ '--i': 0 } as CSSProperties}>
              Swiss
            </span>
            <span className="swiss-enter block" style={{ '--i': 1 } as CSSProperties}>
              Style
            </span>
          </h1>
        </div>

        <SwissGrid className="mt-l gap-y-m lg:mt-xl">
          <SwissCol span={[12, 7, 6]}>
            <p className="max-w-[34ch] text-lead font-bold">
              Tasarımı dekorasyondan arındırıp saf iletişime ve matematiksel ızgara sistemlerine indirgeyen,
              asimetrik ve tipografi odaklı kült stil.
            </p>
          </SwissCol>
          <SwissCol span={[10, 5, 4]} start={[3, 8, 8]} className="flex flex-col gap-s">
            <p className="max-w-[46ch]">
              Bu sayfa stilin kendisiyle dizildi. Her ölçü 12 kolonlu gridden, her boşluk 8 · 16 · 32 · 64 · 128
              dizisinden, her renk dört değişkenden gelir. Grid çizgilerini görmek için{' '}
              <kbd className="border border-ink px-[4px] font-bold">G</kbd> tuşuna basın.
            </p>
            <UnderlineLink href="#ilkeler" className="inline-flex w-fit items-center gap-xs font-bold">
              Beş kurala geç
              <GeoIcon name="arrow-down" size={14} />
            </UnderlineLink>
          </SwissCol>
        </SwissGrid>
      </div>
    </section>
  )
}
