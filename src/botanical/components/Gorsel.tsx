import { useId, type ReactNode } from 'react'
import { damarAt, elips, ornekle, petalAt, rastgele, serit, yaprakAt, yumusak, yuvarlakDortgen, zeytinAt, type Nk } from '../lib/organik'

/**
 * Sayfadaki "fotoğraf" yerine geçen, elle kurgulanmış düz ve tonlu illüstrasyonlar (Madde 2 · 9 · 11).
 * Çizgi yok; yalnızca aynı renk ailesinden yumuşak şekiller.
 */
export type SahneAd = 'zeytin' | 'bal' | 'sabun' | 'ot' | 'yag' | 'sebze' | 'fidan' | 'vadi' | 'kamp'

export const SAHNE_AD: Record<SahneAd, string> = {
  zeytin: 'Zeytin dalı',
  bal: 'Çiçek balı',
  sabun: 'Zeytin sabunu',
  ot: 'Kurutulmuş otlar',
  yag: 'Zeytinyağı şişesi',
  sebze: 'Sebze sepeti',
  fidan: 'Fidan saksıları',
  vadi: 'Vadi ve göl',
  kamp: 'Yıldızlı kamp',
}

const K = {
  kil: '#C86D51',
  kilA: '#E3A48F',
  kilB: '#F0CBBB',
  kilK: '#9A4530',
  zeytin: '#556B2F',
  zeytinA: '#8A9E5B',
  zeytinB: '#B9C68F',
  zeytinK: '#3D4F20',
  toprak: '#D2B48C',
  toprakA: '#E8D6B8',
  toprakB: '#F3E9D6',
  toprakK: '#A98A5F',
  orman: '#2F4F4F',
  ormanA: '#5C7C7A',
  ormanB: '#9BB3AF',
  ormanK: '#1F3535',
  krem: '#F4EEE1',
  bal: '#D9A24E',
  balA: '#EBC57F',
} as const

interface SahneProp {
  r: () => number
  zid: string
}

const Zemin = ({ zid }: { zid: string }) => <rect width="400" height="500" fill={`url(#${zid})`} />
const Tas = ({ d, c, o = 1 }: { d: string; c: string; o?: number }) => <path d={d} fill={c} opacity={o} />

function Zeytin({ zid }: SahneProp) {
  const govde = ornekle(
    [
      [-20, 450],
      [90, 385],
      [165, 300],
      [250, 215],
      [345, 150],
    ],
    10,
  )
  const yapraklar: ReactNode[] = []
  const renk = [K.zeytin, K.zeytinA, K.ormanA, K.zeytinK]
  for (let i = 4; i < govde.length - 3; i += 4) {
    const [x, y] = govde[i]
    const [x2, y2] = govde[i + 1]
    const a = Math.atan2(y2 - y, x2 - x)
    for (const yon of [1, -1]) {
      const boy = 74 + ((i * 7) % 22) - (i / govde.length) * 24
      yapraklar.push(<path key={`${i}${yon}`} d={zeytinAt(x, y, a + yon * (0.78 + (i % 3) * 0.1), boy)} fill={renk[((i / 4 + (yon > 0 ? 0 : 1)) % 4) | 0]} />)
    }
  }
  const zeytinler: [number, number, number][] = [
    [140, 372, 0.3],
    [172, 366, -0.2],
    [232, 290, 0.4],
    [300, 210, -0.3],
  ]
  return (
    <>
      <Zemin zid={zid} />
      <circle cx="292" cy="132" r="92" fill={K.kilB} opacity=".7" />
      <circle cx="292" cy="132" r="60" fill={K.kilA} opacity=".55" />
      <Tas d="M-10 500V430C60 400 120 440 200 428S340 396 410 430V500Z" c={K.toprak} />
      <Tas d="M-10 500V462C80 440 150 470 230 458S350 436 410 458V500Z" c={K.toprakK} o={0.55} />
      {yapraklar}
      <path d={serit(govde, (t) => 7 - t * 3.5)} fill={K.zeytinK} />
      {zeytinler.map(([x, y, a], i) => (
        <g key={i}>
          <path d={`M${x} ${y - 8}q${a * 30} -14 ${a * 44} -8`} stroke={K.zeytinK} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d={elips(x + a * 6, y + 20, 14, 19, a * 0.6)} fill={i % 2 ? K.ormanK : K.zeytinK} />
          <path d={elips(x + a * 6 - 4, y + 13, 3.4, 6, a * 0.6)} fill="#fff" opacity=".28" />
        </g>
      ))}
    </>
  )
}

function Bal({ zid }: SahneProp) {
  return (
    <>
      <Zemin zid={zid} />
      {Array.from({ length: 14 }, (_, i) => {
        const cx = 40 + (i % 4) * 110 + (Math.floor(i / 4) % 2) * 55
        const cy = 60 + Math.floor(i / 4) * 92
        return <path key={i} d={`M${cx} ${cy - 30}l26 15v30l-26 15l-26 -15v-30Z`} fill={K.balA} opacity=".22" />
      })}
      <Tas d="M-10 500V438C70 420 130 448 210 440S340 420 410 440V500Z" c={K.toprak} />
      <path d="M204 200v54c0 12 -16 12 -16 0v-40Z" fill={K.bal} />
      <path d={yuvarlakDortgen(112, 190, 176, 226, 52)} fill={K.bal} />
      <path d={yuvarlakDortgen(126, 204, 30, 190, 15)} fill="#fff" opacity=".28" />
      <path d={yuvarlakDortgen(118, 146, 164, 58, 18)} fill={K.ormanK} />
      <path d={yuvarlakDortgen(118, 176, 164, 12, 5)} fill={K.toprakK} />
      <path d={elips(200, 318, 62, 46)} fill={K.krem} />
      <path d="M200 292l17 10v20l-17 10l-17 -10v-20Z" fill={K.bal} opacity=".85" />
      <path d="M200 305l7 4v8l-7 4l-7 -4v-8Z" fill={K.krem} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <path d={`M${316 + i * 26} 440C${312 + i * 26} 400 ${322 + i * 26} 372 ${318 + i * 26} 340`} stroke={K.zeytin} strokeWidth="4" fill="none" strokeLinecap="round" />
          {petalAt(318 + i * 26, 336 - i * 6, 0, 17, 8, 0.4).map((d, j) => (
            <path key={j} d={d} fill={K.krem} />
          ))}
          <circle cx={318 + i * 26} cy={336 - i * 6} r="7" fill={K.bal} />
        </g>
      ))}
    </>
  )
}

function Sabun({ zid }: SahneProp) {
  return (
    <>
      <Zemin zid={zid} />
      <Tas d="M-10 500V420C60 396 130 430 210 418S340 392 410 424V500Z" c={K.zeytinA} o={0.55} />
      <path d="M40 470C80 380 160 320 240 210" stroke={K.zeytin} strokeWidth="5" fill="none" strokeLinecap="round" />
      {Array.from({ length: 9 }, (_, i) => {
        const t = i / 8
        const x = 64 + t * 170
        const y = 440 - t * 226
        return (
          <g key={i}>
            <circle cx={x - 26} cy={y + 6 - t * 10} r={17 - t * 4} fill={i % 2 ? K.zeytin : K.zeytinA} />
            <circle cx={x + 24} cy={y - 8 + t * 6} r={16 - t * 4} fill={i % 2 ? K.zeytinA : K.ormanA} />
          </g>
        )
      })}
      <g transform="rotate(-8 200 380)">
        <path d={yuvarlakDortgen(96, 340, 210, 100, 34)} fill={K.toprakA} />
        <path d={yuvarlakDortgen(96, 340, 210, 26, 13)} fill="#fff" opacity=".3" />
        <path d={yuvarlakDortgen(150, 372, 100, 42, 16)} fill={K.toprakB} />
        <path d={yaprakAt(184, 394, -0.5, 30, 9)} fill={K.zeytin} />
      </g>
      <g transform="rotate(6 250 290)">
        <path d={yuvarlakDortgen(150, 246, 190, 90, 32)} fill={K.kilB} />
        <path d={yuvarlakDortgen(150, 246, 190, 24, 12)} fill="#fff" opacity=".3" />
        <path d={elips(245, 292, 46, 26)} fill={K.krem} opacity=".85" />
      </g>
      {[
        [310, 200],
        [340, 232],
        [86, 300],
        [60, 336],
      ].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y - 12}C${x + 10} ${y} ${x + 10} ${y + 9} ${x} ${y + 9}C${x - 10} ${y + 9} ${x - 10} ${y} ${x} ${y - 12}Z`} fill={K.ormanB} opacity=".85" />
      ))}
    </>
  )
}

function Ot({ zid }: SahneProp) {
  const govde = [-46, -30, -14, 2, 18, 34, 50]
  return (
    <>
      <Zemin zid={zid} />
      <circle cx="200" cy="250" r="150" fill={K.krem} opacity=".55" />
      <Tas d="M-10 500V450C80 430 140 456 210 448S340 428 410 452V500Z" c={K.kilA} o={0.6} />
      {govde.map((a, i) => {
        const rad = (a * Math.PI) / 180 - Math.PI / 2
        const boy = 270 - Math.abs(a) * 1.2
        const x1 = 200 + Math.cos(rad) * boy
        const y1 = 440 + Math.sin(rad) * boy
        const cx = 200 + Math.cos(rad) * boy * 0.5 + (a > 0 ? -12 : 12)
        const cy = 440 + Math.sin(rad) * boy * 0.5
        const lav = i % 2 === 0
        return (
          <g key={i}>
            <path d={`M200 440Q${cx} ${cy} ${x1} ${y1}`} stroke={K.zeytin} strokeWidth="4" fill="none" strokeLinecap="round" />
            {lav
              ? Array.from({ length: 9 }, (_, k) => {
                  const t = 1 - k * 0.055
                  return <path key={k} d={elips(200 + (x1 - 200) * t + (k % 2 ? 5 : -5), 440 + (y1 - 440) * t, 5.5, 8.5, rad + Math.PI / 2)} fill={k % 3 === 0 ? K.ormanA : K.kilK} opacity=".92" />
                })
              : Array.from({ length: 7 }, (_, k) => {
                  const t = 1 - k * 0.07
                  return <circle key={k} cx={200 + (x1 - 200) * t + (k % 2 ? 7 : -7)} cy={440 + (y1 - 440) * t} r={6 - k * 0.3} fill={k % 2 ? K.zeytinA : K.zeytin} />
                })}
          </g>
        )
      })}
      <path d={yuvarlakDortgen(172, 392, 56, 22, 10)} fill={K.kil} />
      <path d="M200 400c-14 8 -22 22 -20 36M200 400c14 8 22 22 20 36" stroke={K.kilK} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d={yaprakAt(120, 470, -0.3, 44, 12)} fill={K.zeytinA} opacity=".9" />
      <path d={yaprakAt(292, 474, -2.7, 40, 11)} fill={K.zeytin} opacity=".9" />
    </>
  )
}

function Yag({ zid }: SahneProp) {
  return (
    <>
      <Zemin zid={zid} />
      <circle cx="120" cy="150" r="90" fill={K.kilB} opacity=".55" />
      <Tas d="M-10 500V436C70 418 130 446 210 438S340 418 410 438V500Z" c={K.toprak} />
      <path d="M170 116h60v66c0 22 42 38 42 92v154c0 24 -20 38 -42 38h-60c-22 0 -42 -14 -42 -38V274c0-54 42-70 42-92Z" fill={K.orman} />
      <path d="M178 216c0 10 -34 20 -34 70v138c0 14 12 24 30 24h52c18 0 30 -10 30 -24V286c0-50 -34-60 -34-70Z" fill={K.bal} opacity=".92" />
      <path d="M178 224c-10 20 -30 34 -30 62v130" stroke="#fff" strokeWidth="9" opacity=".28" fill="none" strokeLinecap="round" />
      <path d={yuvarlakDortgen(174, 84, 52, 40, 12)} fill={K.toprakK} />
      <path d={yuvarlakDortgen(150, 300, 100, 86, 26)} fill={K.krem} />
      <path d={zeytinAt(166, 358, -0.6, 44)} fill={K.zeytin} />
      <path d={zeytinAt(198, 362, -1.1, 40)} fill={K.zeytinA} />
      <path d={elips(216, 336, 6, 8, 0.4)} fill={K.zeytinK} />
      <path d="M170 318h60" stroke={K.toprakK} strokeWidth="3" strokeLinecap="round" />
      {[
        [318, 452, 0.4],
        [344, 440, -0.3],
      ].map(([x, y, a], i) => (
        <g key={i}>
          <path d={elips(x, y, 15, 20, a)} fill={i ? K.zeytinK : K.ormanK} />
          <path d={elips(x - 4, y - 7, 3.5, 6, a)} fill="#fff" opacity=".28" />
        </g>
      ))}
      <path d={zeytinAt(300, 470, -0.4, 60)} fill={K.zeytin} />
      <path d={zeytinAt(300, 470, -1.1, 54)} fill={K.zeytinA} />
    </>
  )
}

function Sebze({ zid }: SahneProp) {
  return (
    <>
      <Zemin zid={zid} />
      <circle cx="290" cy="130" r="100" fill={K.krem} opacity=".6" />
      <Tas d="M-10 500V440C80 420 140 448 210 440S340 420 410 442V500Z" c={K.toprak} />
      {[
        [120, 296],
        [190, 258],
        [262, 290],
      ].map(([x, y], i) => (
        <path key={i} d={yaprakAt(x, y + 20, -PI2 + (i - 1) * 0.55, 96 - i * 6, 26)} fill={[K.zeytin, K.zeytinA, K.ormanA][i]} />
      ))}
      {[
        [148, 330, 44, K.kil],
        [214, 322, 40, K.kilK],
        [180, 292, 36, K.kil],
      ].map(([x, y, r, c], i) => (
        <g key={i}>
          <circle cx={x as number} cy={y as number} r={r as number} fill={c as string} />
          <path d={elips((x as number) - (r as number) * 0.3, (y as number) - (r as number) * 0.35, (r as number) * 0.16, (r as number) * 0.28, 0.6)} fill="#fff" opacity=".26" />
          {petalAt(x as number, (y as number) - (r as number) * 0.86, -PI2, 15, 5, 0.3).map((d, j) => (
            <path key={j} d={d} fill={K.zeytinK} />
          ))}
        </g>
      ))}
      <path d="M256 322c22 -6 38 6 38 28c0 22 -10 44 -24 52c-16 -8 -26 -30 -26 -52c0 -12 4 -22 12 -28Z" fill={K.zeytinA} />
      <path d="M270 322v-16" stroke={K.zeytinK} strokeWidth="5" strokeLinecap="round" />
      <path d="M78 356h244l-24 92c-3 12 -12 18 -24 18H126c-12 0 -21 -6 -24 -18Z" fill={K.toprakK} />
      <path d="M78 356h244l-6 22H84Z" fill={K.toprak} />
      {[392, 414, 436].map((y) => (
        <path key={y} d={`M92 ${y}Q200 ${y + 10} 308 ${y}`} stroke={K.toprak} strokeWidth="3" fill="none" opacity=".7" />
      ))}
      {[126, 170, 214, 258, 296].map((x) => (
        <path key={x} d={`M${x} 380V462`} stroke={K.toprak} strokeWidth="3" opacity=".5" />
      ))}
    </>
  )
}
const PI2 = Math.PI / 2

function Fidan({ zid }: SahneProp) {
  const saksi = [
    { x: 56, h: 130, c: K.kil },
    { x: 152, h: 176, c: K.kilA },
    { x: 248, h: 110, c: K.kil },
  ]
  return (
    <>
      <Zemin zid={zid} />
      <circle cx="320" cy="110" r="70" fill={K.krem} opacity=".7" />
      <Tas d="M-10 500V420H410V500Z" c={K.toprak} />
      {saksi.map(({ x, h, c }, i) => {
        const cx = x + 48
        const tepe = 396 - h
        return (
          <g key={i}>
            <path d={`M${cx} 396V${tepe}`} stroke={K.zeytin} strokeWidth="5" strokeLinecap="round" />
            <path d={yaprakAt(cx, tepe + 28, -PI2 - 0.9, 46, 13)} fill={K.zeytin} />
            <path d={yaprakAt(cx, tepe + 12, -PI2 + 0.9, 50, 14)} fill={K.zeytinA} />
            <path d={yaprakAt(cx, tepe + 54, -PI2 + 1.1, 36, 11)} fill={K.zeytinA} />
            <path d={yaprakAt(cx, tepe, -PI2 - 0.2, 40, 11)} fill={K.zeytin} />
            <path d={`M${x} 392h96l-12 84c-1 8 -7 12 -14 12H${x + 26}c-7 0 -13 -4 -14 -12Z`} fill={c} />
            <path d={yuvarlakDortgen(x - 6, 384, 108, 22, 10)} fill={K.kilK} opacity=".8" />
          </g>
        )
      })}
      {[
        [330, 250],
        [356, 292],
        [310, 312],
      ].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y - 14}C${x + 11} ${y} ${x + 11} ${y + 10} ${x} ${y + 10}C${x - 11} ${y + 10} ${x - 11} ${y} ${x} ${y - 14}Z`} fill={K.ormanB} opacity=".9" />
      ))}
    </>
  )
}

function Vadi({ zid }: SahneProp) {
  return (
    <>
      <Zemin zid={zid} />
      <circle cx="286" cy="120" r="54" fill={K.kilB} />
      <circle cx="286" cy="120" r="80" fill={K.kilB} opacity=".4" />
      <Tas d="M-10 300C40 240 100 220 160 250C210 276 260 224 330 236S400 270 410 260V420H-10Z" c={K.ormanB} />
      <Tas d="M-10 340C50 296 110 290 170 316S280 300 340 306S400 330 410 322V440H-10Z" c={K.zeytinA} />
      <Tas d="M-10 380H410V440H-10Z" c={K.ormanA} />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${40 + i * 24} ${392 + i * 12}C${120 + i * 20} ${380 + i * 12} ${180} ${404 + i * 12} ${260 + i * 10} ${392 + i * 12}`} stroke={K.krem} strokeWidth="3" fill="none" strokeLinecap="round" opacity=".45" />
      ))}
      <Tas d="M-10 430C60 400 120 410 190 436S330 420 410 420V500H-10Z" c={K.zeytin} />
      <Tas d="M-10 470C80 446 150 470 240 460S360 444 410 462V500H-10Z" c={K.zeytinK} />
      {[
        [70, 420, 1],
        [330, 430, 0.8],
        [372, 440, 1.1],
      ].map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          <path d="M-4 0h8v34h-8Z" fill={K.ormanK} />
          <circle cx="0" cy="-8" r="26" fill={K.ormanK} />
          <circle cx="-10" cy="-2" r="16" fill={K.orman} opacity=".7" />
        </g>
      ))}
      {[
        [130, 90],
        [160, 76],
        [190, 96],
      ].map(([x, y], i) => (
        <path key={i} d={`M${x - 12} ${y}q12 -12 12 0q0 -12 12 0`} stroke={K.ormanK} strokeWidth="3" fill="none" strokeLinecap="round" />
      ))}
    </>
  )
}

function Kamp({ zid, r }: SahneProp) {
  const yildiz = Array.from({ length: 34 }, () => [r() * 400, r() * 260, r() * 1.6 + 0.6] as const)
  return (
    <>
      <Zemin zid={zid} />
      {yildiz.map(([x, y, s], i) => (
        <circle key={i} cx={x} cy={y} r={s} fill={K.krem} opacity={0.5 + (i % 3) * 0.2} />
      ))}
      <circle cx="300" cy="110" r="38" fill={K.toprakB} />
      <circle cx="314" cy="102" r="34" fill={K.orman} />
      <Tas d="M-10 330C60 290 130 300 200 330S340 300 410 320V500H-10Z" c={K.ormanK} />
      <Tas d="M-10 400C70 366 150 380 230 404S350 380 410 396V500H-10Z" c="#182a2a" />
      {[
        [36, 400, 1.15],
        [92, 410, 0.9],
        [340, 396, 1.2],
        [384, 410, 0.85],
      ].map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          <path d="M0 -92l26 46h-14l24 40h-18l26 44H-24l26 -44h-18l24-40h-14Z" fill={K.orman} />
          <path d="M-3 0h6v20h-6Z" fill={K.ormanK} />
        </g>
      ))}
      <path d="M118 440L200 320L282 440Z" fill={K.kil} />
      <path d="M200 320L282 440H240Z" fill={K.kilK} opacity=".55" />
      <path d="M200 372L226 440H174Z" fill={K.bal} />
      <path d="M200 372L214 440H186Z" fill={K.balA} opacity=".85" />
      <path d="M200 320V300" stroke={K.toprakB} strokeWidth="3" strokeLinecap="round" />
      <path d="M200 300l26 8l-26 8Z" fill={K.balA} />
      <circle cx="320" cy="452" r="20" fill={K.bal} opacity=".18" />
      <path d="M312 460c-2 -12 4 -18 8 -26c4 8 10 14 8 26Z" fill={K.bal} />
      <path d="M317 460c-1 -6 1 -9 3 -13c2 4 4 7 3 13Z" fill={K.balA} />
    </>
  )
}

const SAHNELER: Record<SahneAd, (p: SahneProp) => ReactNode> = { zeytin: Zeytin, bal: Bal, sabun: Sabun, ot: Ot, yag: Yag, sebze: Sebze, fidan: Fidan, vadi: Vadi, kamp: Kamp }

const ZEMIN: Record<SahneAd, [string, string]> = {
  zeytin: [K.toprakB, K.toprakA],
  bal: [K.krem, K.toprakA],
  sabun: [K.zeytinB, '#DDE3C6'],
  ot: [K.kilB, K.krem],
  yag: [K.toprakB, K.krem],
  sebze: [K.kilB, K.krem],
  fidan: [K.krem, K.zeytinB],
  vadi: [K.krem, K.toprakA],
  kamp: [K.ormanK, K.orman],
}

/** İllüstrasyon. `konum`: slice kırpmasında öne çıkacak nokta (preserveAspectRatio hizası) */
export function Gorsel({ sahne, tohum = 1, konum = 'xMidYMid', className, etiket }: { sahne: SahneAd; tohum?: number; konum?: string; className?: string; etiket?: string }) {
  const uid = useId().replace(/:/g, '')
  const zid = `zg${uid}`
  const Sahne = SAHNELER[sahne]
  const [a, b] = ZEMIN[sahne]
  const r = rastgele(tohum * 977 + sahne.length)
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio={`${konum} slice`} className={className ?? 'block h-full w-full'} role="img" aria-label={etiket ?? SAHNE_AD[sahne]} data-sahne={sahne}>
      <defs>
        <linearGradient id={zid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
      </defs>
      <Sahne r={r} zid={zid} />
    </svg>
  )
}

/** Yardımcılar dışarıda da kullanılır (Dal: rüzgârda sallanan dal) */
export { damarAt, yumusak }
export type { Nk }
