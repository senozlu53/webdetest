import type { ReactNode } from 'react'

/** Bölüm başlığı: cam çip içinde madde numarası, net başlık, okunur giriş metni. */
export function SectionHead({ item, label, title, lede }: { item: string; label: ReactNode; title: ReactNode; lede?: ReactNode }) {
  return (
    <header className="mb-10 flex max-w-3xl flex-col gap-4 md:mb-14">
      <p data-blur="sm" className="glass inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium">
        <span className="font-mono tabular-nums text-accent">{item}</span>
        <span aria-hidden="true" className="size-1 rounded-full bg-ink-muted" />
        <span>{label}</span>
      </p>
      <h2 className="text-3xl font-semibold md:text-5xl">{title}</h2>
      {lede ? <p className="max-w-[60ch] text-lg text-ink-muted">{lede}</p> : null}
    </header>
  )
}
