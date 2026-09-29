import { useMemo } from 'react'
import { Cizim, type Parca } from './Rough'

export type IkonAd = 'fincan' | 'kalp' | 'yildiz' | 'kalem' | 'ok' | 'ev' | 'zarf' | 'kitap' | 'gunes' | 'yaprak' | 'kamera' | 'ampul' | 'kod' | 'cekirdek' | 'bardak' | 'ara' | 'onay' | 'kapat' | 'ayar' | 'menu' | 'eksi' | 'arti'

const R = 'var(--kirmizi)'
const M = 'var(--murekkep)'

/**
 * Madde 9: 48 birimlik ızgarada, her ikon kendi tohumuyla rough.js'ten geçer; iki aynı ikon aynı titrekliği taşımaz.
 * Hiçbiri simetrik değil, kapalı şekillerin uçları tam birleşmez. Yuvarlak uç (round cap) hepsinde aynı (Madde 12).
 */
const TANIM: Record<IkonAd, { t: number; p: Parca[] }> = {
  fincan: {
    t: 11,
    p: [{ d: 'M9 19 H33 V31 Q33 40 24 40 H18 Q9 40 9 31 Z' }, { d: 'M33 22 Q42 22 42 28 Q42 35 33 35' }, { d: 'M5 44 H37' }, { d: 'M15 6 Q19 10 15 14', renk: R }, { d: 'M22 4 Q26 9 22 13', renk: R }],
  },
  kalp: { t: 5, p: [{ d: 'M24 41 C10 31 5 24 6 17 C7 10 15 7 20 11 C22 13 23 15 24 17 C25 15 27 12 30 10 C36 7 43 11 42 18 C41 25 36 32 24 41 Z', renk: R, dolgu: R, dolguTip: 'hachure', aralik: 5 }] },
  yildiz: { t: 8, p: [{ d: 'M24 5 L29 18 L43 19 L32 28 L36 42 L24 34 L12 42 L16 28 L5 19 L19 18 Z', renk: R }] },
  kalem: { t: 14, p: [{ d: 'M9 39 L11 31 L33 9 L39 15 L17 37 Z' }, { d: 'M11 31 L17 37' }, { d: 'M29 13 L35 19' }, { d: 'M9 39 L11 31 L17 37 Z', renk: R, dolgu: R, dolguTip: 'solid' }] },
  ok: {
    t: 3,
    p: [
      { d: 'M5 30 Q20 22 42 20', renk: M },
      { d: 'M32 11 L42 20 L31 28', renk: M },
    ],
  },
  ev: { t: 21, p: [{ d: 'M6 24 L24 7 L42 24' }, { d: 'M11 21 V41 H37 V21' }, { d: 'M20 41 V30 H28 V41' }] },
  zarf: { t: 33, p: [{ d: 'M5 11 H43 V37 H5 Z' }, { d: 'M5 11 L24 26 L43 11' }] },
  kitap: { t: 6, p: [{ d: 'M24 13 Q15 8 5 10 V38 Q15 36 24 41 Q33 36 43 38 V10 Q33 8 24 13' }, { d: 'M24 13 V41' }] },
  gunes: { t: 17, p: [{ d: 'M14 24 A10 10 0 1 0 34 24 A10 10 0 1 0 14 24', renk: R }, { d: 'M24 3 V8 M24 40 V45 M3 24 H8 M40 24 H45 M9 9 L12.5 12.5 M35.5 35.5 L39 39 M39 9 L35.5 12.5 M12.5 35.5 L9 39' }] },
  yaprak: { t: 40, p: [{ d: 'M8 39 C6 20 18 8 41 7 C41 29 30 42 8 39 Z' }, { d: 'M8 39 L27 20' }] },
  kamera: { t: 9, p: [{ d: 'M5 15 H14 L17 10 H31 L34 15 H43 V38 H5 Z' }, { d: 'M32 26 A8 8 0 1 0 16 26 A8 8 0 1 0 32 26', renk: M }] },
  ampul: { t: 25, p: [{ d: 'M24 5 C15 5 10 12 10 19 C10 25 14 28 16 32 V35 H32 V32 C34 28 38 25 38 19 C38 12 33 5 24 5 Z' }, { d: 'M18 40 H30 M20 44 H28' }] },
  kod: {
    t: 30,
    p: [
      { d: 'M18 12 L6 24 L18 36', renk: M },
      { d: 'M30 12 L42 24 L30 36', renk: M },
      { d: 'M27 8 L21 40', renk: R },
    ],
  },
  cekirdek: { t: 19, p: [{ d: 'M24 5 C37 6 43 20 39 32 C35 43 18 44 10 34 C3 24 11 7 24 5 Z' }, { d: 'M22 9 C30 18 18 28 27 41', renk: R }] },
  bardak: { t: 12, p: [{ d: 'M12 14 H36 L33 42 H15 Z' }, { d: 'M9 14 H39' }, { d: 'M14 22 H34', renk: R }] },
  ara: { t: 23, p: [{ d: 'M32 20 A12 12 0 1 0 8 20 A12 12 0 1 0 32 20' }, { d: 'M29 29 L41 41' }] },
  onay: { t: 7, p: [{ d: 'M8 26 L19 37 L40 12', sw: 4.5 }] },
  kapat: {
    t: 4,
    p: [
      { d: 'M11 11 L37 37', sw: 4.5 },
      { d: 'M37 11 L11 37', sw: 4.5 },
    ],
  },
  ayar: { t: 29, p: [{ d: 'M24 4 V10 M24 38 V44 M4 24 H10 M38 24 H44 M10 10 L14 14 M34 34 L38 38 M38 10 L34 14 M14 34 L10 38' }, { d: 'M31 24 A7 7 0 1 0 17 24 A7 7 0 1 0 31 24' }] },
  eksi: { t: 15, p: [{ d: 'M9 24 Q24 22 39 25', sw: 4.5 }] },
  arti: {
    t: 16,
    p: [
      { d: 'M9 24 Q24 22 39 25', sw: 4.5 },
      { d: 'M24 9 Q26 24 23 39', sw: 4.5 },
    ],
  },
  menu: { t: 2, p: [{ d: 'M8 14 H40' }, { d: 'M8 24 H40' }, { d: 'M8 34 H40' }] },
}

export function Ikon({ ad, boyut = 32, renk, sw = 3, className, etiket, titre, hep, kare = 1 }: { ad: IkonAd; boyut?: number; renk?: string; sw?: number; className?: string; etiket?: string; titre?: boolean; hep?: boolean; kare?: 1 | 3 }) {
  const { t, p } = TANIM[ad]
  const parcalar = useMemo(() => (renk ? p.map((x) => ({ ...x, renk: x.renk === R ? x.renk : renk })) : p), [p, renk])
  return <Cizim w={48} h={48} parcalar={parcalar} tohum={t} sw={sw} kusur={0.9} className={className} style={{ width: boyut, height: boyut }} etiket={etiket} titre={titre} hep={hep} kare={kare} />
}

export const TUM_IKONLAR = Object.keys(TANIM) as IkonAd[]
