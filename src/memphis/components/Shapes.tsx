import type { CSSProperties } from 'react'
import { cx } from '../../shared/cx'
import type { Sekil, Ton } from '../lib/data'

export const DOLGU: Record<Ton, string> = { sari: 'var(--yellow)', camgobegi: 'var(--teal)', pembe: 'var(--pink)', beyaz: 'var(--paper)', lacivert: 'var(--ink)' }

/**
 * Madde 3 · 6: geometrik primitifler. Hepsi 100×100 görünüm kutusunda, kontur 4px ve ölçekle incelmez
 * (vector-effect: non-scaling-stroke). Dolgu düz renk; gölge istenirse aynı şeklin siyah kopyası sağ alta kayar.
 */
export function Sekil({ tur, ton = 'sari', boyut = 64, golge = false, kontur = true, className, style, title }: { tur: Sekil; ton?: Ton; boyut?: number | string; golge?: boolean; kontur?: boolean; className?: string; style?: CSSProperties; title?: string }) {
  const f = DOLGU[ton]
  const k = kontur ? 'var(--ink)' : 'none'
  const ortak = { vectorEffect: 'non-scaling-stroke' as const, strokeWidth: 4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }
  const cizgi = tur === 'zikzak' || tur === 'dalga'
  const govde = (dx = 0, renk?: string) => {
    const fill = renk ?? f
    const stroke = renk ?? k
    const t = `translate(${dx} ${dx})`
    switch (tur) {
      case 'daire':
        return <circle cx={50} cy={50} r={44} fill={fill} stroke={stroke} transform={t} {...ortak} />
      case 'ucgen':
        return <path d="M50 8 L94 88 L6 88 Z" fill={fill} stroke={stroke} transform={t} {...ortak} />
      case 'kare':
        return <rect x={14} y={14} width={72} height={72} fill={fill} stroke={stroke} transform={`${t} rotate(12 50 50)`} {...ortak} />
      case 'yarim':
        return <path d="M6 70 A44 44 0 0 1 94 70 Z" fill={fill} stroke={stroke} transform={t} {...ortak} />
      case 'arti':
        return <path d="M38 8h24v30h30v24H62v30H38V62H8V38h30z" fill={fill} stroke={stroke} transform={t} {...ortak} />
      case 'silindir':
        return (
          <g transform={t}>
            <path d="M18 24v54a32 12 0 0 0 64 0V24" fill={fill} stroke={stroke} {...ortak} />
            <ellipse cx={50} cy={24} rx={32} ry={12} fill={renk ?? 'var(--paper)'} stroke={stroke} {...ortak} />
          </g>
        )
      case 'zikzak':
        return <path d="M4 66 L20 34 L36 66 L52 34 L68 66 L84 34 L96 58" fill="none" stroke={renk ?? f} transform={t} {...ortak} strokeWidth={cizgi && renk ? 10 : 10} />
      case 'dalga':
        return <path d="M4 50 C16 20 28 20 38 50 S62 80 72 50 S90 20 96 40" fill="none" stroke={renk ?? f} transform={t} {...ortak} strokeWidth={10} />
    }
  }
  return (
    <svg viewBox="-4 -4 112 112" width={boyut} height={boyut} className={cx('shrink-0 overflow-visible', className)} style={style} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true} focusable="false">
      {golge ? govde(6, 'var(--shadow)') : null}
      {cizgi && kontur ? (
        // Çizgi şekillerin konturu: önce kalın lacivert, üstüne ince renkli
        <g>
          {tur === 'zikzak' ? <path d="M4 66 L20 34 L36 66 L52 34 L68 66 L84 34 L96 58" fill="none" stroke="var(--ink)" {...ortak} strokeWidth={18} /> : <path d="M4 50 C16 20 28 20 38 50 S62 80 72 50 S90 20 96 40" fill="none" stroke="var(--ink)" {...ortak} strokeWidth={18} />}
          {govde()}
        </g>
      ) : (
        govde()
      )}
    </svg>
  )
}

/** Konfeti parçası: kısa çubuk, nokta ya da küçük üçgen */
export function Konfeti({ tur, ton, className, style }: { tur: 'cubuk' | 'nokta' | 'ucgen'; ton: Ton; className?: string; style?: CSSProperties }) {
  const f = DOLGU[ton]
  return (
    <svg viewBox="0 0 20 20" width={20} height={20} className={cx('shrink-0 overflow-visible', className)} style={style} aria-hidden="true" focusable="false">
      {tur === 'cubuk' ? <rect x={1} y={7} width={18} height={6} rx={3} fill={f} stroke="var(--ink)" strokeWidth={2.5} /> : tur === 'nokta' ? <circle cx={10} cy={10} r={6} fill={f} stroke="var(--ink)" strokeWidth={2.5} /> : <path d="M10 2 L18 17 H2 Z" fill={f} stroke="var(--ink)" strokeWidth={2.5} strokeLinejoin="round" />}
    </svg>
  )
}
