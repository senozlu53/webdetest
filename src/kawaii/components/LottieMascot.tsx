import { useEffect, useMemo, useRef } from 'react'
import lottie, { type AnimationItem } from 'lottie-web/build/player/lottie_light'
import { cx } from '../../shared/cx'
import { useKawaii } from '../lib/store'
import { ikonAnim, maskotAnim } from '../lib/lottie'
import type { MaskotRenk, Ruh } from '../lib/maskot'

/**
 * lottie-web (light, SVG oynatıcı) ile animasyon. Veri kodla üretilir; her örnek kendi kopyasını alır
 * çünkü oynatıcı verinin üstüne yazar. Hareket kapalıysa ilk kare durağan çizilir.
 */
export function useLottie<T extends HTMLElement = HTMLDivElement>(veri: object, { dongu = true, oynat = true, hiz = 1, dur = 0 }: { dongu?: boolean; oynat?: boolean; hiz?: number; dur?: number } = {}) {
  const ref = useRef<T>(null)
  const anim = useRef<AnimationItem | null>(null)
  const { hareket } = useKawaii()
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const a = lottie.loadAnimation({
      container: el,
      renderer: 'svg',
      loop: dongu,
      autoplay: false,
      animationData: JSON.parse(JSON.stringify(veri)),
      rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
    })
    anim.current = a
    return () => {
      a.destroy()
      anim.current = null
    }
  }, [veri, dongu])
  useEffect(() => {
    const a = anim.current
    if (!a) return
    a.setSpeed(hiz)
    if (hareket && oynat) a.play()
    else a.goToAndStop(dur, true)
  }, [veri, dongu, hareket, oynat, hiz, dur])
  return { ref, anim }
}

/** Madde 14: Lottie destekli maskot. Aynı çizim, jöle gibi esner, zıplar ve göz kırpar */
export function LottieMascot({ ruh = 'mutlu', renk = 'peach', boyut = 160, oynat = true, hiz = 1, className, etiket }: { ruh?: Ruh; renk?: MaskotRenk; boyut?: number; oynat?: boolean; hiz?: number; className?: string; etiket?: string }) {
  const veri = useMemo(() => maskotAnim(ruh, renk), [ruh, renk])
  const { maskot } = useKawaii()
  const { ref } = useLottie(veri, { oynat: oynat && maskot, hiz })
  return (
    <div className={cx('shrink-0', className)} style={{ width: boyut, height: boyut }} role={etiket ? 'img' : undefined} aria-label={etiket} aria-hidden={etiket ? undefined : true} data-lottie={ruh}>
      <div ref={ref} className="size-full" />
    </div>
  )
}

/** Düğme içindeki küçük Lottie ikon: üstüne gelince / basınca bir kez oynar */
export function LottieIkon({ tip, boyut = 30, tetik }: { tip: 'kalp' | 'yildiz'; boyut?: number; tetik: number }) {
  const veri = useMemo(() => ikonAnim(tip), [tip])
  const { ref, anim } = useLottie<HTMLSpanElement>(veri, {
    dongu: false,
    oynat: false,
  })
  const { hareket } = useKawaii()
  useEffect(() => {
    if (tetik && hareket) anim.current?.goToAndPlay(0, true)
  }, [tetik, hareket, anim])
  return <span ref={ref} className="inline-block shrink-0" style={{ width: boyut, height: boyut }} aria-hidden="true" data-lottie-ikon={tip} />
}
