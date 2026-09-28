import { useState } from 'react'
import { BrutalistCard } from '../components/BrutalistCard'
import { SolidButton } from '../components/SolidButton'
import { Section } from '../components/ui'
import { IconPlay } from '../components/Icons'
import { useBrut } from '../lib/store'
import { cx } from '../../shared/cx'

const LANES: { ad: string; t: string; ok: boolean }[] = [
  { ad: 'Ease (reddedildi)', t: 'left 700ms cubic-bezier(0.45, 0, 0.2, 1)', ok: false },
  { ad: 'Linear', t: 'left 420ms linear', ok: true },
  { ad: 'Adım adım · steps(5)', t: 'left 420ms steps(5, jump-end)', ok: true },
]

export function Motion() {
  const { motion } = useBrut()
  const [right, setRight] = useState(false)
  const [stamp, setStamp] = useState(0)
  return (
    <Section id="hareket" n="16" kicker="Madde 16 · Hareket dili" title="Yumuşama yok" lead="Hareket ease ile yavaşlamaz; ya anında olur ya da linear ve adım adım. Basış 80ms, sekme iki üç kare, şeritler sabit hızda.">
      <div className="grid gap-8 lg:grid-cols-12">
        <BrutalistCard className="lg:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="headline">Aynı yol, üç eğri</h3>
            <SolidButton size="s" fill="yellow" icon={<IconPlay size={16} />} onClick={() => setRight((r) => !r)}>
              Oynat
            </SolidButton>
          </div>
          <ul className="mt-6 space-y-5">
            {LANES.map((l) => (
              <li key={l.ad}>
                <p className="flex items-center justify-between gap-2 font-bold">
                  <span>{l.ad}</span>
                  <span className={cx('border-[3px] border-line px-2 text-[13px]', l.ok ? 'fill-green' : 'fill-red')}>{l.ok ? 'Bu stil' : 'Kullanma'}</span>
                </p>
                <div className="relative mt-2 h-14 rounded-brut border-[3px] border-line bg-bg">
                  <span className={cx('absolute top-1/2 size-9 -translate-y-1/2 border-[3px] border-line brut-shadow-sm', l.ok ? 'fill-yellow' : 'fill-pink')} style={{ left: right ? 'calc(100% - 48px)' : '4px', transition: motion ? l.t : 'none' }} />
                </div>
                <p className="mt-1 font-mono text-[12px] font-bold text-muted">{l.t}</p>
              </li>
            ))}
          </ul>
        </BrutalistCard>
        <BrutalistCard fill="blue" className="lg:col-span-4 lg:mt-16">
          <h3 className="headline">Damga</h3>
          <p className="mt-2 font-medium">240ms, steps(3): büyük başlar, bir kare sıkışır, yerine oturur.</p>
          <div className="mt-5 grid h-40 place-items-center rounded-brut border-[3px] border-dashed border-black">
            {stamp ? (
              <span key={stamp} className="stamp rounded-brut border-4 border-black bg-[#ff4d3d] px-4 py-2 font-display text-[34px] font-black text-black uppercase [font-stretch:125%]">
                Onaylı
              </span>
            ) : (
              <span className="font-bold">Henüz damga yok</span>
            )}
          </div>
          <SolidButton className="mt-5" fill="white" onClick={() => setStamp((s) => s + 1)}>
            Damgala
          </SolidButton>
        </BrutalistCard>
        <BrutalistCard fill="green" className="lg:col-span-12">
          <h3 className="headline">Süreler</h3>
          <div className="scroll-x mt-5 rounded-brut border-[3px] border-black bg-white text-black" tabIndex={0} role="region" aria-label="Hareket süreleri tablosu, yatay kaydırılabilir">
            <table className="w-full min-w-[560px] text-left">
              <caption className="sr-only">Hareket süreleri ve eğrileri</caption>
              <thead>
                <tr className="border-b-[3px] border-black">
                  {['Hareket', 'Süre', 'Eğri', 'Nerede'].map((h) => (
                    <th key={h} scope="col" className="px-3 py-2 text-[13px] font-bold uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Basma / çökme', '80ms', 'linear', 'SolidButton, ikon düğmeleri'],
                  ['Kart sekmesi', '80ms', 'linear', 'BrutalistCard interactive'],
                  ['Damga', '240ms', 'steps(3)', 'Bildirim, onay'],
                  ['Sayaç sekmesi', '200ms', 'steps(2)', 'Sepet rozeti'],
                  ['Marquee', 'uzunluk / hız', 'linear, sonsuz', '50 · 110 · 220 px/sn'],
                  ['İlerleme', 'blok başına 90ms', 'adım adım', 'Dağıtım paneli'],
                ].map((r) => (
                  <tr key={r[0]} className="border-b-[3px] border-black last:border-0">
                    <th scope="row" className="px-3 py-2 font-bold">
                      {r[0]}
                    </th>
                    <td className="px-3 py-2 font-mono text-[14px]">{r[1]}</td>
                    <td className="px-3 py-2 font-mono text-[14px]">{r[2]}</td>
                    <td className="px-3 py-2 font-medium">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 font-bold">Hareket kapalıyken şeritler ve sekmeler durur; basınca butonun yerinden oynaması (geri bildirim) anında olur, kalır.</p>
        </BrutalistCard>
      </div>
    </Section>
  )
}
