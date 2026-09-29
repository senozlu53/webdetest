import { useId, type ReactNode } from 'react'
import { cx } from '../../shared/cx'
import { CizgiAyrac } from './Rough'

/** Bölüm: daktilo etiketi, el yazısı başlık, sade sans giriş metni, titrek ayraç */
export function Section({ id, madde, title, lead, children, className }: { id: string; madde: string; title: ReactNode; lead?: ReactNode; children: ReactNode; className?: string }) {
  const hid = useId()
  return (
    <section id={id} aria-labelledby={hid} className={cx('mx-auto w-full max-w-[1200px] scroll-mt-24 px-4 pt-16 pb-8 md:px-8 md:pt-24', className)}>
      <CizgiAyrac tohum={id.length + 3} className="mb-10 max-w-[420px]" />
      <p className="kicker">{madde}</p>
      <h2 id={hid} className="mt-3 text-[clamp(48px,7.4vw,92px)] [overflow-wrap:anywhere]">
        {title}
      </h2>
      {lead ? <p className="mt-5 max-w-[62ch] text-[18px] text-soluk">{lead}</p> : null}
      <div className="mt-10 md:mt-12">{children}</div>
    </section>
  )
}

export function Kod({ children, label, className, sar = true }: { children: string; label: string; className?: string; sar?: boolean }) {
  return (
    <pre className={cx('kod overflow-x-auto', !sar && '!whitespace-pre', className)} tabIndex={0} aria-label={label}>
      <code>{children}</code>
    </pre>
  )
}
