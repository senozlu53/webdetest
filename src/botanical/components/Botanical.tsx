import { useMemo, useRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type CSSProperties, type KeyboardEvent, type ReactNode, type Ref } from 'react'
import { cx } from '../../shared/cx'
import { ornekle, serit, yaprakAt, damarAt, type Nk } from '../lib/organik'
import type { SimgeAd } from '../lib/simge'
import { Gorsel, type SahneAd } from './Gorsel'
import { Ikon } from './Ikon'

/* ───────────────────────── <EcoButton> (Madde 14) ───────────────────────── */

type Ton = 'orman' | 'zeytin' | 'kil' | 'hayalet' | 'metin'
type Ortak = { ton?: Ton; boy?: 'k' | 'b'; ikon?: ReactNode; children?: ReactNode; className?: string }

/** Taş biçimli düğme. Hover'da renk ve form yavaşça değişir; sıçrama yok, yalnız çok yumuşak gölge */
export function EcoButton({ ton = 'orman', boy, ikon, className, children, type = 'button', ref, ...rest }: Ortak & { ref?: Ref<HTMLButtonElement> } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button ref={ref} type={type} data-ton={ton} data-boy={boy} className={cx('ebtn', className)} {...rest}>
      <span className="ebtn-ic">
        {children}
        {ikon}
      </span>
    </button>
  )
}
export function EcoLink({ ton = 'orman', boy, ikon, className, children, ...rest }: Ortak & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a data-ton={ton} data-boy={boy} className={cx('ebtn', className)} {...rest}>
      <span className="ebtn-ic">
        {children}
        {ikon}
      </span>
    </a>
  )
}

/* ───────────────────────── Maskeler (Madde 11 · 12 · 14) ───────────────────────── */

export type MaskeAd = 'yaprak' | 'damla' | 'tas' | 'dalga'
/** objectBoundingBox uzayında (0–1) organik maske yolları */
export const MASKE_YOLLARI: Record<MaskeAd, string> = {
  yaprak: 'M0.06 0.94C0.02 0.55 0.2 0.16 0.62 0.05C0.8 0 0.95 0.02 0.98 0.04C0.99 0.3 0.9 0.62 0.62 0.84C0.4 0.97 0.2 0.99 0.06 0.94Z',
  damla: 'M0.5 0.03C0.6 0.25 0.92 0.42 0.92 0.66C0.92 0.86 0.74 0.97 0.5 0.97C0.26 0.97 0.08 0.86 0.08 0.66C0.08 0.42 0.4 0.25 0.5 0.03Z',
  tas: 'M0.46 0.04C0.74 0 0.98 0.16 0.97 0.46C0.96 0.78 0.78 0.99 0.48 0.97C0.2 0.96 0.02 0.8 0.03 0.5C0.04 0.24 0.2 0.07 0.46 0.04Z',
  dalga: 'M0.14 0.02H0.86C0.95 0.02 0.99 0.08 0.99 0.16V0.8C0.9 0.9 0.8 0.98 0.68 0.94C0.56 0.9 0.46 0.8 0.34 0.86C0.22 0.92 0.12 0.99 0.01 0.9V0.16C0.01 0.08 0.05 0.02 0.14 0.02Z',
}
export const MASKE_AD: Record<MaskeAd, string> = { yaprak: 'Yaprak', damla: 'Damla', tas: 'Taş', dalga: 'Dalga' }

/** Sayfada bir kez: clip-path: url(#bt-m-…) ile kullanılan gizli SVG tanımları */
export function Maskeler() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        {(Object.keys(MASKE_YOLLARI) as MaskeAd[]).map((k) => (
          <clipPath key={k} id={`bt-m-${k}`} clipPathUnits="objectBoundingBox">
            <path d={MASKE_YOLLARI[k]} />
          </clipPath>
        ))}
      </defs>
    </svg>
  )
}

/** Maskeli görsel alanı (yaprak, damla, taş, dalga) */
export function MaskeliGorsel({ sahne, maske = 'yaprak', oran = '4 / 5', tohum = 1, konum, etiket, className }: { sahne: SahneAd; maske?: MaskeAd; oran?: string; tohum?: number; konum?: string; etiket?: string; className?: string }) {
  return (
    <div className={cx('bmask w-full', className)} style={{ aspectRatio: oran, clipPath: `url(#bt-m-${maske})` }} data-maske={maske}>
      <Gorsel sahne={sahne} tohum={tohum} konum={konum} etiket={etiket} />
    </div>
  )
}

/* ───────────────────────── Dal: rüzgârda sallanan bitki (Madde 16) ───────────────────────── */

const PALET: Record<'zeytin' | 'kil' | 'toprak', string[]> = {
  zeytin: ['#556B2F', '#8A9E5B', '#5C7C7A', '#3D4F20'],
  kil: ['#C86D51', '#E3A48F', '#9A4530', '#556B2F'],
  toprak: ['#A98A5F', '#D2B48C', '#8A9E5B', '#7A5B32'],
}

/** Kıvrık saplı, iki yana yapraklı bir dal. Tümü kökünden sallanır, her yaprak ayrıca kıpırdar */
export function Dal({ boy = 120, yaprak = 6, yon = 1, palet = 'zeytin', gecikme = 0, className, style }: { boy?: number; yaprak?: number; yon?: 1 | -1; palet?: 'zeytin' | 'kil' | 'toprak'; gecikme?: number; className?: string; style?: CSSProperties }) {
  const g = useMemo(() => {
    const govde = ornekle(
      [
        [60, 136],
        [54, 104],
        [66, 72],
        [56, 40],
        [62, 8],
      ] as Nk[],
      8,
    )
    const yapraklar = Array.from({ length: yaprak }, (_, i) => {
      const idx = Math.round(((i + 1.2) / (yaprak + 0.8)) * (govde.length - 1))
      const [x, y] = govde[idx]
      const [x2, y2] = govde[Math.min(govde.length - 1, idx + 1)]
      const a = Math.atan2(y2 - y, x2 - x)
      const taraf = (i % 2 ? 1 : -1) * yon
      const bo = 34 - i * 2.2
      return { x, y, d: yaprakAt(x, y, a + taraf * (0.82 + (i % 3) * 0.08), bo, bo * 0.34), damar: damarAt(x, y, a + taraf * (0.82 + (i % 3) * 0.08), bo), c: PALET[palet][i % 4] }
    })
    return { govde: serit(govde, (t) => 3.6 - t * 2), yapraklar }
  }, [yaprak, yon, palet])
  return (
    <svg viewBox="0 0 120 140" width={(boy * 120) / 140} height={boy} className={cx('shrink-0 overflow-visible', className)} style={style} aria-hidden="true" data-dal="">
      <g className="salin" style={{ transformOrigin: '60px 136px', ['--d' as string]: `${gecikme}s` } as CSSProperties}>
        <path d={g.govde} fill={PALET[palet][3]} />
        {g.yapraklar.map((y, i) => (
          <g key={i} className="salin-yaprak" style={{ transformOrigin: `${y.x}px ${y.y}px`, ['--d' as string]: `${gecikme + i * 0.45}s` } as CSSProperties}>
            <path d={y.d} fill={y.c} />
            <path d={y.damar} fill="none" stroke="#fff" strokeOpacity=".3" strokeWidth=".8" />
          </g>
        ))}
      </g>
    </svg>
  )
}

/* ───────────────────────── <LeafDivider> (Madde 14) ───────────────────────── */

/** Yaprak ayraç. `dal`: ortada sallanan dal; `su`: yalnız akan su çizgisi; `tohum`: tohum dizisi */
export function LeafDivider({ tur = 'dal', className }: { tur?: 'dal' | 'su' | 'tohum'; className?: string }) {
  const kenar = '[-webkit-mask-image:linear-gradient(90deg,transparent,#000_18%,#000_82%,transparent)] [mask-image:linear-gradient(90deg,transparent,#000_18%,#000_82%,transparent)]'
  return (
    <div className={cx('flex w-full items-center justify-center gap-4', className)} role="presentation" aria-hidden="true" data-leaf-divider={tur}>
      {tur === 'tohum' ? (
        <div className="flex items-center gap-3">
          {[6, 9, 12, 9, 6].map((s, i) => (
            <span key={i} className="bg-zeytin" style={{ width: s, height: s * 1.3, borderRadius: '50% 50% 50% 50% / 62% 62% 38% 38%', opacity: 0.4 + i * 0.1, transform: `rotate(${(i - 2) * 14}deg)` }} />
          ))}
        </div>
      ) : (
        <>
          <div className={cx('flex-1', kenar)}>
            <div className="su-akis" style={{ ['--k' as string]: 1.2 } as CSSProperties} />
          </div>
          {tur === 'dal' ? (
            <div className="flex items-end gap-1">
              <Dal boy={54} yaprak={4} yon={-1} palet="toprak" />
              <Dal boy={70} yaprak={5} yon={1} gecikme={0.8} />
              <Dal boy={54} yaprak={4} yon={-1} palet="kil" gecikme={1.6} />
            </div>
          ) : null}
          <div className={cx('flex-1', kenar)}>
            <div className="su-akis" style={{ ['--k' as string]: 0.9 } as CSSProperties} />
          </div>
        </>
      )}
    </div>
  )
}

/* ───────────────────────── <BotanicalCard> (Madde 11 · 14) ───────────────────────── */

type KartTon = 'yuzey' | 'kil' | 'zeytin' | 'toprak' | 'orman'

/**
 * Yaprak maskeli görsel, ton sür ton arka katmanlar ve yumuşak ortam gölgesi olan kart.
 * Metin her zaman kartın düz yüzeyinde durur.
 */
export function BotanicalCard({
  maske = 'yaprak',
  sahne,
  oran = '4 / 3',
  tohum = 1,
  ton = 'yuzey',
  katman = 0,
  dal = false,
  kicker,
  baslik,
  rozet,
  children,
  className,
  etiket,
  ...rest
}: {
  maske?: MaskeAd
  sahne?: SahneAd
  oran?: string
  tohum?: number
  ton?: KartTon
  katman?: 0 | 1 | 2
  dal?: boolean
  kicker?: ReactNode
  baslik?: ReactNode
  rozet?: ReactNode
  children?: ReactNode
  className?: string
  etiket?: string
} & Omit<React.HTMLAttributes<HTMLElement>, 'className' | 'children'>) {
  return (
    <article className={cx('bcard', className)} data-ton={ton === 'yuzey' ? undefined : ton} data-katman={katman || undefined} data-botanical-card="" {...rest}>
      <div className="bcard-yuz">
        {sahne ? (
          <div className="relative p-3 pb-0">
            <MaskeliGorsel sahne={sahne} maske={maske} oran={oran} tohum={tohum} etiket={etiket} />
            {rozet ? <span className="absolute top-5 left-5 rounded-[1rem_0.5rem_1rem_0.5rem] bg-yuzey px-3 py-1 font-[family-name:var(--font-yumusak)] text-[13.5px] font-bold text-kil-yazi">{rozet}</span> : null}
          </div>
        ) : null}
        {dal ? <Dal boy={70} yaprak={5} className="pointer-events-none absolute -top-9 right-6" gecikme={tohum * 0.3} /> : null}
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          {kicker ? <p className="kicker">{kicker}</p> : null}
          {baslik ? <h3 className="baslik mt-1 text-[clamp(22px,2.2vw,28px)]">{baslik}</h3> : null}
          <div className={cx('flex-1', !!(baslik || kicker) && 'mt-2')}>{children}</div>
        </div>
      </div>
    </article>
  )
}

/* ───────────────────────── Yatay kaydırmalı kategori seçici (Madde 11) ───────────────────────── */

export function KategoriSecici<T extends string>({ liste, deger, onChange, etiket }: { liste: { id: T; ad: string; ikon: SimgeAd }[]; deger: T; onChange: (id: T) => void; etiket: string }) {
  const kap = useRef<HTMLDivElement>(null)
  const kaydir = (yon: 1 | -1) => kap.current?.scrollBy({ left: yon * 260, behavior: 'smooth' })
  const tus = (e: KeyboardEvent, i: number) => {
    let yeni = i
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') yeni = (i + 1) % liste.length
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') yeni = (i - 1 + liste.length) % liste.length
    else if (e.key === 'Home') yeni = 0
    else if (e.key === 'End') yeni = liste.length - 1
    else return
    e.preventDefault()
    onChange(liste[yeni].id)
    const btn = kap.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[yeni]
    btn?.focus()
    btn?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }
  return (
    <div className="relative" data-kategori-secici="">
      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="kicker">{etiket}</p>
        <div className="hidden gap-2 sm:flex">
          <EcoButton ton="hayalet" boy="k" onClick={() => kaydir(-1)} aria-label="Kategorileri sola kaydır" ikon={<Ikon ad="sol" boyut={20} />} style={{ minWidth: 46 }}>
            <span className="sr-only">Sola</span>
          </EcoButton>
          <EcoButton ton="hayalet" boy="k" onClick={() => kaydir(1)} aria-label="Kategorileri sağa kaydır" ikon={<Ikon ad="ok" boyut={20} />} style={{ minWidth: 46 }}>
            <span className="sr-only">Sağa</span>
          </EcoButton>
        </div>
      </div>
      <div ref={kap} role="radiogroup" aria-label={etiket} className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pt-1 pb-4 [scrollbar-width:thin] sm:-mx-1 sm:px-1" data-kaydirici="">
        {liste.map((k, i) => {
          const on = deger === k.id
          return (
            <button
              key={k.id}
              type="button"
              role="radio"
              aria-checked={on}
              tabIndex={on ? 0 : -1}
              onClick={() => onChange(k.id)}
              onKeyDown={(e) => tus(e, i)}
              data-kat={k.id}
              className={cx(
                'flex min-h-[112px] w-[128px] shrink-0 snap-center flex-col items-center justify-center gap-2 border-[1.5px] px-3 py-3 text-center font-[family-name:var(--font-yumusak)] text-[16px] font-bold transition-[background-color,border-radius,box-shadow] duration-700',
                on ? 'border-transparent bg-zeytin text-[#f8f4ea] shadow-[var(--golge-2)]' : 'border-cizgi bg-yuzey text-metin hover:bg-yuzey2',
              )}
              style={{ borderRadius: on ? '2.2rem 1rem 2.4rem 1.1rem' : '1.4rem 2.2rem 1.2rem 2.4rem' }}
            >
              <span className="grid size-11 place-items-center" style={{ borderRadius: 'var(--r-tas)', background: on ? 'rgb(255 255 255 / .16)' : 'var(--toprak-ton)' }} aria-hidden="true">
                <Ikon ad={k.ikon} boyut={26} />
              </span>
              <span>{k.ad}</span>
              {on ? <span className="sr-only">seçili</span> : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}
