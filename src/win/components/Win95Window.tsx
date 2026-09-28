import { useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent as RPE, type ReactNode } from 'react'
import { cx } from '../../shared/cx'
import { useDar, useWin, type PencereId } from '../lib/store'
import type { IkonAd } from '../lib/pixel'
import { Glif, Pixel } from './Pixel'
import { StatusBar } from './ui'

type Seviye = 'h1' | 'h2' | 'h3'

/**
 * Madde 11 · 14: <Win95Window>. Kabartmalı çerçeve, lacivert başlık çubuğu, sağda küçült / büyüt / kapat.
 * İçerik belgesi olan pencereler (bölümler) sayfanın akışında durur; küçült düğmesi gövdeyi katlar.
 */
export function Win95Window({
  baslik,
  ikon,
  children,
  aktif = true,
  seviye = 'h2',
  id,
  className,
  govde,
  durum,
  onKapat,
  onKucult,
  onBuyut,
  buyuk,
  katlanir = true,
  style,
  tutamac,
  rol,
  kapatEtiket,
}: {
  baslik: ReactNode
  ikon?: IkonAd
  children: ReactNode
  aktif?: boolean
  seviye?: Seviye
  id?: string
  className?: string
  govde?: string
  durum?: ReactNode[]
  onKapat?: () => void
  onKucult?: () => void
  onBuyut?: () => void
  buyuk?: boolean
  katlanir?: boolean
  style?: CSSProperties
  tutamac?: (e: RPE<HTMLDivElement>) => void
  rol?: 'dialog' | 'alertdialog'
  kapatEtiket?: string
}) {
  const hid = useId()
  const gid = useId()
  const [kat, setKat] = useState(false)
  const H = seviye
  const baslikMetni = typeof baslik === 'string' ? baslik : ''
  const Kok = rol ? 'div' : 'section'
  return (
    <Kok id={id} role={rol} aria-modal={rol ? true : undefined} aria-labelledby={hid} className={cx('outset flex min-w-0 flex-col p-0.5', !aktif && 'pasif', className)} style={style} data-pencere="">
      <div className="baslik" onPointerDown={tutamac} style={tutamac ? { touchAction: 'none' } : undefined}>
        {ikon ? <Pixel ad={ikon} /> : null}
        <H id={hid} className="min-w-0 flex-1 truncate text-[0.8125rem] font-bold">
          {baslik}
        </H>
        <span className="flex shrink-0 items-center gap-0.5">
          {onKucult || (katlanir && !onKapat) ? (
            <button
              type="button"
              className="tb"
              onClick={onKucult ?? (() => setKat((k) => !k))}
              aria-label={onKucult ? `Küçült: ${baslikMetni}` : kat ? `Geri yükle: ${baslikMetni}` : `Küçült: ${baslikMetni}`}
              aria-expanded={onKucult ? undefined : !kat}
              aria-controls={onKucult ? undefined : gid}
            >
              <Glif tip={kat ? 'geri' : 'kucult'} />
            </button>
          ) : null}
          {onBuyut ? (
            <button type="button" className="tb" onClick={onBuyut} aria-label={buyuk ? `Önceki boyut: ${baslikMetni}` : `Ekranı kapla: ${baslikMetni}`}>
              <Glif tip={buyuk ? 'geri' : 'buyut'} />
            </button>
          ) : null}
          {onKapat ? (
            <button type="button" className="tb ml-0.5" onClick={onKapat} aria-label={kapatEtiket ?? `Kapat: ${baslikMetni}`}>
              <Glif tip="kapat" />
            </button>
          ) : null}
        </span>
      </div>
      <div id={gid} hidden={kat} className={cx('min-h-0 flex-1', govde ?? 'p-3')}>
        {children}
      </div>
      {durum && !kat ? <StatusBar parcalar={durum} /> : null}
    </Kok>
  )
}

/** Başlık çubuğundan sürükleme: anında izler, ekran dışına çıkmaz */
export function useSurukle(konum: { x: number; y: number }, tasi: (x: number, y: number) => void, kapali: boolean) {
  const kok = useRef<HTMLDivElement>(null)
  return {
    kok,
    tutamac: (e: RPE<HTMLDivElement>) => {
      if (kapali || e.button !== 0 || (e.target as HTMLElement).closest('button')) return
      const el = e.currentTarget
      el.setPointerCapture(e.pointerId)
      const bx = e.clientX - konum.x
      const by = e.clientY - konum.y
      const w = kok.current?.offsetWidth ?? 300
      const move = (ev: PointerEvent) => {
        const x = Math.max(-w + 80, Math.min(window.innerWidth - 80, ev.clientX - bx))
        const y = Math.max(0, Math.min(window.innerHeight - 90, ev.clientY - by))
        tasi(Math.round(x), Math.round(y))
      }
      const up = () => {
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerup', up)
        el.removeEventListener('pointercancel', up)
      }
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerup', up)
      el.addEventListener('pointercancel', up)
    },
  }
}

/**
 * Masaüstü uygulama penceresi: sürüklenir, öne gelir, görev çubuğuna küçülür, ekranı kaplar.
 * Madde 17: 768px altında her zaman tam ekran (görev çubuğunun üstü), sürükleme yok.
 */
export function AppWindow({ pid, baslik, ikon, children, genislik = '28rem', durum, govde }: { pid: PencereId; baslik: string; ikon: IkonAd; children: ReactNode; genislik?: string; durum?: ReactNode[]; govde?: string }) {
  const w = useWin()
  const p = w.pencereler[pid]
  const dar = useDar()
  const tam = dar || p.buyuk
  const { kok, tutamac } = useSurukle(p, (x, y) => w.tasi(pid, x, y), tam)
  const acildi = useRef(false)
  useEffect(() => {
    if (p.acik && !p.kucuk && !acildi.current) {
      acildi.current = true
      kok.current?.focus()
    }
    if (!p.acik) acildi.current = false
  }, [p.acik, p.kucuk, kok])
  if (!p.acik || p.kucuk) return null
  const stil: CSSProperties = tam
    ? { position: 'fixed', left: 0, top: 0, right: 0, bottom: '2.75rem', zIndex: 60 + p.z }
    : { position: 'fixed', left: p.x, top: p.y, width: `min(${genislik}, calc(100vw - 1rem))`, maxHeight: 'calc(100vh - 4rem)', zIndex: 60 + p.z }
  return (
    <div
      ref={kok}
      tabIndex={-1}
      style={stil}
      className="flex flex-col outline-none"
      onPointerDownCapture={() => w.aktif !== pid && w.one(pid)}
      onFocusCapture={() => w.aktif !== pid && w.one(pid)}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && !w.diyaloglar.length) {
          e.stopPropagation()
          w.kapat(pid)
        }
      }}
      data-app={pid}
    >
      <Win95Window
        baslik={baslik}
        ikon={ikon}
        aktif={w.aktif === pid}
        onKapat={() => w.kapat(pid)}
        onKucult={() => w.kucult(pid)}
        onBuyut={dar ? undefined : () => w.buyut(pid)}
        buyuk={p.buyuk}
        tutamac={tutamac}
        className="min-h-0 flex-1"
        govde={cx('k95 overflow-auto', govde ?? 'p-3')}
        durum={durum}
        seviye="h2"
      >
        {children}
      </Win95Window>
    </div>
  )
}
