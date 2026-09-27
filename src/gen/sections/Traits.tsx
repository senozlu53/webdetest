import { useState } from 'react'
import { Card, SectionHead } from '../components/ui'
import { ToolCall, ToolResult } from '../components/core'
import { Markdown } from '../components/Markdown'
import { IconCheck, IconSpark, IconTable, IconThinking } from '../components/Icons'

const OZ = [
  { ad: 'Esneklik', t: 'Kapsayıcılar içerik kadar genişler; sabit ızgara yok.' },
  { ad: 'Anlık üretim', t: 'Metin kelime kelime, bileşenler ihtiyaç anında gelir.' },
  { ad: 'Araç çağrısı', t: 'Bileşeni bağlam seçer: tablo, grafik, form, kod.' },
  { ad: 'Markdown', t: 'Yanıt yapılandırılmış metindir; başlık, liste, tablo, kod.' },
  { ad: 'Şematik sadelik', t: 'Nötr gri, tek vurgu, süssüz çizgi.' },
]

/** Madde 3 · 6 · 7 · 8 */
export function Traits() {
  const [metin, setMetin] = useState('Kısa yanıt')
  return (
    <section id="ozellikler" className="px-4 py-16 md:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHead item="03 · 06 · 07 · 08" label="Karakteristik" title="Esneyen, çağrılan, sade" lede="Önceden tasarlanmış ekran yerine yanıtın gerektirdiği kadar arayüz. İçerik büyüdükçe kutu büyür; araç sonucu yoksa kart da yok." />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {OZ.map((o, i) => (
            <li key={o.ad} className="rounded-md border border-line bg-surface p-4">
              <span className="font-mono text-[12px] text-muted">0{i + 1}</span>
              <h3 className="mt-1 font-sans text-[16px] font-semibold">{o.ad}</h3>
              <p className="mt-1 font-sans text-[14px] text-muted">{o.t}</p>
            </li>
          ))}
        </ul>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Card title="Şekil: 8px, içeriği sar" meta="madde 6">
            <p className="font-sans text-[14px] text-muted">Kutu içeriğe göre esner (Hug contents), satırı doldurmaz. Yazın:</p>
            <label className="mt-3 block font-sans text-[12px] font-medium text-muted">
              İçerik
              <input value={metin} onChange={(e) => setMetin(e.target.value)} maxLength={80} className="mt-1 block min-h-9 w-full rounded-md border border-line-strong bg-bg px-2.5 text-[14px] text-ink outline-none focus:border-accent" />
            </label>
            <div className="mt-4 flex flex-col items-start gap-2">
              <p data-layout="hug" className="hug rounded-md border border-line bg-sunken px-3 py-1.5 font-sans text-[14px] break-words">
                {metin || ' '}
              </p>
              <p data-layout="fill" className="w-full rounded-md border border-dashed border-line-strong px-3 py-1.5 font-sans text-[13px] text-muted">
                Karşılaştırma: satırı dolduran (fill) kutu
              </p>
            </div>
          </Card>

          <Card title="Z ekseni: tek katman" meta="madde 7">
            <p className="font-sans text-[14px] text-muted">Üretilen bloklar aynı düzlemde, gölgesiz. Yalnız araç sonucu hafif bir gölgeyle öne çıkar.</p>
            <div className="mt-4 flex flex-col gap-3">
              <ToolCall name="tablo_olustur" params={{ satir: 4 }} status="done" summary="4 satır" elapsed={800} />
              <ToolResult title="Sonuç · 4 satır" icon={<IconTable size={13} />}>
                <p className="text-[14px] text-muted">Gölgeli tek katman: <code className="font-mono text-[12.5px]">shadow-tool</code></p>
              </ToolResult>
              <div className="rounded-md border border-line p-3 font-sans text-[14px] text-muted">Düz metin bloğu: gölge yok</div>
            </div>
          </Card>

          <Card title="Doku: yok" meta="madde 8">
            <p className="font-sans text-[14px] text-muted">Zemin saf ve düz; ayrım yalnız 1px çizgi ve yüzey tonuyla. Dikkat verinin kendisinde kalır.</p>
            <div className="mt-4 rounded-md border border-line bg-bg p-3">
              <Markdown md={'**Durum:** 3 araç çağrıldı, 1 tablo üretildi.\n\n- zemin `#FAFAFA`\n- yüzey `#FFFFFF`\n- çizgi `#E4E4E7`'} />
            </div>
            <ul className="mt-4 flex flex-wrap gap-3 font-sans text-[13px] text-muted" aria-label="Döngüsel durum ikonları">
              <li className="flex items-center gap-1.5">
                <IconThinking size={16} className="text-accent" /> düşünüyor
              </li>
              <li className="flex items-center gap-1.5">
                <IconCheck size={16} className="text-ok" /> tamam
              </li>
              <li className="flex items-center gap-1.5">
                <IconSpark size={14} className="text-accent" /> yapay zekâ
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </section>
  )
}
