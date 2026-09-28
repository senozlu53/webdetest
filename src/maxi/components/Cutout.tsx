import { rng } from '../lib/rand'
import { cx } from '../../shared/cx'

const BGS = ['#ffe680', '#ff2e93', '#9ef0c8', '#fff7ee', '#c9b5ff', '#00e5ff', '#ffb59e', '#c8ff00']
const FONTS = ['font-serif italic wonk', 'font-sans [font-stretch:150%] font-black', 'font-mono font-bold', 'font-serif font-black', 'font-sans [font-stretch:60%] font-black', 'font-hand font-bold']

/**
 * Madde 5: fidye notu gibi kesik harfler. Her harf başka font, renk ve eğim.
 * Ekran okuyucu tek bir metin okur (aria-label); harfler gizlidir.
 */
export function Cutout({ text, seed = 3, className, size = 'text-[40px]' }: { text: string; seed?: number; className?: string; size?: string }) {
  const r = rng(seed)
  return (
    <span className={cx('inline-flex flex-wrap items-end gap-x-1 gap-y-1.5', className)} role="img" aria-label={text}>
      {[...text].map((ch, i) =>
        ch === ' ' ? (
          <span key={i} className="w-3" aria-hidden="true" />
        ) : (
          <span
            key={i}
            aria-hidden="true"
            className={cx('tilt inline-block px-1 leading-none text-[#111014] shadow-[2px_2px_0_rgb(17_16_20/0.85)]', FONTS[Math.floor(r() * FONTS.length)], size)}
            style={{ background: BGS[Math.floor(r() * BGS.length)], ['--r' as string]: (r() * 2 - 1).toFixed(2) }}
          >
            {ch}
          </span>
        ),
      )}
    </span>
  )
}
