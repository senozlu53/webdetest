import type { ReactNode } from 'react'
import { CyberCard, Glitch, NeonProgress, SectionHead } from '../components/Cyber'
import type { Fx, FxPref } from '../hooks/useFx'
import { cx } from '../../shared/cx'

const LABEL: Record<Fx, string> = { tam: 'Tam', sade: 'Sade', kapali: 'Kapalı' }

function Tile({ title, note, children }: { title: string; note: string; children: ReactNode }) {
  return (
    <li>
      <div tabIndex={0} className="group flex h-full flex-col gap-3 border border-line bg-surface p-4 focus-visible:outline-2 focus-visible:outline-cyan">
        <div className="grid h-24 place-items-center">{children}</div>
        <p className="font-display text-lg font-bold uppercase">{title}</p>
        <p className="text-[13px] text-muted">{note}</p>
      </div>
    </li>
  )
}

export function Motion({ fx, pref, onPref, reason }: { fx: Fx; pref: FxPref; onPref: (p: FxPref) => void; reason: string }) {
  return (
    <section id="hareket" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          item="16 · 17"
          label="Hareket ve mobil"
          title="Glitch, tarama, titreşim"
          lede="Efektler üzerine gelince ya da klavye odağında çalışır; ekranda yavaşça süzülen bir tarama çizgisi ve neon nabız sürekli döner. Mobilde glitch durur, HUD kenarları tek neon çizgiye iner."
        />
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Tile title="Glitch" note="900ms, renkli dilimler; üzerine gelince bir kez.">
            <Glitch text="HACK" className="font-display text-5xl font-bold" />
          </Tile>
          <Tile title="Tarama" note="Parlak bir bant kutunun içinden süzülür.">
            <div className="demo-scan scanlines h-full w-full border border-line [--scan:rgb(0_240_255/0.18)]" />
          </Tile>
          <Tile title="Titreşim" note="Arızalı neon tabela: 2 sn'de bir kısa sönme.">
            <span className="demo-flicker font-display text-4xl font-bold text-magenta uppercase glow-magenta">Açık</span>
          </Tile>
          <Tile title="Nabız" note="Parlama 2,6 sn'de bir büyüyüp söner.">
            <span className="neon-pulse h-12 w-12 border-2 border-cyan" />
          </Tile>
        </ul>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <CyberCard label="Efekt düzeyi" code={LABEL[fx]}>
            <fieldset>
              <legend className="sr-only">Efekt düzeyi</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(
                  [
                    ['oto', 'Otomatik', 'Cihaza göre'],
                    ['tam', 'Tam', 'Hepsi açık'],
                    ['sade', 'Sade', 'Glitch yok'],
                    ['kapali', 'Kapalı', 'Hareket yok'],
                  ] as const
                ).map(([id, l, n]) => (
                  <label key={id} className="cursor-pointer has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-cyan">
                    <input type="radio" name="fx-hareket" value={id} checked={pref === id} onChange={() => onPref(id)} className="sr-only" />
                    <span className={cx('flex min-h-14 flex-col justify-center border px-3', pref === id ? 'border-cyan bg-surface-2' : 'border-line')}>
                      <span className="font-display font-bold tracking-[0.1em] uppercase">{l}</span>
                      <span className="text-[12px] text-muted">{n}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <p className="mt-4 font-mono text-[13px]" role="status">
              Şu an: <span className="text-cyan">{LABEL[fx]}</span>
              <span className="text-muted">{pref === 'oto' ? ` · ${reason}` : ' · elle seçildi'}</span>
            </p>
            <ul className="mt-4 grid gap-1 text-[14px] text-muted">
              <li>Tam: glitch, titreşim, kayan tarama, ızgara ve radar hareketi.</li>
              <li>Sade (mobil): glitch ve kayan tarama durur; ızgara ve radar yavaşlar.</li>
              <li>Kapalı (hareketi azalt): hiçbir animasyon oynamaz.</li>
            </ul>
          </CyberCard>

          <CyberCard label="Madde 17 · Mobil kenar" tone="magenta">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="mb-2 font-display text-[13px] font-bold tracking-[0.18em] text-muted uppercase">Masaüstü</p>
                <div className="hud p-5">
                  <NeonProgress label="Sinyal" value={74} />
                </div>
              </div>
              <div>
                <p className="mb-2 font-display text-[13px] font-bold tracking-[0.18em] text-muted uppercase">Mobil</p>
                <div className="hud hud-simple p-5">
                  <NeonProgress label="Sinyal" value={74} segments={12} />
                </div>
              </div>
            </div>
            <p className="mt-4 text-[14px] text-muted">
              Köşe parantezleri, cetvel ve ince çerçeveler dar ekranda gürültüye döner; yerini tek bir 2px neon çizgi alır. İlerleme çubuğu bölüm sayısını yarıya indirir.
            </p>
          </CyberCard>
        </div>
      </div>
    </section>
  )
}
