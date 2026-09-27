import type { CSSProperties } from 'react'
import { ArrowRightIcon, SparkleIcon, TrendUpIcon } from '@phosphor-icons/react'
import { GlassCard } from '../components/GlassCard'

const SPARK = [42, 44, 43, 47, 46, 49, 48, 52, 51, 55, 54, 58]

function Spark() {
  const w = 120
  const h = 36
  const min = Math.min(...SPARK)
  const max = Math.max(...SPARK)
  const pts = SPARK.map((v, i) => `${(i * w) / (SPARK.length - 1)},${h - 4 - ((v - min) / (max - min)) * (h - 8)}`).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" className="overflow-visible">
      <polyline points={pts} fill="none" stroke="var(--blob-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={w} cy={4} r="4" fill="var(--blob-3)" stroke="var(--ink)" strokeWidth="2" />
    </svg>
  )
}

export function Hero() {
  return (
    <section id="ust" className="px-4 pt-16 pb-20 md:px-8 md:pt-24 md:pb-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
        <div className="flex flex-col gap-7">
          <ul className="glass-rise flex flex-wrap gap-2" style={{ '--i': 0 } as CSSProperties}>
            {['Stil 004', 'Glass / Soft / Depth'].map((t) => (
              <li key={t} data-blur="sm" className="glass rounded-full px-3.5 py-1.5 text-xs font-medium" lang={t.includes('Glass') ? 'en' : undefined}>
                {t}
              </li>
            ))}
          </ul>
          <h1 className="glass-rise text-5xl leading-[1.02] font-semibold md:text-7xl" style={{ '--i': 1 } as CSSProperties}>
            Işığı süzen,
            <br />
            <span className="bg-clip-text text-transparent [background-image:linear-gradient(100deg,var(--primary-from),var(--primary-to))]">
              katmanlı arayüzler
            </span>
          </h1>
          <p className="glass-rise max-w-[46ch] text-lg text-ink-muted" style={{ '--i': 2 } as CSSProperties}>
            İşletim sistemlerinde ve modern web platformlarında sıkça görülen, arayüze ferahlık ve hiyerarşik derinlik katan
            yarı saydamlık estetiği.
          </p>
          <div className="glass-rise flex flex-wrap gap-3" style={{ '--i': 3 } as CSSProperties}>
            <a
              href="#laboratuvar"
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold text-(--primary-text) no-underline shadow-glass [background-image:linear-gradient(120deg,var(--primary-from),var(--primary-to))] hover:brightness-110"
            >
              Cam laboratuvarını aç
              <ArrowRightIcon size={18} weight="bold" aria-hidden="true" />
            </a>
            <a href="#bilesenler" className="glass inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold text-ink no-underline">
              Bileşenler
            </a>
          </div>
        </div>

        {/* Kompozisyon: yapay zekâ paneli, portföy kartı ve bildirim; fareyle eğilir */}
        <div className="relative mx-auto w-full max-w-[520px] pt-10 pb-24 lg:pb-16">
          <GlassCard tilt holo blur="xl" className="p-6 pb-28 md:p-7 md:pb-28">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full text-white [background-image:linear-gradient(135deg,var(--blob-1),var(--blob-3))]">
                <SparkleIcon size={20} weight="fill" aria-hidden="true" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="font-semibold">Asistan</span>
                <span className="text-sm text-ink-muted">Finans · örnek sohbet</span>
              </span>
            </div>
            <p data-tone="subtle" className="glass mt-6 ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md px-4 py-3 text-sm">
              Bu ay nereye fazla harcadım?
            </p>
            <p className="mt-3 max-w-[92%] text-sm leading-relaxed">
              Dışarıda yemek harcaması geçen aya göre <strong>%34 arttı</strong> (4.280 TL). Diğer kalemler bütçenin içinde.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {['Bütçe öner', 'Kategorileri göster'].map((c) => (
                <span key={c} data-blur="sm" data-tone="subtle" className="glass rounded-full px-3 py-1.5 text-xs font-medium">
                  {c}
                </span>
              ))}
            </div>
          </GlassCard>

          <GlassCard blur="lg" className="glass-float absolute bottom-0 -left-3 w-[62%] p-5 md:-left-10" style={{ animationDelay: '-3s' }}>
            <p className="text-sm text-ink-muted">Portföy değeri</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">1.284.500 TL</p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-up">
                <TrendUpIcon size={16} weight="bold" aria-hidden="true" />
                %2,4 bugün
              </span>
              <Spark />
            </div>
          </GlassCard>

          <GlassCard blur="md" className="glass-float absolute top-0 -right-2 flex items-center gap-2.5 rounded-full py-2 pr-4 pl-2 md:-right-8">
            <span className="grid size-7 place-items-center rounded-full bg-up/20 text-up" aria-hidden="true">
              <span className="size-2 rounded-full bg-up" />
            </span>
            <span className="text-sm font-medium whitespace-nowrap">Yanıt hazır · 1,2 sn</span>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}
