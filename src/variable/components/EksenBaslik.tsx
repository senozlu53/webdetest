import { useAnimationFrame } from 'motion/react'
import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from 'react'
import { cx } from '../../shared/cx'
import { AILELER, type Aile } from '../lib/data'
import { lerp, sinirla, yayAdim, type Yay } from '../lib/fizik'
import { useVariable } from '../lib/store'
import { useEkranda, useKayit } from './hooks'

export interface EksenHaritasi {
  /** CSS özel özelliği (--wght, --wdth, --slnt, --casl, --soft, --wonk, --opsz) */
  v: string
  min: number
  max: number
  /** 1 − t: ekseni ters çevirir */
  ters?: boolean
}
export interface Harita {
  x: EksenHaritasi[]
  y: EksenHaritasi[]
  /** dinlenme (imleç yok) değerleri */
  dinlenme: Record<string, number>
}

const ETIKET: Record<string, string> = { '--wght': 'wght', '--wdth': 'wdth', '--slnt': 'slnt', '--casl': 'CASL', '--soft': 'SOFT', '--wonk': 'WONK', '--opsz': 'opsz', '--mono': 'MONO' }

/**
 * <EksenBaslik>: kart içi imleç koordinatlarını yazı tipi eksenlerine bağlayan başlık kartı.
 * x → bir eksen grubu, y → bir başka eksen grubu; her eksen kendi yayında elastik olarak hedefe gider ve aşar.
 * Klavye: ok tuşları sanal imleci oynatır, Home sıfırlar. Hareket kapalıyken kart dinlenme durumunda durur.
 */
export function EksenBaslik({
  metin,
  aile,
  harita,
  alt,
  ad = 'eksen-baslik',
  sertlik = 170,
  sonum = 11,
  boy = 'clamp(44px, 12vw, 150px)',
  className,
  uz,
}: {
  metin: string
  aile: Aile
  harita: Harita
  alt?: string
  ad?: string
  sertlik?: number
  sonum?: number
  boy?: string
  className?: string
  uz?: number
}) {
  const { hareket, kilitli } = useVariable()
  const kart = useRef<HTMLDivElement>(null)
  const kelime = useRef<HTMLSpanElement>(null)
  const oku = useRef<HTMLParagraphElement>(null)
  const hedef = useRef({ nx: 0.5, ny: 0.5, var: false })
  const yaylar = useRef<Record<string, Yay>>({})
  const kare = useRef(0)
  const [, ekrandaRef] = useEkranda(kart)
  const calisiyor = hareket && !kilitli
  useKayit(ad, calisiyor)
  const hepsi = [...harita.x, ...harita.y]
  const yaz = (v: string, d: number) => kelime.current?.style.setProperty(v, d.toFixed(v === '--casl' || v === '--mono' ? 3 : 1))
  // dinlenme durumu
  useEffect(() => {
    for (const e of hepsi) yaz(e.v, harita.dinlenme[e.v] ?? e.min)
    yaylar.current = {}
    if (oku.current && kart.current) {
      oku.current.textContent = hareket ? 'İmleci kartın üstünde gezdirin' : 'Hareket durdu: dinlenme durumu'
      kart.current.dataset.eksen = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calisiyor, aile])
  useAnimationFrame((_, delta) => {
    const el = kelime.current
    if (!calisiyor || !el || !ekrandaRef.current) return
    const dt = Math.min(delta / 1000, 1 / 30)
    const h = hedef.current
    const uretici = (e: EksenHaritasi, t: number) => lerp(e.min, e.max, e.ters ? 1 - t : t)
    const sonuc: string[] = []
    for (const e of hepsi) {
      const ekseneX = harita.x.includes(e)
      const hedefDeger = h.var ? uretici(e, ekseneX ? h.nx : h.ny) : (harita.dinlenme[e.v] ?? e.min)
      let y = yaylar.current[e.v]
      if (!y) {
        y = { x: harita.dinlenme[e.v] ?? e.min, v: 0 }
        yaylar.current[e.v] = y
      }
      yayAdim(y, hedefDeger, sertlik, sonum, dt)
      const lo = Math.min(e.min, e.max)
      const hi = Math.max(e.min, e.max)
      // yay aşabilir; yazı tipi sınırlarında kırpılır
      const d = sinirla(y.x, lo, hi)
      yaz(e.v, d)
      sonuc.push(`${ETIKET[e.v] ?? e.v} ${Math.round(d * 100) / 100}`)
    }
    kare.current++
    if (kare.current % 5 === 0 && oku.current && kart.current) {
      const s = sonuc.join(' · ')
      oku.current.textContent = s
      kart.current.dataset.eksen = s
    }
  })
  const izle = (e: PointerEvent) => {
    const r = kart.current!.getBoundingClientRect()
    hedef.current = { nx: sinirla((e.clientX - r.left) / r.width, 0, 1), ny: sinirla((e.clientY - r.top) / r.height, 0, 1), var: true }
  }
  const birak = () => {
    hedef.current = { ...hedef.current, var: false }
  }
  const tus = (e: KeyboardEvent) => {
    const h = hedef.current
    const adim = 0.1
    let { nx, ny } = h
    if (!h.var) {
      nx = 0.5
      ny = 0.5
    }
    if (e.key === 'ArrowLeft') nx -= adim
    else if (e.key === 'ArrowRight') nx += adim
    else if (e.key === 'ArrowUp') ny -= adim
    else if (e.key === 'ArrowDown') ny += adim
    else if (e.key === 'Home' || e.key === 'Escape') {
      // Home sayfayı en başa kaydırmasın: kart odaktayken bu tuş yalnız kartı sıfırlar
      if (e.key === 'Home') e.preventDefault()
      hedef.current = { nx: 0.5, ny: 0.5, var: false }
      return
    } else return
    e.preventDefault()
    hedef.current = { nx: sinirla(nx, 0, 1), ny: sinirla(ny, 0, 1), var: true }
  }
  const kelimeSayisi = uz ?? Math.max(...metin.split(' ').map((w) => [...w].length))
  return (
    <div
      ref={kart}
      className={cx('relative flex flex-col justify-between border-2 border-metin p-5', className)}
      tabIndex={0}
      role="group"
      aria-label={`${metin}: imleci ya da ok tuşlarını kullanarak yazı tipi eksenlerini değiştirin`}
      onPointerMove={izle}
      onPointerDown={izle}
      onPointerLeave={birak}
      onBlur={birak}
      onKeyDown={tus}
      style={{ touchAction: 'pan-y' }}
      data-eksen-kart={aile}
      data-eksen=""
    >
      <p className="kicker">
        {AILELER[aile].ad}
        {alt ? ` · ${alt}` : ''}
      </p>
      <div className="sigdir my-5">
        <span ref={kelime} className={cx('kh vk vk-boy disp', AILELER[aile].css)} style={{ ['--boy' as string]: boy, ['--uz' as string]: kelimeSayisi }} aria-hidden="true" data-kelime="">
          <span className="kw">{metin}</span>
        </span>
        <span className="sr-only">{metin}</span>
      </div>
      <p ref={oku} className="rakam text-[13px] text-soluk" aria-live="off">
        İmleci kartın üstünde gezdirin
      </p>
    </div>
  )
}
