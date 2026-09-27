import type { CSSProperties } from 'react'
import { CyberButton, CyberCard, NeonProgress, SectionHead } from '../components/Cyber'

const ROWS: ReadonlyArray<[string, string, string]> = [
  ['Metin', '17,54', '17,84'],
  ['İkincil metin', '8,29', '8,45'],
  ['Ana vurgu (camgöbeği / koyu mor)', '13,29', '11,10'],
  ['Macenta', '5,19', '6,35'],
  ['Neon yeşil', '15,42', '6,28'],
  ['Mor #7A00FF (metin değil)', '2,92', '—'],
  ['Ana düğme metni', '14,44', '11,94'],
]

const TOKENS: ReadonlyArray<[string, string]> = [
  ['Style/Cyberpunk/Colors/Base', '#050509'],
  ['Style/Cyberpunk/Colors/Cyan', '#00F0FF'],
  ['Style/Cyberpunk/Colors/Magenta', '#FF00A8'],
  ['Style/Cyberpunk/Colors/Purple', '#7A00FF'],
  ['Style/Cyberpunk/Colors/Green', '#B6FF00'],
  ['Effects/NeonGlow/sm', 'drop-shadow 0 0 4px · %80'],
  ['Effects/NeonGlow/md', 'drop-shadow 0 0 8px · %80'],
  ['Effects/NeonGlow/lg', '0 0 14px + 0 0 2px (nabız)'],
]

export function Access() {
  return (
    <section id="erisilebilirlik" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="13 · 18"
          label="Erişilebilirlik ve varyantlar"
          title="Parlak ama güvenli"
          lede="Yüksek kontrast stilin doğasında var. Zemin saf siyah değil #050509: parlak neonun etrafındaki ışık taşmasını ve göz yorgunluğunu azaltır. Işık varyantı nadirdir; uygulanırsa beyaz zemine koyu mor neon."
        />
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <CyberCard label="Kontrast">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[14px]">
                <thead className="font-display text-[13px] tracking-[0.14em] text-muted uppercase">
                  <tr>
                    <th className="py-2 pr-3 font-bold">Çift</th>
                    <th className="py-2 pr-3 text-right font-bold">Gece</th>
                    <th className="py-2 text-right font-bold">Gündüz</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map(([p, d, l]) => (
                    <tr key={p} className="border-t border-line">
                      <td className="py-2 pr-3">{p}</td>
                      <td className="py-2 pr-3 text-right font-mono whitespace-nowrap">{d === '—' ? d : `${d}:1`}</td>
                      <td className="py-2 text-right font-mono whitespace-nowrap">{l === '—' ? l : `${l}:1`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-[13px] text-muted">Her satır en kötü yüzeydeki değerdir: gecede en açık kart (#11111D), gündüzde gri zemin (#F7F6FB). Düğme metni kendi dolgusu üzerinde ölçülür.</p>
          </CyberCard>

          <div data-theme="light" className="flex flex-col gap-4 self-start border border-line bg-bg p-5 text-ink">
            <p className="font-display text-[13px] font-bold tracking-[0.2em] text-cyan uppercase">Gündüz varyantı · önizleme</p>
            <CyberCard label="Erişim" code="A-02" tone="cyan">
              <p className="text-[15px]">Beyaz zemin, koyu mor neon. Parlama yumuşar, tarama çizgisi koyulaşır.</p>
              <div className="mt-4">
                <NeonProgress label="Yükleme" value={66} />
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <CyberButton>Bağlan</CyberButton>
                <CyberButton variant="magenta">Uyarı</CyberButton>
              </div>
            </CyberCard>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <CyberCard label="Işığa duyarlılık" tone="magenta">
            <ul className="flex flex-col gap-3 text-[15px]">
              <li>
                <strong className="font-semibold text-ink">Saniyede 3'ten az:</strong>{' '}
                <span className="text-muted">glitch bir hover'da tek seferlik 900ms'dir; titreşim 4 saniyede iki kısa sönmedir, en düşük opaklık %55 (WCAG 2.3.1).</span>
              </li>
              <li>
                <strong className="font-semibold text-ink">Hareketi azalt:</strong> <span className="text-muted">efekt düzeyi kendiliğinden “Kapalı”ya iner; hiçbir animasyon oynamaz.</span>
              </li>
              <li>
                <strong className="font-semibold text-ink">Durdurulabilir:</strong> <span className="text-muted">üst çubuktaki FX seçicisi süzülen taramayı ve glitch'i her an kapatır.</span>
              </li>
              <li>
                <strong className="font-semibold text-ink">Odak:</strong>{' '}
                <span className="text-muted">kesik köşe arka katmandadır; odak halkası kırpılmaz. Terminal komutları ve radar hedefleri klavyeyle yönetilir.</span>
              </li>
            </ul>
          </CyberCard>
          <CyberCard label="Figma tokenları · Madde 13" tone="mor">
            <dl className="flex flex-col divide-y divide-[var(--line)]">
              {TOKENS.map(([k, v]) => (
                <div key={k} className="flex flex-wrap items-baseline justify-between gap-x-4 py-2">
                  <dt className="font-mono text-[13px]">{k}</dt>
                  <dd className="flex items-center gap-2 font-mono text-[13px] text-muted">
                    {v.startsWith('#') ? <span className="size-3 outline outline-1 outline-line" style={{ background: v, boxShadow: `0 0 8px ${v}` } as CSSProperties} aria-hidden="true" /> : null}
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </CyberCard>
        </div>
      </div>
    </section>
  )
}
