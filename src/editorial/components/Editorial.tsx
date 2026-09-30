import { useId, type CSSProperties, type ElementType, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../shared/cx'

/**
 * <EditorialContainer>: sayfanın 12 kolonlu iskeleti. En çok 1440 piksel + kenar boşlukları;
 * 768 pikselin altında 4 kolon, üstünde 12 kolon. Oluk 16 → 24 → 32 piksel.
 */
export function EditorialContainer({
  as: Tag = 'div',
  izgara = true,
  genis = false,
  kolon = 12,
  className,
  children,
  ...rest
}: {
  as?: ElementType
  /** grid davranışı: kapalıysa yalnız kenar boşluklu bir kap */
  izgara?: boolean
  genis?: boolean
  kolon?: 4 | 12
  className?: string
  children: ReactNode
} & HTMLAttributes<HTMLElement>) {
  const T = Tag as 'div'
  return (
    <T className={cx(genis ? 'w-full' : 'kap', izgara && (kolon === 4 ? 'grid grid-cols-4 gap-x-4' : 'g'), className)} data-editorial-kap="" {...rest}>
      {children}
    </T>
  )
}

/**
 * <MultiColumnLayout>: gazete düzeni. CSS çok sütun (column-count) ve 1 piksellik sütun çizgisi.
 * Sütun sayısı viewport'a değil kapsayıcının genişliğine bağlıdır (kapsayıcı sorgusu): dar kapsayıcıda kendiliğinden tek sütun.
 */
export function MultiColumnLayout({ sutun = 3, kural = true, ilkHarf = false, bosluk, className, children }: { sutun?: 1 | 2 | 3 | 4; kural?: boolean; ilkHarf?: boolean; bosluk?: number; className?: string; children: ReactNode }) {
  const st = { ['--sutun' as string]: sutun, ...(bosluk ? { ['--mk-bosluk' as string]: `${bosluk}px` } : null) } as CSSProperties
  return (
    <div className="mk" data-mk="">
      <div className={cx('mk-ic t-govde', className)} style={st} data-kural={kural ? 'acik' : 'kapali'} data-ilk={ilkHarf ? 'acik' : 'kapali'} data-sutun={sutun}>
        {children}
      </div>
    </div>
  )
}

/** <ArticleHeader>: üst yazı, manşet, dek ve künye satırı. Üstte 2 piksellik koyu çizgi, altta 1 piksellik ince çizgi. */
export function ArticleHeader({ kicker, baslik, dek, imza, dk, seviye = 2, boyut = 't-h1', className }: { kicker?: string; baslik: string; dek?: string; imza?: string; dk?: number; seviye?: 1 | 2 | 3; boyut?: 't-display' | 't-h1' | 't-h2' | 't-h3'; className?: string }) {
  const H = `h${seviye}` as 'h2'
  return (
    <header className={cx('ah', className)} data-article-header="">
      {kicker ? <p className="t-etiket t-soluk mb-4">{kicker}</p> : null}
      <H className={boyut}>{baslik}</H>
      {dek ? <p className="t-dek mt-6 max-w-[38ch]">{dek}</p> : null}
      {imza || dk ? (
        <p className="ah-imza t-alt">
          {imza ? <span>{imza}</span> : null}
          {dk ? <span className="rakam">{dk} dk okuma</span> : null}
        </p>
      ) : null}
    </header>
  )
}

/**
 * Bölüm: 2 piksellik koyu üst çizgi, 1. kolonda küçük künye, 4.–12. kolonda dev başlık, 4.–9. kolonda giriş,
 * 10.–12. kolonda kenar notu. `data-kol` her öğenin hizalandığı kolonu bildirir (hizalama denetimi bunu ölçer).
 */
export function Bolum({ id, no, toplam = 14, madde, baslik, lead, not, children, className }: { id: string; no: string; toplam?: number; madde: string; baslik: string; lead?: ReactNode; not?: ReactNode; children: ReactNode; className?: string }) {
  const hid = useId()
  return (
    <section id={id} aria-labelledby={hid} className={cx('scroll-mt-[9rem] pt-[var(--bolum)]', className)} data-bolum={id}>
      <EditorialContainer>
        <div className="col-span-4 border-t-2 border-metin md:col-span-12" aria-hidden="true" />
        <p className="t-etiket col-span-4 pt-4 md:col-span-3 md:pt-[1.15rem]" data-kol="1">
          <span className="rakam">
            {no} / {String(toplam).padStart(2, '0')}
          </span>
          <span className="t-soluk block">{madde}</span>
        </p>
        <h2 id={hid} className="t-h1 col-span-4 pt-3 md:col-span-9 md:pt-4" data-kol="4">
          {baslik}
        </h2>
        {lead ? (
          <p className="t-dek col-span-4 mt-10 md:col-span-6 md:col-start-4" data-kol="4">
            {lead}
          </p>
        ) : null}
        {not ? (
          <p className="t-alt col-span-4 mt-6 md:col-span-3 md:col-start-10 md:mt-10" data-kol="10">
            {not}
          </p>
        ) : null}
      </EditorialContainer>
      <div className="mt-[calc(var(--bolum)*0.5)]">{children}</div>
    </section>
  )
}
