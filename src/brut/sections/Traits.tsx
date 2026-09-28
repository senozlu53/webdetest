import { BrutalistCard } from '../components/BrutalistCard'
import { Section } from '../components/ui'
import { cx } from '../../shared/cx'

/** Madde 3: altı özellik; asimetrik ızgara (Madde 12) */
export function Traits() {
  return (
    <Section id="ozellik" n="03" kicker="Madde 3 · Karakteristikler" title="Altı kural, sıfır süs" lead="Doku yok, degrade yok, yumuşak gölge yok. Her şey düz renk, kalın çizgi ve bir tane sert gölgeden kurulur.">
      <ul className="grid gap-6 md:grid-cols-6 md:gap-8">
        <BrutalistCard as="li" fill="yellow" className="md:col-span-4">
          <p className="kicker">01</p>
          <h3 className="headline mt-2">Sert kenarlıklar</h3>
          <p className="mt-2 max-w-[44ch] font-medium">Her kutu 3px saf siyah çizgiyle kapanır. Ayrım renkten değil çizgiden gelir; bu yüzden renk körlüğünde bile düzen bozulmaz.</p>
          <div className="mt-5 flex gap-3" aria-hidden="true">
            {[1, 2, 3, 4].map((w) => (
              <span key={w} className="h-12 flex-1 border-black bg-white" style={{ borderWidth: w + 1 }} />
            ))}
          </div>
        </BrutalistCard>
        <BrutalistCard as="li" className="md:col-span-2">
          <p className="kicker">02</p>
          <h3 className="headline mt-2">Yüksek kontrast</h3>
          <p className="mt-3 font-display text-[64px] leading-none font-black [font-stretch:125%]">19:1</p>
          <p className="mt-2 font-medium text-muted">Kirli beyaz zeminde siyah metin.</p>
        </BrutalistCard>
        <BrutalistCard as="li" fill="pink" className="md:col-span-2 md:-translate-y-4">
          <p className="kicker">03</p>
          <h3 className="headline mt-2">Devasa tipografi</h3>
          <p className="mt-1 font-display text-[112px] leading-[0.85] font-black [font-stretch:125%]" aria-hidden="true">
            Aa
          </p>
          <p className="mt-2 font-medium">Başlık gövdenin 10 katı.</p>
        </BrutalistCard>
        <BrutalistCard as="li" className="md:col-span-2">
          <p className="kicker">04</p>
          <h3 className="headline mt-2">Düz renkler</h3>
          <div className="mt-4 grid grid-cols-4 gap-2" aria-hidden="true">
            {['fill-yellow', 'fill-red', 'fill-blue', 'fill-green'].map((f) => (
              <span key={f} className={cx('aspect-square rounded-brut border-[3px] border-line', f)} />
            ))}
          </div>
          <p className="mt-3 font-medium text-muted">Degrade ya da doku yok; tek ton, tam dolgu.</p>
        </BrutalistCard>
        <BrutalistCard as="li" fill="blue" className="md:col-span-2">
          <p className="kicker">05</p>
          <h3 className="headline mt-2">Ofset gölgeler</h3>
          <div className="relative mt-5 h-20" aria-hidden="true">
            <span className="absolute inset-y-0 left-0 w-[70%] border-[3px] border-black bg-white shadow-[6px_6px_0_#000]" />
            <span className="absolute top-[calc(100%+10px)] left-[6px] font-mono text-[12px] font-bold">x6 y6 blur0</span>
          </div>
          <p className="mt-8 font-medium">Bulanıklık hep sıfır.</p>
        </BrutalistCard>
        <BrutalistCard as="li" fill="green" className="md:col-span-6 md:ml-16">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="kicker">06</p>
              <h3 className="headline mt-2">Kasıtlı olarak ham</h3>
              <p className="mt-2 max-w-[60ch] font-medium">Asimetrik boşluklar, eğik çıkartmalar, ızgaradan taşan bloklar. Ham görünür ama rastgele değildir: her kaçıklık bir kuralın sonucudur.</p>
            </div>
            <div className="flex gap-3" aria-hidden="true">
              <span className="rotate-[-6deg] border-[3px] border-black bg-white px-3 py-1 font-display font-black text-black uppercase">Taslak?</span>
              <span className="rotate-[4deg] border-[3px] border-black bg-[#ffd500] px-3 py-1 font-display font-black text-black uppercase">Hayır.</span>
            </div>
          </div>
        </BrutalistCard>
      </ul>
    </Section>
  )
}
