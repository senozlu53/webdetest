import { useEffect, useRef, useState } from 'react'
import { useMaxi } from '../lib/store'
import { useMagnetic } from '../hooks/useMagnetic'
import { useScrollFx } from '../hooks/useScrollFx'
import { useMedia } from '../hooks/useMedia'
import { Range, Section } from '../components/ui'
import { Blob, Starburst, Tri } from '../components/Shapes'
import { StickerFace } from '../components/Sticker'
import { cx } from '../../shared/cx'

function Magnet() {
  const [k, setK] = useState(0.4)
  const ref = useMagnetic<HTMLButtonElement>(k, 150)
  const { announce } = useMaxi()
  const [n, setN] = useState(0)
  return (
    <div className="rounded-[30px] border-4 border-[#fff7ee] p-5">
      <h3 className="font-sans text-[26px] leading-none font-black uppercase [font-stretch:140%]">Manyetik</h3>
      <div className="grid h-[260px] place-items-center">
        <button
          ref={ref}
          type="button"
          onClick={() => {
            setN((x) => x + 1)
            announce(`Yakalandı: ${n + 1}`)
          }}
          className="rounded-full"
          data-cursor="çek"
        >
          <Starburst size={170} fill="var(--pink)" points={16} className="font-sans text-[24px] leading-[0.9] font-black uppercase [font-stretch:125%]">
            Çek
            <br />
            beni
          </Starburst>
        </button>
      </div>
      <Range label="Çekim gücü" value={k} min={0} max={0.8} step={0.05} onChange={setK} format={(v) => `%${Math.round(v * 100)}`} />
      <p className="mt-3 font-mono text-[12px] font-bold" aria-hidden="true">
        yakalandı: {n}
      </p>
    </div>
  )
}

function ParallaxColumn() {
  const a = useScrollFx<HTMLDivElement>()
  const b = useScrollFx<HTMLDivElement>()
  const c = useScrollFx<HTMLDivElement>()
  const d = useScrollFx<HTMLDivElement>()
  const [p, setP] = useState(0)
  useEffect(() => {
    let raf = 0
    const read = () => {
      raf = 0
      const v = parseFloat(a.current?.style.getPropertyValue('--p') || '0')
      setP(v)
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(read)
    }
    window.addEventListener('scroll', on, { passive: true })
    return () => {
      window.removeEventListener('scroll', on)
      cancelAnimationFrame(raf)
    }
  }, [a])
  return (
    <div className="relative rounded-[30px] border-4 border-[#fff7ee] p-5">
      <h3 className="font-sans text-[26px] leading-none font-black uppercase [font-stretch:140%]">Asimetrik paralaks</h3>
      <p className="mt-2 text-[15px] font-semibold text-[#cfc6d9]">Kaydırdıkça her şekil başka bir şey yapar: biri döner, biri büyür, biri renk değiştirir, biri ters yönde kayar.</p>
      <p className="mt-3 inline-block rounded-full border-2 border-[#fff7ee] px-3 py-0.5 font-mono text-[12px] font-bold" aria-hidden="true">
        --p = {p.toFixed(2)}
      </p>
      <div className="relative mt-2 h-[300px]" aria-hidden="true">
        <div ref={a} className="fx absolute top-4 left-[4%] [--fx-rot:180deg]">
          <Starburst size={120} fill="var(--lime)" points={12} />
        </div>
        <div ref={b} className="fx absolute top-10 left-[38%] [--fx-scale:0.5]">
          <Blob seed={5} size={130} fill="var(--lilac)" stroke="#fff7ee" />
        </div>
        <div ref={c} className="fx absolute top-2 right-[6%] [--fx-hue:180deg]">
          <StickerFace shape="circle" bg="var(--orange)" fg="#111014" size={110}>
            renk
          </StickerFace>
        </div>
        <div ref={d} className="fx absolute bottom-16 left-[24%] [--fx-y:-70px] [--fx-rot:-30deg]">
          <Tri size={100} fill="var(--cyan)" />
        </div>
      </div>
    </div>
  )
}

/** Madde 16: imleç takipçisi, manyetik öğeler, kaydırmaya bağlı asimetrik paralaks */
export function Motion() {
  const { motion, kaos } = useMaxi()
  const fine = useMedia('(pointer: fine)')
  const follower = motion && kaos !== 'sakin' && fine
  const why = !fine ? 'dokunmatik ekranda yok' : !motion ? 'hareket kapalı' : kaos === 'sakin' ? 'sakin modda kapalı' : 'açık: fareyi gezdirin'
  const probe = useRef<HTMLDivElement>(null)
  return (
    <Section
      id="hareket"
      tone="bg-[#0b0a0f] text-[#fff7ee]"
      kicker="Madde 16 · Hareket dili"
      title={
        <>
          <span className="font-serif text-lime italic">Seni</span> <span className="uppercase [font-stretch:150%]">izliyor</span>
        </>
      }
      lead="İmleci takip eden fark karışımlı daire, yaklaşınca çekilen öğeler ve kaydırdıkça dönüp büyüyen, renk değiştiren şekiller. Hepsi hareket kapalıyken, hareketi azalt tercihinde ve sakin modda durur."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div ref={probe} className="rounded-[30px] border-4 border-[#fff7ee] bg-pink p-5 text-[#111014] lg:col-span-4">
          <h3 className="font-sans text-[26px] leading-none font-black uppercase [font-stretch:140%]">İmleç takipçisi</h3>
          <p className="mt-3 text-[16px] font-semibold">Beyaz bir daire, mix-blend-difference ile altındaki rengi tersine çevirir; düğme üstünde büyür ve ne yapacağınızı yazar. Asıl imleç gizlenmez.</p>
          <p className="mt-4 inline-block rounded-full border-[3px] border-[#111014] bg-white px-3 py-1 font-mono text-[13px] font-bold" data-follower-state={follower ? 'on' : 'off'}>
            Durum: {why}
          </p>
          {/* Fark karışımı önizlemesi: takipçi açıkken fareyle, değilken sabit daireyle */}
          <div className="group relative isolate mt-5 h-[210px] overflow-hidden rounded-[22px] border-[3px] border-[#111014]" data-cursor="fark" aria-hidden="true">
            <div className="absolute inset-0 grid grid-cols-4">
              <span className="bg-[#111014]" />
              <span className="bg-lime" />
              <span className="bg-blue" />
              <span className="bg-[#fff7ee]" />
            </div>
            <p className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-sans text-[46px] leading-none font-black text-[#fff7ee] uppercase mix-blend-difference [font-stretch:150%]">Fark</p>
            <span className={cx('absolute top-1/2 left-[62%] size-28 -translate-1/2 rounded-full bg-white mix-blend-difference transition-opacity duration-200', follower && 'group-hover:opacity-0')} />
          </div>
        </div>
        <div className="lg:col-span-4">
          <Magnet />
        </div>
        <div className="lg:col-span-4">
          <ParallaxColumn />
        </div>
      </div>
      <div className="scroll-x mt-8 rounded-[24px] border-4 border-[#fff7ee]" tabIndex={0} role="region" aria-label="Hareket tablosu, yatay kaydırılabilir">
        <table className="w-full min-w-[620px] text-left">
          <caption className="sr-only">Hareketler, süreleri ve nerede kullanıldıkları</caption>
          <thead>
            <tr className="border-b-4 border-[#fff7ee]">
              {['Hareket', 'Nasıl', 'Nerede'].map((h) => (
                <th key={h} scope="col" className="kicker px-3 py-2">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-[15px] font-semibold">
            {[
              ['İmleç takipçisi', 'rAF, %20 yaklaşma, mix-blend-difference', 'bütün sayfa'],
              ['Manyetik öğe', 'yarıçap 130–150px, çekim %30–40, translate', 'düğmeler, çıkartmalar'],
              ['Paralaks', '--p (−1…1), dönme / büyüme / renk / ters kayma', 'kahraman, bu bölüm'],
              ['Uçan rozet', 'Lissajous yolu, üstüne gelince durur', 'ekran kenarları'],
              ['Holografik folyo', 'konik degrade 7 sn / hız, @property', 'çıkartmalar'],
              ['3D varlıklar', 'dönme, süzülme, imlece eğilme, tıklayınca yay', 'kahraman'],
              ['Gren', '0,5 sn adımlı titreşim', 'bütün sayfa'],
            ].map((r) => (
              <tr key={r[0]} className="border-b-2 border-[#fff7ee]/30 last:border-0">
                <th scope="row" className="px-3 py-2 font-bold">
                  {r[0]}
                </th>
                <td className="px-3 py-2 font-mono text-[13px]">{r[1]}</td>
                <td className="px-3 py-2">{r[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  )
}
