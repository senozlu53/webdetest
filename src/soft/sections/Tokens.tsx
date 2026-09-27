import tokens from '../../../tokens/soft.tokens.json'
import { FadeSection } from '../components/FadeSection'
import { SectionIntro } from '../components/SectionIntro'
import { SoftCard } from '../components/SoftCard'

const LIGHT = tokens.Color.Light
const DARK = tokens.Color.Dark
const COLOR_ROWS = (Object.keys(LIGHT) as Array<keyof typeof LIGHT>).map((key) => ({
  key,
  light: LIGHT[key].$value,
  dark: DARK[key].$value,
}))

const OTHER_ROWS = [
  { path: 'Shadow/Soft', value: tokens.Shadow.Soft.$description },
  { path: 'Shadow/Float', value: '0 32px 64px −24px · 0 8px 24px −12px' },
  { path: 'Radius/Soft', value: tokens.Radius.Soft.$value },
  { path: 'Radius/Card', value: tokens.Radius.Card.$value },
  { path: 'Radius/Pill', value: tokens.Radius.Pill.$value },
  { path: 'Padding/Card', value: tokens.Padding.Card.$value },
  { path: 'Padding/Page', value: tokens.Padding.Page.$value },
] as const

function Dot({ color }: { color: string }) {
  return <span aria-hidden="true" className="inline-block size-4 shrink-0 rounded-full border border-line" style={{ background: color }} />
}

export function Tokens() {
  return (
    <FadeSection id="tokenlar" className="py-24 md:py-32">
      <div className="soft-frame">
        <SectionIntro
          item="12 · 13"
          label={<span lang="en">Figma Architecture · Tokens</span>}
          title={
            <>
              Geniş <em className="text-gold-deep">iç boşluk</em>
            </>
          }
          lede="Auto Layout kartlarında dikeyde 32px, yatayda 48px iç boşluk. Yarıçap, gölge ve renk birer değişken olarak standartlaştırılır."
        />

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Auto Layout iç boşluk şeması: P 32px 48px */}
          <figure className="flex min-w-0 flex-col gap-4 lg:col-span-5">
            <div
              className="relative rounded-card px-12 py-8"
              style={{ background: 'color-mix(in oklab, var(--gold) 26%, var(--sand))' }}
            >
              <span className="absolute top-0 left-1/2 flex h-8 -translate-x-1/2 items-center text-caption tabular-nums">32</span>
              <span className="absolute bottom-0 left-1/2 flex h-8 -translate-x-1/2 items-center text-caption tabular-nums">32</span>
              <span className="absolute top-1/2 left-0 flex w-12 -translate-y-1/2 justify-center text-caption tabular-nums">48</span>
              <span className="absolute top-1/2 right-0 flex w-12 -translate-y-1/2 justify-center text-caption tabular-nums">48</span>
              <div className="flex flex-col gap-4 rounded-soft bg-float-solid p-5">
                <span className="h-3 w-2/3 rounded-pill bg-sand" />
                <span className="h-3 w-full rounded-pill bg-sand" />
                <span className="h-3 w-5/6 rounded-pill bg-sand" />
                <span className="mt-2 h-10 w-32 rounded-pill bg-ink" />
              </div>
            </div>
            <figcaption className="pl-2 text-small text-ink-soft">
              Auto Layout · dikey · aralık 16 · <span className="tabular-nums">P: 32px 48px</span>
            </figcaption>
          </figure>

          <SoftCard blur="none" elevation="soft" className="min-w-0 lg:col-span-7">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[440px] border-collapse text-left text-small">
                <caption className="pb-4 text-left text-small text-ink-soft">
                  <code>tokens/soft.tokens.json</code> · Light ve Dark modları
                </caption>
                <thead>
                  <tr className="border-b border-line">
                    <th scope="col" className="py-3 pr-4 font-medium">
                      Değişken
                    </th>
                    <th scope="col" className="py-3 pr-4 font-medium">
                      Light
                    </th>
                    <th scope="col" className="py-3 font-medium">
                      Dark
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COLOR_ROWS.map((r) => (
                    <tr key={r.key} className="border-b border-line">
                      <th scope="row" className="py-3 pr-4 font-normal">
                        <span lang="en">Color/{r.key}</span>
                      </th>
                      <td className="py-3 pr-4">
                        <span className="flex items-center gap-2 tabular-nums">
                          <Dot color={r.light} />
                          {r.light}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="flex items-center gap-2 tabular-nums">
                          <Dot color={r.dark} />
                          {r.dark}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {OTHER_ROWS.map((r) => (
                    <tr key={r.path} className="border-b border-line last:border-b-0">
                      <th scope="row" className="py-3 pr-4 font-normal">
                        <span lang="en">{r.path}</span>
                      </th>
                      <td colSpan={2} className="py-3 tabular-nums">
                        {r.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SoftCard>
        </div>
      </div>
    </FadeSection>
  )
}
