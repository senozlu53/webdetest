import { useState } from 'react'
import { NeuralGraph, OUTPUTS } from '../components/NeuralGraph'
import { IconArrowRight } from '../components/Icons'
import { useMedia } from '../hooks/useMedia'
import { useNeural } from '../lib/store'
import { cx } from '../../shared/cx'

export function Hero() {
  const wide = useMedia('(min-width: 768px)')
  const [out, setOut] = useState(0)
  const { announce } = useNeural()
  return (
    <section id="ag" aria-labelledby="baslik" className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 pt-12 pb-10 md:px-8 md:pt-20">
      <p className="label">Stil 015 · AI-Native Design · AI Futurism</p>
      <h1 id="baslik" className="mt-3 max-w-[18ch] text-[42px] leading-[1.05] font-[250] tracking-[-0.02em] md:text-[68px]">
        Yapay zekânın <span className="grad-text font-[350]">zihnini</span> görünür kılın
      </h1>
      <p className="mt-5 max-w-[62ch] text-[17px] text-muted md:text-[19px]">
        <span lang="en">Neural Aesthetic</span>: verinin işlenişini, sinir ağlarını ve ajanın kararlarını derin uzayda parlayan düğümler, Bezier bağlantılar ve zaman çizelgeleriyle gösterir. Gösterinin arkasında her zaman okunabilir veri durur.
      </p>
      <div className="mt-7 flex flex-wrap gap-3">
        <a href="#ajan" className="btn btn-primary no-underline">
          Ajanı izle <IconArrowRight size={18} />
        </a>
        <a href="#veri" className="btn btn-ghost no-underline">
          Veri haritası
        </a>
      </div>

      <div className="panel ticks mt-10 overflow-hidden md:mt-14">
        <div className={cx('relative', wide ? 'h-[440px]' : 'h-[420px]')}>
          <NeuralGraph wide={wide} out={out} />
        </div>
        <div className="flex flex-col gap-4 border-t border-line px-4 py-4 md:flex-row md:items-center md:justify-between md:px-5">
          <div className="min-w-0 text-[14px] text-muted">
            <p>
              Giriş 4 · gizli katman {wide ? '6 · 7 · 6' : '5 · 5'} · çıkış 3. <span className="text-ink">Sarı yol</span>, seçili çıktıya en güçlü ağırlıklarla ulaşan bağlantılar.
            </p>
          </div>
          <div role="radiogroup" aria-label="Çıktı: sıradaki eylem olasılığı" className="grid shrink-0 grid-cols-3 gap-2">
            {OUTPUTS.map((o, i) => (
              <button
                key={o.ad}
                type="button"
                role="radio"
                aria-checked={out === i}
                onClick={() => {
                  setOut(i)
                  announce(`${o.ad} seçildi: olasılık yüzde ${Math.round(o.p * 100)}. En güçlü yol çizildi.`)
                }}
                className={cx('min-w-0 rounded-xl border px-3 py-2 text-left', out === i ? 'border-[rgb(250_204_21/0.6)] bg-[rgb(250_204_21/0.08)]' : 'border-line-strong hover:bg-hover')}
              >
                <span className="block truncate text-[14px] font-medium">{o.ad}</span>
                <span className="mt-1 flex items-center gap-2">
                  <span className="h-1 flex-1 overflow-hidden rounded-full bg-[rgb(255_255_255/0.1)]">
                    <span className={cx('block h-full rounded-full', out === i ? 'bg-active' : 'bg-blue')} style={{ width: `${o.p * 100}%` }} />
                  </span>
                  <span className="font-mono text-[11px] text-muted tabular-nums mono-tight">%{Math.round(o.p * 100)}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
