import { useState, type CSSProperties, type ReactNode } from 'react'
import { CyberCard, Glitch, SectionHead } from '../components/Cyber'
import { cx } from '../../shared/cx'

const TRAITS: ReadonlyArray<{ en: string; tr: string; demo: ReactNode }> = [
  {
    en: 'Dark background',
    tr: 'Karanlık zemin',
    demo: (
      <div className="flex h-full">
        <span className="flex-1 bg-[#000000]" />
        <span className="flex flex-1 items-end bg-[#050509] p-1 font-hud text-[10px] text-muted">#050509</span>
      </div>
    ),
  },
  { en: 'Neon accent', tr: 'Neon vurgu', demo: <span className="font-display text-3xl font-bold text-cyan text-glow">NEON</span> },
  { en: 'High contrast', tr: 'Yüksek kontrast', demo: <span className="font-hud text-2xl font-bold text-ink">19:1</span> },
  { en: 'Scanlines', tr: 'Tarama çizgisi', demo: <div className="scanlines h-full w-full bg-surface-2 [--scan:rgb(0_240_255/0.35)]" /> },
  { en: 'Glow', tr: 'Parlama', demo: <span className="h-1 w-3/4 bg-magenta glow-magenta" /> },
  {
    en: 'Grid',
    tr: 'Izgara',
    demo: <div className="h-full w-full" style={{ backgroundImage: 'linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)', backgroundSize: '12px 12px' }} />,
  },
  { en: 'HUD', tr: 'Gösterge paneli', demo: <div className="hud grid h-full w-full place-items-center font-hud text-[11px] text-cyan">TGT·07</div> },
  { en: 'Glitch', tr: 'Bozulma', demo: <Glitch text="GLITCH" className="font-display text-2xl font-bold" /> },
]

const SHAPES = [
  { name: 'Tek köşe', shape: 'polygon(18px 0, 100% 0, 100% 100%, 0 100%, 0 18px)' },
  { name: 'Çapraz iki köşe', shape: 'polygon(18px 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%, 0 18px)' },
  { name: 'Kırık kenar', shape: 'polygon(0 0, 62% 0, 66% 10px, 100% 10px, 100% 100%, 26px 100%, 0 calc(100% - 26px))' },
  { name: 'Çentikli', shape: 'polygon(0 0, 100% 0, 100% 40%, calc(100% - 8px) 46%, calc(100% - 8px) 60%, 100% 66%, 100% 100%, 0 100%)' },
]

export function Traits() {
  const [tex, setTex] = useState({ scan: true, noise: true, wear: true })
  return (
    <section id="ozellikler" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="03 · 06 · 07 · 08"
          label="Karakteristikler"
          title="Neon ve kir"
          lede="Sekiz özellik bir arada çalışır: karanlık zemin, neon vurgu, yüksek kontrast, tarama çizgisi, parlama, ızgara, HUD ve glitch. Biçimler serttir; köşeler kesik, bazı kenarlar bilerek kırık."
        />
        <ul className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
          {TRAITS.map((t) => (
            <li key={t.en} className="group flex flex-col gap-3 bg-bg p-4">
              <div className="grid h-16 place-items-center overflow-hidden" aria-hidden="true">
                {t.demo}
              </div>
              <p>
                <span className="block font-hud text-[11px] tracking-[0.1em] text-cyan uppercase" lang="en">
                  {t.en}
                </span>
                <span className="font-display text-lg font-bold uppercase">{t.tr}</span>
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <CyberCard label="Şekil" code="06">
            <p className="text-[15px] text-muted">Asimetrik kesik köşeler, sert hatlar, bilerek kırık formlar.</p>
            <ul className="mt-4 grid grid-cols-2 gap-3">
              {SHAPES.map((s) => (
                <li key={s.name} className="flex flex-col gap-2">
                  <span className="h-14 bg-cyan/80" style={{ clipPath: s.shape, background: 'color-mix(in srgb, var(--cyan) 75%, transparent)' }} aria-hidden="true" />
                  <span className="font-display text-[14px] font-bold tracking-[0.1em] uppercase">{s.name}</span>
                </li>
              ))}
            </ul>
          </CyberCard>

          <CyberCard label="Derinlik" code="07" tone="magenta">
            <p className="text-[15px] text-muted">Geleneksel gölge yok. Derinliği yayılan neon parlaması ve yansıması verir.</p>
            <div className="mt-5 grid grid-cols-2 gap-5">
              <figure className="flex flex-col items-center gap-3">
                <span className="h-16 w-full bg-surface-2 shadow-[0_12px_24px_rgb(0_0_0/0.6)]" aria-hidden="true" />
                <figcaption className="text-center text-[13px] text-muted">
                  <span className="line-through">Gri gölge</span>
                </figcaption>
              </figure>
              <figure className="flex flex-col items-center gap-3">
                <span className="chamfer chamfer-sm h-16 w-full glow-magenta" style={{ '--frame': 'var(--magenta)' } as CSSProperties} aria-hidden="true" />
                <figcaption className="text-center text-[13px] font-semibold">Neon parlama</figcaption>
              </figure>
            </div>
            <div className="mt-5 h-8" style={{ background: 'linear-gradient(to bottom, color-mix(in srgb, var(--magenta) 30%, transparent), transparent)', maskImage: 'repeating-linear-gradient(to bottom, #000 0 2px, transparent 2px 4px)' }} aria-hidden="true" />
            <p className="text-center text-[12px] text-muted">zemindeki yansıma</p>
          </CyberCard>

          <CyberCard label="Doku" code="08" tone="yesil">
            <p className="text-[15px] text-muted">Kaset/CRT tarama çizgileri, dijital gürültü ve metal aşınması. Hepsi metnin arkasında kalır.</p>
            <div className="relative mt-4 h-28 overflow-hidden border border-line bg-surface-2" aria-hidden="true">
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1c2230, #0b0b14 60%, #232a3a)' }} />
              {tex.wear ? <div className="absolute inset-0" style={{ backgroundImage: 'var(--wear-img)', opacity: 0.35, mixBlendMode: 'screen' }} /> : null}
              {tex.noise ? <div className="noise absolute inset-0 [--noise-opacity:0.25]" /> : null}
              {tex.scan ? <div className="scanlines absolute inset-0 [--scan:rgb(255_255_255/0.12)]" /> : null}
              <span className="absolute bottom-2 left-3 font-hud text-[12px] text-cyan">PLT-09 · ALLOY</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Doku katmanları">
              {(
                [
                  ['scan', 'Tarama'],
                  ['noise', 'Gürültü'],
                  ['wear', 'Aşınma'],
                ] as const
              ).map(([k, l]) => (
                <button
                  key={k}
                  type="button"
                  aria-pressed={tex[k]}
                  onClick={() => setTex((t) => ({ ...t, [k]: !t[k] }))}
                  className={cx('min-h-11 cursor-pointer border px-3 font-display text-[14px] font-bold tracking-[0.1em] uppercase', tex[k] ? 'border-yesil text-yesil' : 'border-line text-muted')}
                >
                  {l}
                </button>
              ))}
            </div>
          </CyberCard>
        </div>
      </div>
    </section>
  )
}
