import type { CSSProperties } from 'react'
import { cx } from '../../shared/cx'
import { Katmanlar } from './Ikon'
import type { Kat } from '../lib/simge'

const f = (n: number) => Math.round(n * 10) / 10
const daire = (cx0: number, cy: number, r: number) => `M${f(cx0 - r)} ${f(cy)}a${r} ${r} 0 1 0 ${f(2 * r)} 0a${r} ${r} 0 1 0 ${f(-2 * r)} 0Z`

/** El boyaması karakter: Bilge Baykuş. Viewbox 200×230; saydam pigment katmanları */
const BAYKUS: Kat[] = [
  // dal
  { d: 'M6 204C50 194 140 196 196 184L197 194C142 208 52 212 6 214Z', p: 'murekkep', o: 0.42 },
  { d: 'M150 196C160 186 174 184 184 188C176 192 164 196 150 196ZM30 208C24 200 14 198 8 200C14 206 22 208 30 208Z', p: 'yesil', o: 0.8 },
  // kulak tüyleri
  { d: 'M56 64L46 24L88 50Z', p: 'ultramarin', o: 0.75 },
  { d: 'M144 64L154 24L112 50Z', p: 'ultramarin', o: 0.75 },
  // gövde
  { d: 'M100 40C144 40 168 86 168 136C168 176 140 202 100 202C60 202 32 176 32 136C32 86 56 40 100 40Z', p: 'ultramarin', o: 0.7 },
  { d: 'M100 52C132 52 152 88 152 130C152 164 130 188 100 188C70 188 48 164 48 130C48 88 68 52 100 52Z', p: 'ultramarin', o: 0.3 },
  // karın
  { d: 'M100 92C126 92 144 120 144 152C144 178 126 194 100 194C74 194 56 178 56 152C56 120 74 92 100 92Z', p: 'kagit', o: 0.72 },
  { d: 'M100 92C126 92 144 120 144 152C144 178 126 194 100 194C74 194 56 178 56 152C56 120 74 92 100 92Z', p: 'ocre', o: 0.3 },
  { d: 'M100 104C118 104 130 124 130 148C130 166 118 178 100 178C82 178 70 166 70 148C70 124 82 104 100 104Z', p: 'ocre', o: 0.28 },
  // göğüs tüyleri (koyu darbeler)
  { d: 'M84 130Q90 140 96 130ZM104 130Q110 140 116 130ZM94 146Q100 156 106 146ZM78 150Q84 160 90 150ZM110 150Q116 160 122 150Z', p: 'gul', o: 0.6 },
  // kanatlar
  { d: 'M40 108C20 132 22 172 50 190C54 162 56 132 60 110Z', p: 'ultramarin', o: 0.62 },
  { d: 'M160 108C180 132 178 172 150 190C146 162 144 132 140 110Z', p: 'ultramarin', o: 0.62 },
  // gözler
  { d: daire(74, 86, 24) + daire(126, 86, 24), p: 'ocre', o: 0.8 },
  { d: daire(74, 86, 15) + daire(126, 86, 15), p: 'kagit', o: 0.95 },
  { d: daire(77, 88, 8) + daire(123, 88, 8), p: 'murekkep', o: 0.9 },
  { d: daire(79.5, 85, 2.4) + daire(125.5, 85, 2.4), p: 'kagit', o: 0.95 },
  // gaga
  { d: 'M100 94L90 112L100 128L110 112Z', p: 'gul', o: 0.88 },
  // ayaklar
  { d: 'M84 200L82 208L88 208L90 200ZM110 200L112 208L118 208L116 200Z', p: 'ocre', o: 0.75 },
]

export function Baykus({ className, style, etiket = 'Bilge Baykuş, suluboya karakter' }: { className?: string; style?: CSSProperties; etiket?: string }) {
  return (
    <svg viewBox="0 0 200 230" className={cx('block overflow-visible', className)} style={style} role="img" aria-label={etiket} data-karakter="baykus">
      <g filter="url(#wc-orta)">
        <Katmanlar katmanlar={BAYKUS} />
      </g>
    </svg>
  )
}

/** Sahne: dört sayfa için el boyaması manzara (Sayfa geçişi demosu ve hero) */
export type SahneAd = 'orman' | 'nehir' | 'aksam' | 'gece'
const SAHNELER: Record<SahneAd, Kat[]> = {
  orman: [
    { d: 'M0 130C60 110 140 120 220 104C300 88 380 108 460 96V260H0Z', p: 'yesil', o: 0.7 },
    { d: 'M0 170C80 150 180 172 280 152C360 138 420 160 460 150V260H0Z', p: 'yesil', o: 0.6 },
    { d: 'M60 130C60 90 92 66 120 84C130 46 176 40 190 76C214 64 236 88 226 114C240 130 226 150 200 144C186 160 150 160 132 144C104 156 66 152 60 130Z', p: 'yesil', o: 0.55 },
    { d: 'M126 140L130 190H142L146 140Z', p: 'murekkep', o: 0.4 },
    { d: 'M0 0H460V96C380 80 300 100 220 90C140 80 60 94 0 84Z', p: 'ultramarin', o: 0.28 },
  ],
  nehir: [
    { d: 'M0 90C80 70 160 100 240 80C320 60 400 84 460 70V150H0Z', p: 'yesil', o: 0.55 },
    { d: 'M-10 150C90 130 150 190 260 170C340 156 400 200 470 180V260H-10Z', p: 'ultramarin', o: 0.72 },
    { d: 'M20 190C100 176 160 214 250 198C320 186 380 212 440 206V250H20Z', p: 'ultramarin', o: 0.45 },
    { d: 'M0 0H460V80C380 62 300 84 220 72C140 60 60 80 0 70Z', p: 'ultramarin', o: 0.22 },
    { d: 'M300 40C312 30 340 30 352 40C364 32 388 38 384 48H296C290 46 292 42 300 40Z', p: 'kagit', o: 0.8 },
  ],
  aksam: [
    { d: 'M0 0H460V150H0Z', p: 'ocre', o: 0.4 },
    { d: 'M0 60H460V150H0Z', p: 'gul', o: 0.4 },
    { d: 'M330 110a44 44 0 1 0 88 0a44 44 0 1 0-88 0Z', p: 'gul', o: 0.7 },
    { d: 'M0 150C70 126 150 154 230 138C310 122 390 152 460 136V260H0Z', p: 'ultramarin', o: 0.55 },
    { d: 'M0 190C90 172 170 200 260 186C340 174 400 196 460 188V260H0Z', p: 'ultramarin', o: 0.42 },
  ],
  gece: [
    { d: 'M0 0H460V260H0Z', p: 'ultramarin', o: 0.62 },
    { d: 'M0 0H460V130C380 110 300 140 220 124C140 108 60 136 0 120Z', p: 'ultramarin', o: 0.4 },
    { d: 'M330 60a34 34 0 1 0 68 0a34 34 0 1 0-68 0Z', p: 'ocre', o: 0.9 },
    { d: 'M318 60a44 44 0 1 0 88 0a44 44 0 1 0-88 0Z', p: 'ocre', o: 0.3 },
    { d: 'M0 200C90 180 170 210 260 196C340 184 400 206 460 198V260H0Z', p: 'yesil', o: 0.5 },
    { d: 'M60 40a3 3 0 1 0 6 0a3 3 0 1 0-6 0ZM120 70a2.4 2.4 0 1 0 4.8 0a2.4 2.4 0 1 0-4.8 0ZM200 30a3.2 3.2 0 1 0 6.4 0a3.2 3.2 0 1 0-6.4 0ZM260 80a2.4 2.4 0 1 0 4.8 0a2.4 2.4 0 1 0-4.8 0ZM90 100a2 2 0 1 0 4 0a2 2 0 1 0-4 0Z', p: 'kagit', o: 0.95 },
  ],
}
export function Sahne({ ad, className }: { ad: SahneAd; className?: string }) {
  return (
    <svg viewBox="0 0 460 260" preserveAspectRatio="xMidYMid slice" className={cx('block size-full', className)} aria-hidden="true" data-sahne={ad}>
      <g filter="url(#wc-sahne)" style={{ opacity: 'calc(0.55 + 0.45 * var(--su))' }}>
        <Katmanlar katmanlar={SAHNELER[ad]} />
      </g>
    </svg>
  )
}
