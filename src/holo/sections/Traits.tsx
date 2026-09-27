import { useState, type CSSProperties, type ReactNode } from 'react'
import { HoloPanel, PanelHead, SectionHead } from '../components/ui'
import { Gauge } from '../components/Gauge'
import { cx } from '../../shared/cx'

const TRAITS: ReadonlyArray<{ en: string; tr: string; text: string; demo: ReactNode }> = [
  {
    en: 'Glass + Gradient',
    tr: 'Yarı saydam yüzey',
    text: 'Cam, arkasını bulanık gösterir; üstündeki hafif camgöbeği–mavi gradyan ona ışık verir.',
    demo: (
      <div className="relative h-full w-full">
        <span className="absolute top-2 left-4 size-14 rounded-full bg-cyan blur-[2px]" />
        <span className="absolute right-6 bottom-1 size-12 rounded-full bg-blue blur-[2px]" />
        <span className="holo-panel absolute inset-x-6 inset-y-3 !rounded-xl" />
      </div>
    ),
  },
  {
    en: 'Light refraction',
    tr: 'Işık kırılması',
    text: 'Üç iç gölge: üst kenarda beyaz ışık, alt kenarda camgöbeği kostik, içte yumuşak parıltı.',
    demo: (
      <span className="block h-full w-full rounded-xl border border-line shadow-[inset_0_1px_0_var(--refr-hi),inset_0_-2px_0_var(--refr-lo),inset_0_0_26px_var(--refr-in)]" />
    ),
  },
  {
    en: 'Data visualization',
    tr: 'Veri görselleştirme',
    text: 'Her yüzey bir ölçü taşır: ince çizgili seriler, sayılar ve durumlar düzenli bir ızgarada.',
    demo: (
      <svg viewBox="0 0 160 60" className="h-full w-full" aria-hidden="true">
        <path d="M0 48 L20 40 L40 44 L60 26 L80 30 L100 16 L120 22 L140 10 L160 14" fill="none" stroke="var(--cyan-text)" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 0 4px var(--glow-strong))' }} />
        <path d="M0 54 L20 50 L40 52 L60 42 L80 46 L100 38 L120 40 L140 32 L160 36" fill="none" stroke="var(--blue-text)" strokeWidth="1.5" opacity=".8" />
      </svg>
    ),
  },
  {
    en: 'Structural order',
    tr: 'Yapısal düzen',
    text: 'Veri yoğun ama dağınık değil: 4 ve 8 piksellik adımlar, hizalı sütunlar, sabit sayı genişliği.',
    demo: (
      <div className="grid h-full w-full grid-cols-6 gap-1.5 p-1">
        {Array.from({ length: 18 }, (_, i) => (
          <span key={i} className={cx('rounded-sm border', i % 7 === 2 ? 'border-cyan-text bg-[var(--tint)]' : 'border-line-soft')} />
        ))}
      </div>
    ),
  },
  {
    en: 'Hologram illusion',
    tr: 'Hologram yanılsaması',
    text: 'Üzerine gelince yüzeyden bir ışık bandı geçer; tarama çizgileri ve yanardöner kenar derinlik hissi verir.',
    demo: <span className="sheen block h-full w-full rounded-xl border border-line bg-[repeating-linear-gradient(0deg,var(--tint)_0_1px,transparent_1px_4px)]" data-active="" />,
  },
]

/** Madde 12: Figma katman yapısı; her katman açılıp kapanabilir */
const LAYERS = [
  { id: 'blur', label: 'Arka plan bulanıklığı', css: 'backdrop-filter: blur(16px) saturate(140%)' },
  { id: 'scrim', label: 'Koruyucu gradyan (opak)', css: 'linear-gradient(180deg, panel/80%, panel/62%)' },
  { id: 'tint', label: 'Cam tonu gradyanı', css: 'linear-gradient(135deg, cyan/8%, blue/5%, transparent)' },
  { id: 'stroke', label: 'Kontur 1px (Border/ThinGlow)', css: 'border: 1px solid cyan-400/30' },
  { id: 'hi', label: 'İç gölge 1: üst kenar ışığı', css: 'inset 0 1px 0 white/16%' },
  { id: 'lo', label: 'İç gölge 2: alt kostik', css: 'inset 0 -1px 0 cyan/24%' },
  { id: 'in', label: 'İç gölge 3: iç parıltı', css: 'inset 0 0 28px cyan/7%' },
  { id: 'glow', label: 'Dış parlama (ambient glow)', css: '0 0 15px cyan/20%, 0 30px 70px -36px cyan/42%' },
] as const
type LayerId = (typeof LAYERS)[number]['id']

function anatomyStyle(on: Record<LayerId, boolean>): CSSProperties {
  const bg: string[] = []
  if (on.tint) bg.push('linear-gradient(135deg, var(--tint), var(--tint-2) 50%, transparent 80%)')
  if (on.scrim) bg.push('linear-gradient(180deg, rgb(var(--surface-rgb) / var(--panel-b)), rgb(var(--surface-rgb) / var(--panel-a)))')
  const sh: string[] = []
  if (on.hi) sh.push('inset 0 1px 0 var(--refr-hi)')
  if (on.lo) sh.push('inset 0 -1px 0 var(--refr-lo)')
  if (on.in) sh.push('inset 0 0 28px var(--refr-in)')
  if (on.glow) sh.push('0 0 15px var(--glow)', '0 30px 70px -36px var(--glow-strong)')
  return {
    background: bg.length ? bg.join(', ') : 'transparent',
    backdropFilter: on.blur ? 'blur(16px) saturate(140%)' : 'none',
    WebkitBackdropFilter: on.blur ? 'blur(16px) saturate(140%)' : 'none',
    border: `1px solid ${on.stroke ? 'var(--line)' : 'transparent'}`,
    boxShadow: sh.length ? sh.join(', ') : 'none',
  }
}

export function Traits() {
  const [on, setOn] = useState<Record<LayerId, boolean>>(() => Object.fromEntries(LAYERS.map((l) => [l.id, true])) as Record<LayerId, boolean>)
  const [radius, setRadius] = useState(16)
  return (
    <section id="ozellikler" className="px-4 py-20 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="03 · 06 · 07 · 08 · 12"
          label="Karakteristik"
          title="Işık, cam ve düzen"
          lede="Yarı saydam yüzeyler, ışık kırılmaları, veri görselleri ve sıkı bir yapısal düzen bir araya gelince hologram yanılsaması oluşur. Her panel kendi derinliğinde süzülür; metin daima opak bir zeminin önündedir."
        />

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {TRAITS.map((t) => (
            <li key={t.en} className="group">
              <HoloPanel className="flex h-full flex-col gap-4 p-4">
                <div className="h-20" aria-hidden="true">
                  {t.demo}
                </div>
                <div>
                  <p className="font-tech text-[12px] tracking-[0.1em] text-cyan-text uppercase" lang="en">
                    {t.en}
                  </p>
                  <h3 className="mt-1 text-[18px] font-[500]">{t.tr}</h3>
                  <p className="mt-2 text-[14px] text-muted">{t.text}</p>
                </div>
              </HoloPanel>
            </li>
          ))}
        </ul>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          {/* Madde 7 · 12: katman anatomisi */}
          <HoloPanel tick className="p-5 md:p-6">
            <PanelHead title="Katman anatomisi" meta="Figma · 8 katman" />
            <p className="mt-2 text-[15px] text-muted">Figma'da cam panel saydamlık, kontur ve üç iç gölgeyle kurulur. Katmanları tek tek kapatıp neyin ne işe yaradığını görün.</p>
            <div className="mt-5 grid gap-6 md:grid-cols-[1fr_1.05fr]">
              <fieldset>
                <legend className="sr-only">Panel katmanları</legend>
                <ul className="flex flex-col gap-1">
                  {LAYERS.map((l) => (
                    <li key={l.id}>
                      <label className="flex min-h-10 cursor-pointer items-start gap-3 rounded-lg px-2 py-1.5 hover:bg-[var(--tint)]">
                        <input type="checkbox" checked={on[l.id]} onChange={(e) => setOn((o) => ({ ...o, [l.id]: e.target.checked }))} className="mt-1 size-4 accent-[var(--cyan)]" />
                        <span className="flex flex-col">
                          <span className="text-[15px]">{l.label}</span>
                          <span className="font-mono text-[12px] text-muted">{l.css}</span>
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </fieldset>
              <div className="relative grid min-h-[280px] place-items-center overflow-hidden rounded-2xl border border-line-soft bg-bg">
                <span className="absolute top-[18%] left-[10%] size-24 rounded-full bg-cyan blur-sm" aria-hidden="true" />
                <span className="absolute right-[8%] bottom-[16%] size-28 rounded-full bg-blue blur-sm" aria-hidden="true" />
                <span className="dot-grid absolute inset-0" aria-hidden="true" />
                <div className="relative w-[78%] rounded-2xl p-5" style={anatomyStyle(on)}>
                  <p className="font-tech text-[12px] tracking-[0.14em] text-cyan-text uppercase">Çıkarım</p>
                  <p className="mt-1 text-[26px] font-[300] tabular-nums">46 token/sn</p>
                  <p className="text-[14px] text-muted">Atlas 14B · Q5_K_M</p>
                </div>
              </div>
            </div>
          </HoloPanel>

          <div className="flex flex-col gap-6">
            {/* Madde 6 */}
            <HoloPanel className="p-5 md:p-6">
              <PanelHead title="Şekil dili" meta={`radius ${radius}px`} />
              <p className="mt-2 text-[15px] text-muted">Yuvarlatılmış köşeyle birleşen 1px çerçeve; göstergeler asimetrik yaylarla havada asılı durur.</p>
              <div className="mt-4 flex items-center gap-5">
                <div className="thin-glow grid h-24 flex-1 place-items-center bg-[var(--tint)] transition-[border-radius]" style={{ borderRadius: radius }}>
                  <span className="font-tech text-[13px] text-muted">1px · {radius}px</span>
                </div>
                <Gauge value={68} label="Yük" display="68" unit="%" size={104} />
              </div>
              <label className="mt-4 flex items-center gap-3 font-tech text-[13px] text-muted">
                Köşe yarıçapı
                <input type="range" min={4} max={40} step={2} value={radius} onChange={(e) => setRadius(+e.target.value)} className="flex-1 accent-[var(--cyan)]" />
              </label>
            </HoloPanel>
            {/* Madde 8 */}
            <HoloPanel className="p-5 md:p-6">
              <PanelHead title="Doku ve yüzey" meta="4 malzeme" />
              <ul className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { k: 'Kusursuz cam', c: 'holo-panel !rounded-lg' },
                  { k: 'Akrilik', c: 'rounded-lg border border-line-soft bg-[rgb(var(--surface-rgb)/0.72)] backdrop-blur-[6px] [background-image:url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2790%27 height=%2790%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%27.9%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27 opacity=%27.12%27/%3E%3C/svg%3E")]' },
                  { k: 'Hologram yansıması', c: 'sheen rounded-lg border border-line bg-[linear-gradient(135deg,rgb(34_211_238/0.18),rgb(99_102_241/0.14)_45%,rgb(167_139_250/0.12)_60%,rgb(34_211_238/0.08))] backdrop-blur-sm' },
                  { k: 'Nokta ızgara', c: 'rounded-lg border border-line-soft bg-[rgb(var(--bg-rgb)/0.9)] bg-[radial-gradient(var(--dot)_1px,transparent_1.6px)] [background-size:12px_12px]' },
                ].map((m) => (
                  <li key={m.k} className="group flex flex-col gap-2">
                    {/* Malzemenin arkasında renkli bir desen: bulanıklık ve saydamlık ancak böyle görünür */}
                    <span className="relative block h-16 overflow-hidden rounded-lg bg-[linear-gradient(90deg,transparent_8%,var(--cyan)_8%_22%,transparent_22%_48%,var(--blue)_48%_60%,transparent_60%_78%,var(--cyan-text)_78%_86%,transparent_86%)] opacity-100" aria-hidden="true">
                      <span className={cx('absolute inset-1.5', m.c)} data-active={m.k === 'Hologram yansıması' ? '' : undefined} />
                    </span>
                    <span className="text-[14px]">{m.k}</span>
                  </li>
                ))}
              </ul>
            </HoloPanel>
          </div>
        </div>
      </div>
    </section>
  )
}
