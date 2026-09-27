import { useEffect, useState } from 'react'
import { TerminalWindowIcon } from '@phosphor-icons/react'
import { CyberLink, Glitch, NeonProgress } from '../components/Cyber'
import { Radar } from '../components/Radar'

export function Hero() {
  // Başlık yüklenince bir kez glitch yapar, sonra yalnız üzerine gelince
  const [boot, setBoot] = useState(true)
  useEffect(() => {
    const t = window.setTimeout(() => setBoot(false), 1000)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <section id="ust" className="relative isolate overflow-hidden px-4 pt-14 pb-20 md:px-8 md:pt-20 md:pb-28">
      <div className="pointer-events-none absolute inset-x-[-20%] bottom-0 -z-10 h-[55%] grid-floor" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: 'radial-gradient(60% 50% at 70% 30%, color-mix(in srgb, var(--mor) 22%, transparent), transparent 70%), radial-gradient(40% 40% at 10% 80%, color-mix(in srgb, var(--magenta) 12%, transparent), transparent 70%)' }}
        aria-hidden="true"
      />
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <p className="flex items-center gap-3 font-display text-[13px] font-bold tracking-[0.24em] text-yesil uppercase">
            <span className="neon-pulse inline-block size-2.5 bg-yesil" aria-hidden="true" />
            Sistem çevrimiçi · Stil <span className="font-hud tracking-normal">010</span>
          </p>
          <h1 className="mt-5 text-[46px] leading-[0.95] font-bold uppercase md:text-[80px]">
            <Glitch text="Karanlıkta" active={boot} className="block" />
            <span className="block text-cyan text-glow">neonla yazılan</span>
            <Glitch text="arayüz" active={boot} className="block" />
          </h1>
          <p className="mt-6 max-w-[48ch] text-lg text-muted">
            Yüksek teknolojinin distopik, asi sokak kültürüyle birleştiği tasarım dili. Karanlık zemin, agresif neon vurgular, tarama çizgileri ve HUD panelleri.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <CyberLink href="#hud" icon={<TerminalWindowIcon size={18} weight="bold" aria-hidden="true" />}>
              Terminale bağlan
            </CyberLink>
            <CyberLink href="#bilesenler" variant="ghost" glitch>
              Bileşenleri tara
            </CyberLink>
          </div>
        </div>

        <div className="hud min-w-0 p-6 md:p-8">
          <div className="flex items-baseline justify-between gap-3 font-display text-[13px] font-bold tracking-[0.2em] uppercase">
            <span className="text-cyan">Hedef · Sektör 7</span>
            <span className="font-hud text-[11px] tracking-normal text-muted" lang="en">
              41.0082N 28.9784E
            </span>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-6">
            <Radar
              size={190}
              className="shrink-0"
              blips={[
                { id: 'a', angle: 38, dist: 0.62, tone: 'magenta' },
                { id: 'b', angle: 150, dist: 0.4, tone: 'cyan' },
                { id: 'c', angle: 250, dist: 0.78, tone: 'yesil' },
              ]}
            />
            <dl className="grid min-w-40 flex-1 gap-3 font-mono text-[13px]">
              {[
                ['Düğüm', 'NX-7741', 'text-ink'],
                ['Tehdit', 'Orta', 'text-magenta'],
                ['Gecikme', '12 ms', 'text-yesil'],
                ['Şifre', 'AES-256', 'text-cyan'],
              ].map(([k, v, c]) => (
                <div key={k} className="flex justify-between gap-3 border-b border-line pb-1.5">
                  <dt className="text-muted">{k}</dt>
                  <dd className={c}>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="mt-6 grid gap-4">
            <NeonProgress label="Ağ yükü" value={72} />
            <NeonProgress label="Şifre çözme" value={38} tone="magenta" />
            <NeonProgress label="Enerji" value={91} tone="yesil" />
          </div>
        </div>
      </div>
    </section>
  )
}
