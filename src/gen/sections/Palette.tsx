import { Card, SectionHead } from '../components/ui'
import { Markdown } from '../components/Markdown'

const NOTR = [
  { ad: 'zinc-50', hex: '#FAFAFA', rol: 'zemin' },
  { ad: 'white', hex: '#FFFFFF', rol: 'yüzey' },
  { ad: 'zinc-100', hex: '#F4F4F5', rol: 'kod, mesaj' },
  { ad: 'zinc-200', hex: '#E4E4E7', rol: 'çizgi' },
  { ad: 'zinc-600', hex: '#52525B', rol: 'ikincil metin' },
  { ad: 'zinc-900', hex: '#18181B', rol: 'metin' },
]
const VURGU = [
  { ad: 'indigo-50', hex: '#EEF2FF', rol: 'vurgu zemini' },
  { ad: 'indigo-600', hex: '#4F46E5', rol: 'AI vurgusu' },
  { ad: 'indigo-700', hex: '#4338CA', rol: 'vurgu metni' },
]

const HIBRIT = `## Üç yazı, tek yanıt

Okuma bloğu **Source Serif 4** ile dizilir; uzun metinde göz yorulmaz. Arayüz etiketleri, tablo ve durum satırları **Inter** ile; kod **JetBrains Mono** ile.

| Rol | Aile | Boyut |
| --- | --- | ---: |
| Okuma | Source Serif 4 | 17,5px |
| Arayüz | Inter | 13–15px |
| Kod | JetBrains Mono | 13px |

\`\`\`ts
const aile = { okuma: 'serif', arayuz: 'sans', kod: 'mono' }
\`\`\``

/** Madde 4 · 5 */
export function Palette() {
  return (
    <section id="renk" className="px-4 py-16 md:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHead item="04 · 05" label="Renk ve yazı" title="Nötr gri, tek vurgu, hibrit yazı" lede="Griler içeriğin önüne geçmez; indigo yalnız yapay zekânın dokunduğu yerde görünür: araç durumu, atıf, üretim imleci." />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <Card title="Palet" meta="Color/AI-Accent">
            <p className="font-sans text-[12px] font-medium text-muted">Nötr (zinc)</p>
            <ul className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {NOTR.map((c) => (
                <li key={c.ad} className="font-sans text-[12px]">
                  <span className="block h-12 rounded-md border border-line" style={{ background: c.hex }} aria-hidden="true" />
                  <span className="mt-1 block font-medium">{c.ad}</span>
                  <span className="block text-muted">{c.rol}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 font-sans text-[12px] font-medium text-muted">Vurgu (indigo)</p>
            <ul className="mt-2 grid grid-cols-3 gap-2">
              {VURGU.map((c) => (
                <li key={c.ad} className="font-sans text-[12px]">
                  <span className="block h-12 rounded-md border border-line" style={{ background: c.hex }} aria-hidden="true" />
                  <span className="mt-1 block font-medium">
                    {c.ad} <span className="font-normal text-muted">{c.hex}</span>
                  </span>
                  <span className="block text-muted">{c.rol}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 font-sans text-[13px] text-muted">
              Koyu temada zinc-950 zemin, vurgu indigo-400 (#818CF8). Başarı ve hata renkleri yalnız ikonla ve "tamamlandı", "hata" metniyle birlikte kullanılır.
            </p>
          </Card>
          <Card title="Hibrit tipografi" meta="madde 5">
            <Markdown md={HIBRIT} />
          </Card>
        </div>
      </div>
    </section>
  )
}
