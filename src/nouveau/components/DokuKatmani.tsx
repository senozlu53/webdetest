import { useId, useMemo } from 'react'
import { kamci, petalAt, rastgele, sarmasikAt, sivri, yaprakAt, yumusak, type Nk } from '../lib/bitki'
import { useNouveau } from '../lib/store'

/** Açık yol (kapanmayan) gövde çizgisidir; kapalı yollar yaprak ve taç yapraklardır */
const govdeMi = (d: string) => !d.endsWith('Z')

/** Madde 8: preslenmiş çiçek. Kurutulmuş dallar, rastgele açılarla, kenardan taşan parçalar karşı kenara sarılır */
function cicekDesen(n: number, boyut: number) {
  const r = rastgele(41)
  const dallar: string[] = []
  for (let i = 0; i < n; i++) {
    const x = r() * boyut
    const y = r() * boyut
    const a = r() * Math.PI * 2
    const s = 0.75 + r() * 0.6
    const govdePts: Nk[] = [0, 1, 2, 3].map((k) => [x + Math.cos(a) * k * 26 * s + Math.sin(a * 2 + k) * 7 * s, y + Math.sin(a) * k * 26 * s + Math.cos(a * 3 + k) * 6 * s] as Nk)
    const cizik = yumusak(govdePts)
    const uc = govdePts[3]
    const parcalar: string[] = [cizik]
    for (let k = 1; k <= 2; k++) {
      const p = govdePts[k]
      parcalar.push(yaprakAt(p[0], p[1], a + (k % 2 ? 0.9 : -0.9), 26 * s, 8 * s))
      if (r() < 0.5) parcalar.push(sarmasikAt(p[0], p[1], a + (k % 2 ? -1.2 : 1.2), 30 * s))
    }
    parcalar.push(...petalAt(uc[0], uc[1], a, 17 * s, 5 + Math.floor(r() * 3), 0.34))
    for (const dx of [-boyut, 0, boyut]) {
      for (const dy of [-boyut, 0, boyut]) {
        if (dx === 0 && dy === 0) {
          dallar.push(...parcalar)
        } else if ((dx !== 0 && (x < 120 || x > boyut - 120)) || (dy !== 0 && (y < 120 || y > boyut - 120))) {
          // yalnız gerçekten kenara yakın dallar için kopya üret
          const kx = dx === -boyut ? x > boyut - 120 : dx === boyut ? x < 120 : true
          const ky = dy === -boyut ? y > boyut - 120 : dy === boyut ? y < 120 : true
          if (kx && ky) dallar.push(...parcalar.map((d) => d.replace(/(-?\d+\.?\d*) (-?\d+\.?\d*)/g, (_, px, py) => `${(+px + dx).toFixed(1)} ${(+py + dy).toFixed(1)}`)))
        }
      }
    }
  }
  return dallar
}

/** Madde 8: antika duvar kağıdı. Yarım kaymalı tekrar; kamçı kıvrımlar, yaprak çifti ve tomurcuk */
function duvarDesen(w: number, h: number) {
  const parcalar: string[] = []
  const motif = (cx: number, cy: number, don: number) => {
    const c = Math.cos(don)
    const s = Math.sin(don)
    const T = (px: number, py: number): Nk => [cx + px * c - py * s, cy + px * s + py * c]
    const kam = kamci(0, 0, 130, -1.25, {
      donus: 1.05,
      dalga: 0.8,
      us: 2.2,
      yon: 1,
      n: 46,
    }).map(([px, py]) => T(px - 6, py + 62))
    parcalar.push(sivri(kam, 5.6, 0.7, 0.85))
    const kam2 = kamci(0, 0, 70, -1.5, {
      donus: 0.9,
      dalga: 0.5,
      us: 2.1,
      yon: -1,
      n: 30,
    }).map(([px, py]) => T(px + 10, py + 40))
    parcalar.push(sivri(kam2, 3.4, 0.5, 0.9))
    const a = T(-2, 20)
    const b = T(14, -4)
    parcalar.push(yaprakAt(a[0], a[1], don - 2.4, 34, 11), yaprakAt(b[0], b[1], don - 0.5, 30, 10))
    const t = T(6, -38)
    parcalar.push(...petalAt(t[0], t[1], don - 1.6, 17, 5, 0.36))
  }
  for (const dx of [-w, 0, w]) {
    for (const dy of [-h, 0, h]) {
      motif(w * 0.5 + dx, h * 0.5 + dy, 0)
      motif(dx, dy, Math.PI)
      motif(w + dx, dy, Math.PI)
      motif(dx, h + dy, Math.PI)
      motif(w + dx, h + dy, Math.PI)
    }
  }
  return parcalar
}

export function DokuKatmani() {
  const { doku } = useNouveau()
  const id = useId().replace(/:/g, '')
  const cicek = useMemo(() => (doku === 'cicek' ? cicekDesen(9, 520) : []), [doku])
  const duvar = useMemo(() => (doku === 'duvar' ? duvarDesen(190, 250) : []), [doku])
  return (
    <div className="doku-katman" data-doku={doku} aria-hidden="true">
      {doku === 'cicek' ? (
        <svg>
          <defs>
            <pattern id={`pc${id}`} width="520" height="520" patternUnits="userSpaceOnUse">
              {cicek.map((d, i) => (govdeMi(d) ? <path key={i} d={d} fill="none" stroke="var(--dok-renk)" strokeWidth="1.4" strokeLinecap="round" /> : <path key={i} d={d} fillOpacity="0.8" />))}
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#pc${id})`} style={{ fill: `url(#pc${id})` }} />
        </svg>
      ) : null}
      {doku === 'duvar' ? (
        <svg>
          <defs>
            <pattern id={`pd${id}`} width="190" height="250" patternUnits="userSpaceOnUse">
              {duvar.map((d, i) => (
                <path key={i} d={d} />
              ))}
            </pattern>
          </defs>
          <rect width="100%" height="100%" style={{ fill: `url(#pd${id})` }} />
        </svg>
      ) : null}
    </div>
  )
}

/** Doku örnekleri için sabit küçük önizleme (Doku bölümü) */
export function DokuOrnek({ tur }: { tur: 'parsomen' | 'cicek' | 'duvar' }) {
  const id = useId().replace(/:/g, '')
  const cicek = useMemo(() => (tur === 'cicek' ? cicekDesen(9, 520) : []), [tur])
  const duvar = useMemo(() => (tur === 'duvar' ? duvarDesen(190, 250) : []), [tur])
  if (tur === 'parsomen') {
    return (
      <div className="absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background: 'var(--dok-renk)',
            opacity: 0.5,
            WebkitMaskImage: 'var(--m-parsomen)',
            maskImage: 'var(--m-parsomen)',
            WebkitMaskSize: '520px',
            maskSize: '520px',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 85% 75% at 50% 42%, transparent 50%, var(--kenar) 130%)',
          }}
        />
      </div>
    )
  }
  return (
    <svg className="absolute inset-0 h-full w-full" aria-hidden="true" style={{ fill: 'var(--dok-renk)', opacity: 0.55 }}>
      <defs>
        {tur === 'cicek' ? (
          <pattern id={`oc${id}`} width="520" height="520" patternUnits="userSpaceOnUse" patternTransform="scale(.55)">
            {cicek.map((d, i) => (govdeMi(d) ? <path key={i} d={d} fill="none" stroke="var(--dok-renk)" strokeWidth="1.6" strokeLinecap="round" /> : <path key={i} d={d} fillOpacity="0.8" />))}
          </pattern>
        ) : (
          <pattern id={`od${id}`} width="190" height="250" patternUnits="userSpaceOnUse" patternTransform="scale(.7)">
            {duvar.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </pattern>
        )}
      </defs>
      <rect width="100%" height="100%" style={{ fill: `url(#${tur === 'cicek' ? 'oc' : 'od'}${id})` }} />
    </svg>
  )
}
