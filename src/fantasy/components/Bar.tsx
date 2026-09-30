import { cx } from '../../shared/cx'

export type BarTur = 'can' | 'mana' | 'deneyim'
const ETIKET: Record<BarTur, string> = { can: 'Can', mana: 'Mana', deneyim: 'Deneyim' }

/**
 * <HealthBar>: iksir şişesi gibi cam görünümlü dolum çubuğu. Dolgu 500 ms'de yeni değere gelir,
 * "hasar izi" 1,2 sn içinde yetişir. Değer çubuğun içinde değil dışında yazılır (okunabilirlik).
 */
export function HealthBar({ deger, azami, tur = 'can', etiket, kisa = false, className }: { deger: number; azami: number; tur?: BarTur; etiket?: string; kisa?: boolean; className?: string }) {
  const ad = etiket ?? ETIKET[tur]
  const yuzde = Math.max(0, Math.min(100, (deger / azami) * 100))
  return (
    <div className={cx('bar-kap', className)} data-bar={tur} data-yuzde={yuzde.toFixed(1)}>
      {!kisa ? (
        <div className="bar-ust">
          <span className="t-etiket">{ad}</span>
          <span className="rakam" data-bar-deger="">
            {deger} / {azami}
          </span>
        </div>
      ) : null}
      <div className="bar" role="progressbar" aria-label={ad} aria-valuemin={0} aria-valuemax={azami} aria-valuenow={deger} aria-valuetext={`${ad} ${deger} / ${azami}`}>
        <span className="bar-iz" style={{ width: `${yuzde}%` }} />
        <span className="bar-dolu" style={{ width: `${yuzde}%` }} />
        <span className="bar-cam" />
      </div>
    </div>
  )
}
