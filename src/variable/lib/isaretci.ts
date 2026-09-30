/** Sayfa genelinde tek bir işaretçi dinleyicisi: imleç ya da parmak konumu */
export const isaretci = { x: -9999, y: -9999, var: false, dokunma: false }
let kuruldu = false
export function isaretciKur() {
  if (kuruldu || typeof window === 'undefined') return
  kuruldu = true
  const mv = (e: PointerEvent) => {
    isaretci.x = e.clientX
    isaretci.y = e.clientY
    isaretci.var = true
    isaretci.dokunma = e.pointerType === 'touch'
  }
  const bitir = (e: PointerEvent) => {
    if (e.pointerType === 'touch') isaretci.var = false
  }
  window.addEventListener('pointermove', mv, { passive: true })
  window.addEventListener('pointerdown', mv, { passive: true })
  window.addEventListener('pointerup', bitir, { passive: true })
  window.addEventListener('pointercancel', bitir, { passive: true })
  document.documentElement.addEventListener('pointerleave', () => {
    isaretci.var = false
  })
}
