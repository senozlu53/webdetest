import { useState } from 'react'
import { cx } from '../../shared/cx'
import { useWin, type PencereId } from '../lib/store'
import { Pixel } from './Pixel'
import { UYGULAMALAR } from './Taskbar'

/**
 * Masaüstü simgeleri: tek tık seçer, çift tık ya da Enter açar. Dokunmatik ekranda tek dokunuş açar.
 * Yazı hep masaüstü renginde düz bir zeminde (duvar kağıdı ne olursa olsun): beyaz turkuazda 4,77:1. Seçiliyken lacivert zemin ve noktalı çerçeve.
 */
export function DesktopIcons() {
  const w = useWin()
  const [secili, setSecili] = useState<PencereId | null>(null)
  const dokunmatik = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  return (
    <aside aria-labelledby="masaustu-b" className="md:sticky md:top-4 md:self-start">
      <h2 id="masaustu-b" className="sr-only">
        Masaüstü simgeleri
      </h2>
      <p id="masaustu-ipucu" className="sr-only">
        Açmak için Enter'a basın ya da çift tıklayın.
      </p>
      <ul className="grid grid-cols-3 gap-1 sm:grid-cols-6 md:grid-cols-1" data-simgeler="">
        {UYGULAMALAR.map((u) => (
          <li key={u.id}>
            <button
              type="button"
              aria-describedby="masaustu-ipucu"
              className="group flex w-full flex-col items-center gap-1 px-1 py-1.5 text-desk-text focus-visible:outline-none"
              onClick={() => (dokunmatik ? w.ac(u.id) : setSecili(u.id))}
              onDoubleClick={() => w.ac(u.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  w.ac(u.id)
                }
              }}
              onBlur={() => setSecili((s) => (s === u.id ? null : s))}
              data-simge={u.id}
            >
              <Pixel ad={u.ikon} boyut={2} className={cx(secili === u.id && 'opacity-60')} />
              <span className={cx('border border-dotted border-transparent px-0.5 text-center text-[0.8125rem] leading-tight [text-shadow:none]', secili === u.id ? 'secili border-desk-text' : 'bg-desk group-focus-visible:border-desk-text')}>{u.ad}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
