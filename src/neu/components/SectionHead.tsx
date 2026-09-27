import type { ReactNode } from 'react'

/** Bölüm başlığı: gömülü hap içinde madde numarası, kalın ve dolgun başlık. */
export function SectionHead({ item, label, title, lede }: { item: string; label: ReactNode; title: ReactNode; lede?: ReactNode }) {
  return (
    <header className="mb-10 flex max-w-3xl flex-col gap-4 md:mb-14">
      <p className="neu neu-inset inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold">
        <span className="tabular-nums text-accent">{item}</span>
        <span aria-hidden="true" className="size-1 rounded-full bg-muted" />
        <span className="text-muted">{label}</span>
      </p>
      <h2 className="text-3xl font-extrabold md:text-5xl">{title}</h2>
      {lede ? <p className="max-w-[60ch] text-lg text-muted">{lede}</p> : null}
    </header>
  )
}
