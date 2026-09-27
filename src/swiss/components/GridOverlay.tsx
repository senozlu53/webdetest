/** Sayfanın üstüne 12 kolonlu grid çizgilerini yerleştirir (G tuşu). */
export function GridOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50">
      <div className="swiss-frame h-full">
        <div className="swiss-grid h-full">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="relative h-full border-x border-accent">
              <span className="absolute bottom-xs left-[3px] text-label font-bold tabular-nums text-accent">
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
