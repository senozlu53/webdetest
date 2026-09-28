import { useEffect, useId, useRef, useState } from 'react'
import { cx } from '../../shared/cx'
import type { Ton } from '../lib/data'
import { useArcade } from '../lib/store'

export type BarTur = 'can' | 'mana' | 'xp' | 'yukleme'

/** Can çubuğunun rengi orana göre değişir; renk yalnız değil, sayı ve "KRİTİK" yazısı da söyler */
export function barTon(tur: BarTur, oran: number): Ton {
  if (tur === 'mana') return 'camgobegi'
  if (tur === 'xp') return 'eflatun'
  if (tur === 'yukleme') return 'sari'
  return oran > 0.5 ? 'yesil' : oran > 0.25 ? 'sari' : 'kirmizi'
}

/**
 * Madde 11 · 14: <HealthBar>. Segmentli çubuk; yükleyici olarak da kullanılır (tur="yukleme").
 * Değer düşünce kaybedilen kısım bir an beyaz kalır, sonra segment segment erir (hareket kapalıysa hemen).
 * Erişim: can/mana/xp için role="meter", yükleyici için role="progressbar"; aria-valuetext "CAN 72 / 100".
 */
export function HealthBar({ deger, max = 100, etiket, bolum = 20, tur = 'can', kritik = 0.25, yukseklik = 6, gizliEtiket, degerGoster = true, className }: { deger: number; max?: number; etiket: string; bolum?: number; tur?: BarTur; kritik?: number; yukseklik?: number; gizliEtiket?: boolean; degerGoster?: boolean; className?: string }) {
  const { hareket } = useArcade()
  const id = useId()
  const v = Math.max(0, Math.min(max, deger))
  const oran = v / max
  const dolu = Math.ceil(oran * bolum - 1e-9)
  const [iz, setIz] = useState(dolu)
  const onceki = useRef(dolu)
  useEffect(() => {
    const eski = onceki.current
    onceki.current = dolu
    if (dolu >= eski || !hareket) {
      setIz(dolu)
      return
    }
    setIz(eski)
    let n = eski
    let t = 0
    const bekle = window.setTimeout(() => {
      t = window.setInterval(() => {
        n -= 1
        setIz(n)
        if (n <= dolu) window.clearInterval(t)
      }, 45)
    }, 280)
    return () => {
      window.clearTimeout(bekle)
      window.clearInterval(t)
    }
  }, [dolu, hareket])
  const ton = barTon(tur, oran)
  const kritikMi = tur === 'can' && oran <= kritik
  const metin = tur === 'yukleme' ? `%${Math.round(oran * 100)}` : `${Math.round(v)} / ${max}`
  return (
    <div className={cx('min-w-0', className)}>
      <div className={cx('flex items-baseline justify-between gap-3', gizliEtiket && 'sr-only')}>
        <span id={id} className="font-ps text-xs uppercase">
          {etiket}
        </span>
        <span className="flex items-baseline gap-3">
          {kritikMi ? (
            <span data-ton="kirmizi" className="blink font-ps text-xs text-tx" data-hz="2">
              Kritik!
            </span>
          ) : null}
          {degerGoster ? <span className="tabnum text-body">{metin}</span> : null}
        </span>
      </div>
      <div
        role={tur === 'yukleme' ? 'progressbar' : 'meter'}
        aria-labelledby={id}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={Math.round(v)}
        aria-valuetext={`${etiket} ${metin}${kritikMi ? ', kritik' : ''}`}
        className="hp mt-1"
        data-ton={ton}
        data-tur={tur}
        style={{ ['--n' as string]: bolum, ['--h' as string]: yukseklik }}
      >
        {Array.from({ length: bolum }, (_, i) => (
          <i key={i} data-dolu={i < dolu ? '' : undefined} data-iz={i >= dolu && i < iz ? '' : undefined} />
        ))}
      </div>
    </div>
  )
}
