import type { CSSProperties } from 'react'
import { HoloPanel, PanelHead, SectionHead } from '../components/ui'
import { HoloIcon, ICON_SET } from '../components/Icons'

// Tanımdaki palet (tema değişse de sabit) ve Laboratuvar karşılığı
const COLORS = [
  { name: 'Gece mavisi', role: 'Zemin', hex: '#090E17', day: '#EEF4F9', note: 'Saf siyah değil; mavi derinlik verir' },
  { name: 'Camgöbeği', role: 'Ana vurgu · parlama', hex: '#06B6D4', day: '#0891B2', note: 'Metinde #22D3EE: zeminde 10,69:1' },
  { name: 'Elektrik mavisi', role: 'İkincil vurgu', hex: '#3B82F6', day: '#2563EB', note: 'Metinde #60A5FA: zeminde 7,6:1' },
  { name: 'Yarı saydam beyaz', role: 'Metin %92 · ikincil %68', hex: 'rgb(255 255 255 / .92)', day: 'rgb(6 18 33 / .94)', note: 'Zeminde 16,32:1 ve 9,1:1' },
]

export function Palette() {
  return (
    <section id="renk" className="px-4 py-20 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="04 · 05 · 09"
          label="Renk, yazı, ikon"
          title="Gece mavisinde iki ışık"
          lede="Zemin gece mavisi, ışık iki tonda: camgöbeği yön gösterir, elektrik mavisi ikinci katmanı taşır. Metin yarı saydam beyazdır; ikincil metin aynı beyazın daha saydam hâli."
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COLORS.map((c) => (
            <li key={c.name}>
              <HoloPanel className="flex h-full flex-col gap-3 p-4">
                <span className="flex h-20 gap-2" aria-hidden="true">
                  <span
                    className="flex-1 rounded-xl border border-line-soft"
                    style={{ background: c.hex.startsWith('rgb') ? '#090E17' : c.hex, boxShadow: c.hex === '#090E17' ? undefined : `0 0 24px ${c.hex}66` } as CSSProperties}
                  >
                    {c.hex.startsWith('rgb') ? <span className="grid h-full place-items-center text-[28px] font-[300] text-white/90">Aa</span> : null}
                  </span>
                  <span className="grid w-9 place-items-center rounded-xl border border-line-soft" style={{ background: c.day.startsWith('rgb') ? '#EEF4F9' : c.day }}>
                    {c.day.startsWith('rgb') ? <span className="text-[13px] font-[500] text-[#061221]/90">Aa</span> : null}
                  </span>
                </span>
                <div>
                  <p className="text-[18px] font-[500]">{c.name}</p>
                  <p className="font-tech text-[12px] tracking-[0.08em] text-cyan-text uppercase">{c.role}</p>
                </div>
                <p className="font-mono text-[12px] text-muted">
                  {c.hex}
                  <br />
                  laboratuvar {c.day}
                </p>
                <p className="mt-auto text-[13px] text-muted">{c.note}</p>
              </HoloPanel>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] text-muted">
          <span className="font-tech font-semibold tracking-[0.1em] text-ink uppercase">Grafik serileri</span>
          <span className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-series-a" aria-hidden="true" />
            A #0891B2
          </span>
          <span className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-series-b" aria-hidden="true" />
            B #6366F1
          </span>
          <span>Camgöbeği ile elektrik mavisi renk körlüğünde ayrışmaz (ΔE 12,3); B serisi çivit mavisine kaydırıldı: renk körlüğünde ΔE 13, normal görüşte 17, iki temada da zeminde en az 3:1.</span>
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          <HoloPanel tick className="p-5 md:p-6">
            <PanelHead title="Tipografi" meta="4 aile · Türkçe tam" />
            <ul className="mt-5 flex flex-col gap-6">
              <li>
                <span className="font-mono text-[12px] text-muted">Görünür başlık · Audiowide 400 · geniş</span>
                <p className="font-display text-[34px] leading-tight md:text-[42px]">Işık hızında çıkarım</p>
              </li>
              <li>
                <span className="font-mono text-[12px] text-muted">Başlık ve gövde · Exo 2 200–600 · ince, teknik</span>
                <p className="text-[34px] leading-tight font-[200]">Ağırlık uzayı</p>
                <p className="mt-1 text-[16px]">Model 24 GB belleğe sığdı; bağlam penceresi 32 bin token. Sayılar sabit genişlikte: 0123456789.</p>
              </li>
              <li>
                <span className="font-mono text-[12px] text-muted">Etiket ve arayüz · Chakra Petch 500/600</span>
                <p className="font-tech text-[15px] font-semibold tracking-[0.16em] text-cyan-text uppercase">Düğüm senkronize · Gecikme 0,21 ms</p>
              </li>
              <li>
                <span className="font-mono text-[12px] text-muted">Günlük ve kod · IBM Plex Mono 400</span>
                <p className="font-mono text-[14px] text-cyan-text">llm.çalıştır(model: "atlas-14b", bağlam: 32768)</p>
              </li>
            </ul>
          </HoloPanel>
          <HoloPanel className="p-5 md:p-6">
            <PanelHead title="Teknik ikonlar" meta="1,5px · parlayan kontur" />
            <p className="mt-2 text-[15px] text-muted">İçi boş, uçları yuvarlak, veri akışını anlatan çizgiler. Parlama çizginin kendisinden gelir; dolgu yok.</p>
            <ul className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {ICON_SET.map((ic, i) => (
                <li key={ic.name} className="flex flex-col items-center gap-2 rounded-xl border border-line-soft px-2 py-3 text-center">
                  <HoloIcon name={ic.name} size={30} className={i % 3 === 1 ? 'text-blue-text' : 'text-cyan-text'} />
                  <span className="text-[12px] leading-tight">{ic.label}</span>
                </li>
              ))}
            </ul>
          </HoloPanel>
        </div>
      </div>
    </section>
  )
}
