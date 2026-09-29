import { useId } from 'react'
import { cx } from '../../shared/cx'

export type SahneAd = 'duvar' | 'kumsal' | 'seramik' | 'oda' | 'kemer' | 'kumas' | 'mermer' | 'cephe'

export const SAHNE_AD: Record<SahneAd, string> = {
  duvar: 'Beton duvar ve pencere ışığı',
  kumsal: 'Kum tepeleri, sabah',
  seramik: 'Seramik kaplar, natürmort',
  oda: 'Sessiz oda, keten yatak',
  kemer: 'Sıvalı kemerler, öğle',
  kumas: 'Keten kıvrımları',
  mermer: 'Traverten ve mermer damarı',
  cephe: 'Taş cephe, dikey pencereler',
}

/** Sahneler: sıcak, tek renk ailesinden, düz alanlar ve ince tane. Fotoğraf yerine soyut mimari kesitler */
function Sahne({ ad, id }: { ad: SahneAd; id: string }) {
  switch (ad) {
    case 'duvar':
      return (
        <>
          <defs>
            <linearGradient id={`${id}a`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#cfc7ba" />
              <stop offset="1" stopColor="#b3a998" />
            </linearGradient>
            <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f3ecdd" />
              <stop offset="1" stopColor="#e6dcc8" />
            </linearGradient>
          </defs>
          <rect width="1200" height="800" fill={`url(#${id}a)`} />
          <rect y="560" width="1200" height="240" fill="#a59b89" />
          <path d="M0 560H1200" stroke="#8b7f6c" strokeOpacity=".5" />
          <rect x="430" y="180" width="300" height="300" fill={`url(#${id}b)`} />
          <path d="M580 180V480M430 330H730" stroke="#8b7b6b" strokeOpacity=".35" strokeWidth="6" />
          <polygon points="430,600 760,600 930,800 260,800" fill="#efe6d4" opacity=".55" />
          <path d="M580 600L595 800M430 600L330 800" stroke="#8b7b6b" strokeOpacity=".16" strokeWidth="5" />
        </>
      )
    case 'kumsal':
      return (
        <>
          <defs>
            <linearGradient id={`${id}a`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f2ede3" />
              <stop offset="1" stopColor="#e4d9c6" />
            </linearGradient>
          </defs>
          <rect width="1200" height="800" fill={`url(#${id}a)`} />
          <path d="M0 470C180 400 300 380 470 430C650 484 760 380 960 360C1080 350 1140 380 1200 400V800H0Z" fill="#dccdb3" />
          <path d="M0 560C200 500 340 520 520 560C700 600 860 520 1200 470V800H0Z" fill="#cbb896" />
          <path d="M0 660C240 610 420 650 640 690C860 730 1020 640 1200 620V800H0Z" fill="#b39c78" />
          <path d="M0 470C180 400 300 380 470 430C650 484 760 380 960 360C1080 350 1140 380 1200 400" fill="none" stroke="#f6efe1" strokeOpacity=".7" strokeWidth="2" />
        </>
      )
    case 'seramik':
      return (
        <>
          <defs>
            <linearGradient id={`${id}a`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#f6f1e6" />
              <stop offset="1" stopColor="#cfc4b0" />
            </linearGradient>
            <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#a08f7b" />
              <stop offset="1" stopColor="#6d5f50" />
            </linearGradient>
            <linearGradient id={`${id}c`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#4a4640" />
              <stop offset="1" stopColor="#25231f" />
            </linearGradient>
            <filter id={`${id}s`}>
              <feGaussianBlur stdDeviation="9" />
            </filter>
          </defs>
          <rect width="1200" height="800" fill="#d8d0c1" />
          <rect y="560" width="1200" height="240" fill="#bdb09a" />
          <path d="M0 560H1200" stroke="#a89b85" strokeOpacity=".6" />
          <g filter={`url(#${id}s)`} fill="#6d5f50" opacity=".32">
            <ellipse cx="420" cy="590" rx="100" ry="14" />
            <ellipse cx="640" cy="596" rx="130" ry="16" />
            <ellipse cx="900" cy="590" rx="110" ry="13" />
          </g>
          <path d="M400 570C350 560 340 470 372 420C384 400 388 380 384 320L382 250H438L436 320C432 380 436 400 448 420C480 470 470 560 420 570Z" fill={`url(#${id}a)`} />
          <path d="M628 574C548 574 520 500 540 450C556 410 600 392 640 392C680 392 724 410 740 450C760 500 732 574 652 574Z" fill={`url(#${id}b)`} />
          <path d="M560 392H720V372C720 364 712 358 704 358H576C568 358 560 364 560 372Z" fill={`url(#${id}b)`} />
          <path d="M790 574C790 520 850 490 910 490C970 490 1030 520 1030 574Z" fill={`url(#${id}c)`} />
        </>
      )
    case 'oda':
      return (
        <>
          <defs>
            <linearGradient id={`${id}a`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#dcd3c3" />
              <stop offset="1" stopColor="#c8bda9" />
            </linearGradient>
            <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f7f2e7" />
              <stop offset="1" stopColor="#e9e0cd" />
            </linearGradient>
          </defs>
          <rect width="1200" height="800" fill={`url(#${id}a)`} />
          <rect y="600" width="1200" height="200" fill="#a89b86" />
          <rect x="880" y="100" width="210" height="380" fill={`url(#${id}b)`} />
          <path d="M985 100V480M880 290H1090" stroke="#9a8a76" strokeOpacity=".45" strokeWidth="5" />
          <rect x="230" y="220" width="560" height="200" fill="#9c8b76" />
          <rect x="190" y="410" width="640" height="170" fill="#ede7db" />
          <rect x="190" y="410" width="640" height="26" fill="#faf6ee" />
          <rect x="230" y="440" width="230" height="46" fill="#faf6ee" />
          <rect x="520" y="440" width="230" height="46" fill="#faf6ee" />
          <rect x="190" y="520" width="640" height="70" fill="#8b7b6b" opacity=".85" />
          <rect x="190" y="580" width="640" height="34" fill="#7d6e5c" />
          <rect x="870" y="480" width="110" height="120" fill="#8b7b6b" />
          <path d="M630 0V150" stroke="#222" strokeOpacity=".7" />
          <path d="M580 190A50 40 0 0 1 680 190Z" fill="#2b2926" />
        </>
      )
    case 'kemer':
      return (
        <>
          <defs>
            <linearGradient id={`${id}a`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#8f7f6a" />
              <stop offset="1" stopColor="#c2b198" />
            </linearGradient>
          </defs>
          <rect width="1200" height="800" fill="#dccfb9" />
          <rect y="640" width="1200" height="160" fill="#bfae94" />
          {[0, 1, 2].map((i) => {
            const x = 90 + i * 370
            return (
              <g key={i}>
                <path d={`M${x} 640V300A130 130 0 0 1 ${x + 260} 300V640Z`} fill={`url(#${id}a)`} />
                <path d={`M${x + 260} 640V300A130 130 0 0 0 ${x + 130} 170L${x + 130} 640Z`} fill="#b09e85" opacity=".55" />
                <path d={`M${x} 640V300A130 130 0 0 1 ${x + 260} 300V640`} fill="none" stroke="#f4ecdc" strokeOpacity=".8" strokeWidth="2" />
              </g>
            )
          })}
          <polygon points="150,640 330,640 500,800 60,800" fill="#efe5d1" opacity=".55" />
        </>
      )
    case 'kumas':
      return (
        <>
          <defs>
            <linearGradient id={`${id}a`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#f0eadd" />
              <stop offset=".5" stopColor="#cbbfa8" />
              <stop offset="1" stopColor="#ebe4d5" />
            </linearGradient>
            <filter id={`${id}w`} x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence type="fractalNoise" baseFrequency=".004 .012" numOctaves="2" seed="5" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="46" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
          <rect width="1200" height="800" fill="#d9cfbc" />
          <g filter={`url(#${id}w)`}>
            {Array.from({ length: 12 }, (_, i) => (
              <rect key={i} x={-60 + i * 112} y="-60" width="112" height="920" fill={`url(#${id}a)`} />
            ))}
          </g>
        </>
      )
    case 'mermer':
      return (
        <>
          <defs>
            <filter id={`${id}v`} x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency=".004 .009" numOctaves="5" seed="14" result="t" />
              <feColorMatrix in="t" values="0 0 0 0 0.42  0 0 0 0 0.37  0 0 0 0 0.31  1 0 0 0 0" result="a" />
              <feComponentTransfer in="a">
                <feFuncA type="table" tableValues="0 0 0 0 0 0 0 0 .1 .75 .1 0 0 0 0 0 0 0 0 0" />
              </feComponentTransfer>
            </filter>
            <filter id={`${id}w`} x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency=".002 .004" numOctaves="3" seed="3" result="t" />
              <feColorMatrix in="t" values="0 0 0 0 0.62  0 0 0 0 0.56  0 0 0 0 0.47  0.9 0 0 0 -.15" />
            </filter>
          </defs>
          <rect width="1200" height="800" fill="#ece6d9" />
          <rect width="1200" height="800" filter={`url(#${id}w)`} opacity=".55" />
          <rect width="1200" height="800" filter={`url(#${id}v)`} />
        </>
      )
    case 'cephe':
      return (
        <>
          <defs>
            <linearGradient id={`${id}a`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#d1c8b9" />
              <stop offset="1" stopColor="#b1a794" />
            </linearGradient>
            <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#4b463f" />
              <stop offset="1" stopColor="#2a2723" />
            </linearGradient>
          </defs>
          <rect width="1200" height="800" fill={`url(#${id}a)`} />
          {Array.from({ length: 5 }, (_, c) =>
            Array.from({ length: 3 }, (_, r) => (
              <g key={`${c}${r}`}>
                <rect x={110 + c * 210} y={70 + r * 240} width="110" height="180" fill={`url(#${id}b)`} />
                <path d={`M${110 + c * 210} ${250 + r * 240}L${220 + c * 210} ${70 + r * 240}`} stroke="#efe6d4" strokeOpacity=".14" strokeWidth="26" />
              </g>
            )),
          )}
          <path d="M0 305H1200M0 545H1200" stroke="#f0e8d8" strokeOpacity=".5" strokeWidth="3" />
        </>
      )
  }
}

/** Ölçekten bağımsız, mat tanecikli tek renk ailesi görsel. `slice` ile kutuyu doldurur */
export function Gorsel({ sahne, className, etiket, oran, konum = 'xMidYMid' }: { sahne: SahneAd; className?: string; etiket?: string; oran?: string; konum?: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 1200 800" preserveAspectRatio={`${konum} slice`} className={cx('block size-full', className)} style={oran ? { aspectRatio: oran } : undefined} role="img" aria-label={etiket ?? SAHNE_AD[sahne]} data-sahne={sahne}>
      <Sahne ad={sahne} id={id} />
      <filter id={`${id}g`} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3" />
        <feColorMatrix values="0 0 0 0 .13  0 0 0 0 .12  0 0 0 0 .1  1.2 0 0 0 -.42" />
      </filter>
      <rect width="1200" height="800" filter={`url(#${id}g)`} opacity=".3" />
    </svg>
  )
}
