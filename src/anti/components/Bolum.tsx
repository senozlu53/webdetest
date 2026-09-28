import type { ReactNode } from 'react'

/** Bölüm: başlığıyla adlandırılmış bir section. Başka hiçbir şey. */
export function Bolum({ id, baslik, children }: { id: string; baslik: ReactNode; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-b`}>
      <h2 id={`${id}-b`}>{baslik}</h2>
      {children}
    </section>
  )
}
