import { useEffect, useState } from 'react'
import { Card, SectionHead } from '../components/ui'
import { AISources, CitationContext, GenProgress, StreamingIndicator, ToolCall, ToolResult } from '../components/core'
import { Markdown } from '../components/Markdown'
import { tokens } from '../lib/markdown'
import type { Source } from '../lib/scenarios'
import { IconCheck, IconError, IconPending, IconSearch, IconSpark, IconSpinner, IconThinking, IconTool } from '../components/Icons'

const KAYNAK: Source[] = [
  { n: 1, domain: 'github.com/senozlu53/webdetest', title: 'README.md · Stil 013', preview: 'Generative UI: arayüz yanıtla birlikte üretilir; araç çağrıları, atıflar ve kaynak kartları.', href: 'https://github.com/senozlu53/webdetest/blob/claude/optimistic-cerf-u644rd/README.md' },
  { n: 2, domain: 'github.com/senozlu53/webdetest', title: 'src/gen/components/core.tsx', preview: '<AICitation>: satır içi [n], üzerine gelince alan adı, başlık ve önizleme. <AISources>: kaynak kartları.', href: 'https://github.com/senozlu53/webdetest/blob/claude/optimistic-cerf-u644rd/src/gen/components/core.tsx' },
]

const AKIS = 'Yanıt kelime kelime akar; imleç her zaman son kelimenin yanında durur ve üretim bitince kaybolur.'

/** Madde 9 · 11 · 14: bileşen galerisi */
export function Components() {
  const [n, setN] = useState(0)
  const [tur, setTur] = useState(0)
  const toks = tokens(AKIS)
  useEffect(() => {
    if (document.documentElement.dataset.motion === 'off') {
      setN(toks.length)
      return
    }
    setN(0)
    const t = window.setInterval(() => setN((k) => (k >= toks.length ? k : k + 1)), 120)
    return () => window.clearInterval(t)
  }, [tur, toks.length])
  const akiyor = n < toks.length

  return (
    <section id="bilesenler" className="px-4 py-16 md:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHead item="09 · 11 · 14" label="Bileşenler" title="Akış, araç, atıf" lede="Üretken arayüzün dört parçası: yanıtın nerede olduğunu gösteren akış göstergesi, çağrılan aracı anlatan kart, satır içi atıf ve kaynak kartları." />
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="AI Streaming Indicator" meta="kısmi yanıt + üretim imleci">
            <div className="flex flex-col gap-3">
              <StreamingIndicator state="dusunuyor" />
              <div className="rounded-md border border-line bg-bg p-3">
                <Markdown md={toks.slice(0, n).join('')} streaming={akiyor} />
                <div className="mt-2">
                  <StreamingIndicator state={akiyor ? 'yaziyor' : 'bitti'} tokens={n} />
                </div>
              </div>
              <button type="button" onClick={() => setTur((t) => t + 1)} className="self-start rounded-md border border-line px-3 py-1.5 font-sans text-[13px] hover:bg-sunken">
                Yeniden akıt
              </button>
            </div>
          </Card>

          <Card title="AI Generation Progress" meta="adım ilerlemesi">
            <div className="flex flex-col gap-4">
              <GenProgress steps={['Planla', 'Ara', 'Tablola', 'Yanıtla']} current={0} done={false} />
              <GenProgress steps={['Planla', 'Ara', 'Tablola', 'Yanıtla']} current={2} done={false} />
              <GenProgress steps={['Planla', 'Ara', 'Tablola', 'Yanıtla']} current={4} done />
              <p className="font-sans text-[13px] text-muted">Etkin adım vurgulu ve "adım" olarak işaretli (aria-current); bitenlerde onay, bekleyenlerde yalnız çizgi.</p>
            </div>
          </Card>

          <Card title="<ToolCall> durumları" meta="ad · durum · parametre">
            <div className="flex flex-col items-start gap-2.5">
              <ToolCall name="katalog_ara" params={{ sorgu: 'backdrop-filter', limit: 5 }} status="pending" />
              <ToolCall name="katalog_ara" params={{ sorgu: 'backdrop-filter', limit: 5 }} status="running" />
              <ToolCall name="katalog_ara" params={{ sorgu: 'backdrop-filter', limit: 5 }} status="done" summary="4 eşleşme" elapsed={1300} defaultOpen />
              <ToolCall name="odeme_sorgula" params={{ siparis: 'A-1042' }} status="error" />
            </div>
          </Card>

          <Card title="<ToolResult>" meta="tek gölgeli katman">
            <ToolResult title="2 kaynak bulundu" icon={<IconSearch size={13} />}>
              <p className="text-[14px] text-muted">Araç sonucu, yanıt metninden ayrılsın diye düzlemden bir adım öne çıkar. İçinde tablo, grafik, dosya, test çıktısı ya da form olabilir.</p>
            </ToolResult>
          </Card>

          <Card title="<AICitation> ve <AISources>" meta="[1] [2]" className="lg:col-span-2">
            <CitationContext.Provider value={{ turn: 'galeri', sources: KAYNAK }}>
              <Markdown md={'Üretilen her iddia kaynağına bağlanır [1]. Atıfın üzerine gelin ya da Tab ile odaklanın: alan adı, başlık ve önizleme görünür; tıklayınca aşağıdaki karta gidilir [2].'} />
            </CitationContext.Provider>
            <div className="mt-4">
              <AISources sources={KAYNAK} turn="galeri" />
            </div>
          </Card>

          <Card title="Döngüsel ikonlar" meta="madde 9" className="lg:col-span-2">
            <ul className="grid grid-cols-2 gap-3 font-sans text-[14px] sm:grid-cols-4 lg:grid-cols-7">
              {[
                [<IconThinking key="t" size={20} className="text-accent" />, 'Düşünüyor', 'sıralı nokta'],
                [<IconSpinner key="s" size={20} className="text-accent" />, 'Yükleniyor', 'dönen yay'],
                [<IconTool key="g" size={20} className="text-accent" />, 'Araç çalışıyor', 'dişli'],
                [<span key="c" className="gen-cursor" />, 'Yazıyor', 'imleç'],
                [<IconCheck key="k" size={20} className="text-ok" />, 'Tamamlandı', 'çizilen onay'],
                [<IconPending key="p" size={20} className="text-muted" />, 'Sırada', 'kesik halka'],
                [<IconError key="e" size={20} className="text-err" />, 'Hata', 'ünlem'],
              ].map(([icon, ad, not]) => (
                <li key={ad as string} className="flex flex-col items-start gap-2 rounded-md border border-line p-3">
                  <span className="grid h-6 place-items-center" aria-hidden="true">
                    {icon}
                  </span>
                  <span className="font-medium">{ad}</span>
                  <span className="text-[12px] text-muted">{not}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 flex items-center gap-1.5 font-sans text-[13px] text-muted">
              <IconSpark size={12} className="text-accent" /> Hareket kapalıyken döngüler durur, ikon ve metin kalır.
            </p>
          </Card>
        </div>
      </div>
    </section>
  )
}
