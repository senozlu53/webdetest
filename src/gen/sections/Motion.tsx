import { useEffect, useState } from 'react'
import { Card, SectionHead, Segmented } from '../components/ui'
import { AutoHeight, GenProgress, ToolResult } from '../components/core'
import { Markdown } from '../components/Markdown'
import { tokens } from '../lib/markdown'
import { useView, type MotionPref } from '../lib/view'
import { IconTable } from '../components/Icons'

const METIN = 'Hız seçin ve yeniden akıtın. Kelimeler tek tek düşer; gerçek bir modelde bu aralık ağdan gelen token hızıdır. Akış bitince imleç kaybolur.'
const GENIS = `| Stil | Bulanıklık | Doygunluk | Kullanım | Mobil davranış |
| --- | ---: | ---: | --- | --- |
| 004 · Glassmorphism | 24px | %160 | tüm paneller | 14px'e iner |
| 011 · Holographic | 16px | %140 | HoloPanel | tekil katman: 0 |

\`\`\`css
.holo-panel { backdrop-filter: blur(16px) saturate(140%); border: 1px solid var(--line); }
\`\`\``

/** Madde 16 · 17 */
export function Motion() {
  const v = useView()
  const [hiz, setHiz] = useState<'yavas' | 'normal' | 'hizli'>('normal')
  const [tur, setTur] = useState(0)
  const [n, setN] = useState(0)
  const [acik, setAcik] = useState(false)
  const [adim, setAdim] = useState(0)
  const toks = tokens(METIN)
  const ms = hiz === 'yavas' ? 180 : hiz === 'normal' ? 70 : 25

  useEffect(() => {
    if (v.motion === 'kapali') {
      setN(toks.length)
      return
    }
    setN(0)
    const t = window.setInterval(() => setN((k) => (k >= toks.length ? k : k + 1)), ms)
    return () => window.clearInterval(t)
  }, [tur, ms, toks.length, v.motion])
  useEffect(() => {
    if (v.motion === 'kapali') return
    const t = window.setInterval(() => setAdim((a) => (a + 1) % 5), 1100)
    return () => window.clearInterval(t)
  }, [v.motion])

  return (
    <section id="hareket" className="px-4 py-16 md:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHead item="16 · 17" label="Hareket ve mobil" title="Akan metin, esneyen yükseklik" lede="Üç hareket: kelime kelime akış, adım ilerlemesi ve içerik büyürken yumuşak yükseklik geçişi. Mobilde tablolar ve kod blokları kendi yatay kaydırma alanlarına hapsedilir." />
        <div className="grid gap-6 lg:grid-cols-3">
          <Card title="Token akışı" meta={`${ms} ms / kelime`}>
            <Segmented
              legend="Hız"
              name="hiz"
              value={hiz}
              onChange={(x) => {
                setHiz(x)
                setTur((t) => t + 1)
              }}
              options={[
                { id: 'yavas', label: 'Yavaş' },
                { id: 'normal', label: 'Normal' },
                { id: 'hizli', label: 'Hızlı' },
              ]}
            />
            <div className="mt-3 min-h-[7.5rem] rounded-md border border-line bg-bg p-3">
              <Markdown md={toks.slice(0, n).join('')} streaming={n < toks.length} />
            </div>
            <button type="button" onClick={() => setTur((t) => t + 1)} className="mt-3 rounded-md border border-line px-3 py-1.5 font-sans text-[13px] hover:bg-sunken">
              Yeniden akıt
            </button>
          </Card>
          <Card title="Yükseklik esnemesi" meta="auto-height · 240 ms">
            <p className="font-sans text-[14px] text-muted">Yeni bir araç sonucu geldiğinde kutu zıplamaz; yeni yüksekliğine kayarak uzar.</p>
            <button type="button" onClick={() => setAcik((a) => !a)} aria-expanded={acik} className="mt-3 rounded-md bg-accent px-3 py-1.5 font-sans text-[13px] font-medium text-on-accent hover:opacity-90">
              {acik ? 'Sonucu kaldır' : 'Araç sonucu ekle'}
            </button>
            <div className="mt-3 rounded-md border border-dashed border-line-strong p-2">
              <AutoHeight>
                <p className="font-sans text-[13px] text-muted">Kapsayıcı · yükseklik içeriği izler</p>
                {acik ? (
                  <div className="mt-2">
                    <ToolResult title="3 satır" icon={<IconTable size={13} />}>
                      <ul className="font-sans text-[13px] text-muted">
                        <li>004 · Glassmorphism · 24px</li>
                        <li>011 · Holographic · 16px</li>
                        <li>009 · Low Poly · 14px</li>
                      </ul>
                    </ToolResult>
                  </div>
                ) : null}
              </AutoHeight>
            </div>
          </Card>
          <Card title="Üretim ilerlemesi" meta="adım adım">
            <GenProgress steps={['Planla', 'Ara', 'Oku', 'Yanıtla']} current={adim} done={adim === 4} />
            <div className="mt-5">
              <Segmented<MotionPref>
                legend="Hareket"
                name="hareket"
                value={v.motionPref}
                onChange={v.setMotionPref}
                options={[
                  { id: 'oto', label: 'Otomatik' },
                  { id: 'acik', label: 'Açık' },
                  { id: 'kapali', label: 'Kapalı' },
                ]}
              />
              <p className="mt-2 font-sans text-[13px] text-muted">
                Şu an {v.motion === 'acik' ? 'açık' : 'kapalı'}. Kapalıyken yanıt tek seferde gelir, ikonlar döngüye girmez, yükseklik anında değişir; araç sırası ve süreleri korunur.
              </p>
            </div>
          </Card>
        </div>
        <Card title="Mobil: yatay kaydırma alanı" meta="madde 17" className="mt-6">
          <p className="mb-3 font-sans text-[14px] text-muted">Geniş tablo ve kod satırları kırılmaz; kendi alanlarında kayar. Alanlar klavyeyle odaklanır ve adları ekran okuyucuya söylenir.</p>
          <Markdown md={GENIS} />
        </Card>
      </div>
    </section>
  )
}
