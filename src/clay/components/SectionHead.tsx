import type { ReactNode } from 'react'
import { Pop } from './Pop'

export function SectionHead({ item, label, title, lede }: { item: string; label: ReactNode; title: ReactNode; lede?: ReactNode }) {
  return (
    <Pop className="mb-10 max-w-[820px] md:mb-14">
      <p className="clay clay-sm tone-base inline-flex items-center gap-2 rounded-max px-4 py-1.5 text-[15px] font-bold">
        <span className="font-mono text-accent">{item}</span>
        <span className="text-muted">·</span>
        {label}
      </p>
      <h2 className="mt-5 text-4xl leading-[1.05] font-extrabold md:text-6xl">{title}</h2>
      {lede ? <p className="mt-4 max-w-[62ch] text-lg text-muted">{lede}</p> : null}
    </Pop>
  )
}
