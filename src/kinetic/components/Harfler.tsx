import { useRef, type CSSProperties, type ElementType } from 'react'
import { cx } from '../../shared/cx'
import { useSaat, useYakinlik } from './hooks'

export type Efekt = 'dalga' | 'imlec' | 'z'

/**
 * Bölünmüş metin: kelime > harf. Ekran okuyucu metni bir kez ve bütün olarak okur (sr-only), harfler aria-hidden.
 * `dalga` ve `z` zaman tabanlı (--t), `imlec` imleç yakınlığı tabanlıdır (--p).
 */
export function Harfler({
  metin,
  efekt = [],
  className,
  as: Tag = 'span',
  vurgulu = [],
  style,
  ad = 'harf',
  uz: uzDis,
}: {
  metin: string
  efekt?: Efekt[]
  className?: string
  as?: ElementType
  /** vurgu rengiyle çizilecek kelime sırası (0'dan) */
  vurgulu?: number[]
  style?: CSSProperties
  ad?: string
  /** en uzun kelimenin harf sayısı; verilmezse metinden hesaplanır (satırlar aynı boyda olsun diye dışarıdan verilir) */
  uz?: number
}) {
  const ref = useRef<HTMLElement>(null)
  const kelimeler = metin.split(' ')
  const uz = uzDis ?? Math.max(...kelimeler.map((k) => [...k].length))
  useSaat(ref, ad, efekt.includes('dalga') || efekt.includes('z'))
  useYakinlik(ref, efekt.includes('imlec'))
  let i = 0
  const T = Tag as 'span'
  return (
    <T ref={ref} className={cx('kh', className)} data-efekt={efekt.length ? efekt.join(' ') : undefined} style={{ ['--uz' as string]: uz, ...style }}>
      <span className="sr-only">{metin}</span>
      <span className="kh-ic" aria-hidden="true">
        {kelimeler.map((k, wi) => (
          <span key={wi}>
            <span className={cx('kw', vurgulu.includes(wi) && 'vurgu')}>
              {[...k].map((ch, ci) => (
                <span key={ci} className="kc" style={{ ['--i' as string]: i++ }}>
                  {ch}
                </span>
              ))}
            </span>
            {wi < kelimeler.length - 1 ? ' ' : null}
          </span>
        ))}
      </span>
    </T>
  )
}

/** Dev başlık: kapsayıcıya sığdırılır (en uzun kelime) ve clamp() ile üstten sınırlanır */
export function Dev({ metin, boy = 'clamp(48px, 14vw, 220px)', efekt = [], vurgulu, className, as, style, ad, uz }: { metin: string; boy?: string; efekt?: Efekt[]; vurgulu?: number[]; className?: string; as?: ElementType; style?: CSSProperties; ad?: string; uz?: number }) {
  return (
    <span className="sigdir">
      <Harfler metin={metin} efekt={efekt} vurgulu={vurgulu} as={as} ad={ad} uz={uz} className={cx('dev dev-boy', className)} style={{ ['--boy' as string]: boy, ...style }} />
    </span>
  )
}
