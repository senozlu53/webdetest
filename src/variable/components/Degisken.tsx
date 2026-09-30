import { useAnimationFrame } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, type CSSProperties, type ElementType } from 'react'
import { cx } from '../../shared/cx'
import { AILELER, type Aile } from '../lib/data'
import { lerp, sinirla, yayAdim, type Yay } from '../lib/fizik'
import { isaretci, isaretciKur } from '../lib/isaretci'
import { useVariable } from '../lib/store'
import { useEkranda, useKayit } from './hooks'

/** Dinlenme durumu: harf başına farklı (kaos) ya da güvenli standart (düz). Değerler 0–1 arasında normalleştirilmiş üç kanal */
const KA = [0.9, 0.12, 0.55, 1, 0.28, 0.78, 0.05, 0.66]
const KB = [1, 0.1, 0.5, 0.8, 0.28, 0.68, 0.04, 0.92]
const KC = [0, 0.6, 0, 1, 0, 0.3, 0, 0.8]
export function dinlenme(i: number, bazi: 'kaos' | 'duz') {
  if (bazi === 'duz') return { a: 0.33, b: 0.6, c: 0 }
  return { a: KA[(i * 3 + 1) % 8], b: KB[(i * 5 + 2) % 8], c: KC[(i * 7 + 3) % 8] }
}
/** üç kanalı yazı ailesinin gerçek eksen değişkenlerine çevirir */
export function kanalDegiskenleri(aile: Aile, a: number, b: number, c: number): Record<string, string> {
  const A = sinirla(a, 0, 1)
  const B = sinirla(b, 0, 1)
  const C = sinirla(c, 0, 1)
  if (aile === 'rec') return { '--wght': lerp(300, 1000, A).toFixed(1), '--casl': B.toFixed(3), '--slnt': lerp(0, -15, C).toFixed(2) }
  if (aile === 'fra') return { '--wght': lerp(100, 900, A).toFixed(1), '--soft': lerp(0, 100, B).toFixed(1), '--wonk': C > 0.45 ? '1' : '0' }
  return { '--wght': lerp(100, 1000, A).toFixed(1), '--wdth': lerp(25, 151, B).toFixed(1), '--slnt': lerp(0, -10, C).toFixed(2) }
}

interface Kanal {
  a: Yay
  b: Yay
  c: Yay
}

/** İmleç yakınlığı: yaklaşan harf şişer; çevresindeki halkadaki harf incelir. Her harf kendi yayına sahiptir (elastik) */
function useElastikHarf(ref: React.RefObject<HTMLElement | null>, aile: Aile, aktif: boolean, mod: 'yakin' | 'sabit', bazi: 'kaos' | 'duz', ad: string) {
  const { hareket, kilitli } = useVariable()
  const [, ekrandaRef] = useEkranda(ref)
  const durum = useRef<Kanal[]>([])
  const zaman = useRef(0)
  const calisiyor = hareket && !kilitli && aktif
  useKayit(ad, calisiyor)
  useEffect(() => {
    isaretciKur()
  }, [])
  useAnimationFrame((_, delta) => {
    const el = ref.current
    if (!calisiyor || !el || !ekrandaRef.current) return
    const dt = Math.min(delta / 1000, 1 / 30)
    zaman.current += dt
    const t = zaman.current
    const harfler = el.querySelectorAll<HTMLElement>('.hk')
    const pt = mod === 'yakin' && isaretci.var ? { x: isaretci.x, y: isaretci.y } : null
    const olcu: { cx: number; cy: number; R: number }[] = []
    harfler.forEach((h) => {
      const r = h.getBoundingClientRect()
      olcu.push({ cx: r.left + r.width / 2, cy: r.top + r.height / 2, R: Math.max(150, r.height * 1.5) })
    })
    harfler.forEach((h, i) => {
      const dn = dinlenme(i, bazi)
      let ta = dn.a + 0.1 * Math.sin(t * 1.3 + i * 0.9)
      let tb = dn.b + 0.08 * Math.sin(t * 1.1 + i * 0.7)
      let tc = dn.c
      if (pt) {
        const o = olcu[i]
        const d = Math.hypot(pt.x - o.cx, pt.y - o.cy)
        const p = Math.pow(sinirla(1 - d / o.R, 0, 1), 1.4)
        const halka = Math.exp(-Math.pow((sinirla(1 - d / (o.R * 1.9), 0, 1) - 0.42) / 0.16, 2)) * (1 - p)
        const yon = pt.x < o.cx ? 1 : 0.35
        ta = lerp(ta, 1, p)
        tb = lerp(tb, 1, p)
        tc = lerp(tc, 0.7 * yon, p)
        ta = lerp(ta, 0.04, halka * 0.85)
        tb = lerp(tb, 0.02, halka * 0.85)
      }
      let k = durum.current[i]
      if (!k) {
        k = { a: { x: dn.a, v: 0 }, b: { x: dn.b, v: 0 }, c: { x: dn.c, v: 0 } }
        durum.current[i] = k
      }
      yayAdim(k.a, ta, 170, 11, dt)
      yayAdim(k.b, tb, 170, 11, dt)
      yayAdim(k.c, tc, 170, 11, dt)
      const v = kanalDegiskenleri(aile, k.a.x, k.b.x, k.c.x)
      for (const [ad2, deger] of Object.entries(v)) h.style.setProperty(ad2, deger)
    })
  })
  // hareket kapanınca ya da kilitlenince harfler dinlenme durumuna döner
  useLayoutEffect(() => {
    if (calisiyor) return
    durum.current = []
    ref.current?.querySelectorAll<HTMLElement>('.hk').forEach((h, i) => {
      const dn = dinlenme(i, bazi)
      for (const [ad2, deger] of Object.entries(kanalDegiskenleri(aile, dn.a, dn.b, dn.c))) h.style.setProperty(ad2, deger)
    })
  }, [calisiyor, ref, aile, bazi])
}

/**
 * Değişken metin: kelime > harf. Ekran okuyucu metni bir kez, bütün olarak okur; harfler aria-hidden.
 * Yalnız büyük display başlıkta kullanılır (Madde 18): gövde metni hiçbir zaman bükülmez.
 */
export function Degisken({
  metin,
  aile = 'flex',
  mod = 'yakin',
  bazi = 'kaos',
  className,
  as: Tag = 'span',
  vurgulu = [],
  boy = 'clamp(48px, 14vw, 220px)',
  uz: uzDis,
  k,
  style,
  ad = 'degisken',
  sarmal = true,
}: {
  metin: string
  aile?: Aile
  mod?: 'yakin' | 'sabit'
  bazi?: 'kaos' | 'duz'
  className?: string
  as?: ElementType
  vurgulu?: number[]
  boy?: string
  uz?: number
  /** sığdırma katsayısı: harf başına ortalama ilerleme (em) */
  k?: number
  style?: CSSProperties
  ad?: string
  sarmal?: boolean
}) {
  const ref = useRef<HTMLElement>(null)
  const kelimeler = metin.split(' ')
  const uz = uzDis ?? Math.max(...kelimeler.map((w) => [...w].length))
  useElastikHarf(ref, aile, mod === 'yakin', mod, bazi, ad)
  let i = 0
  const T = Tag as 'span'
  const govde = (
    <T ref={ref} className={cx('kh vk vk-boy disp', AILELER[aile].css, className)} style={{ ['--boy' as string]: boy, ['--uz' as string]: uz, ...(k ? { ['--k' as string]: k } : null), ...style }} data-aile={aile}>
      <span className="sr-only">{metin}</span>
      <span className="kh-ic" aria-hidden="true">
        {kelimeler.map((w, wi) => (
          <span key={wi}>
            <span className={cx('kw', vurgulu.includes(wi) && 'yazi-patlama')}>
              {[...w].map((ch, ci) => {
                const dn = dinlenme(i, bazi)
                const st = kanalDegiskenleri(aile, dn.a, dn.b, dn.c)
                const idx = i++
                return (
                  <span key={ci} className="hk" style={st as CSSProperties} data-i={idx}>
                    {ch}
                  </span>
                )
              })}
            </span>
            {wi < kelimeler.length - 1 ? ' ' : null}
          </span>
        ))}
      </span>
    </T>
  )
  return sarmal ? <span className="sigdir">{govde}</span> : govde
}
