import { Card, SectionHead } from '../components/ui'
import { AISources, CitationContext } from '../components/core'
import { Markdown } from '../components/Markdown'
import { parse, type Inline } from '../lib/markdown'
import { SCENARIOS } from '../lib/scenarios'

const DOC = SCENARIOS.find((s) => s.id === 'dokuman')!
const text = (c: Inline[]): string => c.map((x) => (x.t === 'text' || x.t === 'code' ? x.s : x.t === 'cite' ? '' : x.t === 'b' || x.t === 'i' || x.t === 'a' ? text(x.c) : '')).join('')

const KONTRAST = [
  ['Metin #18181B', 'zinc-100 üstünde', '16,12', 'zinc-800 üstünde #F4F4F5', '13,55'],
  ['İkincil #52525B', 'zinc-100 üstünde', '7,03', '#A1A1AA', '5,81'],
  ['AI vurgusu #4F46E5', 'zinc-100 üstünde', '5,72', '#818CF8', '4,99'],
  ['Vurgu metni #4338CA', 'indigo-50 üstünde', '7,07', '#A5B4FC', '7,47'],
  ['Düğme metni beyaz', '#4F46E5 üstünde', '6,29', 'zinc-950 / #818CF8', '6,67'],
]

const REACT = `<ToolCall name="katalog_ara"
  params={{ sorgu: 'backdrop-filter' }}
  status="done" summary="4 eşleşme" />

<ToolResult title="4 kaynak bulundu">
  <ResultView r={sonuc} />
</ToolResult>

<Markdown md={yanit} streaming />   // [1] -> <AICitation n={1} />
<AISources sources={kaynaklar} turn={id} />`

/** Madde 15 · 18 */
export function Access() {
  const blocks = parse(DOC.answer)
  return (
    <section id="erisilebilirlik" className="px-4 py-16 md:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="14 · 15 · 18"
          label="Erişilebilirlik ve kod"
          title="Markdown, semantik HTML olarak"
          lede="Üretilen yanıtın hiyerarşisi ekran okuyucuya olduğu gibi ulaşmalı: başlıklar gerçek başlık, listeler gerçek liste, tablolar başlık hücreli tablo. Görünüm ne kadar değişirse değişsin ağaç sabittir."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Üretilen yanıt" meta="dinamik doküman senaryosu">
            <CitationContext.Provider value={{ turn: 'erisim', sources: DOC.sources }}>
              <Markdown md={DOC.answer} />
            </CitationContext.Provider>
            <div className="mt-4">
              <AISources sources={DOC.sources} turn="erisim" compact />
            </div>
          </Card>
          <Card title="Ekran okuyucunun gördüğü ağaç" meta="aynı AST'den">
            <ol className="flex flex-col gap-1 font-mono text-[12.5px]">
              {blocks.map((b, i) => {
                const [etiket, ayrinti] =
                  b.t === 'h'
                    ? [`h${b.level + 2}`, `başlık, düzey ${b.level + 2}: ${text(b.c)}`]
                    : b.t === 'p'
                      ? ['p', `paragraf, ${text(b.c).split(/\s+/).length} kelime${b.c.some((x) => x.t === 'cite') ? ', atıflı' : ''}`]
                      : b.t === 'ul' || b.t === 'ol'
                        ? [b.t, `liste, ${b.items.length} öğe`]
                        : b.t === 'table'
                          ? ['table', `tablo, ${b.head.length} sütun başlığı (th scope=col), ${b.rows.length} satır`]
                          : b.t === 'code'
                            ? ['figure > pre > code', `${b.lang} kodu, ${b.text.split('\n').length} satır, kaydırılabilir bölge`]
                            : ['blockquote', 'alıntı']
                return (
                  <li key={i} className="flex gap-2 rounded-sm px-2 py-1 odd:bg-sunken" style={{ marginLeft: b.t === 'h' ? (b.level - 2) * 12 : 12 }}>
                    <span className="shrink-0 font-semibold text-accent-ink">{etiket}</span>
                    <span className="text-muted">{ayrinti}</span>
                  </li>
                )
              })}
              <li className="ml-3 flex gap-2 rounded-sm px-2 py-1">
                <span className="shrink-0 font-semibold text-accent-ink">a</span>
                <span className="text-muted">atıf [1] [2]: "Kaynak n: başlık" adıyla kaynak kartına bağlantı</span>
              </li>
            </ol>
            <p className="mt-3 font-sans text-[13px] text-muted">Sayfada h1 ve bölüm h2'si olduğundan yanıttaki "##" h4 olur; tur başlığı (soru) h3'tür. Akan yanıt aria-busy ile işaretlenir, bitince tek bir durum duyurusu yapılır.</p>
          </Card>
          <Card title="Kontrast" meta="WCAG 2.2 · AA">
            <div className="scroll-x" role="region" tabIndex={0} aria-label="Kontrast tablosu">
              <table className="w-full min-w-[560px] border-collapse font-sans text-[13px]">
                <caption className="sr-only">Kontrast oranları, açık ve koyu tema</caption>
                <thead>
                  <tr className="text-left text-muted">
                    <th scope="col" className="border-b border-line py-1.5 pr-3 font-medium">Çift</th>
                    <th scope="col" className="border-b border-line py-1.5 pr-3 font-medium">Açık (en kötü)</th>
                    <th scope="col" className="border-b border-line py-1.5 pr-3 text-right font-medium">Oran</th>
                    <th scope="col" className="border-b border-line py-1.5 pr-3 font-medium">Koyu</th>
                    <th scope="col" className="border-b border-line py-1.5 text-right font-medium">Oran</th>
                  </tr>
                </thead>
                <tbody>
                  {KONTRAST.map(([a, b, c, d, e]) => (
                    <tr key={a} className="border-b border-line last:border-0">
                      <th scope="row" className="py-1.5 pr-3 text-left font-medium whitespace-nowrap">
                        {a}
                      </th>
                      <td className="py-1.5 pr-3 text-muted">{b}</td>
                      <td className="py-1.5 pr-3 text-right tabular-nums">{c}:1</td>
                      <td className="py-1.5 pr-3 text-muted">{d}</td>
                      <td className="py-1.5 text-right tabular-nums">{e}:1</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <Card title="CSS ve React" meta="madde 14 · 15">
            <p className="font-sans text-[14px] text-muted">
              Paragraf ve liste öğeleri <code className="font-mono text-[12.5px]">whitespace-pre-wrap</code>: akan metnin satır sonları korunur, uzun satır kırılır. Kod blokları ve tablolar <code className="font-mono text-[12.5px]">overflow-x-auto</code> alanda.
            </p>
            <pre className="scroll-x mt-3 rounded-md border border-line bg-sunken p-3 font-mono text-[12.5px] leading-relaxed" tabIndex={0} aria-label="React örneği">
              <code>{REACT}</code>
            </pre>
          </Card>
        </div>
      </div>
    </section>
  )
}
