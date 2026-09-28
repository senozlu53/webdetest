import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { useDar, useWin } from '../lib/store'
import type { IkonAd } from '../lib/pixel'
import { Pixel } from './Pixel'
import { Button } from './ui'
import { Win95Window, useSurukle } from './Win95Window'

/**
 * Madde 11 · 14: <DialogBox>. "X" kapatma tuşlu klasik diyalog. Kipli: arkası tıklanmaz, Tab içeride döner,
 * Esc kapatır; açılınca varsayılan düğme odak alır, kapanınca odak eski yerine döner. Açılış ve kapanış anında.
 * Madde 17: telefonda tam ekran.
 */
export function DialogBox({ baslik, ikon, children, altlik, onKapat, genislik = '26rem', uyari }: { baslik: string; ikon?: IkonAd; children: ReactNode; altlik: ReactNode; onKapat: () => void; genislik?: string; uyari?: boolean }) {
  const dar = useDar()
  const [konum, setKonum] = useState<{ x: number; y: number } | null>(null)
  const { kok, tutamac } = useSurukle(konum ?? { x: 0, y: 0 }, (x, y) => setKonum({ x, y }), dar)
  const onceki = useRef<HTMLElement | null>(null)
  const kapatRef = useRef(onKapat)
  kapatRef.current = onKapat

  useLayoutEffect(() => {
    onceki.current = document.activeElement as HTMLElement | null
    const el = kok.current
    if (!el) return
    if (!dar) {
      const w = el.offsetWidth
      const h = el.offsetHeight
      setKonum({ x: Math.round((window.innerWidth - w) / 2), y: Math.max(16, Math.round((window.innerHeight - h) / 2.6)) })
    }
    const hedef = el.querySelector<HTMLElement>('[data-varsayilan]') ?? el.querySelector<HTMLElement>('button, input, select, textarea, [tabindex="0"]')
    hedef?.focus()
    return () => {
      const o = onceki.current
      if (o && document.contains(o)) o.focus()
    }
    // Yalnız açılışta
  }, [])

  useEffect(() => {
    const el = kok.current
    if (!el) return
    const tus = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        kapatRef.current()
        return
      }
      if (e.key !== 'Tab') return
      const odak = [...el.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select, textarea, a[href], [tabindex="0"]')].filter((x) => x.offsetParent !== null)
      if (!odak.length) return
      const ilk = odak[0]
      const son = odak[odak.length - 1]
      if (e.shiftKey && document.activeElement === ilk) {
        e.preventDefault()
        son.focus()
      } else if (!e.shiftKey && document.activeElement === son) {
        e.preventDefault()
        ilk.focus()
      }
    }
    el.addEventListener('keydown', tus)
    return () => el.removeEventListener('keydown', tus)
  }, [kok])

  const stil = dar
    ? ({ position: 'fixed', left: 0, top: 0, right: 0, bottom: '2.75rem' } as const)
    : // Konum ilk boyamadan önce (layout effect) hesaplanır; gizlemeye gerek yok, gizli öğe odak alamaz
      { position: 'fixed' as const, left: konum?.x ?? 0, top: konum?.y ?? 0, width: `min(${genislik}, calc(100vw - 1rem))` }
  return (
    <div className="fixed inset-0 z-[200]" data-diyalog-kok="">
      {/* Kipli: arkadaki masaüstü tıklanmaz */}
      <div className="absolute inset-0" aria-hidden="true" />
      <div ref={kok} style={stil} className="flex flex-col">
        <Win95Window baslik={baslik} rol={uyari ? 'alertdialog' : 'dialog'} onKapat={onKapat} katlanir={false} tutamac={tutamac} className="min-h-0 flex-1" govde="k95 overflow-auto p-3" seviye="h2" kapatEtiket="Kapat">
          <div className="flex gap-4" data-diyalog-metin="">
            {ikon ? <Pixel ad={ikon} boyut={2} className="mt-1" /> : null}
            <div className="min-w-0 flex-1">{children}</div>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">{altlik}</div>
        </Win95Window>
      </div>
    </div>
  )
}

/** Kuyruktaki standart mesaj kutuları (bilgi, uyarı, hata, soru) */
export function Diyaloglar() {
  const { diyaloglar } = useWin()
  const d = diyaloglar[diyaloglar.length - 1]
  if (!d) return null
  // Esc = İptal; yoksa Hayır, Kapat, Tamam sırasıyla
  const iptal = ['iptal', 'hayir', 'kapat', 'tamam'].find((v) => d.butonlar.some((b) => b.deger === v)) ?? d.butonlar[d.butonlar.length - 1].deger
  return (
    <DialogBox
      key={d.id}
      baslik={d.baslik}
      ikon={d.ikon}
      uyari={d.ikon === 'uyari' || d.ikon === 'hata'}
      onKapat={() => d.coz(iptal)}
      altlik={d.butonlar.map((b) => (
        <Button key={b.deger} varsayilan={b.varsayilan} data-varsayilan={b.varsayilan ? '' : undefined} onClick={() => d.coz(b.deger)}>
          {b.ad}
        </Button>
      ))}
    >
      <div className="pt-1">{d.mesaj}</div>
    </DialogBox>
  )
}
