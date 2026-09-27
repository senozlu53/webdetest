import { Section, SectionHeader } from '../components/Section'
import { SwissCol, SwissGrid } from '../components/SwissGrid'
import { CONTRAST, SWATCHES } from '../content'
import { cx } from '../../shared/cx'

export function Palette() {
  return (
    <Section id="renk">
      <SectionHeader
        item="04"
        label="Renk Paleti"
        title="Dört renk"
        lede="Paletin tamamı bu kadar. Kare boyutları önerilen yüzey payını gösterir: kırmızı yalnızca vurgudur."
      />

      {/* Kare boyutları kolon sayısıyla orantılı: 5 · 4 · 2 · 1 */}
      <SwissGrid className="items-end">
        {SWATCHES.map((s) => (
          <SwissCol key={s.token} span={s.span} className="flex flex-col gap-xs">
            <div className={cx('aspect-square w-full max-w-full', s.className)} />
            <p className="swiss-label hidden md:block">{s.short}</p>
          </SwissCol>
        ))}
      </SwissGrid>

      <div className="mt-l overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-ink">
              {['Renk', 'Rol', 'Açık', 'Invert', 'Değişken', 'Tailwind'].map((h) => (
                <th key={h} scope="col" lang={h === 'Tailwind' ? 'en' : undefined} className="swiss-label py-xs pr-s font-bold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SWATCHES.map((s) => (
              <tr key={s.token} className="border-b border-ink">
                <th scope="row" className="py-s pr-s font-bold">
                  {s.name}
                </th>
                <td className="py-s pr-s">{s.role}</td>
                <td className="py-s pr-s tabular-nums">{s.light}</td>
                <td className="py-s pr-s tabular-nums">{s.invert}</td>
                <td className="py-s pr-s">--color-{s.token}</td>
                <td className="py-s pr-s">bg-{s.token}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SwissGrid className="mt-l gap-y-m lg:mt-xl">
        <SwissCol span={[12, 4, 3]}>
          <h3 className="text-h3 font-bold tracking-tight">Kontrast</h3>
          <p className="mt-s max-w-[36ch]">
            WCAG 2.2 oranları. Kırmızı beyaz zeminde küçük metin taşıyamaz; bu yüzden kırmızı zemin üstündeki
            metin her iki modda da Kömür Siyahı'dır.
          </p>
        </SwissCol>
        <SwissCol span={[12, 8, 8]} start={[1, 5, 5]}>
          <ul className="m-0 list-none p-0">
            {CONTRAST.map((c) => (
              <li
                key={c.fg + c.bg}
                className="grid grid-cols-[48px_1fr] items-start gap-x-s gap-y-xs border-t border-ink py-s md:grid-cols-[64px_144px_112px_1fr]"
              >
                <span
                  className="row-span-3 flex aspect-square w-full items-center justify-center border border-ink text-lead font-black md:row-span-1"
                  style={{ color: c.fg, background: c.bg }}
                  aria-hidden="true"
                >
                  Aa
                </span>
                <span className="tabular-nums">
                  {c.fg} / {c.bg}
                </span>
                <span className="flex flex-col">
                  <span className="text-lead font-bold tabular-nums">{c.ratio}:1</span>
                  <span className="swiss-label">{c.verdict}</span>
                </span>
                <span>{c.use}</span>
              </li>
            ))}
          </ul>
        </SwissCol>
      </SwissGrid>
    </Section>
  )
}
