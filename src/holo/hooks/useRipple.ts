import type { KeyboardEvent, PointerEvent } from 'react'
import { motionOff } from './useView'

function spawn(host: HTMLElement, x: number, y: number) {
  if (motionOff()) return
  const r = host.getBoundingClientRect()
  const size = Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y)) * 2
  const el = document.createElement('span')
  el.className = 'ripple'
  el.setAttribute('aria-hidden', 'true')
  el.style.left = `${x}px`
  el.style.top = `${y}px`
  el.style.width = el.style.height = `${size}px`
  host.appendChild(el)
  el.addEventListener('animationend', () => el.remove(), { once: true })
}

/**
 * Madde 16: tıklamada dalgalanma. İşaretçi basılan noktadan, klavyede (Enter / Boşluk) ortadan yayılır.
 * Öğeye `ripple-host` sınıfı verilmelidir.
 */
export function ripple<T extends HTMLElement>() {
  return {
    onPointerDown: (e: PointerEvent<T>) => {
      const r = e.currentTarget.getBoundingClientRect()
      spawn(e.currentTarget, e.clientX - r.left, e.clientY - r.top)
    },
    onKeyDown: (e: KeyboardEvent<T>) => {
      if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) {
        const r = e.currentTarget.getBoundingClientRect()
        spawn(e.currentTarget, r.width / 2, r.height / 2)
      }
    },
  }
}
