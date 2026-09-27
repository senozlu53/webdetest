import { SwissCol, SwissGrid } from '../components/SwissGrid'
import { ThickDivider } from '../components/ThickDivider'
import { UnderlineLink } from '../components/UnderlineLink'
import { GeoIcon } from '../components/GeoIcon'
import { TIMELINE } from '../content'

export function Colophon() {
  return (
    <footer id="kunye" className="pt-l pb-m lg:pt-xl">
      <div className="swiss-frame">
        <ThickDivider />
        <SwissGrid className="gap-y-m pt-s">
          <SwissCol span={[12, 3, 3]}>
            <p className="swiss-label">Künye</p>
            <p className="swiss-label font-normal">Tarihçe ve kaynaklar</p>
          </SwissCol>
          <SwissCol as="ol" span={[12, 9, 9]} className="list-none p-0">
            {TIMELINE.map((t) => (
              <li key={t.text} className="grid grid-cols-[72px_1fr] gap-s border-t border-ink py-s md:grid-cols-[128px_1fr]">
                <span className="text-lead font-bold tabular-nums">{t.year}</span>
                <span className="max-w-[60ch]">{t.text}</span>
              </li>
            ))}
          </SwissCol>
        </SwissGrid>

        <SwissGrid className="mt-l gap-y-s border-t-2 border-ink pt-s">
          <SwissCol span={[12, 8, 9]}>
            <p className="max-w-[72ch]">
              Stil 001 · Swiss Style. Dizgi: Inter Variable. Grid: 12 kolon. Renk: 4 değişken. Gölge: 0. Köşe
              yarıçapı: 0. Tokenlar: tokens/swiss.tokens.json.
            </p>
          </SwissCol>
          <SwissCol span={[12, 4, 3]} className="flex flex-col gap-xs">
            <UnderlineLink href="../../" className="w-fit">
              Tüm stiller
            </UnderlineLink>
            <UnderlineLink href="../002/" className="w-fit">
              Stil 002 · <span lang="en">Soft Minimalism</span>
            </UnderlineLink>
            <UnderlineLink href="#ust" className="inline-flex w-fit items-center gap-xs font-bold">
              Başa dön
              <GeoIcon name="arrow-down" size={14} className="rotate-180" />
            </UnderlineLink>
          </SwissCol>
        </SwissGrid>
      </div>
    </footer>
  )
}
