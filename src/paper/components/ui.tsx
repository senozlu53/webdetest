import { useId, type CSSProperties, type ReactNode } from 'react'
import { cx } from '../../shared/cx'
import { PaperCard } from './Paper'

/**
 * Bölüm: kraft zeminin üstünde büyük bej kâğıt levha (organik dalgalı kenar). Levha pürüzsüzdür:
 * bütün metin bu en üst katmanda durur (Madde 18). Başlık etiketi levhaya yapıştırılmış renkli kâğıt.
 */
export function Section({ id, madde, renk = 'var(--gunes)', title, lead, children, className, tohum }: { id: string; madde: string; renk?: string; title: ReactNode; lead?: ReactNode; children: ReactNode; className?: string; tohum?: number }) {
  const hid = useId()
  const t = tohum ?? id.length * 7 + 3
  return (
    <section id={id} aria-labelledby={hid} className={cx('mx-auto w-full max-w-[1240px] scroll-mt-24 px-3 py-7 md:px-6 md:py-10', className)}>
      <PaperCard renk="var(--bej)" nivel={3} duz tohum={t} r={30} dalga={5} adim={140} yuzClass="px-5 pt-14 pb-12 md:px-12 md:pt-16 md:pb-16">
        <div className="-mt-9 mb-5">
          <PaperCard nivel={2} renk={renk} duz tohum={t + 4} r={12} dalga={1.5} adim={90} className="inline-block -rotate-1" yuzClass="px-4 py-1.5">
            <p className="etiket">{madde}</p>
          </PaperCard>
        </div>
        <h2 id={hid} className="text-[clamp(40px,6.4vw,84px)] [overflow-wrap:anywhere]">
          {title}
        </h2>
        {lead ? <p className="mt-5 max-w-[62ch] text-[18px] font-medium text-soluk">{lead}</p> : null}
        <div className="mt-10 md:mt-12">{children}</div>
      </PaperCard>
    </section>
  )
}

export function Kod({ children, label, className, sar = true, style }: { children: string; label: string; className?: string; sar?: boolean; style?: CSSProperties }) {
  return (
    <pre className={cx('kod overflow-x-auto', !sar && '!whitespace-pre', className)} tabIndex={0} aria-label={label} style={style}>
      <code>{children}</code>
    </pre>
  )
}
