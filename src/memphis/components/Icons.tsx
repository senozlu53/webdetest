import { cx } from '../../shared/cx'

/**
 * Madde 9: soyut, kalın kontürlü, içi düz renkli kaba ikonlar. 48×48 ızgara, kontur 4.
 * Her ikon iki katman: renkli dolgu şekli + lacivert kontur. Ayrıntı yok, köşeler yuvarlak.
 */
type Parca = { d: string; f?: 'sari' | 'camgobegi' | 'pembe' | 'beyaz' | 'yok' }
const R = { sari: 'var(--yellow)', camgobegi: 'var(--teal)', pembe: 'var(--pink)', beyaz: 'var(--paper)', yok: 'none' }

export const IKONLAR: Record<string, { ad: string; p: Parca[] }> = {
  ev: { ad: 'Ana sayfa', p: [{ d: 'M8 22 L24 8 L40 22 V40 H8 Z', f: 'sari' }, { d: 'M19 40 V28 H29 V40', f: 'pembe' }] },
  bilet: { ad: 'Bilet', p: [{ d: 'M6 14 H42 V20 A4 4 0 0 0 42 28 V34 H6 V28 A4 4 0 0 0 6 20 Z', f: 'pembe' }, { d: 'M20 14 V34', f: 'yok' }] },
  takvim: { ad: 'Takvim', p: [{ d: 'M7 12 H41 V41 H7 Z', f: 'beyaz' }, { d: 'M7 12 H41 V21 H7 Z', f: 'camgobegi' }, { d: 'M16 7 V15 M32 7 V15', f: 'yok' }] },
  konum: { ad: 'Konum', p: [{ d: 'M24 43 C14 31 10 25 10 19 A14 14 0 0 1 38 19 C38 25 34 31 24 43 Z', f: 'pembe' }, { d: 'M24 13 A6 6 0 1 1 23.9 13 Z', f: 'beyaz' }] },
  nota: { ad: 'Müzik', p: [{ d: 'M18 34 V10 L38 6 V30', f: 'yok' }, { d: 'M12 34 A6 5 0 1 0 24 34 A6 5 0 1 0 12 34 Z', f: 'sari' }, { d: 'M32 30 A6 5 0 1 0 44 30 A6 5 0 1 0 32 30 Z', f: 'camgobegi' }] },
  kalem: { ad: 'Tasarım', p: [{ d: 'M10 38 L12 30 L32 10 L38 16 L18 36 Z', f: 'sari' }, { d: 'M28 14 L34 20', f: 'yok' }] },
  kitap: { ad: 'Ders', p: [{ d: 'M6 10 C14 8 20 9 24 13 C28 9 34 8 42 10 V38 C34 36 28 37 24 41 C20 37 14 36 6 38 Z', f: 'camgobegi' }, { d: 'M24 13 V41', f: 'yok' }] },
  ampul: { ad: 'Fikir', p: [{ d: 'M24 6 A13 13 0 0 1 32 29 V34 H16 V29 A13 13 0 0 1 24 6 Z', f: 'sari' }, { d: 'M17 40 H31', f: 'yok' }] },
  sohbet: { ad: 'Sohbet', p: [{ d: 'M6 10 H42 V32 H22 L12 40 V32 H6 Z', f: 'pembe' }, { d: 'M14 21 H34', f: 'yok' }] },
  yildiz: { ad: 'Favori', p: [{ d: 'M24 5 L29 18 L43 18 L32 27 L36 41 L24 33 L12 41 L16 27 L5 18 L19 18 Z', f: 'sari' }] },
  kamera: { ad: 'Fotoğraf', p: [{ d: 'M6 16 H14 L18 10 H30 L34 16 H42 V38 H6 Z', f: 'camgobegi' }, { d: 'M24 18 A8 8 0 1 1 23.9 18 Z', f: 'beyaz' }] },
  kupa: { ad: 'Ödül', p: [{ d: 'M14 8 H34 V18 A10 10 0 0 1 14 18 Z', f: 'sari' }, { d: 'M24 28 V36 M16 40 H32', f: 'yok' }] },
}

export function Ikon({ ad, boyut = 48, className, etiket }: { ad: keyof typeof IKONLAR; boyut?: number; className?: string; etiket?: string }) {
  const i = IKONLAR[ad]
  return (
    <svg viewBox="0 0 48 48" width={boyut} height={boyut} className={cx('shrink-0', className)} role={etiket ? 'img' : undefined} aria-label={etiket} aria-hidden={etiket ? undefined : true} focusable="false">
      {i.p.map((p, k) => (
        <path key={k} d={p.d} fill={R[p.f ?? 'yok']} stroke="var(--ink)" strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  )
}

/** Arayüz simgeleri: tek renkli, kalın çizgi (yazı tipinde ok ve tik glifi yok) */
const UI = {
  ok: 'M5 12 H19 M13 6 L19 12 L13 18',
  geri: 'M19 12 H5 M11 6 L5 12 L11 18',
  tik: 'M4 12 L10 18 L20 6',
  kapat: 'M6 6 L18 18 M18 6 L6 18',
  karistir: 'M4 7 H8 C13 7 11 17 16 17 H20 M17 14 L20 17 L17 20 M4 17 H8 C10 17 10.5 15 11.2 13.5 M13 10 C13.8 8.4 14.6 7 16 7 H20 M17 4 L20 7 L17 10',
  ayar: 'M4 7 H20 M4 17 H20 M9 4 V10 M15 14 V20',
  arti: 'M12 5 V19 M5 12 H19',
  eksi: 'M5 12 H19',
  oynat: 'M8 5 L19 12 L8 19 Z',
  durdur: 'M8 5 V19 M16 5 V19',
} as const
export function UiIkon({ ad, boyut = 20, className }: { ad: keyof typeof UI; boyut?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={boyut} height={boyut} className={cx('shrink-0', className)} aria-hidden="true" focusable="false">
      <path d={UI[ad]} fill={ad === 'oynat' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
