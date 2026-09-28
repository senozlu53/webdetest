import type { PointerEvent } from 'react'

/** Holografik yüzeyde parlama imleci izler: --mx, --my */
export function sheen(e: PointerEvent<HTMLElement>) {
  const b = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${(((e.clientX - b.left) / b.width) * 100).toFixed(1)}%`)
  e.currentTarget.style.setProperty('--my', `${(((e.clientY - b.top) / b.height) * 100).toFixed(1)}%`)
}
