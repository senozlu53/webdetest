import type { CSSProperties } from 'react'
import { SoftCard } from '../components/SoftCard'
import { LineIcon } from '../components/LineIcon'
import { HERO_META } from '../content'
import { useParallax } from '../useParallax'

/** Shoji paravanı: 3 × 4 ışık bölmesi, bulanık ve eğik. */
function ShojiLight() {
  const ref = useParallax<HTMLDivElement>(-0.06)
  return (
    <div ref={ref} aria-hidden="true" className="absolute -top-[6%] -right-[18%] h-[92%] w-[88%]">
      <div className="grid h-full w-full rotate-[-9deg] skew-x-[-6deg] grid-cols-3 grid-rows-4 gap-[5%] blur-[10px]">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className="rounded-soft" style={{ background: 'var(--light-patch)' }} />
        ))}
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section id="ust" className="pt-16 pb-24 md:pt-24 md:pb-32">
      <div className="soft-frame grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <ul className="soft-rise flex flex-wrap gap-2" style={{ '--i': 0 } as CSSProperties}>
            {HERO_META.map((m) => (
              <li key={m.label} className="soft-eyebrow">
                <span className="text-ink-soft">{m.label}</span>
                <span lang={m.label === 'Diğer adı' ? 'en' : undefined}>{m.value}</span>
              </li>
            ))}
          </ul>
          <h1 className="mt-10 text-display">
            <span className="soft-rise block" style={{ '--i': 1 } as CSSProperties}>
              Yavaşlayan,
            </span>
            <span className="soft-rise block" style={{ '--i': 2 } as CSSProperties}>
              <em className="text-gold-deep">nefes alan</em> arayüzler
            </span>
          </h1>
          <p className="soft-rise mt-8 max-w-[48ch] text-lead text-ink-soft" style={{ '--i': 3 } as CSSProperties}>
            Soğuk teknolojik arayüzlere karşı organik, sıcak, sakinleştirici ve nefes alan bir kullanıcı deneyimi sunan
            minimalizm varyasyonu.
          </p>
          <div className="soft-rise mt-10 flex flex-wrap gap-3" style={{ '--i': 4 } as CSSProperties}>
            <a
              href="#uygulama"
              className="inline-flex items-center gap-2.5 rounded-pill bg-ink px-7 py-3.5 font-medium tracking-wide text-canvas no-underline transition-[box-shadow,transform] duration-400 ease-soft hover:-translate-y-px hover:shadow-float"
            >
              Nefes egzersizini dene
              <LineIcon name="arrow-right" size={18} />
            </a>
            <a
              href="#renk"
              className="inline-flex items-center rounded-pill border border-field px-7 py-3.5 font-medium tracking-wide text-ink no-underline transition-colors duration-400 ease-soft hover:bg-sand"
            >
              Paleti incele
            </a>
          </div>
        </div>

        {/* Keten üstünde taşlar ve paravandan süzülen ışık */}
        <div className="soft-bloom lg:col-span-5">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px] overflow-hidden rounded-[40px] bg-sand shadow-soft">
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{ background: 'radial-gradient(120% 90% at 85% 5%, var(--glow) 0%, transparent 62%)' }}
            />
            <ShojiLight />
            <div
              aria-hidden="true"
              className="absolute bottom-[26%] left-[12%] aspect-[1.35] w-[46%] rounded-[58%_42%_52%_48%/48%_56%_44%_52%] bg-canvas shadow-float"
            />
            <div
              aria-hidden="true"
              className="absolute bottom-[30%] left-[52%] aspect-[1.2] w-[18%] rounded-[46%_54%_40%_60%/55%_45%_55%_45%] bg-gold shadow-float"
            />
            <SoftCard blur="sm" padding="none" className="absolute right-5 bottom-5 left-5 flex items-center gap-4 p-4 md:right-6 md:bottom-6 md:left-6">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-sand text-gold-deep">
                <LineIcon name="wind" />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="font-medium">Bugünkü nefes</span>
                <span className="text-small text-ink-soft">4-7-8 · 5 dakika</span>
              </span>
              <a
                href="#uygulama"
                aria-label="Nefes egzersizine git"
                className="ml-auto grid size-11 shrink-0 place-items-center rounded-full bg-ink text-canvas transition-shadow duration-400 ease-soft hover:shadow-float"
              >
                <LineIcon name="play" size={18} />
              </a>
            </SoftCard>
          </div>
        </div>
      </div>
    </section>
  )
}
