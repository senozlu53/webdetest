import { cx } from '../../shared/cx'
import { FILIZ, GOVDE, GOZ_X, GOZ_Y, RENK, RUH_AD, YANAK_X, YANAK_Y, YAPRAK, YUZLER, yildizD, yolD, type MaskotRenk, type Ruh } from '../lib/maskot'

const KAHVE = 'var(--brown)'

function Goz({ x, ruh }: { x: number; ruh: Ruh }) {
  const g = YUZLER[ruh].goz
  if (g.tip === 'nokta')
    return (
      <g>
        <circle cx={x} cy={GOZ_Y} r={g.r} fill={KAHVE} />
        <circle cx={x + 2.2} cy={GOZ_Y - 2.4} r={g.r * 0.35} fill="#fff" />
      </g>
    )
  if (g.tip === 'yildiz') return <path d={yildizD(x, GOZ_Y)} fill={KAHVE} stroke={KAHVE} strokeWidth="2.5" strokeLinejoin="round" />
  if (g.tip === 'cizgi') return <path d={`M${x - 7} ${GOZ_Y} Q${x} ${GOZ_Y + 6} ${x + 7} ${GOZ_Y}`} fill="none" stroke={KAHVE} strokeWidth="4.5" strokeLinecap="round" />
  return <path d={`M${x - 7} ${GOZ_Y + 3} Q${x} ${GOZ_Y - 8} ${x + 7} ${GOZ_Y + 3}`} fill="none" stroke={KAHVE} strokeWidth="4.5" strokeLinecap="round" />
}

/**
 * Madde 2 · 9 · 12: gülümseyen maskot. Mochi damlası gövde, tepede filiz, pembe yanaklar.
 * Figma'daki "Maskot" bileşen setinin kod karşılığı: Ruh × Renk varyantları.
 * Yüz (^‿^) fontla değil çizimle: seçilen fontlarda ‿ glifi yok.
 */
export function Mascot({ ruh = 'mutlu', renk = 'peach', boyut = 120, className, etiket }: { ruh?: Ruh; renk?: MaskotRenk; boyut?: number; className?: string; etiket?: string }) {
  const y = YUZLER[ruh]
  const r = RENK[renk]
  const yanak = renk === 'salmon' ? '#E9827C' : '#FFAAA5'
  return (
    <svg viewBox="-92 -100 184 170" width={boyut} height={(boyut * 170) / 184} className={cx('block shrink-0 overflow-visible', className)} role={etiket ? 'img' : undefined} aria-label={etiket} aria-hidden={etiket ? undefined : true} data-maskot={ruh} data-renk={renk}>
      <path d={yolD(FILIZ)} fill="none" stroke={KAHVE} strokeWidth="4" strokeLinecap="round" />
      <path d={yolD(YAPRAK)} fill="#A8E6CF" stroke={KAHVE} strokeWidth="4" strokeLinejoin="round" />
      <path d={yolD(GOVDE)} fill={r.dolgu} stroke={KAHVE} strokeWidth="5" />
      <ellipse cx={-36} cy={-26} rx={11} ry={6} fill="#fff" opacity="0.75" transform="rotate(-30 -36 -26)" />
      <ellipse cx={-YANAK_X} cy={YANAK_Y} rx={9} ry={5.5} fill={yanak} opacity="0.85" />
      <ellipse cx={YANAK_X} cy={YANAK_Y} rx={9} ry={5.5} fill={yanak} opacity="0.85" />
      <g className="goz-kirp">
        <Goz x={-GOZ_X} ruh={ruh} />
        <Goz x={GOZ_X} ruh={ruh} />
      </g>
      {y.kas ? <path d="M-32 -14 Q-26 -20 -17 -19 M32 -14 Q26 -20 17 -19" fill="none" stroke={KAHVE} strokeWidth="3.5" strokeLinecap="round" /> : null}
      <path d={yolD(y.agiz)} fill={y.agizDolu ? '#8A5249' : 'none'} stroke={KAHVE} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      {y.yas ? <path d="M-30 4 C-30 4 -25 11 -25 14 C-25 19.5 -35 19.5 -35 14 C-35 11 -30 4 -30 4 Z" fill="#D5EEF8" stroke="#6FA8C7" strokeWidth="2" /> : null}
      {y.zzz ? <path d="M46 -58 H58 L46 -46 H58 M64 -80 H72 L64 -72 H72" fill="none" stroke={KAHVE} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /> : null}
    </svg>
  )
}

export const maskotEtiket = (ruh: Ruh, renk: MaskotRenk) => `${RUH_AD[ruh]} maskot, ${RENK[renk].ad.toLocaleLowerCase('tr')}`
