import { Section, SectionHeader } from '../components/Section'
import { SwissCol, SwissGrid } from '../components/SwissGrid'
import { TypographyDisplay } from '../components/TypographyDisplay'
import { UnderlineLink } from '../components/UnderlineLink'
import { Figure } from '../components/Figure'
import { PROJECTS } from '../content'

const FACTS = [
  { label: 'Program', value: 'Halk kütüphanesi' },
  { label: 'Alan', value: '2.400 m²' },
  { label: 'Kat', value: 'Zemin + 2' },
  { label: 'Durum', value: 'Yapım aşamasında' },
] as const

/** Merdiven basamakları: 12 birim aralıklı paralel çizgiler. */
const STAIR = Array.from({ length: 11 }, (_, i) => `M${300 + i * 12} 64V124`).join('')

function FloorPlan() {
  return (
    <svg viewBox="0 0 480 400" className="absolute inset-0 h-full w-full bg-paper text-ink" role="img" aria-label="Zemin kat planı çizimi">
      <g fill="none" stroke="currentColor" strokeLinecap="square">
        <path d="M200 320H40V40h400v280H260" strokeWidth="8" />
        <path d="M280 40v140M280 240v80M280 180h60M388 180h52" strokeWidth="4" />
        <path d={STAIR} strokeWidth="2" />
        <path d="M300 144h120" strokeWidth="2" />
      </g>
      <circle cx="156" cy="180" r="76" fill="var(--accent)" />
      <g fill="currentColor">
        {[
          [72, 72],
          [232, 72],
          [72, 280],
          [232, 280],
        ].map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x - 4} y={y - 4} width="8" height="8" />
        ))}
        <rect x="40" y="352" width="50" height="8" />
        <polygon points="440,344 452,376 428,376" />
      </g>
      <rect x="90" y="352" width="50" height="8" fill="none" stroke="currentColor" strokeWidth="2" />
      <g fill="currentColor" fontSize="12" fontWeight="700" style={{ fontFamily: 'inherit' }}>
        <text x="40" y="382">0</text>
        <text x="86" y="382">5</text>
        <text x="132" y="382">10 m</text>
        <text x="435" y="394">K</text>
        <text x="296" y="222">Okuma</text>
        <text x="296" y="238">odası</text>
        <text x="120" y="184" fill="var(--on-accent)">Avlu</text>
      </g>
    </svg>
  )
}

export function Application() {
  return (
    <Section id="uygulama">
      <SectionHeader
        item="10"
        label="UI Kullanım Alanı"
        title="Mimarlık stüdyosu"
        lede="Stil en çok mimarlık stüdyolarında, galerilerde, editoryal bloglarda, portfolyolarda ve moda ajanslarında işe yarar. Aşağıdaki stüdyo kurgusaldır."
      />

      <div className="border-2 border-ink">
        <header className="flex flex-wrap items-baseline justify-between gap-s border-b-2 border-ink p-s">
          <span className="text-lead font-black uppercase tracking-tighter">Raster</span>
          <nav aria-label="Örnek site menüsü" className="flex gap-m">
            {['Projeler', 'Stüdyo', 'İletişim'].map((l) => (
              <UnderlineLink key={l} href="#uygulama">
                {l}
              </UnderlineLink>
            ))}
          </nav>
          <span className="swiss-label border border-ink px-xs py-[4px]">Örnek</span>
        </header>

        <div className="p-s md:p-m lg:p-l">
          <SwissGrid className="gap-y-m">
            <SwissCol span={[12, 10, 9]}>
              <TypographyDisplay as="h3" size="display">
                Raster Mimarlık
              </TypographyDisplay>
            </SwissCol>
            <SwissCol span={[10, 6, 4]} start={[3, 7, 9]}>
              <p className="text-lead">Kadıköy'de dokuz kişilik bir stüdyo. Kütüphane, galeri ve konut projeleri.</p>
            </SwissCol>
          </SwissGrid>

          <SwissGrid className="mt-l gap-y-m lg:mt-xl">
            <SwissCol span={[12, 7, 7]}>
              <Figure number={4} caption="Moda Kütüphanesi, zemin kat planı, 1:200." ratio="6 / 5">
                <FloorPlan />
              </Figure>
            </SwissCol>
            <SwissCol span={[12, 5, 4]} start={[1, 8, 9]} className="flex flex-col gap-m">
              <div>
                <p className="swiss-label tabular-nums">014</p>
                <h4 className="text-h3 font-bold tracking-tight">Moda Kütüphanesi</h4>
              </div>
              <dl className="grid gap-s">
                {FACTS.map((f) => (
                  <div key={f.label} className="grid grid-cols-[96px_1fr] gap-s border-t border-ink pt-xs">
                    <dt className="swiss-label">{f.label}</dt>
                    <dd className="tabular-nums">{f.value}</dd>
                  </div>
                ))}
              </dl>
              <UnderlineLink href="#uygulama" className="w-fit font-bold">
                Projeyi aç
              </UnderlineLink>
            </SwissCol>
          </SwissGrid>

          <div className="mt-l overflow-x-auto lg:mt-xl">
            <table className="w-full min-w-[560px] border-collapse text-left tabular-nums">
              <caption className="swiss-label pb-xs text-left">Proje dizini</caption>
              <thead>
                <tr className="border-b-2 border-ink">
                  {['No.', 'Proje', 'Konum', 'Yıl', 'Tür'].map((h) => (
                    <th key={h} scope="col" className="swiss-label py-xs pr-s">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PROJECTS.map((p) => (
                  <tr key={p.no} className="border-b border-ink hover:bg-ink hover:text-paper">
                    <td className="py-s pr-s">{p.no}</td>
                    <th scope="row" className="py-s pr-s text-lead font-bold">
                      {p.name}
                    </th>
                    <td className="py-s pr-s">{p.place}</td>
                    <td className="py-s pr-s">{p.year}</td>
                    <td className="py-s pr-s">{p.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Section>
  )
}
