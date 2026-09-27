import type { ReactNode } from 'react'
import { Scrim } from './Scrim'

export function SectionHead({ item, label, title, lede }: { item: string; label: ReactNode; title: ReactNode; lede?: ReactNode }) {
  return (
    <Scrim className="-mx-10 mb-6 max-w-[860px] md:-mx-12 md:mb-10">
      <p className="text-sm font-normal tracking-[0.12em] text-muted uppercase">
        <span className="font-mono tracking-normal text-accent">{item}</span> · {label}
      </p>
      <h2 className="mt-4 text-4xl leading-[1.08] font-extralight md:text-6xl">{title}</h2>
      {lede ? <p className="mt-5 max-w-[60ch] text-lg text-muted">{lede}</p> : null}
    </Scrim>
  )
}
