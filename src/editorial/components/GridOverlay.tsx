/** Madde 12: 12 kolonluk kılavuz. Sayfanın gerçek kolonlarının üstüne biner; başlıktaki "Izgara" düğmesiyle açılır. */
export function GridOverlay() {
  return (
    <div className="izgara-kaplama" aria-hidden="true" data-izgara-kaplama="">
      <div className="kap">
        <div className="g">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
