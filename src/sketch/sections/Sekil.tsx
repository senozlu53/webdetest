import { useState } from 'react'
import { Cizim } from '../components/Rough'
import { RoughBox, type RoughSekil } from '../components/Rough'
import { Aralik, RoughButton, Secim } from '../components/Controls'
import { Ikon } from '../components/Icons'
import { Kod, Section } from '../components/ui'
import type { Secenek } from '../lib/rough'

type Dolgu = NonNullable<Secenek['dolguTip']> | 'yok'

/** Madde 6 · 12: rough.js parametreleri. Sol: cetvelle çizilmiş kusursuz kutu, sağ: elle */
export function Sekil() {
  const [kusur, setKusur] = useState(1.6)
  const [egrilik, setEgrilik] = useState(1.6)
  const [sw, setSw] = useState(2.6)
  const [aralik, setAralik] = useState(8)
  const [sekil, setSekil] = useState<RoughSekil>('yuvarlak')
  const [dolgu, setDolgu] = useState<Dolgu>('hachure')
  const [tohum, setTohum] = useState(7)
  return (
    <Section id="sekil" madde="Madde 6 · Şekil dili" title="Hiçbir çizgi düz değil" lead="Sol taraf cetvelle çizilmiş kutu, sağ taraf aynı ölçüde elle çizilmiş: köşeler tam kapanmıyor, çizgiler iki kez geçiliyor, uçlar biraz taşıyor. Aşağıdaki değerler rough.js'in gerçek parametreleridir.">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.35fr_1fr]">
        <div className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2">
          <figure className="m-0 grid content-start gap-3">
            <div className="grid h-[240px] place-items-center rounded-none border-2 border-komur" aria-hidden="true">
              <span className="font-daktilo text-[14px] tracking-wider uppercase">cetvel</span>
            </div>
            <figcaption className="text-[15px] text-soluk">Düz çizgi, tam köşe: kusursuz ama soğuk.</figcaption>
          </figure>
          <figure className="m-0 grid content-start gap-3">
            <RoughBox tohum={tohum} sekil={sekil} r={22} cizgi={sw} kusur={kusur} egrilik={egrilik} dolgu={dolgu === 'yok' ? undefined : '#1d3557'} dolguTip={dolgu === 'yok' ? undefined : dolgu} aralik={aralik} className="grid h-[240px] place-items-center" data-rough-ornek="" pad={4}>
              <span className="rounded bg-kagit px-2 font-daktilo text-[14px] tracking-wider uppercase">el</span>
            </RoughBox>
            <figcaption className="text-[15px] text-soluk">Aynı ölçü, aynı tohum → aynı çizim. Tohum değişince el değişir.</figcaption>
          </figure>
        </div>
        <div className="grid min-w-0 grid-cols-1 content-start gap-5">
          <Aralik label="Kusur (roughness)" value={kusur} min={0} max={4} step={0.1} onChange={setKusur} format={(v) => v.toFixed(1).replace('.', ',')} />
          <Aralik label="Eğrilik (bowing)" value={egrilik} min={0} max={6} step={0.1} onChange={setEgrilik} format={(v) => v.toFixed(1).replace('.', ',')} />
          <Aralik label="Kalem kalınlığı" value={sw} min={1} max={6} step={0.2} onChange={setSw} format={(v) => `${v.toFixed(1).replace('.', ',')}px`} />
          <Aralik label="Tarama aralığı" value={aralik} min={4} max={16} onChange={setAralik} format={(v) => `${v}px`} />
          <Secim<RoughSekil>
            legend="Şekil"
            name="sk-sekil"
            value={sekil}
            onChange={setSekil}
            options={[
              { id: 'kutu', ad: 'Kutu' },
              { id: 'yuvarlak', ad: 'Yuvarlak köşe' },
              { id: 'elips', ad: 'Elips' },
            ]}
          />
          <Secim<Dolgu>
            legend="Dolgu"
            name="sk-dolgu"
            value={dolgu}
            onChange={setDolgu}
            options={[
              { id: 'yok', ad: 'Yok' },
              { id: 'hachure', ad: 'Tarama' },
              { id: 'cross-hatch', ad: 'Çapraz' },
              { id: 'zigzag', ad: 'Karalama' },
              { id: 'dots', ad: 'Nokta' },
              { id: 'solid', ad: 'Dolu' },
            ]}
          />
          <RoughButton boy="k" onClick={() => setTohum((t) => t + 1)} ikon={<Ikon ad="kalem" boyut={24} />}>
            Yeniden çiz
          </RoughButton>
          <Kod label="rough.js çağrısı">{`rough.generator().rectangle(0, 0, w, h, {
  roughness: ${kusur.toFixed(1)}, bowing: ${egrilik.toFixed(1)}, strokeWidth: ${sw.toFixed(1)},
  fillStyle: '${dolgu === 'yok' ? 'yok' : dolgu}', hachureGap: ${aralik}, seed: ${tohum}
})`}</Kod>
        </div>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
        {[
          {
            baslik: 'Taşan köşeler',
            not: 'Dört çizgi ayrı ayrı çekilir, köşede birbirini geçer.',
            parcalar: [{ d: 'M8 24 L166 20' }, { d: 'M158 8 L162 112' }, { d: 'M170 108 L10 114' }, { d: 'M18 120 L14 12' }],
          },
          {
            baslik: 'Kapanmayan köşe',
            not: 'Kalem kalkıyor; bir köşe açık kalıyor.',
            parcalar: [{ d: 'M26 14 H160 V110 H14 V30' }],
          },
          {
            baslik: 'Çift geçiş',
            not: 'Bir çizgi iki kez üstünden geçilir; kalınlık değişir.',
            parcalar: [{ d: 'M10 30 Q80 22 170 32' }, { d: 'M12 60 Q90 68 170 58' }, { d: 'M10 90 Q70 84 168 96', sw: 5 }],
          },
        ].map((x, i) => (
          <figure key={x.baslik} className="m-0 grid content-start gap-3">
            <RoughBox tohum={90 + i} kare={3} sekil="yuvarlak" r={14} className="p-3">
              <Cizim w={180} h={126} parcalar={x.parcalar} tohum={20 + i * 7} kusur={1.5} sw={3} className="h-auto w-full" etiket={x.baslik} />
            </RoughBox>
            <figcaption>
              <span className="block font-el text-[32px] leading-none font-bold text-murekkep">{x.baslik}</span>
              <span className="mt-1 block text-[16px] text-soluk">{x.not}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  )
}
