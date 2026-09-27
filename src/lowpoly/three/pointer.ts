/** Sayfa genelinde imleç konumu (−1…1). Yeniden render tetiklemez; sahneler her karede okur. */
export const pointer = { x: 0, y: 0 }

let bound = false
export function bindPointer() {
  if (bound || typeof window === 'undefined') return
  bound = true
  window.addEventListener(
    'pointermove',
    (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    },
    { passive: true },
  )
}
