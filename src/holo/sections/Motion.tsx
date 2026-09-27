import { useMemo, useState, type CSSProperties } from 'react'
import { HoloCanvas } from '../components/HoloCanvas'
import { HoloButton, HoloPanel, PanelHead, SectionHead, Segmented } from '../components/ui'
import { HoloIcon } from '../components/Icons'
import { LAYER_OPTIONS } from '../components/HoloNav'
import { icosphere, merge, ring } from '../lib/geo3d'
import { useHolo } from '../lib/store'
import { ripple } from '../hooks/useRipple'
import type { MotionPref } from '../hooks/useView'
import { cx } from '../../shared/cx'

const LOG = [
  '[00:00.012] düğüm gpu-0 hazır · 24 GB',
  '[00:00.031] atlas-14b-q5_k_m.gguf eşlendi · 10,5 GB',
  '[00:00.188] KV önbelleği ayrıldı · 32768 bağlam',
  '[00:00.214] ön doldurma · 42 token · 118 ms',
  '[00:00.332] kod çözme başladı · 46 token/sn',
  '[00:01.402] enp5s0 · 9,41 Gbit/sn · MTU 9000',
  '[00:01.515] gömme dizini güncellendi · 12 408 vektör',
  '[00:01.620] hat boşta · sıcaklık 64 °C',
]

const MOTION_OPTIONS: ReadonlyArray<{ id: MotionPref; label: string }> = [
  { id: 'oto', label: 'Oto' },
  { id: 'acik', label: 'Açık' },
  { id: 'kapali', label: 'Kapalı' },
]

export function Motion({ layersReason, motionReason }: { layersReason: string; motionReason: string }) {
  const s = useHolo()
  const mesh = useMemo(() => merge(icosphere(1, 0.8), ring(1.25, 80, 1.1)), [])
  const [run, setRun] = useState(0)
  const [taps, setTaps] = useState(0)
  const pad = ripple<HTMLButtonElement>()

  return (
    <section id="hareket" className="px-4 py-20 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="16 · 17"
          label="Hareket ve mobil"
          title="Yavaş dönüş, akan veri, dalga"
          lede="Uzay nesneleri dakikada bir iki tur döner; veri satırları akarak gelir; her tıklama yüzeyde bir dalga bırakır. Mobilde çoklu saydam katmanlar tek, opak bir katmana iner."
        />
        <div className="grid gap-4 md:grid-cols-3">
          <HoloPanel className="flex flex-col p-4">
            <PanelHead title="Dönen nesne" meta="0,14 rad/sn" />
            <HoloCanvas mesh={mesh} speed={0.14} className="mt-2 h-44" />
            <p className="mt-2 text-[14px] text-muted">Ekran dışındayken ve hareket kapalıyken çizim durur.</p>
          </HoloPanel>
          <HoloPanel className="flex flex-col p-4">
            <div className="flex items-center justify-between gap-2">
              <PanelHead title="Veri akışı" meta="45 ms arayla" />
              <HoloButton size="sm" variant="ghost" onClick={() => setRun((r) => r + 1)} icon={<HoloIcon name="oynat" size={14} glow={false} />}>
                Yeniden
              </HoloButton>
            </div>
            <ol key={run} className="mt-3 flex h-44 flex-col gap-1 overflow-hidden font-mono text-[12px] leading-snug" aria-label="Örnek günlük">
              {LOG.map((l, i) => (
                <li key={l} className="stream-in truncate" style={{ '--i': i * 2 } as CSSProperties}>
                  <span className="text-cyan-text">{l.slice(0, 12)}</span>
                  <span className="text-muted">{l.slice(12)}</span>
                </li>
              ))}
            </ol>
            <p className="mt-2 text-[14px] text-muted">Satırlar hafif bulanıklıktan netleşerek kayar.</p>
          </HoloPanel>
          <HoloPanel className="flex flex-col p-4">
            <PanelHead title="Dalgalanma" meta="650 ms" />
            <button
              type="button"
              {...pad}
              onClick={() => setTaps((t) => t + 1)}
              className="ripple-host thin-glow mt-3 grid h-44 place-items-center rounded-2xl bg-[var(--tint)] text-center"
            >
              <span className="relative z-[1]">
                <HoloIcon name="atom" size={34} className="mx-auto text-cyan-text" />
                <span className="mt-2 block font-tech text-[14px] font-semibold">Yüzeye dokunun</span>
                <span className="block text-[13px] text-muted tabular-nums" aria-live="polite">
                  {taps ? `${taps} dalga` : 'Dalga basılan noktadan yayılır'}
                </span>
              </span>
            </button>
            <p className="mt-2 text-[14px] text-muted">Klavyede Enter ya da Boşluk ile ortadan yayılır.</p>
          </HoloPanel>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <HoloPanel tick className="p-5 md:p-6">
            <PanelHead title="Hareket" meta={s.motion === 'acik' ? 'açık' : 'kapalı'} />
            <div className="mt-4">
              <Segmented<MotionPref> legend="Hareket tercihi" name="hareket" value={s.motionPref} options={MOTION_OPTIONS} onChange={s.setMotionPref} />
            </div>
            <p className="mt-3 text-[14px] text-muted">
              Şu an: <span className="text-ink">{s.motion === 'acik' ? 'Açık' : 'Kapalı'}</span>
              {s.motionPref === 'oto' ? ` · ${motionReason}` : ' · elle seçildi'}
            </p>
            <ul className="mt-4 flex flex-col gap-2 text-[14px] text-muted">
              <li>Açık: dönen nesneler, akan satırlar, token akışı, dalgalanma, süzülen göstergeler.</li>
              <li>Kapalı: nesneler sabit açıda durur, yanıt tek seferde gelir, dalga çıkmaz. Veri güncellemesi sürer.</li>
            </ul>
          </HoloPanel>
          <HoloPanel className="p-5 md:p-6">
            <PanelHead title="Katmanlar · Madde 17" meta={s.layers === 'tam' ? 'tam' : 'tekil'} />
            <div className="mt-4">
              <Segmented legend="Katman tercihi" name="katman" value={s.layersPref} options={LAYER_OPTIONS} onChange={s.setLayersPref} />
            </div>
            <p className="mt-3 text-[14px] text-muted">
              Şu an: <span className="text-ink">{s.layers === 'tam' ? 'Tam' : 'Tekil'}</span>
              {s.layersPref === 'oto' ? ` · ${layersReason}` : ' · elle seçildi'}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4" aria-hidden="true">
              {(['tam', 'tekil'] as const).map((k) => (
                <div key={k} className={cx('rounded-2xl border p-3', s.layers === k ? 'border-line' : 'border-line-soft opacity-60')}>
                  <div className="relative h-24">
                    {k === 'tam' ? (
                      <>
                        <span className="absolute inset-x-6 top-0 h-14 rounded-lg border border-line bg-[rgb(34_211_238/0.1)] backdrop-blur-sm" />
                        <span className="absolute inset-x-3 top-4 h-14 rounded-lg border border-line bg-[rgb(59_130_246/0.1)] backdrop-blur-sm" />
                        <span className="absolute inset-x-0 top-8 h-14 rounded-lg border border-line bg-[rgb(var(--surface-rgb)/0.5)] backdrop-blur-sm" />
                      </>
                    ) : (
                      <span className="absolute inset-x-0 top-8 h-14 rounded-lg border border-line bg-surface" />
                    )}
                  </div>
                  <p className="mt-2 font-tech text-[13px] font-semibold">{k === 'tam' ? '3 cam katman · 3 bulanıklık' : '1 opak katman · 0 bulanıklık'}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[14px] text-muted">Tekilde yalnız üst çubuk ve komut katmanı bulanıklık kullanır; paneller opak yüzeye döner, iç içe cam düzleşir, dekoratif süzülen paneller gizlenir, parçacık sayısı üçte bire iner.</p>
          </HoloPanel>
        </div>
      </div>
    </section>
  )
}
