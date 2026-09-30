import { useEffect, useRef } from 'react'
import { useVariable } from '../lib/store'

type Genislik = 'ultra-condensed' | 'condensed' | 'normal' | 'expanded' | 'ultra-expanded'

/**
 * <PikselMetin>: metin küçük bir tuvale çizilir, sonra piksel piksel büyütülür (Madde 8). `piksel` 1 iken tam çözünürlük.
 * Tuval erişilebilir bir görsel değil metindir: aria-label ve gizli metin taşır.
 */
export function PikselMetin({ metin, piksel, agirlik = 900, genislik = 'expanded', genislikPx = 1200, yukseklikPx = 340 }: { metin: string; piksel: number; agirlik?: number; genislik?: Genislik; genislikPx?: number; yukseklikPx?: number }) {
  const { palet, kontrast } = useVariable()
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    let iptal = false
    const ciz = () => {
      const c = ref.current
      if (!c || iptal) return
      const ctx = c.getContext('2d')
      if (!ctx) return
      const px = Math.max(1, Math.round(piksel))
      const W = c.width
      const H = c.height
      const sw = Math.ceil(W / px)
      const sh = Math.ceil(H / px)
      const off = document.createElement('canvas')
      off.width = sw
      off.height = sh
      const o = off.getContext('2d', { willReadFrequently: true })!
      const renk = getComputedStyle(document.documentElement).getPropertyValue('--metin').trim() || '#000'
      o.fillStyle = renk
      o.textAlign = 'center'
      o.textBaseline = 'middle'
      let fs = sh * 0.78
      const yaz = () => {
        o.font = `${agirlik} ${fs}px "Roboto Flex Variable", Arial, sans-serif`
        ;(o as unknown as { fontStretch: string }).fontStretch = genislik
      }
      yaz()
      const w = o.measureText(metin).width
      if (w > sw * 0.94) {
        fs *= (sw * 0.94) / w
        yaz()
      }
      o.fillText(metin, sw / 2, sh / 2)
      // yarı saydam kenarları kes: gerçek piksel görünümü
      const img = o.getImageData(0, 0, sw, sh)
      for (let i = 3; i < img.data.length; i += 4) img.data[i] = img.data[i] > 110 ? 255 : 0
      o.putImageData(img, 0, 0)
      ctx.clearRect(0, 0, W, H)
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(off, 0, 0, sw, sh, 0, 0, sw * px, sh * px)
    }
    void document.fonts.load(`${agirlik} 100px "Roboto Flex Variable"`).then(ciz)
    ciz()
    return () => {
      iptal = true
    }
  }, [metin, piksel, agirlik, genislik, palet, kontrast])
  return (
    <div>
      <span className="sr-only">{metin}</span>
      <canvas ref={ref} width={genislikPx} height={yukseklikPx} className="piksel-tuval" role="img" aria-label={`${metin}, piksel boyu ${Math.round(piksel)}`} data-piksel={Math.round(piksel)} />
    </div>
  )
}
