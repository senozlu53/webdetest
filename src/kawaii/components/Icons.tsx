import type { ReactNode } from 'react'
import { cx } from '../../shared/cx'
import { yildizD } from '../lib/maskot'

/**
 * Madde 9: kalın çizgili (3,5px / 48 birim), içinde küçük gülen yüz taşıyan ikonlar.
 * Birden fazla şekilden oluşan ikonlar "birleşik" çizilir: önce kalın kahverengi kontur, üstüne aynı şekiller dolgu,
 * böylece iç kesişim çizgileri kaybolur ve tek parça oyuncak gibi durur.
 */
export type IkonAd = 'yildiz' | 'kalp' | 'bulut' | 'damla' | 'cicek' | 'elma' | 'kitap' | 'kemik' | 'top' | 'ay' | 'ates' | 'ampul' | 'mama' | 'ayar' | 'kapat' | 'onay' | 'ok' | 'yukari' | 'ses' | 'yenile' | 'kilit'

const K = 'var(--brown)'
const W = 3.5

function Yuz({ x, y, ruh = 'mutlu', olcek = 1 }: { x: number; y: number; ruh?: 'mutlu' | 'uzgun' | 'uykulu'; olcek?: number }) {
  const g = 5 * olcek
  return (
    <g stroke={K} strokeWidth={2.6 * olcek} strokeLinecap="round" fill="none">
      {ruh === 'uykulu' ? (
        <path d={`M${x - g - 2.2} ${y} q2.2 2 4.4 0 M${x + g - 2.2} ${y} q2.2 2 4.4 0`} />
      ) : (
        <>
          <circle cx={x - g} cy={y} r={1.9 * olcek} fill={K} stroke="none" />
          <circle cx={x + g} cy={y} r={1.9 * olcek} fill={K} stroke="none" />
        </>
      )}
      {ruh === 'uzgun' ? <path d={`M${x - 3.2 * olcek} ${y + 6 * olcek} Q${x} ${y + 3 * olcek} ${x + 3.2 * olcek} ${y + 6 * olcek}`} /> : <path d={`M${x - 3.4 * olcek} ${y + 3.6 * olcek} Q${x} ${y + 7.4 * olcek} ${x + 3.4 * olcek} ${y + 3.6 * olcek}`} />}
    </g>
  )
}

/** Birleşik şekil: kontur altta, dolgu üstte */
function Bir({ renk, children }: { renk: string; children: ReactNode }) {
  return (
    <>
      <g fill={K} stroke={K} strokeWidth={W * 2} strokeLinejoin="round">
        {children}
      </g>
      <g fill={renk}>{children}</g>
    </>
  )
}

const P = {
  peach: '#FFD3B6',
  mint: '#A8E6CF',
  salmon: '#FFAAA5',
  rose: '#D4A5A5',
  paper: '#FFFFFF',
}

function ciz(ad: IkonAd, renk: string | undefined, ruh: 'mutlu' | 'uzgun' | 'uykulu', yuz: boolean): ReactNode {
  const tek = (d: string, r: string, fx: number, fy: number) => (
    <>
      <path d={d} fill={renk ?? r} stroke={K} strokeWidth={W} strokeLinejoin="round" />
      {yuz ? <Yuz x={fx} y={fy} ruh={ruh} /> : null}
    </>
  )
  switch (ad) {
    case 'yildiz':
      return tek(yildizD(24, 26, 21, 10.5), P.peach, 24, 27)
    case 'kalp':
      return tek('M24 41 C10 32 5 25 5 17.5 C5 10.5 10 6 15.5 6 C19.5 6 22.5 8.5 24 11.5 C25.5 8.5 28.5 6 32.5 6 C38 6 43 10.5 43 17.5 C43 25 38 32 24 41 Z', P.salmon, 24, 20)
    case 'bulut':
      return tek('M13 38 C7 38 4 34 4 29.5 C4 25 7.5 22 11.5 22 C12 15 17 10 24 10 C31 10 36 15 36.5 21 C41 21 44 25 44 29.5 C44 34 41 38 36 38 Z', P.paper, 24, 27)
    case 'damla':
      return tek('M24 5 C24 5 38 21 38 30 C38 38 31.5 43 24 43 C16.5 43 10 38 10 30 C10 21 24 5 24 5 Z', P.mint, 24, 30)
    case 'ates':
      return tek('M24 43 C14 43 9 36 9 29 C9 20 16 16 17 7 C22 11 24 15 24 20 C26 17 27 15 27 11 C34 16 39 23 39 30 C39 37 33 43 24 43 Z', P.salmon, 24, 31)
    case 'elma':
      return (
        <>
          <path d="M24 14 C24 10 25.5 7 28 5" fill="none" stroke={K} strokeWidth={W} strokeLinecap="round" />
          <path d="M26 10 C28 5 34 5 36 7 C34 11 29 12 26 10 Z" fill={P.mint} stroke={K} strokeWidth={3} strokeLinejoin="round" />
          {tek('M24 15 C18 10 7 11 7 24 C7 35 14 43 20.5 43 C22.5 43 24 42 24 42 C24 42 25.5 43 27.5 43 C34 43 41 35 41 24 C41 11 30 10 24 15 Z', P.salmon, 24, 27)}
        </>
      )
    case 'kitap':
      return (
        <>
          <rect x="7" y="8" width="34" height="32" rx="9" fill={renk ?? P.mint} stroke={K} strokeWidth={W} />
          <path d="M14 8 V40" stroke={K} strokeWidth={W} />
          {yuz ? <Yuz x={27.5} y={22} ruh={ruh} /> : null}
        </>
      )
    case 'cicek':
      return (
        <>
          <Bir renk={renk ?? P.salmon}>
            {[0, 72, 144, 216, 288].map((a) => (
              <circle key={a} cx={24 + Math.cos(((a - 90) * Math.PI) / 180) * 12} cy={24 + Math.sin(((a - 90) * Math.PI) / 180) * 12} r="8.5" />
            ))}
          </Bir>
          <circle cx="24" cy="24" r="9.5" fill={P.peach} stroke={K} strokeWidth={W} />
          {yuz ? <Yuz x={24} y={22.5} ruh={ruh} olcek={0.8} /> : null}
        </>
      )
    case 'kemik':
      return (
        <>
          <Bir renk={renk ?? P.paper}>
            <rect x="11" y="18" width="26" height="12" rx="6" />
            <circle cx="11" cy="17.5" r="6.5" />
            <circle cx="11" cy="30.5" r="6.5" />
            <circle cx="37" cy="17.5" r="6.5" />
            <circle cx="37" cy="30.5" r="6.5" />
          </Bir>
          {yuz ? <Yuz x={24} y={22} ruh={ruh} olcek={0.8} /> : null}
        </>
      )
    case 'top':
      return (
        <>
          <circle cx="24" cy="24" r="18" fill={renk ?? P.mint} stroke={K} strokeWidth={W} />
          <path d="M8 18 C16 22 32 22 40 18 M8.5 31 C16 27 32 27 39.5 31" fill="none" stroke={K} strokeWidth="2.6" strokeLinecap="round" opacity="0.55" />
          {yuz ? <Yuz x={24} y={23} ruh={ruh} /> : null}
        </>
      )
    case 'ay':
      return tek('M30 6 C20 8 13 16 13 25.5 C13 35 21 43 31 43 C35 43 39 41.5 42 39 C29 39 22 31 22 21.5 C22 15 25 9.5 30 6 Z', P.peach, 20.5, 25.5)
    case 'ampul':
      return (
        <>
          {tek('M24 5 C15 5 9 11.5 9 19.5 C9 25.5 12.5 29 15.5 32 L16.5 35 H31.5 L32.5 32 C35.5 29 39 25.5 39 19.5 C39 11.5 33 5 24 5 Z', P.peach, 24, 19)}
          <rect x="17" y="35" width="14" height="7" rx="3.5" fill={P.mint} stroke={K} strokeWidth={W} />
        </>
      )
    case 'mama':
      return (
        <>
          <path d="M14 20 C14 14 20 11 24 14 C28 11 34 14 34 20" fill={P.peach} stroke={K} strokeWidth={W} strokeLinejoin="round" />
          {tek('M5 21 H43 C43 33 35 41 24 41 C13 41 5 33 5 21 Z', renk ?? P.salmon, 24, 29)}
        </>
      )
    case 'ayar':
      return (
        <>
          <Bir renk={renk ?? P.paper}>
            <circle cx="24" cy="24" r="13" />
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <circle key={a} cx={24 + Math.cos((a * Math.PI) / 180) * 14} cy={24 + Math.sin((a * Math.PI) / 180) * 14} r="5.5" />
            ))}
          </Bir>
          <circle cx="24" cy="24" r="5.5" fill={P.mint} stroke={K} strokeWidth={W} />
        </>
      )
    case 'kilit':
      return (
        <>
          <path d="M16 21 V15 C16 10 19.5 7 24 7 C28.5 7 32 10 32 15 V21" fill="none" stroke={K} strokeWidth={W} />
          <rect x="9" y="20" width="30" height="22" rx="9" fill={renk ?? P.peach} stroke={K} strokeWidth={W} />
          {yuz ? <Yuz x={24} y={29} ruh={ruh} /> : null}
        </>
      )
    case 'ses':
      return (
        <>
          <path d="M8 19 C8 17.5 9 16.5 10.5 16.5 H15 L24 9 V39 L15 31.5 H10.5 C9 31.5 8 30.5 8 29 Z" fill={renk ?? P.peach} stroke={K} strokeWidth={W} strokeLinejoin="round" />
          <path d="M30 18 C32.5 21 32.5 27 30 30 M35 13 C40 19 40 29 35 35" fill="none" stroke={K} strokeWidth={W} strokeLinecap="round" />
        </>
      )
    case 'kapat':
      return <path d="M13 13 L35 35 M35 13 L13 35" stroke={K} strokeWidth="5" strokeLinecap="round" />
    case 'onay':
      return <path d="M10 25 L20 35 L38 14" fill="none" stroke={K} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    case 'ok':
      return <path d="M9 24 H37 M27 13 L38 24 L27 35" fill="none" stroke={K} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    case 'yukari':
      return <path d="M24 39 V11 M13 21 L24 10 L35 21" fill="none" stroke={K} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    case 'yenile':
      return <path d="M38 22 C37 14 31 8.5 23.5 8.5 C15 8.5 8.5 15.5 8.5 24 C8.5 32.5 15.5 39.5 24 39.5 C30 39.5 35 36 37.5 31 M38 10 V22 H26" fill="none" stroke={K} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
  }
}

export const YUZLU: IkonAd[] = ['yildiz', 'kalp', 'bulut', 'damla', 'cicek', 'elma', 'kitap', 'kemik', 'top', 'ay', 'ates', 'ampul', 'mama', 'kilit']

export function Ikon({ ad, boyut = 32, renk, ruh = 'mutlu', yuz = true, className, etiket }: { ad: IkonAd; boyut?: number; renk?: string; ruh?: 'mutlu' | 'uzgun' | 'uykulu'; yuz?: boolean; className?: string; etiket?: string }) {
  return (
    <svg viewBox="0 0 48 48" width={boyut} height={boyut} className={cx('inline-block shrink-0 overflow-visible', className)} role={etiket ? 'img' : undefined} aria-label={etiket} aria-hidden={etiket ? undefined : true} data-ikon={ad}>
      {ciz(ad, renk, ruh, yuz)}
    </svg>
  )
}

/** ^‿^ yüzü: "‿" glifi fontlarda olmadığı için satır içi çizim */
export function Kaomoji({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 20" width="2.2em" height="1em" className={cx('inline-block align-[-0.12em]', className)} role="img" aria-label="gülen yüz">
      <path d="M4 9 L9 3 L14 9 M30 9 L35 3 L40 9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 12 Q22 19 28 12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
