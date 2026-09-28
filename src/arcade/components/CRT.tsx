import { useEffect, useRef } from 'react'

/**
 * Madde 8: CRT katmanı. Tarama çizgileri (::before), yukarıdan aşağı kayan yenileme bandı (::after)
 * ve 4 karelik gren (Noise Layer). Gren her açılışta 256×64 tuvale bir kez çizilir; kareler steps(4) ile atlar.
 * Tıklamayı geçirir, ekran okuyucudan gizlidir. Ayarlardan kapatılır; Kılavuz temasında zaten yoktur.
 */
export function CRT() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const cv = document.createElement('canvas')
    cv.width = 256
    cv.height = 64
    const ctx = cv.getContext('2d')
    if (!ctx || !ref.current) return
    const img = ctx.createImageData(256, 64)
    for (let i = 0; i < img.data.length; i += 4) {
      const r = Math.random()
      if (r < 0.05) {
        // beyaz gren
        img.data.set([255, 255, 255, 40], i)
      } else if (r < 0.065) {
        // renk sapması kırıntısı: kırmızı ya da camgöbeği
        img.data.set(Math.random() < 0.5 ? [255, 0, 0, 46] : [0, 255, 255, 46], i)
      }
    }
    ctx.putImageData(img, 0, 0)
    ref.current.style.setProperty('--gren', `url(${cv.toDataURL('image/png')})`)
  }, [])
  return (
    <div ref={ref} className="crt" aria-hidden="true" data-crt-katman="">
      <i />
    </div>
  )
}
