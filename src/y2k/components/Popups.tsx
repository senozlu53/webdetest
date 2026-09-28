import { useEffect, useRef } from 'react'
import { useY2K } from '../lib/store'
import { cx } from '../../shared/cx'
import { ChromeButton } from './ChromeButton'
import { IconClose, IconWindow } from './Icons'

/**
 * Madde 16: hızlı açılıp kapanan pop-up pencereler (140ms açılış, 90ms kapanış). Esc en üsttekini kapatır.
 * Kullanıcı açtıysa odak pencerenin düğmesine geçer; kapanınca eski yerine döner.
 */
export function Popups() {
  const { popups, kapat } = useY2K()
  const onceki = useRef(new Map<number, HTMLElement | null>())
  const odaklandi = useRef(new Set<number>())
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      const son = [...popups].reverse().find((p) => !p.kapaniyor)
      if (son) kapat(son.id)
    }
    window.addEventListener('keydown', f)
    return () => window.removeEventListener('keydown', f)
  }, [popups, kapat])
  // Kapanan pencerenin odağını geri ver
  useEffect(() => {
    for (const [id, el] of onceki.current) {
      if (!popups.some((p) => p.id === id)) {
        onceki.current.delete(id)
        if (el && document.activeElement === document.body) el.focus()
      }
    }
  }, [popups])
  const W = typeof window === 'undefined' ? 1280 : window.innerWidth
  const H = typeof window === 'undefined' ? 800 : window.innerHeight
  return (
    <div className="pointer-events-none fixed inset-0 z-[90]" data-popups="">
      {popups.map((p, i) => {
        const w = Math.min(340, W - 32)
        const left = Math.max(16, Math.min(p.x, W - w - 16))
        const top = Math.max(80, Math.min(p.y, H - 260))
        return (
          <section
            key={p.id}
            role="dialog"
            aria-labelledby={`pp-${p.id}`}
            className={cx('rim pointer-events-auto absolute overflow-hidden rounded-[22px] p-0', p.kapaniyor ? 'pop-out' : 'pop-in')}
            style={{ left, top, width: w, zIndex: i + 1 }}
            data-popup={p.id}
          >
            <header className={cx(p.ton, 'flex items-center gap-2 px-3 py-2')}>
              <IconWindow size={16} />
              <h2 id={`pp-${p.id}`} className="min-w-0 flex-1 truncate font-logo text-[11.5px] tracking-[0.08em] uppercase">
                {p.baslik}
              </h2>
              <button type="button" onClick={() => kapat(p.id)} className="chrome grid size-8 shrink-0 place-items-center rounded-full border border-[#2b3445]/55" aria-label={`Kapat: ${p.baslik}`}>
                <IconClose size={14} />
              </button>
            </header>
            <div className="px-4 pt-3 pb-4 text-[15px] leading-snug text-ink">{p.metin}</div>
            <div className="flex justify-end px-4 pb-4">
              <ChromeButton
                boyut="sm"
                ton={p.ton === 'grape' ? 'candy' : p.ton}
                onClick={() => kapat(p.id)}
                ref={(el) => {
                  if (el && p.odak && !odaklandi.current.has(p.id)) {
                    odaklandi.current.add(p.id)
                    onceki.current.set(p.id, document.activeElement as HTMLElement | null)
                    el.focus()
                  }
                }}
              >
                Tamam
              </ChromeButton>
            </div>
          </section>
        )
      })}
    </div>
  )
}
