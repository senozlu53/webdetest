import { useMemo, type CSSProperties } from 'react'
import { HoloCanvas } from '../components/HoloCanvas'
import { Particles } from '../components/Particles'
import { Gauge } from '../components/Gauge'
import { HoloButton, HoloPanel } from '../components/ui'
import { HoloIcon } from '../components/Icons'
import { icosphere, merge, ring } from '../lib/geo3d'
import { useHolo } from '../lib/store'
import { VRAM_GB, fmtNum } from '../lib/data'

export function Hero() {
  const s = useHolo()
  const mesh = useMemo(() => merge(icosphere(2, 1), ring(1.42, 120, 1.25, 0.2), ring(1.66, 140, -0.55, -0.35)), [])
  const active = s.models.find((m) => m.id === s.activeId)!
  const vram = s.models.filter((m) => m.status === 'yuklu').reduce((a, m) => a + m.sizeGB, 0)

  return (
    <section id="ust" className="relative isolate overflow-hidden">
      {/* Zemin: nokta ızgara, geniş ortam parlamaları ve uçuşan veri parçacıkları */}
      <div className="dot-grid absolute inset-0 -z-10" aria-hidden="true" />
      <div className="holo-deco absolute top-[-10%] right-[-10%] -z-10 size-[620px] rounded-full bg-[radial-gradient(closest-side,var(--glow-strong),transparent)] blur-2xl" aria-hidden="true" />
      <div className="absolute bottom-[-20%] left-[-10%] -z-10 size-[520px] rounded-full bg-[radial-gradient(closest-side,var(--glow-blue),transparent)] blur-2xl" aria-hidden="true" />
      <Particles className="absolute inset-0 -z-10" />

      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-14 pb-16 md:px-8 md:pt-20 lg:min-h-[calc(100vh-64px)] lg:grid-cols-[1.05fr_1fr] lg:pb-20">
        {/* Madde 18: metin hologramın önünde, opak koruyucu gradyanla */}
        <div className="scrim">
          <p className="flex items-center gap-3 font-tech text-[13px] font-semibold tracking-[0.18em] text-cyan-text uppercase">
            <span className="pulse-dot size-2 rounded-full bg-cyan shadow-[0_0_10px_var(--cyan)]" aria-hidden="true" />
            Stil 011 · <span lang="en">Futuristic / Technology</span>
          </p>
          <h1 className="mt-5 text-[46px] leading-[1.02] md:text-[76px]">
            <span className="block font-[200]">Boşlukta süzülen</span>
            <span className="glow-text block bg-[linear-gradient(100deg,var(--cyan-text),var(--blue-text))] bg-clip-text pb-1 font-display text-transparent">cam arayüz</span>
          </h1>
          <p className="mt-6 max-w-[52ch] text-[18px] text-muted">
            Cyberpunk'ın karanlık ve kirli yapısının aksine laboratuvar temizliğinde bir bilimkurgu: uçuşan veri parçacıkları, yarı saydam cam paneller, ince çerçeveler ve açık mavi parlamalar.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <HoloButton variant="primary" onClick={() => s.setCommandOpen(true)} icon={<HoloIcon name="komut" size={18} glow={false} />}>
              Komut merkezini aç
            </HoloButton>
            <a
              href="#hat"
              className="thin-glow inline-flex min-h-11 items-center gap-2 rounded-full bg-[rgb(var(--surface-rgb)/0.55)] px-5 font-tech text-[15px] font-semibold tracking-[0.06em] text-ink no-underline transition-colors hover:border-cyan-text"
            >
              <HoloIcon name="akis" size={18} className="text-cyan-text" />
              Çıkarım hattını izle
            </a>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-line-soft pt-5">
            {[
              ['Zemin', s.theme === 'dark' ? '#090E17' : '#EEF4F9'],
              ['Bulanıklık', '16px'],
              ['Kontur', '1px'],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="font-tech text-[12px] tracking-[0.12em] text-muted uppercase">{k}</dt>
                <dd className="mt-1 text-[18px] font-[300] tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* 3B veri küresi ve etrafında havada asılı asimetrik göstergeler */}
        <div className="relative mx-auto aspect-square w-full max-w-[540px]">
          <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent)]" aria-hidden="true" />
          <HoloCanvas mesh={mesh} speed={0.14} zoom={0.84} className="absolute inset-0" />
          <HoloPanel tick className="float absolute top-[4%] left-0 hidden p-3 sm:block" style={{ '--i': 0 } as CSSProperties}>
            <Gauge value={(vram / VRAM_GB) * 100} label="VRAM" display={fmtNum(vram)} unit={`/ ${VRAM_GB} GB`} size={118} />
          </HoloPanel>
          <HoloPanel className="float absolute right-0 bottom-[10%] hidden p-3 sm:block" style={{ '--i': 1 } as CSSProperties}>
            <Gauge value={active.tps} max={150} label="Üretim" display={String(active.tps)} unit="token/sn" size={118} tone="blue" />
          </HoloPanel>
          <HoloPanel className="float absolute top-[10%] right-[4%] hidden px-4 py-3 md:block" style={{ '--i': 2 } as CSSProperties}>
            <p className="font-tech text-[11px] tracking-[0.14em] text-muted uppercase">Etkin model</p>
            <p className="mt-0.5 text-[17px] font-[400]">
              {active.name} {active.params}
            </p>
            <p className="font-tech text-[12px] text-cyan-text">{active.quant}</p>
          </HoloPanel>
          <HoloPanel className="holo-deco float absolute bottom-[4%] left-[6%] hidden px-4 py-3 md:block" style={{ '--i': 3 } as CSSProperties}>
            <p className="font-tech text-[11px] tracking-[0.14em] text-muted uppercase">10GbE</p>
            <p className="mt-0.5 flex items-center gap-2 text-[17px] font-[400]">
              <span className={s.transfer ? 'pulse-dot size-1.5 rounded-full bg-cyan' : 'size-1.5 rounded-full bg-[var(--muted)]'} aria-hidden="true" />
              {s.transfer ? 'Aktarım sürüyor' : 'Boşta'}
            </p>
          </HoloPanel>
        </div>
        {/* Dar ekranda göstergeler kürenin altında, düz bir sırada */}
        <div className="-mt-4 grid grid-cols-2 gap-3 sm:hidden">
          <HoloPanel className="grid place-items-center p-3">
            <Gauge value={(vram / VRAM_GB) * 100} label="VRAM" display={fmtNum(vram)} unit={`/ ${VRAM_GB} GB`} size={116} />
          </HoloPanel>
          <HoloPanel className="grid place-items-center p-3">
            <Gauge value={active.tps} max={150} label="Üretim" display={String(active.tps)} unit="token/sn" size={116} tone="blue" />
          </HoloPanel>
        </div>
      </div>
    </section>
  )
}
