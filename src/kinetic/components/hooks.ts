import { useAnimationFrame } from 'motion/react'
import { useEffect, useId, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { HAREKET_KAYDI, useKinetic } from '../lib/store'

/** Ekranda mı? Ekran dışındaki hareketli bileşen hiçbir iş yapmaz */
export function useEkranda<T extends Element>(ref: RefObject<T | null>, pay = '120px', anahtar?: unknown) {
  const [g, setG] = useState(true)
  const gr = useRef(true)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (es) => {
        const v = es.some((e) => e.isIntersecting)
        gr.current = v
        setG(v)
      },
      { rootMargin: pay },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, pay, anahtar])
  return [g, gr] as const
}

/** Hareket bütçesi: çalışan bileşeni kayda yazar, ekrandan çıkınca ya da hareket kapanınca siler */
export function useKayit(ad: string, calisiyor: boolean) {
  const id = useId()
  useEffect(() => {
    if (!calisiyor) return
    const k = `${ad}:${id}`
    HAREKET_KAYDI.add(k)
    return () => {
      HAREKET_KAYDI.delete(k)
    }
  }, [ad, id, calisiyor])
}

/**
 * Zaman tabanlı harf hareketi: --t (sn, hız çarpanıyla) kapsayıcıya yazılır; harfler CSS sin() ile bu değere bağlıdır.
 * Hareket kapalıyken ya da ekran dışındayken döngü hiçbir şey yazmaz.
 */
export function useSaat(ref: RefObject<HTMLElement | null>, ad: string, aktif = true) {
  const { hareket, hizRef } = useKinetic()
  const [ekranda, ekrandaRef] = useEkranda(ref)
  const t = useRef(0)
  const calisiyor = hareket && aktif && ekranda
  useKayit(ad, calisiyor)
  useAnimationFrame((_, delta) => {
    if (!hareket || !aktif || !ekrandaRef.current) return
    const el = ref.current
    if (!el) return
    t.current += (delta / 1000) * hizRef.current
    el.style.setProperty('--t', t.current.toFixed(3))
  })
  // hareket kapanınca son kare değil, başlangıç durumu
  useLayoutEffect(() => {
    if (!hareket) ref.current?.style.removeProperty('--t')
  }, [hareket, ref])
}

/** İmleç yakınlığı: her harfe --p (0–1) yazar. Harf ne kadar yakınsa ağırlık o kadar artar */
export function useYakinlik(ref: RefObject<HTMLElement | null>, aktif = true) {
  const { hareket, tam } = useKinetic()
  const [, ekrandaRef] = useEkranda(ref)
  const isaretci = useRef<{ x: number; y: number } | null>(null)
  const degerler = useRef<number[]>([])
  const calisiyor = hareket && tam && aktif
  useEffect(() => {
    if (!calisiyor) return
    const mv = (e: PointerEvent) => {
      isaretci.current = { x: e.clientX, y: e.clientY }
    }
    const ayril = () => {
      isaretci.current = null
    }
    window.addEventListener('pointermove', mv, { passive: true })
    window.addEventListener('pointerdown', mv, { passive: true })
    document.documentElement.addEventListener('pointerleave', ayril)
    window.addEventListener('pointerup', (e) => e.pointerType === 'touch' && ayril())
    return () => {
      window.removeEventListener('pointermove', mv)
      window.removeEventListener('pointerdown', mv)
      document.documentElement.removeEventListener('pointerleave', ayril)
    }
  }, [calisiyor])
  useAnimationFrame(() => {
    const el = ref.current
    if (!calisiyor || !el || !ekrandaRef.current) return
    const harfler = el.querySelectorAll<HTMLElement>('.kc')
    const pt = isaretci.current
    if (!pt && degerler.current.every((v) => v === 0)) return
    const olcu: { yaricap: number; d: number }[] = []
    harfler.forEach((h) => {
      const r = h.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      olcu.push({ yaricap: Math.max(150, r.height * 1.25), d: pt ? Math.hypot(pt.x - cx, pt.y - cy) : Infinity })
    })
    harfler.forEach((h, i) => {
      const hedef = pt ? Math.pow(Math.max(0, 1 - olcu[i].d / olcu[i].yaricap), 1.4) : 0
      const onceki = degerler.current[i] ?? 0
      let yeni = onceki + (hedef - onceki) * 0.16
      if (Math.abs(yeni) < 0.004) yeni = 0
      if (yeni !== onceki) {
        degerler.current[i] = yeni
        h.style.setProperty('--p', yeni.toFixed(3))
      }
    })
  })
  useLayoutEffect(() => {
    if (calisiyor) return
    degerler.current = []
    ref.current?.querySelectorAll<HTMLElement>('.kc').forEach((h) => h.style.removeProperty('--p'))
  }, [calisiyor, ref])
  useKayit('imlec', calisiyor)
}
