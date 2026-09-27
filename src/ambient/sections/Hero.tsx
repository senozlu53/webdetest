import type { CSSProperties } from 'react'
import { MicrophoneIcon, PauseIcon, SparkleIcon } from '@phosphor-icons/react'
import { Scrim } from '../components/Scrim'
import { MorphOrb } from '../components/Liquid'
import { GlowCard } from '../components/GlowCard'
import { GradientMesh } from '../components/GradientMesh'

export function Hero() {
  return (
    <section id="ust" className="px-4 pt-10 pb-16 md:px-8 md:pt-16 md:pb-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        <Scrim className="-mx-6 md:-mx-12">
          <p className="ambient-rise text-sm tracking-[0.12em] text-muted uppercase" style={{ '--i': 0 } as CSSProperties}>
            Stil 006 · <span lang="en">Glass / Soft / Depth</span>
          </p>
          <h1 className="ambient-rise mt-5 text-5xl leading-[1.02] font-extralight md:text-7xl" style={{ '--i': 1 } as CSSProperties}>
            Sınırları
            <br />
            <span className="font-light">eriyen</span> arayüz
          </h1>
          <p className="ambient-rise mt-6 max-w-[46ch] text-lg text-muted" style={{ '--i': 2 } as CSSProperties}>
            Yapay zekâ çağının akışkan, sınırları belirsiz, sürekli değişen ve sıvı gibi hareket eden atmosferik arayüz tasarımı.
          </p>
          <div className="ambient-rise mt-8 flex flex-wrap gap-3" style={{ '--i': 3 } as CSSProperties}>
            <a href="#uygulama" className="glow-border inline-flex min-h-11 items-center gap-2 rounded-full bg-scrim px-5 text-sm tracking-wide text-ink no-underline">
              <SparkleIcon size={18} weight="light" aria-hidden="true" />
              Asistanla konuş
            </a>
            <a href="#mesh" className="inline-flex min-h-11 items-center rounded-full border border-line px-5 text-sm tracking-wide text-ink no-underline hover:bg-scrim">
              Mesh nasıl kuruluyor
            </a>
          </div>
        </Scrim>

        <div className="relative mx-auto grid w-full max-w-[460px] place-items-center py-10">
          <MorphOrb size={300} state="listening" />
          <GlowCard className="absolute -top-2 right-0 flex items-center gap-2 rounded-full px-4 py-2 text-sm">
            <MicrophoneIcon size={16} weight="light" aria-hidden="true" />
            Asistan dinliyor
          </GlowCard>
          <GlowCard className="absolute bottom-0 left-0 flex w-[260px] items-center gap-3 p-3">
            <GradientMesh palette="aurora2" className="morph size-14 shrink-0" />
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-sm font-normal">Gece Yüzmesi</span>
              <span className="truncate text-xs text-muted">Premium · kurgusal parça</span>
            </span>
            <span className="ml-auto grid size-9 shrink-0 place-items-center rounded-full border border-line" aria-hidden="true">
              <PauseIcon size={14} weight="fill" />
            </span>
          </GlowCard>
        </div>
      </div>
    </section>
  )
}
