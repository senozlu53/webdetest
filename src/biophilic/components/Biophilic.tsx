import { useCallback, useEffect, useRef, useState, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type CSSProperties, type HTMLAttributes, type ReactNode, type Ref } from 'react'
import { cx } from '../../shared/cx'
import type { SimgeAd } from '../lib/simge'
import { useBiophilic } from '../lib/store'
import { Ikon } from './Ikon'

/* ───────────────────────── <BioButton> ───────────────────────── */

type Ton = 'dolu' | 'cam' | 'gunes' | 'metin'
type Ortak = { ton?: Ton; boy?: 'k' | 'b'; ikon?: ReactNode; children?: ReactNode; className?: string }

/** Yuvarlak düğme. Üzerine gelince biçimi çok yavaş bir hücre formuna döner; sıçrama yok */
export function BioButton({ ton = 'dolu', boy, ikon, className, children, type = 'button', ref, ...rest }: Ortak & { ref?: Ref<HTMLButtonElement> } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button ref={ref} type={type} data-ton={ton} data-boy={boy} className={cx('dugme', className)} {...rest}>
      {ikon}
      {children}
    </button>
  )
}
export function BioLink({ ton = 'dolu', boy, ikon, className, children, ...rest }: Ortak & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a data-ton={ton} data-boy={boy} className={cx('dugme', className)} {...rest}>
      {ikon}
      {children}
    </a>
  )
}

/* ───────────────────────── <BiophilicCard> (Madde 11 · 14) ───────────────────────── */

const MOD_IKON = { sabah: 'dogus', ogle: 'gunes', aksam: 'batis', gece: 'ay' } as const

/**
 * Yarı saydam cam kart. Cam yüzeyin opaklığı ve yazı rengi günün saatine göre çözülür; üst şerit gökyüzü tonlarını taşır.
 * `dinamik`: kartın üstünde o anki günün modu görünür. `nefes`: kart çok yavaş genişler ve daralır.
 */
export function BiophilicCard({
  gorsel,
  kicker,
  baslik,
  ikon,
  dinamik = false,
  mod: modProp,
  serit = true,
  nefes = false,
  children,
  className,
  ...rest
}: {
  gorsel?: ReactNode
  kicker?: ReactNode
  baslik?: ReactNode
  ikon?: SimgeAd
  dinamik?: boolean
  /** önizleme alanlarında kartın kendi modu; verilmezse sayfanın o anki modu */
  mod?: 'sabah' | 'ogle' | 'aksam' | 'gece'
  serit?: boolean
  nefes?: boolean
  children?: ReactNode
  className?: string
} & Omit<HTMLAttributes<HTMLElement>, 'className' | 'children'>) {
  const ctx = useBiophilic()
  const mod = modProp ?? ctx.mod
  return (
    <article className={cx('bcard cam', className)} data-biophilic-card="" data-nefes={nefes ? '' : undefined} {...rest}>
      {serit ? <div className="bcard-serit" aria-hidden="true" /> : null}
      {gorsel ? (
        <div className="p-3 pb-0">
          <div className="bcard-gorsel relative">{gorsel}</div>
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-5 sm:p-7">
        {dinamik || kicker || ikon ? (
          <p className="kicker flex flex-wrap items-center gap-x-3 gap-y-1">
            {ikon ? <Ikon ad={ikon} boyut={20} /> : null}
            {kicker ? <span>{kicker}</span> : null}
            {dinamik ? (
              <span className="inline-flex items-center gap-1.5 text-soluk" data-kart-mod={mod}>
                <Ikon ad={MOD_IKON[mod]} boyut={16} />
                {modAd(mod)}
              </span>
            ) : null}
          </p>
        ) : null}
        {baslik ? <h3 className="baslik mt-1 text-[clamp(22px,2.2vw,28px)]">{baslik}</h3> : null}
        <div className={cx('flex-1', !!(baslik || kicker || dinamik) && 'mt-2')}>{children}</div>
      </div>
    </article>
  )
}
const modAd = (m: 'sabah' | 'ogle' | 'aksam' | 'gece') => ({ sabah: 'Sabah ışığı', ogle: 'Öğle göğü', aksam: 'Akşam parıltısı', gece: 'Gece sakinliği' })[m]

/* ───────────────────────── nefes desenleri ───────────────────────── */

export type AdimAd = 'Nefes al' | 'Tut' | 'Nefes ver' | 'Bekle'
export interface Adim {
  ad: AdimAd
  sn: number
  bas: number
  son: number
}
export interface NefesDesen {
  id: string
  ad: string
  aciklama: string
  adimlar: Adim[]
}
export const NEFES_DESENLERI: NefesDesen[] = [
  {
    id: 'sakin',
    ad: 'Sakin nefes',
    aciklama: '4 sn al, 6 sn ver. Dakikada 6 nefes; kalp ritmini yavaşlatır.',
    adimlar: [
      { ad: 'Nefes al', sn: 4, bas: 0, son: 1 },
      { ad: 'Nefes ver', sn: 6, bas: 1, son: 0 },
    ],
  },
  {
    id: 'kutu',
    ad: 'Kutu nefesi',
    aciklama: '4 al, 4 tut, 4 ver, 4 bekle. Odaklanmadan önce.',
    adimlar: [
      { ad: 'Nefes al', sn: 4, bas: 0, son: 1 },
      { ad: 'Tut', sn: 4, bas: 1, son: 1 },
      { ad: 'Nefes ver', sn: 4, bas: 1, son: 0 },
      { ad: 'Bekle', sn: 4, bas: 0, son: 0 },
    ],
  },
  {
    id: '478',
    ad: '4-7-8 uyku',
    aciklama: '4 al, 7 tut, 8 ver. Uykuya geçişi kolaylaştırır.',
    adimlar: [
      { ad: 'Nefes al', sn: 4, bas: 0, son: 1 },
      { ad: 'Tut', sn: 7, bas: 1, son: 1 },
      { ad: 'Nefes ver', sn: 8, bas: 1, son: 0 },
    ],
  },
]
const dongusu = (d: NefesDesen) => d.adimlar.reduce((a, s) => a + s.sn, 0)
const yumusat = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, t)))
export const sureMetni = (sn: number) => {
  const s = Math.max(0, Math.round(sn))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/* ───────────────────────── <BreathProgress> ───────────────────────── */

/** Nefes ritminde kalınlaşıp incelen ilerleme çubuğu. Değer sayı ve metin olarak da verilir */
export function BreathProgress({ deger, toplam, etiket, className, format = sureMetni }: { deger: number; toplam: number; etiket: string; className?: string; format?: (n: number) => string }) {
  const p = toplam > 0 ? Math.min(100, Math.max(0, (deger / toplam) * 100)) : 0
  return (
    <div className={className}>
      <div className="mb-2 flex items-baseline justify-between gap-3 text-[15px]">
        <span className="etiket">{etiket}</span>
        <span className="font-mono text-soluk tabular-nums" data-ilerleme-metin="">
          {format(deger)} / {format(toplam)}
        </span>
      </div>
      <div className="ilerleme" role="progressbar" aria-label={etiket} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(p)} aria-valuetext={`${format(deger)} / ${format(toplam)}`} data-ilerleme={Math.round(p)}>
        <i style={{ ['--p' as string]: `${p}%` } as CSSProperties} />
      </div>
    </div>
  )
}

/* ───────────────────────── <BreatheTimer> (Madde 11 · 14 · 16) ───────────────────────── */

type Durum = 'hazir' | 'calisiyor' | 'duraklatildi' | 'bitti'

/**
 * Nefes egzersizi sayacı. Halkalar nefes alırken genişler, verirken daralır; tut adımında olduğu yerde bekler.
 * Hareket kapalıyken halkalar sabit kalır; adım adı, geri sayım ve adım listesi yönlendirir.
 */
export function BreatheTimer({ desen, sureDk, onBitir, duyurAdim = false, className }: { desen: NefesDesen; sureDk: number; onBitir?: () => void; duyurAdim?: boolean; className?: string }) {
  const { hareket, duyur } = useBiophilic()
  const kok = useRef<HTMLDivElement>(null)
  const raf = useRef(0)
  const t0 = useRef(0)
  const birikim = useRef(0)
  const [durum, setDurum] = useState<Durum>('hazir')
  const [adimNo, setAdimNo] = useState(0)
  const [kalanSn, setKalanSn] = useState(desen.adimlar[0].sn)
  const [gecenSn, setGecenSn] = useState(0)
  const [tur, setTur] = useState(0)
  const son = useRef({ adim: -1, kalan: -1, gecen: -1, tur: -1 })
  const hareketRef = useRef(hareket)
  hareketRef.current = hareket
  const toplamMs = sureDk * 60000
  const dMs = dongusu(desen) * 1000

  const n = useCallback((v: number) => kok.current?.style.setProperty('--n', v.toFixed(3)), [])

  const hesapla = useCallback(
    (gecenMs: number) => {
      const t = gecenMs % dMs
      let acc = 0
      let idx = 0
      for (let i = 0; i < desen.adimlar.length; i++) {
        if (t < acc + desen.adimlar[i].sn * 1000 || i === desen.adimlar.length - 1) {
          idx = i
          break
        }
        acc += desen.adimlar[i].sn * 1000
      }
      const a = desen.adimlar[idx]
      const faz = (t - acc) / (a.sn * 1000)
      return { idx, a, faz, deger: a.bas + (a.son - a.bas) * yumusat(faz), kalan: Math.max(1, Math.ceil(a.sn - (t - acc) / 1000)), tur: Math.floor(gecenMs / dMs) + 1 }
    },
    [desen, dMs],
  )

  const guncelle = useCallback(
    (gecenMs: number) => {
      const h = hesapla(gecenMs)
      // hareket kapalıyken halkalar orta boyda sabit kalır
      n(hareketRef.current ? h.deger : 0.5)
      const gs = Math.floor(gecenMs / 1000)
      if (son.current.adim !== h.idx) {
        son.current.adim = h.idx
        setAdimNo(h.idx)
        if (duyurAdim) duyur(`${h.a.ad}, ${h.a.sn} saniye`)
      }
      if (son.current.kalan !== h.kalan) {
        son.current.kalan = h.kalan
        setKalanSn(h.kalan)
      }
      if (son.current.gecen !== gs) {
        son.current.gecen = gs
        setGecenSn(gs)
      }
      if (son.current.tur !== h.tur) {
        son.current.tur = h.tur
        setTur(h.tur)
      }
    },
    [hesapla, n, duyur, duyurAdim],
  )

  const dongu = useCallback(
    (now: number) => {
      const gecen = birikim.current + (now - t0.current)
      if (gecen >= toplamMs) {
        birikim.current = toplamMs
        setGecenSn(Math.round(toplamMs / 1000))
        setDurum('bitti')
        n(0)
        duyur(`Egzersiz bitti. ${sureDk} dakika, ${Math.floor(toplamMs / dMs)} tam döngü.`)
        onBitir?.()
        return
      }
      guncelle(gecen)
      raf.current = requestAnimationFrame(dongu)
    },
    [toplamMs, guncelle, n, duyur, sureDk, dMs, onBitir],
  )

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  const baslat = () => {
    if (durum === 'bitti') {
      birikim.current = 0
      son.current = { adim: -1, kalan: -1, gecen: -1, tur: -1 }
    }
    t0.current = performance.now()
    setDurum('calisiyor')
    if (durum === 'hazir' || durum === 'bitti') duyur(`${desen.ad} başladı. ${sureDk} dakika.`)
    raf.current = requestAnimationFrame(dongu)
  }
  const duraklat = () => {
    cancelAnimationFrame(raf.current)
    birikim.current += performance.now() - t0.current
    setDurum('duraklatildi')
    duyur('Duraklatıldı')
  }
  const sifirla = () => {
    cancelAnimationFrame(raf.current)
    birikim.current = 0
    son.current = { adim: -1, kalan: -1, gecen: -1, tur: -1 }
    setDurum('hazir')
    setAdimNo(0)
    setKalanSn(desen.adimlar[0].sn)
    setGecenSn(0)
    setTur(0)
    n(0)
  }

  // süre değişince sıfırla
  useEffect(() => {
    sifirla()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sureDk, desen])

  const a = desen.adimlar[adimNo]
  const etiket = durum === 'hazir' ? 'Hazır' : durum === 'bitti' ? 'Bitti' : a.ad
  const sayi = durum === 'bitti' ? '✓' : durum === 'hazir' ? String(desen.adimlar[0].sn) : String(kalanSn)
  return (
    <div ref={kok} className={cx('grid grid-cols-1 gap-6', className)} style={{ ['--n' as string]: 0 } as CSSProperties} data-breathe-timer="" data-durum={durum} data-adim={durum === 'calisiyor' || durum === 'duraklatildi' ? a.ad : ''}>
      <div className="nefes" aria-hidden="true">
        <span className="nefes-halka" data-h="3" />
        <span className="nefes-halka" data-h="2" />
        <span className="nefes-halka" data-h="1" />
        <div className="nefes-orta cam" data-nefes-orta="">
          <p className="kicker !text-[12px]" data-nefes-adim="">
            {etiket}
          </p>
          <p className="rakam text-[clamp(38px,7vw,62px)] leading-none" data-nefes-sayi="">
            {sayi}
          </p>
        </div>
      </div>
      <ol className="m-0 flex list-none flex-wrap justify-center gap-2 p-0" aria-label="Adımlar" data-nefes-adimlar="">
        {desen.adimlar.map((s, i) => {
          const aktif = (durum === 'calisiyor' || durum === 'duraklatildi') && i === adimNo
          return (
            <li key={i} className="cip !min-h-[40px] !px-4 !text-[15px]" data-on={aktif ? '' : undefined}>
              {s.ad} {s.sn} sn
              {aktif ? <span className="sr-only"> (şimdi)</span> : null}
            </li>
          )
        })}
      </ol>
      <BreathProgress deger={gecenSn} toplam={sureDk * 60} etiket={`Oturum · ${tur > 0 ? `${tur}. döngü` : 'başlamadı'}`} />
      <div className="flex flex-wrap justify-center gap-3">
        {durum === 'calisiyor' ? (
          <BioButton onClick={duraklat} ikon={<Ikon ad="duraklat" boyut={20} />} data-nefes-dugme="duraklat">
            Duraklat
          </BioButton>
        ) : (
          <BioButton onClick={baslat} ikon={<Ikon ad="oynat" boyut={20} />} data-nefes-dugme="baslat">
            {durum === 'duraklatildi' ? 'Devam et' : durum === 'bitti' ? 'Yeniden' : 'Başlat'}
          </BioButton>
        )}
        <BioButton ton="cam" onClick={sifirla} ikon={<Ikon ad="yenile" boyut={20} />} disabled={durum === 'hazir'} data-nefes-dugme="sifirla">
          Sıfırla
        </BioButton>
      </div>
    </div>
  )
}
