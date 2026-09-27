import type { CSSProperties } from 'react'
import { CyberCard, SectionHead } from '../components/Cyber'
import { HUD_ICONS, HudIcon, type HudIconName } from '../components/HudIcons'

// Tanımdaki palet sabittir (tema değişse de aynı); gündüz karşılığı ayrıca gösterilir
const COLORS = [
  { name: 'Zemin', hex: '#050509', day: '#F7F6FB', role: 'Saf siyah değil: göz yorgunluğunu azaltır', c: '—', dc: '—' },
  { name: 'Camgöbeği', hex: '#00F0FF', day: '#4B0099', role: 'Ana vurgu, bağlantı, odak', c: '14,44', dc: '11,10' },
  { name: 'Macenta', hex: '#FF00A8', day: '#B0006F', role: 'Uyarı, hata, ikincil eylem', c: '5,64', dc: '6,35' },
  { name: 'Mor', hex: '#7A00FF', day: '#5B00C8', role: 'Yalnız parlama ve ızgara (metin değil)', c: '3,17', dc: '8,57' },
  { name: 'Neon yeşil', hex: '#B6FF00', day: '#3F6600', role: 'Çevrimiçi, başarı', c: '16,76', dc: '6,28' },
]

export function Palette() {
  return (
    <section id="renk" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="04 · 05 · 09"
          label="Renk, yazı, ikon"
          title="Dört neon, bir gece"
          lede="Tek bir karanlık zemin üzerine dört neon. Camgöbeği yön gösterir, macenta uyarır, yeşil onaylar; mor yalnızca ışık olarak kalır çünkü metin için fazla koyu."
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {COLORS.map((c) => (
            <li key={c.hex} className="flex flex-col gap-3 border border-line bg-surface p-4">
              <span className="flex h-16 gap-1.5" aria-hidden="true">
                <span
                  className="chamfer chamfer-sm flex-1"
                  style={{ '--frame': c.c === '—' ? '#2a2a3a' : c.hex, '--fill': c.hex, filter: c.c === '—' ? undefined : `drop-shadow(0 0 10px ${c.hex}99)` } as CSSProperties}
                />
                <span className="chamfer chamfer-sm w-7" style={{ '--frame': c.dc === '—' ? '#cfcbe0' : c.day, '--fill': c.day } as CSSProperties} />
              </span>
              <div>
                <p className="font-display text-lg font-bold uppercase">{c.name}</p>
                <p className="font-hud text-[12px] text-muted">{c.hex}</p>
              </div>
              <p className="text-[13px] text-muted">{c.role}</p>
              <p className="mt-auto font-mono text-[12px] leading-relaxed">
                gece {c.c === '—' ? c.hex : `${c.c}:1`}
                <br />
                <span className="text-muted">gündüz {c.day}{c.dc === '—' ? '' : ` · ${c.dc}:1`}</span>
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <CyberCard label="Tipografi" code="05">
            <ul className="flex flex-col gap-6">
              <li>
                <span className="font-mono text-[12px] text-muted">Başlık · Rajdhani 700 · Türkçe tam</span>
                <p className="font-display text-5xl leading-none font-bold uppercase">Şifre çözüldü</p>
              </li>
              <li>
                <span className="font-mono text-[12px] text-muted">HUD rakamları · Orbitron 400–900 · yalnız Latin ve rakam</span>
                <p className="font-hud text-4xl font-bold text-cyan text-glow" lang="en">
                  07:42:19
                </p>
              </li>
              <li>
                <span className="font-mono text-[12px] text-muted">Gövde · Space Grotesk 400</span>
                <p>Ağ ölü, sokak canlı. Veriler şehrin altından akıyor; biz yalnızca dinliyoruz.</p>
              </li>
              <li>
                <span className="font-mono text-[12px] text-muted">Terminal · IBM Plex Mono 400/600</span>
                <p className="font-mono text-[14px] text-yesil">&gt; bağlan --düğüm NX-7741 --şifre aes256</p>
              </li>
            </ul>
            <p className="mt-5 text-[13px] text-muted">Orbitron ğ, ş ve İ içermez; Türkçe kelimelerde kullanılmaz, yalnız saat, kod ve koordinatlarda.</p>
          </CyberCard>
          <CyberCard label="HUD ikonları" code="09" tone="magenta">
            <p className="text-[15px] text-muted">İnce çizgili (1,25px), köşe işaretli, askerî/bilimkurgu vektörleri. Renk çevreden gelir.</p>
            <ul className="mt-5 grid grid-cols-4 gap-3">
              {(Object.keys(HUD_ICONS) as HudIconName[]).map((k, i) => (
                <li key={k} className="flex flex-col items-center gap-2 border border-line p-3">
                  <HudIcon name={k} size={36} className={i % 3 === 0 ? 'text-cyan' : i % 3 === 1 ? 'text-magenta' : 'text-yesil'} />
                  <span className="text-center text-[12px] font-semibold">{HUD_ICONS[k].name}</span>
                </li>
              ))}
            </ul>
          </CyberCard>
        </div>
      </div>
    </section>
  )
}
