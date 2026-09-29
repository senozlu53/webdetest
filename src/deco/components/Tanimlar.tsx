/** Ortak SVG tanımları: altın çizgi gradyanları (temaya göre renk değiştirir) */
export function Tanimlar() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="dc-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--altin-koyu)' }} />
          <stop offset="0.22" style={{ stopColor: 'var(--altin-isik)' }} />
          <stop offset="0.46" style={{ stopColor: 'var(--altin)' }} />
          <stop offset="0.64" style={{ stopColor: 'var(--altin-koyu)' }} />
          <stop offset="0.84" style={{ stopColor: 'var(--altin-isik)' }} />
          <stop offset="1" style={{ stopColor: 'var(--altin)' }} />
        </linearGradient>
      </defs>
    </svg>
  )
}
