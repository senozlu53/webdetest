import { useEffect, useMemo, useRef, useState } from 'react'
import { cx } from '../../shared/cx'
import { pad } from '../lib/ascii'
import { SEVIYE_ETIKET, type Log, type Seviye } from '../lib/data'
import { Btn, Check } from './ui'

const SEVIYELER: Seviye[] = ['bilgi', 'uyari', 'hata', 'ayikla']
const AD: Record<Seviye, string> = { bilgi: 'bilgi', uyari: 'uyarı', hata: 'hata', ayikla: 'ayıklama' }

/**
 * <LogStream> (Madde 11 · 14): çalışan işlem günlüğü, zaman çizelgesi gibi alttan akar.
 * Otomatik satırlar ekran okuyucuya tek tek duyurulmaz (aria-live="off"); hata ve uyarı sayısı durum satırında.
 * Duraklatınca görünüm donar, yeni satırlar sayılır. "Takip et" kapalıyken kaydırma yeri korunur.
 */
export function LogStream({ logs, height = 'h-[12lh]', onClear }: { logs: Log[]; height?: string; onClear?: () => void }) {
  const [filtre, setFiltre] = useState<Record<Seviye, boolean>>({ bilgi: true, uyari: true, hata: true, ayikla: false })
  const [durdu, setDurdu] = useState<Log[] | null>(null)
  const [takip, setTakip] = useState(true)
  const ref = useRef<HTMLDivElement>(null)
  const kaynak = durdu ?? logs
  const gorunen = useMemo(() => kaynak.filter((l) => filtre[l.seviye]), [kaynak, filtre])
  const yeni = durdu ? logs.length - durdu.length : 0
  const hata = logs.filter((l) => l.seviye === 'hata').length
  const uyari = logs.filter((l) => l.seviye === 'uyari').length

  useEffect(() => {
    const el = ref.current
    if (el && takip) el.scrollTop = el.scrollHeight
  }, [gorunen, takip])

  return (
    <div className="flex min-w-0 flex-col border border-line">
      <div className="flex flex-wrap items-center gap-x-2 border-b border-line px-1">
        <fieldset className="flex flex-wrap gap-x-2">
          <legend className="sr-only">Seviye süzgeci</legend>
          {SEVIYELER.map((s) => (
            <Check key={s} checked={filtre[s]} onChange={(v) => setFiltre((f) => ({ ...f, [s]: v }))}>
              {AD[s]}
            </Check>
          ))}
        </fieldset>
        <span className="flex-1" />
        <Check checked={takip} onChange={setTakip}>
          takip et
        </Check>
        <Btn onClick={() => setDurdu(durdu ? null : logs)} aria-pressed={!!durdu}>
          {durdu ? 'sürdür' : 'duraklat'}
        </Btn>
        {onClear ? <Btn onClick={onClear}>temizle</Btn> : null}
      </div>
      <div ref={ref} role="log" aria-live="off" aria-label="İşlem günlüğü" tabIndex={0} className={cx('scroll-y scroll-x ascii px-1', height)}>
        {gorunen.length ? (
          gorunen.map((l) => (
            <div key={l.id} className={cx(l.seviye === 'uyari' && 'text-em', l.seviye === 'ayikla' && 'text-dim')}>
              <span className="text-dim">{l.t}</span>{' '}
              <span className={cx(l.seviye === 'hata' && 'inv font-bold')}>[{SEVIYE_ETIKET[l.seviye]}]</span> <span className="text-hi">{pad(l.kaynak, 9)}</span> {l.mesaj}
            </div>
          ))
        ) : (
          <div className="text-dim">-- günlük boş --</div>
        )}
      </div>
      <div className="flex flex-wrap justify-between gap-x-2 border-t border-line px-1 text-dim">
        <p>
          {logs.length} satır ·{' '}
          <span role="status">
            {hata} hata · {uyari} uyarı
          </span>
        </p>
        <p>{durdu ? `[!] duraklatıldı · ${yeni} yeni satır bekliyor` : takip ? '[>] canlı · takip ediliyor' : '[>] canlı'}</p>
      </div>
    </div>
  )
}
