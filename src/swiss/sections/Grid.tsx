import { Section, SectionHeader } from '../components/Section'
import { SwissCol, SwissGrid } from '../components/SwissGrid'
import { SwissButton } from '../components/SwissButton'
import { GeoIcon } from '../components/GeoIcon'
import { BREAKPOINTS, COMPOSITIONS } from '../content'
import { cx } from '../../shared/cx'

const TONE = {
  ink: 'bg-ink text-paper',
  mute: 'bg-mute text-ink',
  accent: 'bg-accent text-on-accent',
} as const

type Props = { overlay: boolean; onToggleOverlay: () => void }

export function Grid({ overlay, onToggleOverlay }: Props) {
  return (
    <Section id="grid">
      <SectionHeader
        item="12"
        label={<span lang="en">Figma Architecture</span>}
        title="12 kolon"
        lede="Her öğe kolon çizgilerine oturur. Figma'daki grid aynıdır; Auto Layout aralığı 0 ya da 2px'tir."
      />

      <SwissGrid aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="h-l bg-mute p-[4px] lg:h-xl">
            <span className="text-label font-bold tabular-nums">{i + 1}</span>
          </div>
        ))}
      </SwissGrid>

      <div className="mt-m flex flex-col gap-m">
        {COMPOSITIONS.map((c) => (
          <div key={c.label}>
            <p className="swiss-label mb-xs">{c.label}</p>
            <SwissGrid>
              {c.blocks.map((b) => (
                <SwissCol key={b.start} span={b.span} start={b.start} className={cx('h-l p-xs', TONE[b.tone])}>
                  <span className="swiss-label tabular-nums">span {b.span}</span>
                </SwissCol>
              ))}
            </SwissGrid>
          </div>
        ))}
      </div>

      <SwissGrid className="mt-l gap-y-m lg:mt-xl">
        <SwissCol span={[12, 7, 7]}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-left tabular-nums">
              <thead>
                <tr className="border-b-2 border-ink">
                  {['Kırılım', 'Ekran', 'Kenar', 'Oluk', 'Kolon'].map((h) => (
                    <th key={h} scope="col" className="swiss-label py-xs pr-s">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BREAKPOINTS.map((b) => (
                  <tr key={b.name} className="border-b border-ink">
                    <th scope="row" className="py-s pr-s font-bold">
                      {b.name}
                    </th>
                    <td className="py-s pr-s">{b.width}</td>
                    <td className="py-s pr-s">{b.margin}</td>
                    <td className="py-s pr-s">{b.gutter}</td>
                    <td className="py-s pr-s">12</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SwissCol>
        <SwissCol span={[12, 4, 4]} start={[1, 9, 9]} className="flex flex-col items-start gap-s">
          <p className="max-w-[36ch]">
            Mobilde de 12 kolon kalır. Bloklar üst üste biner ama başlangıç kolonları korunur; asimetri kaybolmaz.
          </p>
          <SwissButton
            variant="outline"
            aria-pressed={overlay}
            onClick={onToggleOverlay}
            icon={<GeoIcon name="grid" size={16} />}
          >
            {overlay ? "Grid'i kaldır" : "Grid'i sayfaya yerleştir"}
          </SwissButton>
          <p className="swiss-label font-normal">Kısayol: G</p>
        </SwissCol>
      </SwissGrid>
    </Section>
  )
}
