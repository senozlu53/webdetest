import type { ReactNode } from 'react'
import { cx } from '../../shared/cx'
import { SwissCol, SwissGrid } from './SwissGrid'
import { ThickDivider } from './ThickDivider'
import { TypographyDisplay } from './TypographyDisplay'
import { useCutReveal } from '../useCutReveal'

type SectionProps = {
  id: string
  /** Bant sayfanın tersi renklerle çizilir. */
  invert?: boolean
  className?: string
  children: ReactNode
}

export function Section({ id, invert, className, children }: SectionProps) {
  return (
    <section id={id} className={cx(invert ? 'swiss-invert py-l lg:py-xl' : 'pt-l lg:pt-xl', className)}>
      <div className="swiss-frame">{children}</div>
    </section>
  )
}

type HeaderProps = {
  /** Stil tanımındaki madde numarası, örn. "04" ya da "06–08". */
  item: string
  label: ReactNode
  title: string
  lede?: ReactNode
}

/** Bölüm başlığı: 2px çizgi, solda madde numarası, sağda devasa başlık. */
export function SectionHeader({ item, label, title, lede }: HeaderProps) {
  const ref = useCutReveal<HTMLElement>()
  return (
    <header className="mb-l">
      <ThickDivider />
      <SwissGrid className="gap-y-m pt-s">
        <SwissCol span={[12, 3, 3]} className="flex gap-s md:flex-col md:gap-0">
          <p className="swiss-label tabular-nums">Madde {item}</p>
          <p className="swiss-label font-normal">{label}</p>
        </SwissCol>
        <SwissCol span={[12, 9, 9]}>
          <TypographyDisplay ref={ref} as="h2" size="h2" className="swiss-cut w-fit max-w-full">
            {title}
          </TypographyDisplay>
          {lede ? <p className="mt-m max-w-[38ch] text-lead">{lede}</p> : null}
        </SwissCol>
      </SwissGrid>
    </header>
  )
}
