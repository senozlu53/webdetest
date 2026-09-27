import type { ReactNode } from 'react'

type Props = {
  /** Stil tanımındaki madde numarası, örn. "04" ya da "06–08". */
  item: string
  label: ReactNode
  title: ReactNode
  lede?: ReactNode
}

/** Bölüm girişi: hap biçimli madde etiketi, serif başlık, geniş aralıklı giriş metni. */
export function SectionIntro({ item, label, title, lede }: Props) {
  return (
    <header className="mb-14 grid gap-6 md:mb-20 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-4">
        <p className="soft-eyebrow">
          <span className="tabular-nums text-gold-deep">{item}</span>
          <span aria-hidden="true" className="size-1 rounded-full bg-gold" />
          <span>{label}</span>
        </p>
      </div>
      <div className="flex flex-col gap-5 lg:col-span-8">
        <h2 className="text-h2">{title}</h2>
        {lede ? <p className="max-w-[56ch] text-lead text-ink-soft">{lede}</p> : null}
      </div>
    </header>
  )
}
