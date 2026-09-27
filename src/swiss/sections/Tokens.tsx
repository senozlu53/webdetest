import tokens from '../../../tokens/swiss.tokens.json'
import { Section, SectionHeader } from '../components/Section'
import { SwissCol, SwissGrid } from '../components/SwissGrid'
import { SPACING } from '../content'

const MODES = tokens.color.mode
const PRIMITIVES = tokens.color.primitive
type PrimitiveName = keyof typeof PRIMITIVES

/** "{color.primitive.white}" → "#FFFFFF" */
function resolve(ref: string): string {
  const name = ref.replace(/^\{color\.primitive\.|\}$/g, '') as PrimitiveName
  return PRIMITIVES[name]?.$value ?? ref
}

const VARIABLES = (Object.keys(MODES.light) as Array<keyof typeof MODES.light>).map((key) => ({
  key,
  role: MODES.light[key].$description,
  light: resolve(MODES.light[key].$value),
  invert: resolve(MODES.invert[key].$value),
}))

export function Tokens() {
  return (
    <Section id="tokenlar">
      <SectionHeader
        item="13"
        label={<span lang="en">Figma Tokens</span>}
        title="Beş boşluk"
        lede="Her adım bir öncekinin iki katıdır: 8 × 2ⁿ. Ara değer yoktur. Renk değişkenleri iki modludur: Açık ve Invert."
      />

      <SwissGrid className="gap-y-l">
        <SwissCol span={[12, 12, 6]}>
          <ul className="flex list-none flex-wrap items-end gap-s p-0" aria-label="Boşluk ölçeği">
            {SPACING.map((s) => (
              <li key={s.token} className="flex flex-col gap-xs">
                <span className="block bg-ink" style={{ width: s.px, height: s.px }} aria-hidden="true" />
                <span className="text-lead font-bold tabular-nums">{s.px}</span>
                <span className="swiss-label font-normal">{s.token}</span>
              </li>
            ))}
          </ul>
          <p className="mt-m max-w-[44ch]">
            Tailwind'de <code>p-s</code>, <code>gap-m</code>, <code>mt-xl</code> gibi adlarla kullanılır. Çizgi
            olarak kullanılan 2px (<code>gap-rule</code>) bir boşluk değil, ayraçtır.
          </p>
        </SwissCol>

        <SwissCol span={[12, 12, 5]} start={[1, 1, 8]}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[360px] border-collapse text-left tabular-nums">
              <caption lang="en" className="swiss-label pb-xs text-left">
                Color Variables · tokens/swiss.tokens.json
              </caption>
              <thead>
                <tr className="border-b-2 border-ink">
                  {['Değişken', 'Açık', 'Invert'].map((h) => (
                    <th key={h} scope="col" className="swiss-label py-xs pr-s">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {VARIABLES.map((v) => (
                  <tr key={v.key} className="border-b border-ink">
                    <th scope="row" className="py-s pr-s text-left">
                      <span className="block font-bold">{v.key}</span>
                      <span className="swiss-label font-normal">{v.role}</span>
                    </th>
                    {[v.light, v.invert].map((hex, i) => (
                      <td key={i} className="py-s pr-s">
                        <span className="flex items-center gap-xs">
                          <span
                            aria-hidden="true"
                            className="inline-block size-s shrink-0 border border-ink"
                            style={{ background: hex }}
                          />
                          {hex}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SwissCol>
      </SwissGrid>
    </Section>
  )
}
