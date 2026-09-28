import { Section } from '../components/ui'
import { Cutout } from '../components/Cutout'
import { Starburst } from '../components/Shapes'
import { cx } from '../../shared/cx'

const FACTS: [string, string, string][] = [
  ['72', 'sanatçı', 'font-sans [font-stretch:150%]'],
  ['3', 'sahne', 'font-serif italic'],
  ['41', 'yemek arabası', 'font-mono'],
  ['9', 'uçan rozet', 'font-hand'],
  ['04.30', 'son otobüs', 'font-sans [font-stretch:60%]'],
  ['120+', 'eser', 'font-serif'],
]

/** Madde 3: beş özellik, üst üste binen, eğik, boşluksuz bir mozaikte */
export function Traits() {
  return (
    <Section
      id="ozellik"
      kicker="Madde 3 · Karakteristikler"
      title={
        <>
          Beş <span className="font-serif italic">kural</span>, <span className="font-mono text-[0.7em]">sıfır</span> <span className="uppercase [font-stretch:150%]">boşluk</span>
        </>
      }
      lead="Horror vacui: boş alan korkusu. Her köşe bir şeyle dolar, ama okunacak metin hep düz bir zeminde kalır."
      className="z-0"
    >
      <ul className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-0">
        <li className="tilt grain-box relative z-20 overflow-hidden rounded-[30px] border-4 border-[#111014] bg-lime p-6 text-[#111014] shadow-[8px_9px_0_#111014] md:col-span-7" style={{ ['--r' as string]: -0.3 }}>
          <p aria-hidden="true" className="clutter pointer-events-none absolute inset-0 font-mono text-[10px] leading-[1.1] break-all opacity-25">
            {'BOŞLUK YOK · '.repeat(90)}
          </p>
          <p className="kicker relative">01</p>
          <h3 className="relative mt-2 font-serif text-[clamp(34px,4.6vw,64px)] leading-[0.9] font-black italic">
            <span className="wonk">Boşluktan kaçınma</span>
          </h3>
          <p className="relative mt-3 max-w-[44ch] rounded-2xl bg-lime/90 text-[17px] font-semibold">Beyaz alan tasarım kararı değil, doldurulacak bir fırsattır. Arka planı bile desen, doku ve küçük yazı kaplar.</p>
        </li>
        <li className="tilt relative z-30 rounded-[30px] border-4 border-[#111014] bg-[#111014] p-6 text-[#fff7ee] shadow-[8px_9px_0_var(--pink)] md:col-span-5 md:-ml-[calc(var(--overlap)*60px)] md:mt-10" style={{ ['--r' as string]: 0.4 }}>
          <p className="kicker">02</p>
          <h3 className="mt-2 font-sans text-[30px] leading-none font-black uppercase [font-stretch:125%]">Aşırı bilgi</h3>
          <dl className="mt-4 grid grid-cols-3 gap-x-3 gap-y-2">
            {FACTS.map(([n, k, f], i) => (
              <div key={k} className="min-w-0">
                <dt className="sr-only">{k}</dt>
                <dd className={cx('text-[34px] leading-none font-black', f, ['text-lime', 'text-pink', 'text-cyan', 'text-orange', 'text-butter', 'text-lilac'][i])}>{n}</dd>
                <dd className="font-mono text-[11px] leading-tight [font-stretch:87.5%]" aria-hidden="true">
                  {k}
                </dd>
              </div>
            ))}
          </dl>
        </li>
        <li className="tilt relative z-10 rounded-[30px] border-4 border-[#111014] bg-sky p-6 text-[#111014] shadow-[8px_9px_0_#111014] md:col-span-4 md:mt-[calc(var(--overlap)*-30px+24px)] md:ml-8" style={{ ['--r' as string]: 0.2 }}>
          <p className="kicker">03</p>
          <h3 className="mt-2 font-mono text-[24px] leading-tight font-bold [font-stretch:112.5%]">Asimetri</h3>
          <svg viewBox="0 0 200 110" className="mt-3 w-full" aria-hidden="true">
            {[[0, 0, 120, 60], [124, 0, 76, 30], [124, 34, 40, 76], [168, 34, 32, 40], [0, 64, 60, 46], [64, 64, 56, 20]].map(([x, y, w, h], i) => (
              <rect key={i} x={x} y={y} width={w} height={h} fill={['#ff2e93', '#fff7ee', '#c8ff00', '#8a2bff', '#ffe680', '#00e5ff'][i]} stroke="#111014" strokeWidth={2.5} />
            ))}
          </svg>
          <p className="mt-3 text-[16px] font-semibold">Eşit sütun yok; her blok komşusundan farklı boyda.</p>
        </li>
        <li className="tilt relative z-40 overflow-visible rounded-[30px] border-4 border-[#111014] bg-pink p-6 text-[#111014] shadow-[8px_9px_0_#111014] md:col-span-4 md:mt-6 md:-ml-[calc(var(--overlap)*40px)]" style={{ ['--r' as string]: -0.5 }}>
          <p className="kicker">04</p>
          <h3 className="mt-2 font-sans text-[30px] leading-none font-black uppercase [font-stretch:150%]">Kural yıkıcılık</h3>
          <div className="mt-4 md:-mr-16">
            <Cutout text="GRID? YOK." seed={8} size="text-[34px]" />
          </div>
          <p className="mt-4 text-[16px] font-semibold">Öğeler kutusundan taşar, ızgarayı keser, komşusunun üstüne biner.</p>
        </li>
        <li className="tilt relative z-20 rounded-[30px] border-4 border-[#111014] bg-paper p-6 text-ink shadow-[8px_9px_0_#111014] md:col-span-4 md:mt-16 md:-ml-[calc(var(--overlap)*30px)] md:pl-[calc(24px+var(--overlap)*30px)]" style={{ ['--r' as string]: 0.35 }}>
          <p className="kicker">05</p>
          <h3 className="mt-2 font-hand text-[40px] leading-none font-bold">Çoklu font</h3>
          <ul className="mt-3 space-y-1 text-[34px] leading-none" aria-label="Aynı kelime dört ailede">
            <li className="font-serif font-black italic">Kaos</li>
            <li className="font-sans font-black uppercase [font-stretch:150%]">Kaos</li>
            <li className="font-mono font-bold">Kaos</li>
            <li className="font-hand font-bold">Kaos</li>
          </ul>
          <Starburst size={92} fill="var(--orange)" className="clutter absolute -top-8 -right-6 font-sans text-[13px] font-black uppercase">
            4 aile
          </Starburst>
        </li>
      </ul>
    </Section>
  )
}
