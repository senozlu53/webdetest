import { useEffect, useRef } from 'react'
import { cx } from '../../shared/cx'
import { AILELER, type Aile } from '../lib/data'
import { useVariable } from '../lib/store'
import { useEkranda, useKayit } from './hooks'

/**
 * <GlitchMetin>: kısa patlamalarla kayan yatay dilimler (Madde 8). Yüzey temiz kalır; bozulma yalnız birkaç
 * dilimde, en çok 260 ms sürer ve iki patlama arasında en az 1,2 sn vardır. Hareket kapalıyken ya da ayardan
 * kapatılınca hiç çalışmaz.
 */
export function GlitchMetin({ metin, aile = 'flex', boy = 'clamp(48px, 15vw, 230px)', className, uz, tetik = 0 }: { metin: string; aile?: Aile; boy?: string; className?: string; uz?: number; tetik?: number }) {
  const { hareket, glitch } = useVariable()
  const kok = useRef<HTMLSpanElement>(null)
  const sayi = useRef(0)
  const zamanlayici = useRef<number[]>([])
  const son = useRef(0)
  const [ekranda, ekrandaRef] = useEkranda(kok)
  const aktif = hareket && glitch === 'acik'
  useKayit('glitch', aktif && ekranda)
  const sifirla = () => {
    kok.current?.querySelectorAll<HTMLElement>('.glitch-kat').forEach((k) => {
      k.style.setProperty('--gt', '0%')
      k.style.setProperty('--gb', '100%')
      k.style.setProperty('--gx', '0')
    })
    if (kok.current) kok.current.dataset.glitchDurum = 'sakin'
  }
  const patla = () => {
    const el = kok.current
    if (!el || !aktif) return
    const simdi = performance.now()
    if (simdi - son.current < 1200) return
    son.current = simdi
    sayi.current++
    el.dataset.glitchDurum = 'patlak'
    el.dataset.glitchSay = String(sayi.current)
    zamanlayici.current.forEach((t) => window.clearTimeout(t))
    zamanlayici.current = []
    const kat = el.querySelectorAll<HTMLElement>('.glitch-kat')
    for (let a = 0; a < 4; a++) {
      zamanlayici.current.push(
        window.setTimeout(() => {
          kat.forEach((k, j) => {
            const ust = Math.random() * 70
            const yuk = 8 + Math.random() * 22
            k.style.setProperty('--gt', `${ust.toFixed(1)}%`)
            k.style.setProperty('--gb', `${Math.max(0, 100 - ust - yuk).toFixed(1)}%`)
            k.style.setProperty('--gx', ((Math.random() * 2 - 1) * 26 * (j === 0 ? 1 : -1)).toFixed(1))
          })
        }, a * 55),
      )
    }
    zamanlayici.current.push(window.setTimeout(sifirla, 4 * 55 + 40))
  }
  useEffect(() => {
    if (!aktif) {
      sifirla()
      return
    }
    // ekrandayken 3,5–6 sn'de bir kendiliğinden patlar
    const id = window.setInterval(
      () => {
        if (ekrandaRef.current) patla()
      },
      4200 + Math.random() * 1600,
    )
    return () => {
      window.clearInterval(id)
      zamanlayici.current.forEach((t) => window.clearTimeout(t))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aktif])
  useEffect(() => {
    if (tetik) patla()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tetik])
  const kelimeSay = uz ?? Math.max(...metin.split(' ').map((w) => [...w].length))
  const ortak = cx('vk vk-boy disp', AILELER[aile].css)
  const st = { ['--boy' as string]: boy, ['--uz' as string]: kelimeSay, ['--wght' as string]: 900, ['--wdth' as string]: 120 }
  return (
    <span className="sigdir">
      <span ref={kok} className={cx('glitch', className)} onPointerEnter={patla} data-glitch="" data-glitch-durum="sakin" data-glitch-say="0">
        <span className={cx(ortak, 'kh')} style={st}>
          <span className="sr-only">{metin}</span>
          <span aria-hidden="true">{metin}</span>
        </span>
        {(['a', 'b'] as const).map((k) => (
          <span key={k} className={cx('glitch-kat', ortak)} data-kat={k} style={st} aria-hidden="true">
            {metin}
          </span>
        ))}
      </span>
    </span>
  )
}
