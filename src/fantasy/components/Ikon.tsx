import type { ReactNode } from 'react'
import { cx } from '../../shared/cx'
import type { IkonAd } from '../lib/data'

const K = '#17110a'

/** Ortak degrade ve kesim tanımları: bir kez sayfaya konur, bütün simgeler `url(#…)` ile kullanır */
export function IkonTanim() {
  const d = (id: string, stops: [number, string][], yatay = false) => (
    <linearGradient key={id} id={id} x1="0" y1="0" x2={yatay ? 1 : 0} y2={yatay ? 0 : 1}>
      {stops.map(([o, c]) => (
        <stop key={o} offset={o} stopColor={c} />
      ))}
    </linearGradient>
  )
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false" data-ikon-tanim="">
      <defs>
        {d('g-altin', [
          [0, '#fff3b0'],
          [0.45, '#d4af37'],
          [1, '#8f7220'],
        ])}
        {d('g-celik', [
          [0, '#f4f7fb'],
          [0.5, '#aeb6c2'],
          [1, '#666f7e'],
        ])}
        {d('g-ahsap', [
          [0, '#a5713b'],
          [0.5, '#6b4423'],
          [1, '#3a240f'],
        ])}
        {d('g-kan', [
          [0, '#ff6a6a'],
          [0.5, '#c40000'],
          [1, '#5a0000'],
        ])}
        {d('g-mana', [
          [0, '#8fceff'],
          [0.5, '#1e90ff'],
          [1, '#0a4590'],
        ])}
        {d('g-parsomen', [
          [0, '#f6ebcb'],
          [1, '#d3bd85'],
        ])}
        {d('g-ates', [
          [0, '#fff2a8'],
          [0.45, '#ff9a1f'],
          [1, '#d2260b'],
        ])}
        {d('g-su', [
          [0, '#c4f3ff'],
          [0.5, '#2aa7e8'],
          [1, '#0b5a96'],
        ])}
        {d('g-toprak', [
          [0, '#b99465'],
          [0.5, '#7d5c36'],
          [1, '#3d2a17'],
        ])}
        {d('g-elektrik', [
          [0, '#fffbd0'],
          [0.5, '#ffd23f'],
          [1, '#e29a00'],
        ])}
        {d('g-mor', [
          [0, '#ecd2ff'],
          [0.5, '#a55bff'],
          [1, '#4b1d8f'],
        ])}
        {d('g-kitap', [
          [0, '#7a2a8f'],
          [1, '#2e0f3d'],
        ])}
        <clipPath id="k-iksir">
          <path d="M24 24 C15 30 13 41 19 50 C24 58 40 58 45 50 C51 41 49 30 40 24 Z" />
        </clipPath>
      </defs>
    </svg>
  )
}

const kalem = { stroke: K, strokeWidth: 1.6, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }

const iksir = (sivi: string) => (
  <>
    <path d="M24 24 C15 30 13 41 19 50 C24 58 40 58 45 50 C51 41 49 30 40 24 Z" fill="#ffffff" fillOpacity=".14" />
    <g clipPath="url(#k-iksir)">
      <path d={`M8 38 Q16 33 24 38 T40 38 T56 38 V62 H8 Z`} fill={`url(#${sivi})`} />
    </g>
    <path d="M24 24 C15 30 13 41 19 50 C24 58 40 58 45 50 C51 41 49 30 40 24 Z" fill="none" {...kalem} />
    <rect x="27" y="12" width="10" height="13" fill="#ffffff" fillOpacity=".2" {...kalem} />
    <rect x="25" y="22" width="14" height="4" rx="1" fill="url(#g-altin)" {...kalem} />
    <path d="M26 6 H38 L37 13 H27 Z" fill="url(#g-ahsap)" {...kalem} />
    <ellipse cx="24" cy="42" rx="2.6" ry="7" fill="#fff" fillOpacity=".4" transform="rotate(18 24 42)" />
    <circle cx="39" cy="46" r="1.6" fill="#fff" fillOpacity=".5" />
  </>
)

const ICERIK: Record<IkonAd, ReactNode> = {
  kilic: (
    <>
      <path d="M32 3 L39 11 V41 H25 V11 Z" fill="url(#g-celik)" {...kalem} />
      <path d="M32 6 V41" stroke="#fff" strokeOpacity=".7" strokeWidth="1.4" />
      <path d="M32 6 L34 10 V41 H32 Z" fill="#000" fillOpacity=".12" />
      <path d="M12 41 H52 L50 47 H14 Z" fill="url(#g-altin)" {...kalem} />
      <rect x="29" y="47" width="6" height="9" fill="url(#g-ahsap)" {...kalem} strokeWidth="1.4" />
      <path d="M29 50H35M29 53H35" stroke={K} strokeWidth="1" opacity=".6" />
      <circle cx="32" cy="59" r="4" fill="url(#g-altin)" {...kalem} strokeWidth="1.4" />
    </>
  ),
  kalkan: (
    <>
      <path d="M32 3 L55 11 V30 C55 45 45 55 32 61 C19 55 9 45 9 30 V11 Z" fill="url(#g-altin)" {...kalem} />
      <path d="M32 9 L49 15 V30 C49 41 42 49 32 54 C22 49 15 41 15 30 V15 Z" fill="url(#g-kan)" {...kalem} strokeWidth="1.3" />
      <path d="M30 19 H34 V28 H43 V32 H34 V46 H30 V32 H21 V28 H30 Z" fill="url(#g-altin)" {...kalem} strokeWidth="1.1" />
      <path d="M15 15 L32 9 V54 C22 49 15 41 15 30Z" fill="#fff" fillOpacity=".1" />
    </>
  ),
  'iksir-kan': iksir('g-kan'),
  'iksir-mana': iksir('g-mana'),
  parsomen: (
    <>
      <path d="M16 10 H48 V50 H16 Z" fill="url(#g-parsomen)" {...kalem} />
      <path d="M22 20H42M22 26H42M22 32H37M22 38H41" stroke="#5a3d1a" strokeWidth="1.7" strokeLinecap="round" />
      <rect x="11" y="6" width="42" height="8" rx="4" fill="url(#g-parsomen)" {...kalem} />
      <rect x="11" y="46" width="42" height="8" rx="4" fill="url(#g-parsomen)" {...kalem} />
      {[
        [11, 10],
        [53, 10],
        [11, 50],
        [53, 50],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="3.6" fill="url(#g-altin)" {...kalem} strokeWidth="1.2" />
      ))}
      <circle cx="44" cy="43" r="7" fill="url(#g-kan)" {...kalem} strokeWidth="1.3" />
      <path d="M44 39 L45.3 42 L48.5 42.2 L46 44.2 L46.8 47.3 L44 45.6 L41.2 47.3 L42 44.2 L39.5 42.2 L42.7 42Z" fill="#ffd9d9" fillOpacity=".85" />
    </>
  ),
  sandik: (
    <>
      <rect x="6" y="30" width="52" height="26" rx="2" fill="url(#g-ahsap)" {...kalem} />
      <path d="M6 39H58M6 47H58" stroke={K} strokeOpacity=".35" strokeWidth="1" />
      <path d="M6 30 V22 C6 13 17 9 32 9 C47 9 58 13 58 22 V30 Z" fill="url(#g-ahsap)" {...kalem} />
      <path d="M10 22 C14 15 24 12 32 12" stroke="#fff" strokeOpacity=".28" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <rect x="14" y="10" width="6" height="46" fill="url(#g-celik)" {...kalem} strokeWidth="1.3" />
      <rect x="44" y="10" width="6" height="46" fill="url(#g-celik)" {...kalem} strokeWidth="1.3" />
      <path d="M25 27 H39 V40 H25 Z" fill="url(#g-altin)" {...kalem} />
      <circle cx="32" cy="32" r="2.4" fill={K} />
      <path d="M30.6 33 H33.4 L34.4 38 H29.6 Z" fill={K} />
      {[
        [17, 15],
        [47, 15],
        [17, 51],
        [47, 51],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="1.3" fill="#fff" fillOpacity=".7" />
      ))}
    </>
  ),
  ates: (
    <>
      <path d="M32 3 C35 13 47 19 47 35 C47 47 40 59 32 59 C23 59 17 48 17 38 C17 30 21 25 25 19 C26 27 29 29 32 30 C35 21 30 12 32 3 Z" fill="url(#g-ates)" {...kalem} />
      <path d="M32 30 C36 36 40 40 40 46 C40 53 36 57 32 57 C28 57 24 53 24 47 C24 41 29 38 32 30 Z" fill="#ffe9a0" fillOpacity=".92" />
    </>
  ),
  su: (
    <>
      <path d="M32 4 C30 13 14 28 14 41 C14 51 22 59 32 59 C42 59 50 51 50 41 C50 28 34 13 32 4 Z" fill="url(#g-su)" {...kalem} />
      <path d="M22 42 C22 47 25 51 29 52" stroke="#fff" strokeOpacity=".75" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="26" cy="36" r="2" fill="#fff" fillOpacity=".8" />
    </>
  ),
  toprak: (
    <>
      <path d="M4 56 L22 24 L30 36 L40 14 L60 56 Z" fill="url(#g-toprak)" {...kalem} />
      <path d="M40 14 L46.5 26 L40 23.5 L36 30 Z" fill="#fff" fillOpacity=".88" />
      <path d="M22 24 L26.5 31.5 L21 30 L17.5 34 Z" fill="#fff" fillOpacity=".8" />
      <path d="M4 56 H60" stroke={K} strokeWidth="2" strokeLinecap="round" />
      <path d="M12 56 L20 44 L24 50 L30 44 L40 56Z" fill="#000" fillOpacity=".16" />
    </>
  ),
  yildirim: (
    <>
      <path d="M37 3 L13 36 H28 L23 61 L51 25 H35 Z" fill="url(#g-elektrik)" {...kalem} />
      <path d="M36 8 L20 33 H31 L28 50" stroke="#fff" strokeOpacity=".65" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </>
  ),
  anahtar: (
    <>
      <path d="M29 29 L55 55" stroke={K} strokeWidth="8.5" strokeLinecap="round" />
      <path d="M29 29 L55 55" stroke="url(#g-altin)" strokeWidth="5" strokeLinecap="round" />
      <path d="M44 44 L50 38 M50 50 L56 44" stroke={K} strokeWidth="7" strokeLinecap="round" />
      <path d="M44 44 L50 38 M50 50 L56 44" stroke="url(#g-altin)" strokeWidth="3.6" strokeLinecap="round" />
      <circle cx="21" cy="21" r="12" fill="none" stroke={K} strokeWidth="9.5" />
      <circle cx="21" cy="21" r="12" fill="none" stroke="url(#g-altin)" strokeWidth="6" />
      <circle cx="21" cy="21" r="4.5" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="1.4" />
    </>
  ),
  altin: (
    <>
      <circle cx="32" cy="32" r="25" fill="url(#g-altin)" {...kalem} />
      <circle cx="32" cy="32" r="19" fill="none" stroke="#8f7220" strokeWidth="2" />
      <path d="M20 40 L23 26 L28 33 L32 24 L36 33 L41 26 L44 40 Z" fill="#8f7220" stroke={K} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M16 20 C20 12 28 8 36 8" stroke="#fff" strokeOpacity=".7" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </>
  ),
  mucevher: (
    <>
      <path d="M18 12 H46 L58 26 L32 58 L6 26 Z" fill="url(#g-mor)" {...kalem} />
      <path d="M6 26 H58 M18 12 L24 26 L32 12 L40 26 L46 12 M24 26 L32 58 L40 26" stroke="#fff" strokeOpacity=".55" strokeWidth="1.2" fill="none" strokeLinejoin="round" />
      <path d="M18 12 L24 26 L6 26 Z" fill="#fff" fillOpacity=".22" />
      <path d="M32 12 L40 26 L24 26 Z" fill="#fff" fillOpacity=".12" />
    </>
  ),
  migfer: (
    <>
      <path d="M32 11 C26 3 37 -1 45 6 C41 8 38 11 32 11 Z" fill="url(#g-kan)" {...kalem} strokeWidth="1.3" transform="translate(0 3)" />
      <path d="M10 44 C10 24 20 12 32 12 C44 12 54 24 54 44 V56 H43 V48 H21 V56 H10 Z" fill="url(#g-celik)" {...kalem} />
      <rect x="20" y="32" width="24" height="6" rx="2" fill="#0d0d12" />
      <path d="M32 12 V29" stroke="#fff" strokeOpacity=".6" strokeWidth="1.6" />
      <path d="M13 40 C13 28 18 18 26 15" stroke="#fff" strokeOpacity=".4" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </>
  ),
  kitap: (
    <>
      <path d="M12 8 H50 V56 H12 Z" fill="url(#g-kitap)" {...kalem} />
      <rect x="12" y="8" width="6" height="48" fill="#1a0826" {...kalem} strokeWidth="1.2" />
      <rect x="20" y="13" width="26" height="38" fill="none" stroke="url(#g-altin)" strokeWidth="2" />
      <path d="M33 19 L35.6 27 L44 27 L37.2 32 L39.8 40 L33 35 L26.2 40 L28.8 32 L22 27 L30.4 27 Z" fill="url(#g-altin)" {...kalem} strokeWidth="1.1" />
      <rect x="44" y="28" width="8" height="8" rx="1.5" fill="url(#g-altin)" {...kalem} strokeWidth="1.2" />
    </>
  ),
  asa: (
    <>
      <path d="M13 59 L43 23" stroke={K} strokeWidth="8" strokeLinecap="round" />
      <path d="M13 59 L43 23" stroke="url(#g-ahsap)" strokeWidth="4.6" strokeLinecap="round" />
      <path d="M36 25 C33 15 39 8 46 6 M57 25 C60 15 53 8 46 6" stroke={K} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M36 25 C33 15 39 8 46 6 M57 25 C60 15 53 8 46 6" stroke="url(#g-altin)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="46.5" cy="18" r="9.5" fill="url(#g-mana)" {...kalem} />
      <ellipse cx="43.5" cy="14.5" rx="3" ry="2" fill="#fff" fillOpacity=".7" transform="rotate(-30 43.5 14.5)" />
    </>
  ),
  yay: (
    <>
      <path d="M18 5 C50 13 50 51 18 59" stroke={K} strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M18 5 C50 13 50 51 18 59" stroke="url(#g-ahsap)" strokeWidth="4.6" fill="none" strokeLinecap="round" />
      <path d="M18 5 V59" stroke="#e9ddb8" strokeWidth="1.5" />
      <path d="M8 32 H55" stroke={K} strokeWidth="3.6" strokeLinecap="round" />
      <path d="M8 32 H55" stroke="#cbbfa3" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M58 32 L49 26 V38 Z" fill="url(#g-celik)" {...kalem} strokeWidth="1.3" />
      <path d="M8 32 L14 27 M8 32 L14 37 M12 32 L18 27 M12 32 L18 37" stroke="url(#g-kan)" strokeWidth="2.2" strokeLinecap="round" />
    </>
  ),
}

/** Madde 9: detaylı vektörel oyun ikonları. Süstür: ekran okuyucudan gizli; tek başına anlam taşıyorsa `baslik` verilir. */
export function Ikon({ ad, boy = 48, baslik, className }: { ad: IkonAd; boy?: number | string; baslik?: string; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" width={boy} height={boy} className={cx('oyun-ikon', className)} data-ikon={ad} role={baslik ? 'img' : undefined} aria-label={baslik} aria-hidden={baslik ? undefined : 'true'} focusable="false">
      {ICERIK[ad]}
    </svg>
  )
}
