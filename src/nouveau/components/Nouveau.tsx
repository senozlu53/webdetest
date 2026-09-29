import { useMemo, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type CSSProperties, type ReactNode, type Ref } from 'react'
import { cx } from '../../shared/cx'
import { konturYol, kontur, sus as susUret, type SusSeviye } from '../lib/bitki'
import { useNouveau } from '../lib/store'
import { Gorsel, type SahneAd } from './Gorsel'
import { useGorunur, useSize } from './hooks'

/* ───────────────────────── Düğme ───────────────────────── */

type Varyant = 'dolu' | 'cizgi' | 'metin'
type Ortak = {
  varyant?: Varyant
  boy?: 'k' | 'b'
  ikon?: ReactNode
  children?: ReactNode
  className?: string
}

/** Madde 14: <NouveauButton>. Yaprak biçimli, hover'da özsu alttan yükselir (dalgalı üst kenar) */
export function NouveauButton({
  varyant = 'cizgi',
  boy,
  ikon,
  className,
  children,
  type = 'button',
  ref,
  ...rest
}: Ortak & {
  ref?: Ref<HTMLButtonElement>
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button ref={ref} type={type} data-varyant={varyant} data-boy={boy} className={cx('nbtn', className)} {...rest}>
      <span className="nbtn-ic">
        {children}
        {ikon}
      </span>
    </button>
  )
}
export function NouveauLink({ varyant = 'cizgi', boy, ikon, className, children, ...rest }: Ortak & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a data-varyant={varyant} data-boy={boy} className={cx('nbtn', className)} {...rest}>
      <span className="nbtn-ic">
        {children}
        {ikon}
      </span>
    </a>
  )
}

/* ───────────────────────── Sade panel (Madde 18) ───────────────────────── */

/** Metin blokları için düz, dokusuz, süssüz panel. Köşeler dik değil, ama içi tamamen sade */
export function SadePanel({
  children,
  className,
  ic,
  as: Tag = 'div',
  ...rest
}: {
  children: ReactNode
  className?: string
  ic?: string
  as?: 'div' | 'section' | 'article' | 'li'
} & Omit<React.HTMLAttributes<HTMLElement>, 'className'>) {
  const T = Tag as 'div'
  return (
    <T className={cx('sade-panel', className)} data-sade-panel="" {...rest}>
      <div className={cx('p-6', ic)}>{children}</div>
    </T>
  )
}

/* ───────────────────────── Çerçeve (Madde 6 · 7 · 11 · 14) ───────────────────────── */

interface CerceveProps {
  tohum?: number
  /** arkada üst üste binen çerçeve sayısı (Madde 7) */
  katman?: number
  /** katmanların kayma miktarı (px) */
  ayrisma?: number
  /** katmanların eğimi (derece) */
  egim?: number
  /** süs seviyesini bu çerçeve için sabitler; verilmezse sayfa ayarı */
  sus?: SusSeviye
  genlik?: number
  dalgaBoyu?: number
  asimetri?: number
  className?: string
  style?: CSSProperties
  children?: ReactNode
  /** kontur dolgusu (süs bandı rengi); metin bu bandın üstüne değil, içteki düz plakaya yazılır */
  dolgu?: string
  /** düz metin plakasının iç boşluğu (Tailwind sınıfı) */
  plaka?: string
  /** sarmaşık yerine yalnız kontur */
  yalnizKontur?: boolean
  as?: 'div' | 'article' | 'li' | 'section'
  'data-testid'?: string
}

/** Çerçevenin kenar payı: sarmaşığın taşabileceği alan (seviyeye göre küçülür, Madde 17) */
export const PAY: Record<SusSeviye, number> = { tam: 34, sade: 22, yalin: 12 }
/** Konturla düz metin plakası arasındaki süs bandı: sarmaşık bu bandın içinde kalır (Madde 18) */
export const BANT: Record<SusSeviye, number> = { tam: 30, sade: 18, yalin: 12 }

/**
 * Kıvrımlı bitkisel çerçeveli kart. Kutuyu ölçer, dalgalı kontur ve sarmaşık süsünü
 * piksel uzayında çizer. Metin, konturun içindeki düz `dolgu` yüzeyinde durur (Madde 18).
 */
export function Cerceve({ tohum = 1, katman = 0, ayrisma = 12, egim = 1.6, sus: susOv, genlik = 6, dalgaBoyu = 150, asimetri = 0.7, className, style, children, dolgu = 'var(--band)', plaka = 'p-5 sm:p-7', yalnizKontur, as: Tag = 'div', ...rest }: CerceveProps) {
  const { sus: sayfaSus, hareket } = useNouveau()
  const seviye = yalnizKontur ? 'yalin' : (susOv ?? sayfaSus)
  const [ref, { w, h }] = useSize<HTMLDivElement>()
  const [gRef, goruldu] = useGorunur<HTMLDivElement>(0.12)
  const ekPay = katman > 0 ? ayrisma + 4 : 0
  const pay = PAY[seviye] + ekPay
  const olcek = seviye === 'tam' ? 1 : 0.82
  const g = useMemo(() => {
    if (w < 40 || h < 40) return null
    const gen = seviye === 'tam' ? genlik : genlik * 0.8
    const ana = kontur(w, h, {
      tohum,
      genlik: gen,
      dalgaBoyu: dalgaBoyu * (seviye === 'tam' ? 1 : 1.15),
      asimetri,
      pay,
    })
    const ic = kontur(w, h, {
      tohum: tohum + 101,
      genlik: gen * 0.7,
      dalgaBoyu: dalgaBoyu * 0.9,
      asimetri: asimetri * 0.7,
      pay: pay + 9,
    })
    const alt = Array.from({ length: katman }, (_, i) =>
      kontur(w, h, {
        tohum: tohum + 31 * (i + 1),
        genlik: gen,
        dalgaBoyu: dalgaBoyu * (1 + i * 0.12),
        asimetri: 0.9,
        pay: pay - ekPay + 2,
      }),
    )
    const s = susUret(ana, { tohum, seviye, olcek, kutu: [w, h] })
    return {
      ana: konturYol(ana),
      ic: konturYol(ic),
      alt: alt.map(konturYol),
      s,
    }
  }, [w, h, tohum, katman, seviye, genlik, dalgaBoyu, asimetri, pay, ekPay, olcek])
  const bosluk = pay + BANT[seviye]
  const T = Tag as 'div'
  return (
    <T
      ref={(el: HTMLElement | null) => {
        ;(ref as { current: Element | null }).current = el
        ;(gRef as { current: Element | null }).current = el
      }}
      className={cx('cerceve relative isolate', className)}
      style={style}
      data-cerceve=""
      data-sus={seviye}
      data-katman={katman || undefined}
      {...rest}
    >
      {g ? (
        <svg className="pointer-events-none absolute inset-0 -z-10 overflow-visible" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" data-cerceve-svg="">
          {g.alt.map((d, i) => (
            <path
              key={i}
              d={d}
              fill={`var(--kat${(i % 3) + 1})`}
              stroke="var(--nv-gold)"
              strokeWidth="1.2"
              strokeOpacity={0.85 - i * 0.15}
              transform={`translate(${(i % 2 ? -1 : 1) * ayrisma * (1 - i * 0.15)} ${(i + 1) * ayrisma * 0.55}) rotate(${(i % 2 ? -1 : 1) * egim * (i + 1)} ${w / 2} ${h / 2})`}
              data-katman-yolu=""
            />
          ))}
          <path d={g.ana} fill={dolgu} stroke="var(--nv-gold)" strokeWidth="1.7" strokeLinejoin="round" data-kontur="" />
          <path d={g.ic} fill="none" stroke="var(--nv-sage)" strokeWidth="1" strokeOpacity="0.85" />
          {seviye !== 'yalin' ? (
            <g className="sus" data-goruldu={goruldu || !hareket ? '' : undefined}>
              <path d={g.s.govde} fill="none" stroke="var(--nv-sage)" strokeWidth={seviye === 'tam' ? 2.4 : 2} strokeLinecap="round" pathLength={1} className="sus-govde" />
              {g.s.kivrimlar.map((k, i) => (
                <g
                  key={`k${i}`}
                  className="sus-buyu"
                  data-tur="kivrim"
                  style={{
                    ['--d' as string]: `${k.gecikme}s`,
                    transformOrigin: `${k.x}px ${k.y}px`,
                  }}
                >
                  <path d={k.d} fill="var(--nv-gold)" />
                </g>
              ))}
              {g.s.yapraklar.map((y, i) => (
                <g
                  key={`y${i}`}
                  className="sus-buyu"
                  data-tur="yaprak"
                  style={{
                    ['--d' as string]: `${y.gecikme}s`,
                    transformOrigin: `${y.x}px ${y.y}px`,
                  }}
                >
                  <g
                    className={i % 3 === 0 ? 'sus-salin' : undefined}
                    style={{
                      ['--d' as string]: `${(i % 7) * 0.7}s`,
                      transformOrigin: `${y.x}px ${y.y}px`,
                    }}
                  >
                    <path d={y.d} fill={y.ton === 0 ? 'var(--nv-sage)' : y.ton === 1 ? 'var(--nv-yaprak-a)' : 'var(--nv-gold)'} fillOpacity={0.9} stroke="var(--nv-gece)" strokeWidth={0.5} strokeOpacity={0.55} />
                    <path d={y.damar} fill="none" stroke="var(--nv-gece)" strokeWidth={0.6} strokeOpacity={0.45} />
                  </g>
                </g>
              ))}
              {g.s.cicekler.map((c, i) => (
                <g
                  key={`c${i}`}
                  className="sus-buyu"
                  data-tur="cicek"
                  style={{
                    ['--d' as string]: `${c.gecikme}s`,
                    transformOrigin: `${c.x}px ${c.y}px`,
                  }}
                >
                  {c.petal.map((d, j) => (
                    <path key={j} d={d} fill="var(--nv-gul)" stroke="var(--nv-gul-k)" strokeWidth={0.7} />
                  ))}
                  <circle cx={c.x} cy={c.y} r={c.r * 0.16} fill="var(--nv-gold)" />
                </g>
              ))}
            </g>
          ) : null}
        </svg>
      ) : null}
      <div className="cerceve-ic" style={{ padding: bosluk }}>
        <div className="sade-panel cerceve-plaka" data-sade-panel="">
          <div className={plaka}>{children}</div>
        </div>
      </div>
    </T>
  )
}

/** Madde 11 · 14: kenarları kıvrımlı bitkisel çerçeveli kart */
export function BotanikKart({
  tohum = 1,
  baslik,
  kicker,
  children,
  katman = 0,
  className,
  ...rest
}: {
  tohum?: number
  baslik?: ReactNode
  kicker?: ReactNode
  children?: ReactNode
  katman?: number
  className?: string
} & Pick<CerceveProps, 'sus' | 'ayrisma' | 'egim' | 'asimetri' | 'yalnizKontur'>) {
  return (
    <Cerceve as="article" tohum={tohum} katman={katman} className={cx('botanik-kart', className)} {...rest}>
      {kicker ? <p className="kicker">{kicker}</p> : null}
      {baslik ? <h3 className="baslik mt-2 text-[clamp(26px,2.4vw,30px)]">{baslik}</h3> : null}
      <div className={cx(baslik || kicker ? 'mt-3' : '')}>{children}</div>
    </Cerceve>
  )
}

/* ───────────────────────── Dalgalı maskeli görsel (Madde 11 · 14) ───────────────────────── */

/**
 * Dairesel yerine dalgalı maskelenmiş görsel alanı. Kontur `clip-path: path()` ile kesilir;
 * aynı kontur altın çizgi ve sarmaşık olarak görselin üstüne biner.
 */
export function DalgaGorsel({
  sahne,
  oran = '4 / 5',
  tohum = 3,
  altyazi,
  etiket,
  sus: susOv,
  className,
  konum,
  genlik = 8,
  dalgaBoyu = 120,
  asimetri = 0.9,
}: {
  sahne: SahneAd
  oran?: string
  tohum?: number
  altyazi?: ReactNode
  etiket?: string
  sus?: SusSeviye
  className?: string
  konum?: string
  genlik?: number
  dalgaBoyu?: number
  asimetri?: number
}) {
  const { sus: sayfaSus, hareket } = useNouveau()
  const seviye = susOv ?? sayfaSus
  const [ref, { w, h }] = useSize<HTMLDivElement>()
  const [gRef, goruldu] = useGorunur<HTMLDivElement>(0.1)
  const pay = seviye === 'tam' ? 26 : seviye === 'sade' ? 16 : 8
  const g = useMemo(() => {
    if (w < 40 || h < 40) return null
    const gen = seviye === 'tam' ? genlik : genlik * 0.8
    const ana = kontur(w, h, {
      tohum,
      genlik: gen,
      dalgaBoyu,
      asimetri,
      pay,
      us: 3.6,
    })
    const cerceve = kontur(w, h, {
      tohum,
      genlik: gen,
      dalgaBoyu,
      asimetri,
      pay: Math.max(2, pay - 8),
      us: 3.6,
    })
    const s = susUret(cerceve, {
      tohum: tohum + 5,
      seviye,
      olcek: seviye === 'tam' ? 1 : 0.8,
      kapsam: 0.62,
      kutu: [w, h],
    })
    return { klip: konturYol(ana), cerceve: konturYol(cerceve), s }
  }, [w, h, tohum, seviye, pay, genlik, dalgaBoyu, asimetri])
  return (
    <figure className={cx('m-0 min-w-0', className)} data-dalga-gorsel="" data-sus={seviye}>
      <div
        ref={(el) => {
          ;(ref as { current: Element | null }).current = el
          ;(gRef as { current: Element | null }).current = el
        }}
        className="relative w-full"
        style={{ aspectRatio: oran }}
      >
        {g ? (
          <>
            <div
              className="absolute inset-0"
              style={{
                clipPath: `path('${g.klip}')`,
                WebkitClipPath: `path('${g.klip}')`,
              }}
              data-klip=""
            >
              <Gorsel sahne={sahne} tohum={tohum} konum={konum} etiket={etiket} />
            </div>
            <svg className="pointer-events-none absolute inset-0 overflow-visible" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
              <path d={g.klip} fill="none" stroke="var(--nv-gold)" strokeWidth="2" />
              <path d={g.cerceve} fill="none" stroke="var(--nv-gold)" strokeWidth="1" strokeOpacity="0.8" />
              {seviye !== 'yalin' ? (
                <g className="sus" data-goruldu={goruldu || !hareket ? '' : undefined}>
                  <path d={g.s.govde} fill="none" stroke="var(--nv-sage)" strokeWidth="2.2" strokeLinecap="round" pathLength={1} className="sus-govde" />
                  {g.s.kivrimlar.map((k, i) => (
                    <g
                      key={`k${i}`}
                      className="sus-buyu"
                      style={{
                        ['--d' as string]: `${k.gecikme}s`,
                        transformOrigin: `${k.x}px ${k.y}px`,
                      }}
                    >
                      <path d={k.d} fill="var(--nv-gold)" />
                    </g>
                  ))}
                  {g.s.yapraklar.map((y, i) => (
                    <g
                      key={`y${i}`}
                      className="sus-buyu"
                      style={{
                        ['--d' as string]: `${y.gecikme}s`,
                        transformOrigin: `${y.x}px ${y.y}px`,
                      }}
                    >
                      <path d={y.d} fill={y.ton === 0 ? 'var(--nv-sage)' : y.ton === 1 ? 'var(--nv-yaprak-a)' : 'var(--nv-gold)'} fillOpacity={0.92} stroke="var(--nv-gece)" strokeWidth={0.5} strokeOpacity={0.55} />
                    </g>
                  ))}
                </g>
              ) : null}
            </svg>
          </>
        ) : null}
      </div>
      {altyazi ? <figcaption className="mt-3 text-[16px] text-soluk">{altyazi}</figcaption> : null}
    </figure>
  )
}
