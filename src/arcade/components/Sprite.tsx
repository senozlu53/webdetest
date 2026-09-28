import type { CSSProperties } from 'react'
import { cx } from '../../shared/cx'
import { ANIM, png, SPRITE_AD, type AnimAd, type SpriteAd } from '../lib/sprites'

/** 16×16 sprite. buyukluk: bir sprite pikseli kaç sanal piksel (1 → 16u). Hep tam sayı kat (Madde 17) */
export function Sprite({ ad, buyukluk = 1, alt, className, style }: { ad: SpriteAd; buyukluk?: number; alt?: string; className?: string; style?: CSSProperties }) {
  const olcu = `calc(var(--u) * ${16 * buyukluk})`
  return <img src={png(ad)} alt={alt ?? ''} aria-hidden={alt ? undefined : true} width={16} height={16} draggable={false} className={cx('pixelated inline-block shrink-0 align-middle', className)} style={{ width: olcu, height: olcu, ...style }} />
}

/**
 * Madde 16: kare kare sprite animasyonu. Kareler tek bir PNG şeridinde; CSS steps() kareler arasında ara çizmez.
 * oynat=false iken `kare` numaralı kare durur (adım adım gösterim ve hareket kapalı hali).
 */
export function SpriteAnim({ anim, buyukluk = 1, oynat = true, kare = 0, sure, etiket, className }: { anim: AnimAd; buyukluk?: number; oynat?: boolean; kare?: number; sure?: number; etiket?: string; className?: string }) {
  const a = ANIM[anim]
  const olcu = `calc(var(--u) * ${16 * buyukluk})`
  return (
    <span
      role="img"
      aria-label={etiket ?? a.ad}
      className={cx('sprite inline-block shrink-0 align-middle', className)}
      data-oynat={oynat ? '' : undefined}
      style={{ width: olcu, height: olcu, backgroundImage: `url(${png(a.kareler)})`, ['--kare' as string]: a.kareler.length, ['--i' as string]: kare, ['--sure' as string]: `${sure ?? a.sure}ms` } as CSSProperties}
    />
  )
}

export const spriteAdi = (ad: SpriteAd) => SPRITE_AD[ad] ?? ad

/** 8×8 tek renkli piksel ikonlar (arayüz simgeleri). Yazı rengini alır; yazı tipindeki eksik glifler yerine */
const IKON8 = {
  gunes: ['#..#..#.', '.#.#.#..', '..###...', '#######.', '..###...', '.#.#.#..', '#..#..#.', '........'],
  ay: ['..###...', '.##.....', '##......', '##......', '##......', '.##.....', '..###...', '........'],
  menu: ['........', '#######.', '........', '#######.', '........', '#######.', '........', '........'],
  kapat: ['#.....#.', '.#...#..', '..#.#...', '...#....', '..#.#...', '.#...#..', '#.....#.', '........'],
  sol: ['....#...', '...##...', '..###...', '.####...', '..###...', '...##...', '....#...', '........'],
  sag: ['..#.....', '..##....', '..###...', '..####..', '..###...', '..##....', '..#.....', '........'],
  yukari: ['........', '...#....', '..###...', '.#####..', '#######.', '........', '........', '........'],
  asagi: ['........', '#######.', '.#####..', '..###...', '...#....', '........', '........', '........'],
  oynat: ['.#......', '.##.....', '.###....', '.####...', '.###....', '.##.....', '.#......', '........'],
  dur: ['........', '.##.##..', '.##.##..', '.##.##..', '.##.##..', '.##.##..', '........', '........'],
  adim: ['#...#...', '##..#...', '###.#...', '####....', '###.#...', '##..#...', '#...#...', '........'],
  yildiz: ['...#....', '..###...', '#######.', '.#####..', '..###...', '.##.##..', '#.....#.', '........'],
  jeton: ['..###...', '.#...#..', '#..#..#.', '#..#..#.', '#..#..#.', '.#...#..', '..###...', '........'],
  tik: ['........', '......#.', '.....##.', '#...##..', '##.##...', '.###....', '..#.....', '........'],
} as const
export type Ikon8Ad = keyof typeof IKON8

export function Ikon({ ad, buyukluk = 2, className }: { ad: Ikon8Ad; buyukluk?: number; className?: string }) {
  const d = IKON8[ad].flatMap((s, y) => [...s].map((c, x) => (c === '#' ? `M${x} ${y}h1v1h-1z` : ''))).join('')
  const olcu = `calc(var(--u) * ${8 * buyukluk})`
  return (
    <svg viewBox="0 0 8 8" aria-hidden="true" focusable="false" className={cx('inline-block shrink-0', className)} style={{ width: olcu, height: olcu }} shapeRendering="crispEdges">
      <path d={d} fill="currentColor" />
    </svg>
  )
}
