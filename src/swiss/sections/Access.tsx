import { Section, SectionHeader } from '../components/Section'
import { SwissCol, SwissGrid } from '../components/SwissGrid'
import { SwissButton } from '../components/SwissButton'
import { GeoIcon } from '../components/GeoIcon'
import type { Theme } from '../useTheme'

const RESPONSIVE = [
  'Grid mobilde de 12 kolondur. Bloklar üst üste biner, başlangıç kolonları korunur.',
  'Kenar boşluğu 64 / 32 / 16px, oluk 32 / 16 / 8px.',
  'Display ve h2 clamp() ile küçülür; 14px gövde metni sabit kalır.',
  'Metin her kırılımda sola dayalıdır. Ortalanmış blok yoktur.',
] as const

const ACCESS = [
  'Siyah / beyaz kontrastı 18.88:1.',
  'Kırmızı küçük metin taşımaz. Kırmızı zemin üstündeki metin siyahtır.',
  'Klavye odağı 2px kırmızı çerçeveyle görünür.',
  'Invert modunda zemin siyah, metin beyaz olur; kırmızı değişmez.',
] as const

type Props = { theme: Theme; onToggleTheme: () => void }

export function Access({ theme, onToggleTheme }: Props) {
  return (
    <Section id="erisilebilirlik" invert>
      <SectionHeader
        item="17–18"
        label={
          <>
            <span lang="en">Responsive</span> · Erişilebilirlik
          </>
        }
        title="Her ekranda sola"
        lede="Bu bant sayfanın tersiyle dizildi. Invert modu açıldığında bant beyaza, sayfa siyaha döner."
      />
      <SwissGrid className="gap-y-l">
        <SwissCol span={[12, 6, 5]}>
          <p className="swiss-label mb-s">
            Madde 17 · <span lang="en">Responsive</span>
          </p>
          <ul className="list-none p-0">
            {RESPONSIVE.map((line) => (
              <li key={line} className="max-w-[48ch] border-t border-ink py-s">
                {line}
              </li>
            ))}
          </ul>
        </SwissCol>
        <SwissCol span={[12, 6, 5]} start={[1, 7, 8]}>
          <p className="swiss-label mb-s">Madde 18 · Erişilebilirlik ve varyant</p>
          <ul className="list-none p-0">
            {ACCESS.map((line) => (
              <li key={line} className="max-w-[48ch] border-t border-ink py-s">
                {line}
              </li>
            ))}
          </ul>
          <SwissButton
            variant="outline"
            className="mt-m"
            aria-pressed={theme === 'dark'}
            onClick={onToggleTheme}
            icon={<GeoIcon name="square" size={16} />}
          >
            {theme === 'dark' ? 'Açık moda dön' : 'Invert modunu aç'}
          </SwissButton>
        </SwissCol>
      </SwissGrid>
    </Section>
  )
}
