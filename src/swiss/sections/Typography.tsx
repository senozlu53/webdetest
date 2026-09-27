import { Section, SectionHeader } from '../components/Section'
import { SwissCol, SwissGrid } from '../components/SwissGrid'
import { TYPE_SCALE } from '../content'

const FACTS = [
  { label: 'Yazı tipi', value: 'Inter Variable, Rasmus Andersson' },
  { label: 'Eksenler', value: 'Ağırlık 100–900 · optik boyut 14–32' },
  { label: 'Ağırlıklar', value: '400 gövde · 700 vurgu · 900 display' },
  { label: 'Tercih sırası', value: 'Helvetica Now, Neue Haas Grotesk, Inter, Roboto' },
] as const

export function Typography() {
  return (
    <Section id="tipografi">
      <SectionHeader
        item="05"
        label="Tipografi"
        title="Tek aile"
        lede="Yalnızca sans-serif. Başlık ile gövde arasındaki fark büyük tutulur: 120px'e karşı 14px, yaklaşık 8,6 kat."
      />

      <SwissGrid className="gap-y-l">
        <SwissCol span={[12, 12, 5]}>
          <p aria-hidden="true" className="m-0 text-[clamp(160px,24vw,352px)] leading-[0.78] font-black tracking-tighter">
            Aa
          </p>
          <dl className="mt-m grid gap-s">
            {FACTS.map((f) => (
              <div key={f.label} className="grid grid-cols-[112px_1fr] gap-s border-t border-ink pt-xs">
                <dt className="swiss-label">{f.label}</dt>
                <dd className="m-0">{f.value}</dd>
              </div>
            ))}
          </dl>
        </SwissCol>

        <SwissCol span={[12, 12, 7]} start={[1, 1, 6]}>
          <ol className="m-0 list-none p-0">
            {TYPE_SCALE.map((t) => (
              <li key={t.token} className="grid grid-cols-[64px_1fr] gap-s border-t border-ink pt-xs pb-m">
                <div className="flex flex-col">
                  <span className="text-lead font-bold tabular-nums">{t.px}</span>
                  <span lang="en" className="swiss-label font-normal">
                    {t.token}
                  </span>
                </div>
                <p className={t.className} style={{ overflowWrap: 'anywhere' }}>
                  {t.sample}
                </p>
              </li>
            ))}
          </ol>
          <p className="swiss-label font-normal">Display ve h2 mobilde clamp() ile küçülür; oran korunur.</p>
        </SwissCol>
      </SwissGrid>

      <div className="mt-l border-t-2 border-ink pt-s lg:mt-xl">
        <p className="swiss-label">Türk alfabesi</p>
        <p className="mt-s text-h2 font-black uppercase tracking-tighter" style={{ overflowWrap: 'anywhere' }}>
          ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ
        </p>
        <p className="mt-s text-h3 tracking-tight" style={{ overflowWrap: 'anywhere' }}>
          abcçdefgğhıijklmnoöprsştuüvyz 0123456789
        </p>
      </div>

      <SwissGrid className="mt-l gap-y-m">
        <SwissCol span={[12, 4, 3]}>
          <h3 className="text-h3 font-bold tracking-tight">Büyük harf ve dil</h3>
          <p className="mt-s max-w-[36ch]">
            <code>text-transform: uppercase</code> dile göre çalışır. <code>lang="tr"</code> olmadan "i" harfi
            noktasız "I" olur.
          </p>
        </SwissCol>
        <SwissCol span={[12, 4, 4]} start={[1, 5, 5]} className="border-t-2 border-ink pt-xs">
          <p className="swiss-label">lang="tr" · doğru</p>
          <p lang="tr" className="mt-xs text-h2 font-black uppercase tracking-tighter">
            istanbul
          </p>
        </SwissCol>
        <SwissCol span={[12, 4, 4]} start={[1, 9, 9]} className="border-t-2 border-accent pt-xs">
          <p className="swiss-label">lang="en" · yanlış</p>
          <p lang="en" className="mt-xs text-h2 font-black uppercase tracking-tighter">
            istanbul
          </p>
        </SwissCol>
      </SwissGrid>
    </Section>
  )
}
