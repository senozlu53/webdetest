import { useState, type FormEvent } from 'react'
import { Section, SectionHeader } from '../components/Section'
import { SwissCol, SwissGrid } from '../components/SwissGrid'
import { SwissButton } from '../components/SwissButton'
import { UnderlineLink } from '../components/UnderlineLink'
import { GeoIcon } from '../components/GeoIcon'
import { ThickDivider } from '../components/ThickDivider'
import { PROGRAM } from '../content'

const REACT_SNIPPET = `<SwissGrid>
  <SwissCol span={[12, 8, 7]}>
    <TypographyDisplay as="h1" size="display">
      Raster
    </TypographyDisplay>
  </SwissCol>
  <SwissCol span={[10, 4, 4]} start={[3, 9, 9]}>
    <p className="text-body">…</p>
  </SwissCol>
</SwissGrid>
<ThickDivider thickness="2px" />`

const TAILWIND_SNIPPET = `font-sans font-black uppercase
tracking-tighter rounded-none
border-b-2 border-ink`

/** Kart genişlikleri bilerek eşit değil: 5 · 3 · 4 kolon. */
const CARD_SPANS = [
  [12, 12, 5],
  [12, 6, 3],
  [12, 6, 4],
] as const

export function Components() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState<string | null>(null)

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSent(email)
  }

  return (
    <Section id="bilesenler">
      <SectionHeader
        item="11 · 14 · 15"
        label={<span lang="en">UI Component Patterns</span>}
        title="Çizgiyle ayrılmış"
        lede="Kartlar kutu değil, 2px çizgiyle ayrılmış grid hücreleridir. Hover durumu geçişsiz, anında tersine döner."
      />

      <p className="swiss-label mb-xs">Örnek içerik · Galeri programı</p>
      <SwissGrid as="ul" className="swiss-ruled list-none p-0">
        {PROGRAM.map((item, i) => (
          <SwissCol as="li" key={item.title} span={CARD_SPANS[i]}>
            <a
              href="#bilesenler"
              className="group flex h-full min-h-[288px] flex-col justify-between gap-l p-m text-ink no-underline hover:bg-ink hover:text-paper"
            >
              <span className="flex items-baseline justify-between gap-s">
                <span className="swiss-label">{item.kind}</span>
                <span className="swiss-label tabular-nums">0{i + 1}</span>
              </span>
              <span className="flex flex-col gap-s">
                <span className="text-h3 font-bold tracking-tight">{item.title}</span>
                <span className="flex flex-col">
                  <span>{item.place}</span>
                  <span className="tabular-nums">{item.date}</span>
                </span>
                <span className="inline-flex items-center gap-xs font-bold underline decoration-1 underline-offset-4 group-hover:decoration-accent group-hover:decoration-[3px]">
                  Ayrıntılar
                  <GeoIcon name="arrow-right" size={14} />
                </span>
              </span>
            </a>
          </SwissCol>
        ))}
      </SwissGrid>

      <SwissGrid className="mt-l gap-y-l lg:mt-xl">
        <SwissCol span={[12, 6, 4]} className="flex flex-col gap-s">
          <p className="swiss-label">Düğmeler</p>
          <SwissButton variant="solid" icon={<GeoIcon name="arrow-right" size={16} />}>
            Bilet al
          </SwissButton>
          <SwissButton variant="outline" icon={<GeoIcon name="download" size={16} />}>
            Programı indir
          </SwissButton>
          <SwissButton variant="accent" icon={<GeoIcon name="plus" size={16} />}>
            Üye ol
          </SwissButton>
        </SwissCol>

        <SwissCol span={[12, 5, 3]} start={[1, 8, 6]} className="flex flex-col gap-m">
          <div>
            <p className="swiss-label mb-s">Bağlantılar</p>
            <ul className="flex list-none flex-col gap-xs p-0 text-lead">
              {['Arşiv', 'Basın', 'Ziyaret'].map((label) => (
                <li key={label}>
                  <UnderlineLink href="#bilesenler">{label}</UnderlineLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="swiss-label mb-s">Etiketler</p>
            <ul className="flex list-none flex-wrap gap-xs p-0">
              {['Grafik', 'Tipografi', '1957'].map((tag) => (
                <li key={tag} className="swiss-label border border-ink px-xs py-[4px] tabular-nums">
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </SwissCol>

        <SwissCol span={[12, 12, 4]} start={[1, 1, 9]}>
          <form onSubmit={onSubmit} className="flex flex-col gap-s" noValidate>
            <label htmlFor="bulten-eposta" className="swiss-label">
              E-bülten
            </label>
            <input
              id="bulten-eposta"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="ad@alan.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-none border-0 border-b-2 border-ink bg-transparent py-xs text-lead font-bold text-ink outline-none placeholder:font-normal placeholder:text-ink focus:border-accent"
            />
            <SwissButton type="submit" variant="solid" icon={<GeoIcon name="arrow-right" size={16} />}>
              Kaydol
            </SwissButton>
            <p className="min-h-[1lh]" aria-live="polite">
              {sent !== null
                ? `Örnek form: ${sent || 'boş adres'} hiçbir yere gönderilmedi.`
                : 'Örnek form. Gönderim yapılmaz.'}
            </p>
          </form>
        </SwissCol>
      </SwissGrid>

      <ThickDivider thickness="1px" className="mt-l lg:mt-xl" />
      <SwissGrid className="mt-s gap-y-m">
        <SwissCol span={[12, 7, 7]}>
          <p className="swiss-label mb-xs">React · Madde 14</p>
          <pre className="swiss-code bg-mute p-m">
            <code>{REACT_SNIPPET}</code>
          </pre>
        </SwissCol>
        <SwissCol span={[12, 5, 4]} start={[1, 8, 9]}>
          <p className="swiss-label mb-xs">
            <span lang="en">Tailwind</span> · Madde 15
          </p>
          <pre className="swiss-code bg-mute p-m">
            <code>{TAILWIND_SNIPPET}</code>
          </pre>
          <p className="mt-s max-w-[36ch]">
            Tema yalnızca dört renk, altı yazı boyutu ve beş boşluk tanımlar. Gölge, yarıçap ve easing tokenları
            silinmiştir.
          </p>
        </SwissCol>
      </SwissGrid>
    </Section>
  )
}
