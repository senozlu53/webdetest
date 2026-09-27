import type { ReactNode } from 'react'
import type { Msg } from '../lib/store'
import type { WidgetId } from '../lib/topics'
import { Anatomi, Balon, Kutu, Palet } from './Basics'
import { Kod, Modlar } from './Build'
import { Erisim, Hareket, Klavye } from './Behavior'
import { Dosya } from './Dosya'

export function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-label={`Örnek: ${title}`} className="w-full max-w-[680px] rounded-2xl border border-line bg-surface p-4 shadow-[var(--card-shadow)] md:p-5">
      <p className="mb-3 text-[12px] font-medium tracking-wide text-muted uppercase">Örnek · {title}</p>
      {children}
    </section>
  )
}

export function Widget({ id, title, m }: { id: WidgetId; title: string; m: Msg }) {
  const body = (() => {
    switch (id) {
      case 'anatomi':
        return <Anatomi />
      case 'palet':
        return <Palet />
      case 'balon':
        return <Balon />
      case 'kutu':
        return <Kutu />
      case 'modlar':
        return <Modlar />
      case 'kod':
        return <Kod />
      case 'hareket':
        return <Hareket />
      case 'klavye':
        return <Klavye />
      case 'erisim':
        return <Erisim />
      case 'dosya':
        return <Dosya analyses={m.analyses ?? []} />
    }
  })()
  return <Card title={title}>{body}</Card>
}
