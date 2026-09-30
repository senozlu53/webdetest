import { useId } from 'react'
import { cx } from '../../shared/cx'
import type { IkonAd } from '../lib/data'
import { Ikon } from './Ikon'

/** Madde 6 · 9: dairesel mum mühür. Düzensiz mum kenarı, kabartma halka ve içine basılı simge. */
export function Muhur({ ikon = 'hac', boy = 88, baslik, tur = 'kan', className }: { ikon?: IkonAd; boy?: number; baslik?: string; tur?: 'kan' | 'pas' | 'gumus'; className?: string }) {
  const id = useId().replace(/:/g, '')
  const renk = {
    kan: ['#b81c1c', '#7a0c0c', '#430404'],
    pas: ['#c0703a', '#8b4513', '#4e2708'],
    gumus: ['#c9c9cf', '#8a8a91', '#46464b'],
  }[tur]
  const iz = tur === 'gumus' ? '#2a2a2f' : '#2b0202'
  return (
    <svg className={cx('muhur', className)} viewBox="0 0 96 96" width={boy} height={boy} role={baslik ? 'img' : undefined} aria-label={baslik} aria-hidden={baslik ? undefined : 'true'} focusable="false">
      <defs>
        <filter id={`f${id}`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="9" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <radialGradient id={`g${id}`} cx="0.36" cy="0.3" r="0.85">
          <stop offset="0" stopColor={renk[0]} />
          <stop offset="0.5" stopColor={renk[1]} />
          <stop offset="1" stopColor={renk[2]} />
        </radialGradient>
      </defs>
      <g filter={`url(#f${id})`}>
        <circle cx="48" cy="48" r="39" fill={`url(#g${id})`} />
      </g>
      <circle cx="48" cy="48" r="29.500" fill="none" stroke="#000" strokeOpacity="0.4" strokeWidth="1.500" />
      <circle cx="48" cy="48" r="31" fill="none" stroke="#fff" strokeOpacity="0.16" strokeWidth="1.500" />
      <circle cx="48" cy="48" r="34.500" fill="none" stroke={iz} strokeOpacity="0.5" strokeWidth="1.500" strokeDasharray="0.1 4.400" strokeLinecap="round" />
      <g transform="translate(29 30.200)" style={{ color: '#fff', ['--vurgu-2' as string]: '#fff' }} opacity="0.24">
        <Ikon ad={ikon} boy={38} />
      </g>
      <g transform="translate(29 29)" style={{ color: iz, ['--vurgu-2' as string]: iz }}>
        <Ikon ad={ikon} boy={38} />
      </g>
      <path d="M22 18a30 30 0 0 1 17-7" fill="none" stroke="#fff" strokeOpacity="0.3" strokeWidth="2.500" strokeLinecap="round" />
    </svg>
  )
}
